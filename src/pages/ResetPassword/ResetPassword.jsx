import { GalleryVerticalEnd } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Card} from "@/components/ui/card";
import { useAuth } from "@/store/useAuth";

const ResetPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setIsLoading(true);
      await resetPassword({ email: values.email });
      toast.success("Password reset instructions sent to your email");
      navigate("/auth/reset-password/verify-otp", {
        state: {
          email: values.email,
          purpose: "reset-password",
        },
      });
    } catch (error) {
      toast.error("Failed to send reset instructions");
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
            initialValues={{ email: "" }}
            validationSchema={ResetPasswordSchema}
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
                      <img src="/DawabackNewLogo.png" className="w-16"/>
                    </div>
                    <span className="sr-only">Acme Inc.</span>
                  </a>
                  <h1 className="text-xl font-bold">Reset Password</h1>
                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link to="/auth/signup" className="underline underline-offset-4">
                      Sign up
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      disabled={isLoading}
                    />
                    {errors.email && touched.email && (
                      <div className="text-sm text-red-500">{errors.email}</div>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading || isSubmitting}
                  >
                    {isLoading ? "Sending..." : "Reset Password"}
                  </Button>
                  <div className="text-center text-sm">
                    Remember your password?{" "}
                    <Link to="/auth/login" className="underline underline-offset-4">
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
