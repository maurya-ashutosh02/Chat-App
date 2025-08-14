import jwt from "jsonwebtoken";

export const generateTokens=(userId, res)=>{
    const token= jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"7d"});
    res.cookie("jwt", token,{
        httpOnly:true,
        maxAge:7*24*60*60*1000 ,
        sameSite:"strict", 
        secure: true // Set to true in production
      })
      return token;
}