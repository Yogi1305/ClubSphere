import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import dotenv from 'dotenv';
import client from '../redis/redisconfig.js';
dotenv.config();

// let otp1=null;
// Configure Nodemailer
// const transporter = nodemailer.createTransport({
//   service: 'gmail,zohomail', // e.g., use 'gmail', 'hotmail', etc.
//   auth: {
//     user: process.env.emailsend, //  your email
//     pass: process.env.pass    // your email passkey
//   }
// });

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.in",
  port: 465,
  secure: true, // true for port 465, false for 587
  auth: {
    user: process.env.emailsend, 
    pass: process.env.pass
  }
});


// Send OTP to user
export const sendOtp = async (req, res) => {
  const { email } = req.body;
   const otp1 = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets:false });
//    console.log(otp1);
  
  try {
    // Send OTP email
    await transporter.sendMail({
      from: 'clubsphere@zohomail.in',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp1}.This key expiry in 5 minutes.This is email sent via ClubSphere. If you did not request this, please ignore this email.`
    });

    await client.setex(`email:${email}`, 300, otp1); // 300 seconds = 5 minutes

    res.status(200).json({
      message: 'OTP sent to email',
      success: true
    });
  } catch (error) {
    console.log("error is ",error);
    res.status(500).json({
      message: 'Failed to send OTP',
      success: false
    });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  const { otp,email } = req.body;
  // const { email } = req.params;
  const otp1 = await client.get(`email:${email}`);
  console.log(`verify}`)

  if (otp1 === otp) {
    
    await client.del(`email:${email}`); // Delete the OTP from Redis after verification
    return res.status(200).json({
      message: "OTP is valid",
      success: true
    });
  } else {
    return res.status(400).json({
      message: "Invalid OTP",
      success: false
    });
  }
};