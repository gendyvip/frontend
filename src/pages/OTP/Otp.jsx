import React, { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/store/useAuth";
import { useNavigate } from "react-router-dom";

export default function Otp({ message }) {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { confirmOtp } = useAuth();
  const navigate = useNavigate();

  const handleComplete = (value) => {
    setOtp(value);
  };

  const handleChange = (value) => {
    setOtp(value);
  };

  const handleSubmit = async () => {
    if (otp.length !== 6) return;
    setIsLoading(true);
    try {
      const email = sessionStorage.getItem("resetEmail");
      if (!email) throw new Error("No email found in session");
      await confirmOtp({ email, otp });
      navigate("/auth/reset-password/confirm");
    } catch (error) {
      console.error("Error verifying OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startResendCountdown = () => {
    setResendDisabled(true);
    setCountdown(30);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOTP = async () => {
    if (resendDisabled) return;
    try {
      // Add your resend OTP logic here
      startResendCountdown();
    } catch (error) {
      console.error("Failed to resend OTP:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden rounded-xl shadow-lg"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-100 rounded-full -ml-20 -mb-20 opacity-50"></div>
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">{message}</h1>
          <p className="text-gray-600">
            We've sent a 6-digit code to your email address. Please enter it
            below.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              onComplete={handleComplete}
              onChange={handleChange}
              value={otp}
              className="gap-2"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={otp.length !== 6 || isLoading}
            className={`w-full transition-all duration-200 ${
              otp.length === 6
                ? "bg-primary hover:bg-primary-hover"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>

          <div className="text-center text-sm text-gray-600">
            <p>Didn't receive the code?</p>
            <button
              className={`text-blue-600 hover:text-blue-700 font-medium ${
                resendDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleResendOTP}
              disabled={resendDisabled}
            >
              {resendDisabled ? `Resend OTP in ${countdown}s` : "Resend OTP"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
