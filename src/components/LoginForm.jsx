import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/useAuth";
import { ErrorDisplay, ErrorMessage } from "@/components/ui/error-display";
import { useState } from "react";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export function LoginForm({ className, ...props }) {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        clearError();
        await login(values);
        navigate("/");
      } catch (error) {
        console.error("Login error:", error);
        // Error is handled by the store with toast notifications
      }
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            onSubmit={formik.handleSubmit}
            className="p-6 md:p-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16 opacity-10" style={{ background: 'var(--primary)' }}></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-100 rounded-full -ml-20 -mb-20 opacity-10" style={{ background: 'var(--primary)' }}></div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-row items-center justify-center text-center gap-4 mb-2">
                <img
                  src="/logo.svg"
                  alt="Dawaback Logo"
                  className="h-14 w-14"
                />
                <div className="flex flex-col items-start">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-muted-foreground text-balance -mt-1">
                    Login to your Dawaback account
                  </p>
                </div>
              </div>
              
              {/* Error Display */}
              <ErrorDisplay error={error} />

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className={cn(
                    formik.touched.email &&
                      formik.errors.email &&
                      "border-red-500"
                  )}
                />
                <ErrorMessage error={formik.touched.email && formik.errors.email ? (
                  <span className="flex items-center gap-1 text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 11 3 12a9 9 0 0118 0z" />
                    </svg>
                    {formik.errors.email}
                  </span>
                ) : null} />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    className={cn(
                      formik.touched.password &&
                        formik.errors.password &&
                        "border-red-500"
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
                <ErrorMessage error={formik.touched.password && formik.errors.password ? (
                  <span className="flex items-center gap-1 text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 11 3 12a9 9 0 0118 0z" />
                    </svg>
                    {formik.errors.password}
                  </span>
                ) : null} />
                <div className="text-right text-sm">
                  Forgot your password?{' '}
                  <Link
                    to="/auth/reset-password"
                    className="font-semibold text-primary hover:text-primary-hover transition-colors duration-150 focus:outline-none  rounded underline-offset-2 hover:underline"
                  >
                    Reset it
                  </Link>
                </div>
              </div>
              <Button
                type="submit"
                variant="default"
                className="w-full"
                disabled={isLoading || formik.isSubmitting}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <div className="text-center text-sm -mt-4">
                Don&apos;t have an account?{" "}
                <Link
                  to="/auth/signup"
                  className="font-semibold text-primary hover:text-primary-hover transition-colors duration-150 focus:outline-none  rounded underline-offset-2 hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </form>
          <div className="bg-gradient-to-br from-primary/20 via-white to-primary/20 hidden md:flex items-center justify-center">
            <img
              src="/Fingerprint-bro.svg"
              alt="Fingerprint illustration"
              className="h-70 w-70 object-contain dark:brightness-[0.2] dark:grayscale mx-auto my-auto"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground text-center -mt-3 text-xs text-balance">
        By clicking continue, you agree to our 
        <a 
          href="#" 
          className="font-bold text-primary hover:text-primary-hover underline-offset-2 hover:underline transition-colors duration-150"
        >
           {" "}Terms of Service
        </a>{" "}
        and 
        <a 
          href="#" 
          className="font-bold text-primary hover:text-primary-hover underline-offset-2 hover:underline transition-colors duration-150"
        >
           {" "}Privacy Policy
        </a>.
      </div>
    </div>
  );
}
