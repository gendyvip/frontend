import { GalleryVerticalEnd } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/store/useAuth";

const ConfirmPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function ConfirmPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { confirmPassword } = useAuth();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setIsLoading(true);
      const email = sessionStorage.getItem("resetEmail");
      if (!email) throw new Error("No email found in session");
      await confirmPassword({ email, newPassword: values.password });
      toast.success("Password confirmed successfully!");
      resetForm();
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Failed to confirm password");
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <Card className="relative w-full max-w-sm overflow-hidden shadow-lg border-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-100 rounded-full -ml-20 -mb-20 opacity-50"></div>
        <div className="relative p-8">
          <Formik
            initialValues={{ password: "", confirmPassword: "" }}
            validationSchema={ConfirmPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2">
                  <a
                    href="#"
                    className="flex flex-col items-center gap-2 font-medium"
                  >
                    <div className="flex size-8 items-center justify-center rounded-md">
                      <img src="/DawabackNewLogo.png" className="w-16" />
                    </div>
                    <span className="sr-only">Acme Inc.</span>
                  </a>
                  <h1 className="text-xl font-bold">Confirm Password</h1>
                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link to="/signup" className="underline underline-offset-4">
                      Sign up
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="password">New Password</Label>
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter new password"
                      disabled={isLoading}
                    />
                    {errors.password && touched.password && (
                      <div className="text-sm text-red-500">{errors.password}</div>
                    )}
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Field
                      as={Input}
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Re-enter new password"
                      disabled={isLoading}
                    />
                    {errors.confirmPassword && touched.confirmPassword && (
                      <div className="text-sm text-red-500">{errors.confirmPassword}</div>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || isSubmitting}
                  >
                    {isLoading ? "Confirming..." : "Confirm Password"}
                  </Button>
                  <div className="text-center text-sm">
                    Remember your password?{" "}
                    <Link to="/login" className="underline underline-offset-4">
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