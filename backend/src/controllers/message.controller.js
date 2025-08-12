import User from "../models/user.model.js"
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId } from "../lib/socket.js";
import {io} from "../lib/socket.js"

export const getUsersForSidebar= async (req , res )=>{
    try{
        const loggedInUserId= req.user._id;
        const filteredUsers= await User.find({_id:{$ne:loggedInUserId}}).select("-password ");
        res.status(200).json(filteredUsers);


    } catch(error){
        console.error("Error fetching users for sidebar:", error);
        res.status(500).json({message: "Internal server error"});

    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: receiverID } = req.params;
        const senderID = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderID, receiverID },
                { senderID: receiverID, receiverID: senderID }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverID } = req.params;
        const senderID = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
            senderID,
            receiverID,
            text,
            image: imageUrl
        });

        await newMessage.save();



        const receiverSocketId= getReceiverSocketId(receiverID)
        res.status(201).json(newMessage);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
