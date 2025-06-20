import Nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transport = Nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendOTP = async (email, otp) => {
  console.log("Using EMAIL_USER:", process.env.EMAIL_USER);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
  };

  try {
    await transport.sendMail(mailOptions);
    console.log("OTP email sent Successfully");
  } catch (err) {
    console.log("Eror send otp Email", err);
  }
};

export const sendEventTicket = async (email, qrCodeImage, bookingId) => {
  console.log("Using EMAIL_USER:", process.env.EMAIL_USER);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Event Ticket",
    html: `
        <p>Your Event code is attached below. </p>
        <p><img src="cid:qrCodeImage" alt="Event QR Code" /></p>
        <p>${bookingId}</p>`, // Use "cid" to reference the inline image
    attachments: [
      {
        filename: "event_qr_code.png", // Name of the image file
        content: qrCodeImage.split("base64,")[1], // Get the base64 data (remove the 'data:image/png;base64,' part)
        encoding: "base64", // Specify base64 encoding
        cid: "qrCodeImage", // Attach the QR code with a "cid" (content ID)
      },
    ],
  };

  try {
    await transport.sendMail(mailOptions);
    console.log("Event ticket email sent successfully");
  } catch (err) {
    console.log("Error sending event ticket email", err);
  }
};
