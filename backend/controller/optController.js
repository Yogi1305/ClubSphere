// import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import dotenv from 'dotenv';
import client from '../redis/redisconfig.js';
import { Resend } from 'resend';

dotenv.config();

// =================== OLD CODE (Zoho + Nodemailer) ===================
// const transporter = nodemailer.createTransport({
//   host: "smtp.zoho.in",
//   port: 465,
//   secure: true, // true for port 465, false for 587
//   auth: {
//     user: process.env.emailsend, 
//     pass: process.env.pass
//   }
// });

// export const sendOtp = async (req, res) => {
//   const { email } = req.body;
//   const otp1 = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });

//   try {
//     await transporter.sendMail({
//       from: 'clubsphere@zohomail.in',
//       to: email,
//       subject: 'Your OTP Code',
//       text: `Your OTP code is ${otp1}.This key expiry in 5 minutes.This is email sent via ClubSphere.`
//     });

//     await client.setex(`email:${email}`, 300, otp1); // 5 minutes expiry

//     res.status(200).json({ message: 'OTP sent to email', success: true });
//   } catch (error) {
//     console.log("error is ", error);
//     res.status(500).json({ message: 'Failed to send OTP', success: false });
//   }
// };

// ====================================================================


// =================== NEW CODE (Resend API) ===================
const resend = new Resend(process.env.RESEND_API_KEY);

// Send OTP to user
export const sendOtp = async (req, res) => {
  const { email } = req.body;
  const otp1 = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false
  });

  try {
    const { data, error } = await resend.emails.send({
      from: 'ClubSphere <onboarding@resend.dev>', 
      to: [email],
      subject: 'Your ClubSphere OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #007bff;">Your OTP Code</h2>
          <p>Your OTP code is <strong>${otp1}</strong>.</p>
          <p>This OTP will expire in <strong>5 minutes</strong>.</p>
          <p>If you didn’t request this, please ignore this email.</p>
          <br/>
          <p>— Team ClubSphere</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return res.status(500).json({ message: "Failed to send OTP", success: false });
    }

    // Save OTP in Redis (expire in 5 minutes)
    await client.setex(`email:${email}`, 300, otp1);

    res.status(200).json({
      message: "OTP sent successfully via Resend",
      success: true,
      data,
    });
  } catch (err) {
    console.error("Send OTP Error:", err);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};


// Verify OTP
export const verifyOtp = async (req, res) => {
  const { otp, email } = req.body;

  try {
    const storedOtp = await client.get(`email:${email}`);

    if (storedOtp === otp) {
      await client.del(`email:${email}`);
      return res.status(200).json({
        message: "OTP verified successfully",
        success: true,
      });
    } else {
      return res.status(400).json({
        message: "Invalid or expired OTP",
        success: false,
      });
    }
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};
