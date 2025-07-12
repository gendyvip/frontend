import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaLock, FaEye, FaEyeSlash, FaShieldAlt, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { useAuth } from "@/store/useAuth";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function SecurityCard({ pharmacistDetails }) {
  // Add null check and default values
  const details = pharmacistDetails || {};

  const { changePassword, isLoading, error, clearError } = useAuth();
  const [success, setSuccess] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmNewPassword: false
  });

  const validationSchema = Yup.object({
    oldPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string()
      .required("New password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Please confirm your new password'),
  });

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['text-red-500', 'text-orange-500', 'text-yellow-500', 'text-blue-500', 'text-green-500'];
    
    return {
      strength: Math.min(strength, 5),
      label: labels[Math.min(strength - 1, 4)],
      color: colors[Math.min(strength - 1, 4)]
    };
  };

  return (
    <Card className="shadow-lg rounded-xl border border-gray-200 bg-white max-w-xl mx-auto px-4 py-8">
      <CardHeader>
        <CardTitle>
          <div className="inline-flex items-center gap-3 font-bold text-xl tracking-wide">
            <span className="inline-flex items-center justify-center rounded-full bg-primary/10 shadow-sm w-12 h-12">
              <FaLock size={24} className="text-primary" />
            </span>
           <div className="flex flex-col">
           <span className="text-gray-900">
              Security Settings
            </span>
            <p className="text-sm text-gray-600 font-normal">Update your password to keep your account secure</p>
           </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Formik
          initialValues={{ oldPassword: "", newPassword: "", confirmNewPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            setSuccess("");
            clearError();
            try {
              await changePassword(values);
              setSuccess("Password updated successfully.");
              resetForm();
              setShowPasswords({
                oldPassword: false,
                newPassword: false,
                confirmNewPassword: false
              });
            } catch (err) {
              // error handled by zustand
            }
          }}
        >
          {({ handleSubmit, values, setFieldValue }) => (
            <>
              <Form className="space-y-6" onSubmit={handleSubmit}>
                {/* Current Password */}
                <div className="group relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div>
                      <Label htmlFor="current-password" className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Current Password
                      </Label>
                    </div>
                  </div>
                  <div className="relative">
                    <Field
                      as={Input}
                      id="current-password"
                      name="oldPassword"
                      type={showPasswords.oldPassword ? "text" : "password"}
                      placeholder="Enter current password"
                      className="pl-12 pr-12 py-3 border-2 border-gray-200 focus:border-primary transition-all duration-200"
                    />
                    <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('oldPassword')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showPasswords.oldPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                  </div>
                  <ErrorMessage name="oldPassword" component="div" className="flex items-center gap-2 mt-2 text-red-500 text-xs">
                    {(msg) => (
                      <div className="flex items-center gap-2 mt-2 text-red-500 text-xs">
                        <FaExclamationTriangle size={12} />
                        {msg}
                      </div>
                    )}
                  </ErrorMessage>
                </div>

                {/* New Password */}
                <div className="group relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div>
                      <Label htmlFor="new-password" className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        New Password
                      </Label>
                    </div>
                  </div>
                  <div className="relative">
                    <Field
                      as={Input}
                      id="new-password"
                      name="newPassword"
                      type={showPasswords.newPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      className="pl-12 pr-12 py-3 border-2 border-gray-200 focus:border-primary transition-all duration-200"
                    />
                    <FaShieldAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('newPassword')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showPasswords.newPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {values.newPassword && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-600">Password Strength</span>
                        <span className={`text-xs font-medium ${getPasswordStrength(values.newPassword).color}`}>
                          {getPasswordStrength(values.newPassword).label}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            getPasswordStrength(values.newPassword).strength <= 2 ? 'bg-red-500' :
                            getPasswordStrength(values.newPassword).strength === 3 ? 'bg-yellow-500' :
                            getPasswordStrength(values.newPassword).strength === 4 ? 'bg-blue-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${(getPasswordStrength(values.newPassword).strength / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <ErrorMessage name="newPassword" component="div" className="flex items-center gap-2 mt-2 text-red-500 text-xs">
                    {(msg) => (
                      <div className="flex items-center gap-2 mt-2 text-red-500 text-xs">
                        <FaExclamationTriangle size={12} />
                        {msg}
                      </div>
                    )}
                  </ErrorMessage>
                </div>

                {/* Confirm New Password */}
                <div className="group relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div>
                      <Label htmlFor="confirm-password" className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Confirm New Password
                      </Label>
                    </div>
                  </div>
                  <div className="relative">
                    <Field
                      as={Input}
                      id="confirm-password"
                      name="confirmNewPassword"
                      type={showPasswords.confirmNewPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="pl-12 pr-12 py-3 border-2 border-gray-200 focus:border-primary transition-all duration-200"
                    />
                    <FaShieldAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirmNewPassword')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showPasswords.confirmNewPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                  </div>
                  <ErrorMessage name="confirmNewPassword" component="div" className="flex items-center gap-2 mt-2 text-red-500 text-xs">
                    {(msg) => (
                      <div className="flex items-center gap-2 mt-2 text-red-500 text-xs">
                        <FaExclamationTriangle size={12} />
                        {msg}
                      </div>
                    )}
                  </ErrorMessage>
                </div>

                {/* Submit Button */}
                <div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-medium transition-colors duration-200"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Updating Password...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <FaCheckCircle size={16} />
                        Update Password
                      </div>
                    )}
                  </Button>
                </div>

                {/* Success/Error Messages */}
                {success && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                      <FaCheckCircle size={16} />
                      <span className="text-sm">{success}</span>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-700">
                      <FaExclamationTriangle size={16} />
                      <span className="text-sm">{error}</span>
                    </div>
                  </div>
                )}
              </Form>
            </>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}
