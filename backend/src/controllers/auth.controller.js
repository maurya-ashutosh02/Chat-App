import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateTokens } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
import jwt from "jsonwebtoken";
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  console.log("📨 Received Signup Data:", req.body); // Log input

  try {
    // Field validation
    if (!fullName || !email || !password) {
      console.log("🚫 Missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      console.log("🚫 Weak password");
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("🚫 Duplicate user");
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save(); // Save user

    // Generate and set JWT cookie
    generateTokens(newUser._id, res);

    // Send response
    res.status(201).json({
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic || null,
        createdAt: newUser.createdAt,
      },
    });

  } catch (error) {
    console.error("🔥 Signup Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }


    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });

    }

    generateTokens(user._id, res);

    res.status(200).json({
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        createdAt: user.createdAt,
      }
    });


  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Internal server error" });

  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 })
    res.status(200).json({ message: "Logged out successfully" });

  } catch (error) {
    console.error("Logout Error:", error.message);
    res.status(500).json({ message: "Internal server error" });

  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic || typeof profilePic !== "string") {
      return res.status(400).json({ message: "Invalid image format" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic); // this works if base64
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update Profile Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const checkAuth = (req, res) => {
  const token = req.cookies.jwt; // ✅ Get token from cookie
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: { id: decoded.userId } });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
