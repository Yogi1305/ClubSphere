import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import dotenv from 'dotenv';
dotenv.config();

let otp1=null;
// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // e.g., use 'gmail', 'hotmail', etc.
  auth: {
    user: process.env.emailsend, //  your email
    pass: process.env.pass    // your email passkey
  }
});

// Send OTP to user
export const sendOtp = async (req, res) => {
  const { email } = req.body;
   otp1 = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets:false });
//    console.log(otp1);
  
  try {
    // Send OTP email
    await transporter.sendMail({
      from: 'kushwahay535@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp1}`
    });

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
  const { otp } = req.body;
  console.log(`verify otp1 : ${otp1} and otp is ${otp}`)

  if (otp1 === otp) {
     otp1=null
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