import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "notyf/notyf.min.css";
import { Notyf } from "notyf";

const OTPVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const location = useLocation();
  const email = location.state?.email;
  const navigate = useNavigate();

  // Initialize Notyf inside component
  const notyf = new Notyf({
    position: {
      x: "right",
      y: "top",
    },
  });

  // Handle input change
  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 1) {
      setOtp((prevOtp) => {
        const updatedOtp = [...prevOtp];
        updatedOtp[index] = value;
        return updatedOtp;
      });

      // Focus next input if current one is filled
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  // Handle key down for backspace navigation
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (!otpValue || otpValue.length !== 6) {
      notyf.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/verify-otp", {
        email,
        otp: otpValue,
      });

      if (res.data.data === "WRONG") {
        notyf.error("Invalid OTP or Expired");
        return;
      }

      if (res.data.data === "OK") {
        localStorage.removeItem("canVerifyOtp");
        notyf.success("Registered Successfully");
        navigate("/login");
      }
    } catch (error) {
      notyf.error("Failed to verify OTP. Please try again.");
      console.error("OTP verification error:", error);
    }
  };

  // Handle OTP resend
  const handleResend = async () => {
    try {
      await axios.post("http://localhost:5000/api/generate-otp", { email });
      notyf.success("OTP resent successfully");
      setOtp(["", "", "", "", "", ""]); // Reset OTP inputs
    } catch (error) {
      notyf.error("Failed to resend OTP. Please try again.");
      console.error("Resend OTP error:", error);
    }
  };

  // Ensure email exists, else redirect
  useEffect(() => {
    if (!email) {
      notyf.error("No email provided. Redirecting to registration.");
      navigate("/register");
    }
  }, [email, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1A1A1A] p-4">
      <div className="w-full max-w-md">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
          Enter OTP
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="flex justify-between gap-2 md:gap-4 w-full">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength="1"
                className="w-12 h-12 md:w-14 md:h-14 text-2xl md:text-3xl text-center bg-[#2A2A2A] text-white rounded-lg border border-[#3A3A3A] focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 placeholder-gray-500"
                placeholder="-"
                aria-label={`OTP digit ${index + 1}`}
                aria-describedby="otp-instruction"
              />
            ))}
          </div>
          <p
            id="otp-instruction"
            className="text-gray-400 text-sm mt-2 text-center"
          >
            Enter the 6-digit OTP sent to your email.
          </p>
          <button
            type="submit"
            className="mt-8 w-full max-w-xs py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
          >
            Verify
          </button>
          <button
            type="button"
            onClick={handleResend}
            className="mt-4 w-full max-w-xs py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
          >
            Resend OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTPVerification;
