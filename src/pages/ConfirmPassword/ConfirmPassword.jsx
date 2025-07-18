import { GalleryVerticalEnd } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/store/useAuth";
import { ErrorDisplay, ErrorMessage } from "@/components/ui/error-display";
import { cn } from "@/lib/utils";

const ConfirmPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function ConfirmPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { confirmPassword } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setIsLoading(true);
      setError(null);
      const email = sessionStorage.getItem("resetEmail");
      if (!email) throw new Error("No email found in session");
      await confirmPassword({ email, newPassword: values.password });
      resetForm();
      navigate("/auth/login");
    } catch (error) {
      console.error("Confirm password error:", error);
      setError(error.message || "Failed to confirm password");
      // Error toast is handled by the store
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="flex lg:my-30 md:my-10 flex-col items-center justify-center gap-6 p-6 md:p-10">
      <Card className="relative w-full max-w-md overflow-hidden shadow-2xl border-0 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-indigo-50" style={{ backdropFilter: 'blur(8px)' }}>
        {/* Decorative Circles & Illustration */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-10" style={{ background: 'var(--primary)' }}></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full -ml-20 -mb-20 opacity-10" style={{ background: 'var(--primary)' }}></div>
        <div className="absolute left-1/2 -translate-x-1/2 -top-16 flex justify-center">
          <GalleryVerticalEnd className="w-20 h-20 text-primary/95" />
        </div>
        <div className="relative p-10 pt-20 flex flex-col gap-4">
          <Formik
            initialValues={{ password: "", confirmPassword: "" }}
            validationSchema={ConfirmPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2 -mt-10">
                  <img src="/logo.svg" alt="Dawaback Logo" className="h-18 w-18 mx-auto" />
                  <h1 className="text-2xl font-bold tracking-tight text-primary/95">Confirm Password</h1>
                  <p className="text-sm -mt-2 text-center" style={{ color: 'var(--muted-foreground)' }}>
                    Create a new password for your account.
                  </p>
                </div>

                {/* Error Display */}
                <ErrorDisplay error={error} />

                <div className="flex flex-col gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                      <Field
                        as={Input}
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        disabled={isLoading}
                        className={cn(
                          errors.password && touched.password && "border-red-500"
                        )}
                      />
                      <button
                        type="button"
                        className={cn(
                          "absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded transition",
                          showPassword
                            ? "text-primary"
                            : "text-gray-500"
                        )}
                        onClick={() => setShowPassword((prev) => !prev)}
                        tabIndex={-1}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          // Eye-off (crossed) icon, outline style (Heroicons)
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9.27-3.11-10.5-7.5a10.05 10.05 0 012.563-4.568m2.1-1.933A9.956 9.956 0 0112 5c5 0 9.27 3.11 10.5 7.5a9.956 9.956 0 01-4.198 5.568M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                          </svg>
                        ) : (
                          // Eye icon (outlined)
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <ErrorMessage error={errors.password && touched.password ? errors.password : null} />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Field
                        as={Input}
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter new password"
                        disabled={isLoading}
                        className={cn(
                          errors.confirmPassword && touched.confirmPassword && "border-red-500"
                        )}
                      />
                      <button
                        type="button"
                        className={cn(
                          "absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded transition",
                          showConfirmPassword
                            ? "text-primary"
                            : "text-gray-500"
                        )}
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        tabIndex={-1}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? (
                          // Eye-off (crossed) icon, outline style (Heroicons)
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9.27-3.11-10.5-7.5a10.05 10.05 0 012.563-4.568m2.1-1.933A9.956 9.956 0 0112 5c5 0 9.27 3.11 10.5 7.5a9.956 9.956 0 01-4.198 5.568M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                          </svg>
                        ) : (
                          // Eye icon (outlined)
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <ErrorMessage error={errors.confirmPassword && touched.confirmPassword ? errors.confirmPassword : null} />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || isSubmitting}
                  >
                    {isLoading ? "Confirming..." : "Confirm Password"}
                  </Button>
                  <div className="text-center text-sm -mt-2">
                  Need further assistance?{" "}
                    <Link
                      to="/contact"
                      className="font-semibold text-primary hover:text-primary-hover transition-colors duration-150 focus:outline-none rounded underline-offset-2 hover:underline"
                    >
                      Contact us
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