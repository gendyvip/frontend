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
import { ErrorDisplay } from "@/components/ui/error-display";
import { GalleryVerticalEnd } from "lucide-react";

export default function Otp({ message }) {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState(null);
  const { confirmOtp, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleComplete = (value) => {
    setOtp(value);
  };

  const handleChange = (value) => {
    setOtp(value);
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async () => {
    if (otp.length !== 6) return;
    setIsLoading(true);
    setError(null);
    try {
      const email = sessionStorage.getItem("resetEmail");
      if (!email) throw new Error("No email found in session");
      await confirmOtp({ email, otp });
      navigate("/auth/reset-password/confirm");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError(error.message || "Failed to verify OTP");
      // Error toast is handled by the store
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
      const email = sessionStorage.getItem("resetEmail");
      if (!email) throw new Error("No email found in session");
      
      await resetPassword({ email });
      startResendCountdown();
      // Success toast is handled by the store
    } catch (error) {
      console.error("Failed to resend OTP:", error);
      setError(error.message || "Failed to resend OTP");
      // Error toast is handled by the store
    }
  };

  return (
    <div className="flex lg:my-30 md:my-10 flex-col items-center justify-center gap-6 p-6 md:p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md overflow-hidden shadow-2xl border-0 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-indigo-50" style={{ backdropFilter: 'blur(8px)' }}
      >
        {/* Decorative Circles & Illustration */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-10" style={{ background: 'var(--primary)' }}></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full -ml-20 -mb-20 opacity-10" style={{ background: 'var(--primary)' }}></div>
        <div className="absolute left-1/2 -translate-x-1/2 -top-16 flex justify-center">
          <GalleryVerticalEnd className="w-20 h-20 text-primary/95" />
        </div>
        <div className="relative p-10 pt-20 flex flex-col gap-4">
          <div className="flex flex-col items-center gap-2 -mt-10">
            <img src="/logo.svg" alt="Dawaback Logo" className="h-18 w-18 mx-auto" />
            <h1 className="text-2xl font-bold tracking-tight text-primary/95">Verify OTP</h1>
            <p className="text-sm -mt-2 text-center" style={{ color: 'var(--muted-foreground)' }}>
              We've sent a 6-digit code to your email address <br /> Please enter it below
            </p>
          </div>
          {/* Error Display */}
          <ErrorDisplay error={error} />
          <div className="flex flex-col gap-6">
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
              className="w-full py-2 rounded-lg font-bold text-white shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: otp.length === 6 ? 'var(--primary)' : '#d1d5db', color: 'var(--primary-foreground)' }}
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>
            <div className="text-center text-sm -mt-2" style={{ color: 'var(--muted-foreground)' }}>
              Didn't receive the code?{" "}
              <button
                className={`font-semibold text-primary hover:text-primary-hover transition-colors duration-150 focus:outline-none rounded underline-offset-2 hover:underline ${resendDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleResendOTP}
                disabled={resendDisabled}
              >
                {resendDisabled ? `Resend OTP in ${countdown}s` : "Resend OTP"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
