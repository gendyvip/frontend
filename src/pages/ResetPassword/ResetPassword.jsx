import { GalleryVerticalEnd } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Card} from "@/components/ui/card";
import { useAuth } from "@/store/useAuth";
import { ErrorDisplay, ErrorMessage } from "@/components/ui/error-display";
import { cn } from "@/lib/utils";

const ResetPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setIsLoading(true);
      setError(null);
      await resetPassword({ email: values.email });
      navigate("/auth/reset-password/verify-otp", {
        state: {
          email: values.email,
          purpose: "reset-password",
        },
      });
    } catch (error) {
      console.error("Reset password error:", error);
      setError(error.message || "Failed to send reset instructions");
      // Error toast is handled by the store
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="flex lg:my-30 md:my-10 flex-col items-center justify-center gap-6 p-6 md:p-10">
      <Card className="relative w-full max-w-md overflow-hidden shadow-2xl border-0 rounded-3xl  bg-gradient-to-br from-blue-50 via-white to-indigo-50" style={{ backdropFilter: 'blur(8px)' }}>
        {/* Decorative Circles & Illustration */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-10" style={{ background: 'var(--primary)' }}></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full -ml-20 -mb-20 opacity-10" style={{ background: 'var(--primary)' }}></div>
        <div className="absolute left-1/2 -translate-x-1/2 -top-16 flex justify-center">
          <GalleryVerticalEnd className="w-20 h-20 text-primary/95"/>
        </div>
        <div className="relative p-10 pt-20 flex flex-col gap-4">
          <Formik
            initialValues={{ email: "" }}
            validationSchema={ResetPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting, handleBlur, handleChange, values }) => (
              <Form className="flex flex-col gap-7">
                <div className="flex flex-col items-center gap-2 -mt-10">
                  <img src="/logo.svg" alt="Dawaback Logo" className="h-18 w-18 mx-auto" />
                  <h1 className="text-2xl font-bold tracking-tight text-primary/95" >Reset Password</h1>
                  <p className="text-sm -mt-2" style={{ color: 'var(--muted-foreground)' }}>Enter your email to receive password reset instructions.</p>
                </div>

                {/* Error Display */}
                <ErrorDisplay error={error} />

                <div className="flex flex-col gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email" className="font-semibold">Email</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {/* Envelope icon */}
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </span>
                      <Field
                        as={Input}
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                        disabled={isLoading}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.email}
                        className={cn(
                          "pl-10",
                          touched.email && errors.email && "border-red-500"
                        )}
                      />
                    </div>
                    {touched.email && errors.email ? (
                      <span className="-mt-1 flex items-center gap-1 text-red-500 text-sm ">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 11 3 12a9 9 0 0118 0z" />
                        </svg>
                        {errors.email}
                      </span>
                    ) : null}
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full py-2 rounded-lg font-bold text-white shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
                    disabled={isLoading || isSubmitting}
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                  <div className="text-center text-sm -mt-2" style={{ color: 'var(--muted-foreground)' }}>
                    Remember your password?{" "}
                    <Link to="/auth/login" className="font-semibold text-primary hover:text-primary-hover transition-colors duration-150 focus:outline-none  rounded underline-offset-2 hover:underline" style={{ color: 'var(--primary)' }}>
                      Back to login
                    </Link>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Card>
    </div>
  );
}
