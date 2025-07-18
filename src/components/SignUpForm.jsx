import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar28 } from "./DatePicker";
import {
  Info,
  UploadCloud,
  XCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signUp } from "@/api/auth/SignUp";
import { ErrorHandler } from "@/utils/errorHandler";
import { ErrorDisplay, ErrorMessage } from "@/components/ui/error-display";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

let userSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(40, "Name must be at most 40 characters"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .required("phone number is required  ")
    .matches(
      /^(010|011|012|015)[0-9]{8}$/,
      "the phone number must be egyptian phone number "
    ),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password")], "Password not match"),
  dateOfBirth: Yup.date()
    .required("Date of birth is required")
    .max(new Date(), "Date of birth cannot be in the future")
    .test("isValidDate", "Please select a valid date", (value) => {
      return value instanceof Date && !isNaN(value);
    }),
  gender: Yup.string().required("Gender is required"),
  uploadFrontId: Yup.mixed()
    .required("Front ID Card is required")
    .test("fileExists", "You must upload a file", (value) => {
      return value && value.length > 0;
    })
    .test(
      "fileType",
      "Only image files (jpg, jpeg, png) are allowed",
      (value) => {
        return (
          value &&
          value.length > 0 &&
          ["image/jpeg", "image/png", "image/jpg"].includes(value[0].type)
        );
      }
    ),
  uploadBackId: Yup.mixed()
    .required("Back ID Card is required")
    .test("fileExists", "You must upload a file", (value) => {
      return value && value.length > 0;
    })
    .test(
      "fileType",
      "Only image files (jpg, jpeg, png) are allowed",
      (value) => {
        return (
          value &&
          value.length > 0 &&
          ["image/jpeg", "image/png", "image/jpg"].includes(value[0].type)
        );
      }
    ),
  uploadWorkId: Yup.mixed()
    .required("Work ID is required")
    .test("fileExists", "You must upload a file", (value) => {
      return value && value.length > 0;
    })
    .test(
      "fileType",
      "Only image files (jpg, jpeg, png) are allowed",
      (value) => {
        return (
          value &&
          value.length > 0 &&
          ["image/jpeg", "image/png", "image/jpg"].includes(value[0].type)
        );
      }
    ),

  nationalId: Yup.string()
    .required("National id is required")
    .matches(/^[0-9]{14}$/, "National id must be 14 digits"),
  acceptPolicy: Yup.boolean()
    .oneOf([true], "You must accept the privacy policy")
    .required("You must accept the privacy policy"),
});

export function SignUpForm({ className, ...props }) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [imagePreviews, setImagePreviews] = React.useState({
    uploadFrontId: null,
    uploadBackId: null,
    uploadWorkId: null,
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  // Formik initialization at the top level
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      dateOfBirth: null,
      gender: "",
      uploadFrontId: null,
      uploadBackId: null,
      uploadWorkId: null,
      nationalId: "",
      acceptPolicy: false,
    },
    validationSchema: userSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        setError(null);

        // Additional client-side validation before submission
        if (!values.uploadFrontId || values.uploadFrontId.length === 0) {
          throw new Error("Front ID card image is required");
        }
        if (!values.uploadBackId || values.uploadBackId.length === 0) {
          throw new Error("Back ID card image is required");
        }
        if (!values.uploadWorkId || values.uploadWorkId.length === 0) {
          throw new Error("Work ID image is required");
        }

        // Create FormData for file upload
        const formData = new FormData();
        // Add text fields
        formData.append("fullName", values.name);
        formData.append("email", values.email);
        formData.append("password", values.password);
        formData.append("confirmPassword", values.confirmPassword);
        formData.append(
          "dateOfBirth",
          values.dateOfBirth
            ? values.dateOfBirth.toISOString().split("T")[0]
            : ""
        );
        formData.append("gender", values.gender);
        formData.append("phone", values.phone);
        formData.append("idCard", values.nationalId);
        // Add files
        if (values.uploadWorkId && values.uploadWorkId.length > 0) {
          formData.append("workIdUrl", values.uploadWorkId[0]);
        }
        if (values.uploadFrontId && values.uploadFrontId.length > 0) {
          formData.append("idFrontCardUrl", values.uploadFrontId[0]);
        }
        if (values.uploadBackId && values.uploadBackId.length > 0) {
          formData.append("idBackCardUrl", values.uploadBackId[0]);
        }
        const response = await signUp(formData);

        // Show success message
        ErrorHandler.handleSuccess(
          "Account created successfully! Your data will be reviewed. Please check your email for updates."
        );
        // Redirect to login
        navigate("/under-review");
      } catch (error) {
        console.error("Signup error:", error);

        // Use the centralized error handler for better error management
        const errorResult = ErrorHandler.handleSignupError(error, "submission");
        setError(errorResult.message);
        toast.error(errorResult.message || "Signup failed. Please try again.");

        // Don't show toast here as it's handled by ErrorHandler
        // Just set the local error state for form display
      } finally {
        setIsLoading(false);
      }
    },
    validateOnMount: true,
  });

  // Helper: Check if step 1 is valid
  const isStep1Valid = () => {
    const step1Fields = [
      "name",
      "email",
      "phone",
      "password",
      "confirmPassword",
      "dateOfBirth",
      "gender",
    ];
    // Check for errors in step 1 fields and that all are filled
    for (let field of step1Fields) {
      if (!formik.values[field]) return false; // not filled
      if (formik.errors[field]) return false; // has error
    }

    // Additional check for password confirmation
    if (formik.values.password !== formik.values.confirmPassword) {
      return false;
    }

    return true;
  };

  // File input handlers for Formik
  const handleFileChange = (e, field) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        setError(
          `Please upload only JPG, JPEG, or PNG files for ${field
            .replace("upload", "")
            .replace("Id", " ID")
            .toLowerCase()}`
        );
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setError(
          `File size must be less than 5MB for ${field
            .replace("upload", "")
            .replace("Id", " ID")
            .toLowerCase()}`
        );
        return;
      }

      // Set the file in formik
      formik.setFieldValue(field, e.target.files);

      // Create image preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreviews((prev) => ({
          ...prev,
          [field]: event.target.result,
        }));
      };
      reader.onerror = () => {
        setError(
          `Failed to read image file for ${field
            .replace("upload", "")
            .replace("Id", " ID")
            .toLowerCase()}`
        );
        formik.setFieldValue(field, null);
      };
      reader.readAsDataURL(file);

      // Clear any previous errors when user uploads a file
      if (error) setError(null);
    }
  };

  const handleFileClear = (field) => {
    formik.setFieldValue(field, null);
    setImagePreviews((prev) => ({
      ...prev,
      [field]: null,
    }));
    // Clear any related errors
    if (error) setError(null);
  };

  // Step navigation
  const nextStep = async () => {
    // Mark all step 1 fields as touched
    formik.setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
      dateOfBirth: true,
      gender: true,
    });

    // Validate the form
    const errors = await formik.validateForm();

    // Check if there are any errors in step 1 fields
    const step1Fields = [
      "name",
      "email",
      "phone",
      "password",
      "confirmPassword",
      "dateOfBirth",
      "gender",
    ];
    const hasStep1Errors = step1Fields.some((field) => errors[field]);

    if (!hasStep1Errors && isStep1Valid()) {
      setCurrentStep(2);
      // Clear any previous errors when moving to next step
      setError(null);
    } else {
      // Show validation errors
      setError(
        "Please fix the errors above before proceeding to the next step."
      );
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
    // Clear any previous errors when going back
    setError(null);
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      <Card className="overflow-hidden shadow-2xl border-0 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative">
        {/* Decorative Elements */}
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-10"
          style={{ background: "var(--primary)" }}
        ></div>
        <div
          className="absolute bottom-0 left-0 w-40 h-40 rounded-full -ml-20 -mb-20 opacity-10"
          style={{ background: "var(--primary)" }}
        ></div>

        <div className="relative p-8 md:p-10">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-primary/70 mb-2">
              Create Your Account
            </h1>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              Fill out the form below to create your secure account
            </p>
          </div>

          {/* Enhanced Step Indicator */}
          <div className="flex items-center justify-center space-x-6 mb-8">
            <div
              className={`flex items-center ${
                currentStep === 1 ? "text-primary" : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-semibold ${
                  currentStep === 1
                    ? "border-primary bg-primary text-white"
                    : "border-gray-300"
                }`}
              >
                1
              </div>
              <span className="ml-3 text-sm font-medium">Personal Info</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div
              className={`flex items-center ${
                currentStep === 2 ? "text-primary" : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-semibold ${
                  currentStep === 2
                    ? "border-primary bg-primary text-white"
                    : "border-gray-300"
                }`}
              >
                2
              </div>
              <span className="ml-3 text-sm font-medium">Documents</span>
            </div>
          </div>

          {/* Error Display */}
          <ErrorDisplay className="mb-4" error={error} />

          <form className="space-y-8" onSubmit={formik.handleSubmit}>
            {/* Step 1: Personal Information */}
            <div className={currentStep === 2 ? "hidden" : "space-y-6"}>
              {/* Basic Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-semibold">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      className={cn(
                        "rounded-lg border-2 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] transition-all h-10",
                        formik.touched.name &&
                          formik.errors.name &&
                          "border-red-500"
                      )}
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      aria-describedby={
                        formik.touched.name && formik.errors.name
                          ? "name-error"
                          : undefined
                      }
                      aria-invalid={
                        formik.touched.name && formik.errors.name
                          ? "true"
                          : "false"
                      }
                    />
                    <ErrorMessage
                      error={
                        formik.touched.name && formik.errors.name ? (
                          <span
                            id="name-error"
                            className="flex items-center gap-1 text-red-500 text-sm mt-1"
                            role="alert"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 flex-shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v2m0 4h.01M21 12A9 9 0 11 3 12a9 9 0 0118 0z"
                              />
                            </svg>
                            {formik.errors.name}
                          </span>
                        ) : null
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-semibold">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      className={cn(
                        "rounded-lg border-2 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] transition-all h-10",
                        formik.touched.email &&
                          formik.errors.email &&
                          "border-red-500"
                      )}
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <ErrorMessage
                      error={
                        formik.touched.email && formik.errors.email ? (
                          <span className="flex items-center gap-1 text-red-500 text-sm mt-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 flex-shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v2m0 4h.01M21 12A9 9 0 11 3 12a9 9 0 0118 0z"
                              />
                            </svg>
                            {formik.errors.email}
                          </span>
                        ) : null
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Contact & Personal Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Contact & Personal Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-semibold">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="Enter your phone number"
                      className={cn(
                        "rounded-lg border-2 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] transition-all h-10",
                        formik.touched.phone &&
                          formik.errors.phone &&
                          "border-red-500"
                      )}
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <ErrorMessage
                      error={
                        formik.touched.phone && formik.errors.phone ? (
                          <span className="flex items-center gap-1 text-red-500 text-sm mt-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 flex-shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v2m0 4h.01M21 12A9 9 0 11 3 12a9 9 0 0118 0z"
                              />
                            </svg>
                            {formik.errors.phone}
                          </span>
                        ) : null
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-semibold">
                      Date of Birth <span className="text-red-500">*</span>
                    </Label>
                    <div
                      className={cn(
                        "rounded-lg border-2 transition-all",
                        formik.touched.dateOfBirth && formik.errors.dateOfBirth
                          ? "border-red-500 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500"
                          : "border-gray-300 focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary)]"
                      )}
                    >
                      <Calendar28
                        value={formik.values.dateOfBirth}
                        onChange={(date) => {
                          formik.setFieldValue("dateOfBirth", date);
                          formik.setFieldTouched("dateOfBirth", true);
                        }}
                      />
                    </div>
                    <ErrorMessage
                      error={
                        formik.touched.dateOfBirth &&
                        formik.errors.dateOfBirth ? (
                          <span className="flex items-center gap-1 text-red-500 text-sm mt-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 flex-shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v2m0 4h.01M21 12A9 9 0 11 3 12a9 9 0 0118 0z"
                              />
                            </svg>
                            {formik.errors.dateOfBirth}
                          </span>
                        ) : null
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2 w-full">
                  <Label htmlFor="gender" className="font-semibold">
                    Gender <span className="text-red-500">*</span>
                  </Label>
                  <div className="space-y-2 flex flex-row gap-4 w-full">
                    <div className="flex items-center flex-row space-x-3 h-10 px-3 rounded-lg border-2 border-gray-300 transition-all w-full">
                      <input
                        id="gender-male"
                        name="gender"
                        type="radio"
                        value="male"
                        checked={formik.values.gender === "male"}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                      />
                      <Label
                        htmlFor="gender-male"
                        className="text-sm font-medium text-gray-700 cursor-pointer"
                      >
                        Male
                      </Label>
                    </div>
                    <div className="flex items-center flex-row space-x-3 h-10 px-3 rounded-lg border-2 border-gray-300 transition-all w-full">
                      <input
                        id="gender-female"
                        name="gender"
                        type="radio"
                        value="female"
                        checked={formik.values.gender === "female"}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                      />
                      <Label
                        htmlFor="gender-female"
                        className="text-sm font-medium text-gray-700 cursor-pointer"
                      >
                        Female
                      </Label>
                    </div>
                  </div>
                  <ErrorMessage
                    error={
                      formik.touched.gender && formik.errors.gender ? (
                        <span className="flex items-center gap-1 text-red-500 text-sm mt-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 9v2m0 4h.01M21 12A9 9 0 11 3 12a9 9 0 0118 0z"
                            />
                          </svg>
                          {formik.errors.gender}
                        </span>
                      ) : null
                    }
                  />
                </div>
              </div>

              {/* Security Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Security
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="font-semibold">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className={cn(
                          "rounded-lg border-2 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] transition-all h-10",
                          formik.touched.password &&
                            formik.errors.password &&
                            "border-red-500"
                        )}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
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
                    <ErrorMessage
                      error={
                        formik.touched.password && formik.errors.password ? (
                          <span className="flex items-center gap-1 text-red-500 text-sm mt-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 flex-shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v2m0 4h.01M21 12A9 9 0 11 3 12a9 9 0 0118 0z"
                              />
                            </svg>
                            {formik.errors.password}
                          </span>
                        ) : null
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="font-semibold">
                      Confirm Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className={cn(
                          "rounded-lg border-2 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] transition-all h-10",
                          formik.touched.confirmPassword &&
                            formik.errors.confirmPassword &&
                            "border-red-500",
                          formik.values.confirmPassword &&
                            formik.values.password ===
                              formik.values.confirmPassword
                        )}
                        value={formik.values.confirmPassword}
                        onChange={(e) => {
                          formik.handleChange(e);
                          // Clear password match error when user starts typing
                          if (
                            formik.errors.confirmPassword &&
                            e.target.value === formik.values.password
                          ) {
                            formik.setFieldError("confirmPassword", null);
                          }
                        }}
                        onBlur={formik.handleBlur}
                        aria-describedby={
                          formik.touched.confirmPassword &&
                          formik.errors.confirmPassword
                            ? "confirmPassword-error"
                            : undefined
                        }
                        aria-invalid={
                          formik.touched.confirmPassword &&
                          formik.errors.confirmPassword
                            ? "true"
                            : "false"
                        }
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
                    {/* Password match indicator */}

                    <ErrorMessage
                      error={
                        formik.touched.confirmPassword &&
                        formik.errors.confirmPassword ? (
                          <span
                            id="confirmPassword-error"
                            className="flex items-center gap-1 text-red-500 text-sm mt-1"
                            role="alert"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 flex-shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v2m0 4h.01M21 12A9 9 0 11 3 12a9 9 0 0118 0z"
                              />
                            </svg>
                            {formik.errors.confirmPassword}
                          </span>
                        ) : null
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Document Upload */}
            <div className={currentStep === 1 ? "hidden" : "space-y-6"}>
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Document Verification
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="frontIdFile" className="font-semibold">
                    Front ID Card <span className="text-red-500">*</span>
                  </Label>
                  <label
                    htmlFor="frontIdFile"
                    className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all hover:border-[var(--primary)] overflow-hidden group"
                  >
                    {formik.values.uploadFrontId &&
                    formik.values.uploadFrontId.length > 0 &&
                    imagePreviews.uploadFrontId ? (
                      <div className="relative w-full h-full">
                        <img
                          src={imagePreviews.uploadFrontId}
                          alt="Front ID Card Preview"
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleFileClear("uploadFrontId");
                            }}
                            className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-2 transition-all duration-200 hover:bg-red-600"
                            title="Remove image"
                          >
                            <XCircle size={16} />
                          </button>
                        </div>
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          {formik.values.uploadFrontId[0].name}
                        </div>
                      </div>
                    ) : formik.values.uploadFrontId &&
                      formik.values.uploadFrontId.length > 0 ? (
                      <div className="flex items-center justify-center space-x-2 p-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-xs text-gray-600">📄</span>
                          </div>
                          <span className="text-sm text-gray-700 truncate max-w-32">
                            {formik.values.uploadFrontId[0].name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleFileClear("uploadFrontId");
                          }}
                          className="text-gray-500 hover:text-red-500 transition-colors p-1"
                          title="Remove file"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-12 h-12 text-gray-400 mb-3 group-hover:text-gray-600 transition-colors" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">
                            Click to upload image
                          </span>
                        </p>
                        <p className="text-xs text-gray-500">
                          JPG, PNG (Max 5MB)
                        </p>
                      </div>
                    )}
                    <Input
                      id="frontIdFile"
                      name="uploadFrontId"
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, "uploadFrontId")}
                    />
                  </label>
                  <ErrorMessage
                    error={
                      formik.touched.uploadFrontId &&
                      formik.errors.uploadFrontId ? (
                        <span className="flex items-center gap-1 text-red-500 text-sm mt-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 9v2m0 4h.01M21 12A9 9 0 11 3 12a9 9 0 0118 0z"
                            />
                          </svg>
                          {formik.errors.uploadFrontId}
                        </span>
                      ) : null
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backIdFile" className="font-semibold">
                    Back ID Card <span className="text-red-500">*</span>
                  </Label>
                  <label
                    htmlFor="backIdFile"
                    className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all hover:border-[var(--primary)] overflow-hidden group"
                  >
                    {formik.values.uploadBackId &&
                    formik.values.uploadBackId.length > 0 &&
                    imagePreviews.uploadBackId ? (
                      <div className="relative w-full h-full">
                        <img
                          src={imagePreviews.uploadBackId}
                          alt="Back ID Card Preview"
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleFileClear("uploadBackId");
                            }}
                            className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-2 transition-all duration-200 hover:bg-red-600"
                            title="Remove image"
                          >
                            <XCircle size={16} />
                          </button>
                        </div>
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          {formik.values.uploadBackId[0].name}
                        </div>
                      </div>
                    ) : formik.values.uploadBackId &&
                      formik.values.uploadBackId.length > 0 ? (
                      <div className="flex items-center justify-center space-x-2 p-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-xs text-gray-600">📄</span>
                          </div>
                          <span className="text-sm text-gray-700 truncate max-w-32">
                            {formik.values.uploadBackId[0].name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleFileClear("uploadBackId");
                          }}
                          className="text-gray-500 hover:text-red-500 transition-colors p-1"
                          title="Remove file"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-12 h-12 text-gray-400 mb-3 group-hover:text-gray-600 transition-colors" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">
                            Click to upload image
                          </span>
                        </p>
                        <p className="text-xs text-gray-500">
                          JPG, PNG (Max 5MB)
                        </p>
                      </div>
                    )}
                    <Input
                      id="backIdFile"
                      name="uploadBackId"
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, "uploadBackId")}
                    />
                  </label>
                  <ErrorMessage
                    error={
                      formik.touched.uploadBackId &&
                      formik.errors.uploadBackId ? (
                        <span className="flex items-center gap-1 text-red-500 text-sm mt-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 9v2m0 4h.01M21 12A9 9 0 11 3 12a9 9 0 0118 0z"
                            />
                          </svg>
                          {formik.errors.uploadBackId}
                        </span>
                      ) : null
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workIdFile" className="font-semibold">
                    Work ID Card <span className="text-red-500">*</span>
                  </Label>
                  <label
                    htmlFor="workIdFile"
                    className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all hover:border-[var(--primary)] overflow-hidden group"
                  >
                    {formik.values.uploadWorkId &&
                    formik.values.uploadWorkId.length > 0 &&
                    imagePreviews.uploadWorkId ? (
                      <div className="relative w-full h-full">
                        <img
                          src={imagePreviews.uploadWorkId}
                          alt="Work ID Card Preview"
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleFileClear("uploadWorkId");
                            }}
                            className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-2 transition-all duration-200 hover:bg-red-600"
                            title="Remove image"
                          >
                            <XCircle size={16} />
                          </button>
                        </div>
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          {formik.values.uploadWorkId[0].name}
                        </div>
                      </div>
                    ) : formik.values.uploadWorkId &&
                      formik.values.uploadWorkId.length > 0 ? (
                      <div className="flex items-center justify-center space-x-2 p-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-xs text-gray-600">📄</span>
                          </div>
                          <span className="text-sm text-gray-700 truncate max-w-32">
                            {formik.values.uploadWorkId[0].name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleFileClear("uploadWorkId");
                          }}
                          className="text-gray-500 hover:text-red-500 transition-colors p-1"
                          title="Remove file"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-12 h-12 text-gray-400 mb-3 group-hover:text-gray-600 transition-colors" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">
                            Click to upload image
                          </span>
                        </p>
                        <p className="text-xs text-gray-500">
                          JPG, PNG (Max 5MB)
                        </p>
                      </div>
                    )}
                    <Input
                      id="workIdFile"
                      name="uploadWorkId"
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, "uploadWorkId")}
                    />
                  </label>
                  <ErrorMessage
                    error={
                      formik.touched.uploadWorkId &&
                      formik.errors.uploadWorkId ? (
                        <span className="flex items-center gap-1 text-red-500 text-sm mt-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 9v2m0 4h.01M21 12A9 9 0 11 3 12a9 9 0 0118 0z"
                            />
                          </svg>
                          {formik.errors.uploadWorkId}
                        </span>
                      ) : null
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationalId" className="font-semibold">
                  National ID Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nationalId"
                  name="nationalId"
                  type="text"
                  placeholder="Enter your 14-digit national ID"
                  className={cn(
                    "rounded-lg border-2 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] transition-all",
                    formik.touched.nationalId &&
                      formik.errors.nationalId &&
                      "border-red-500"
                  )}
                  value={formik.values.nationalId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <ErrorMessage
                  error={
                    formik.touched.nationalId && formik.errors.nationalId ? (
                      <span className="flex items-center gap-1 text-red-500 text-sm mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v2m0 4h.01M21 12A9 9 0 11 3 12a9 9 0 0118 0z"
                          />
                        </svg>
                        {formik.errors.nationalId}
                      </span>
                    ) : null
                  }
                />
              </div>

              {/* Privacy Policy Checkbox */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Terms & Conditions
                </h3>
                <div className="flex items-start space-x-4 p-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-lg border border-primary/80">
                  <div className="flex items-center justify-center w-5 h-5 mt-0.5">
                    <input
                      id="acceptPolicy"
                      name="acceptPolicy"
                      type="checkbox"
                      checked={formik.values.acceptPolicy}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="h-4 w-4 text-primary focus:ring-2 focus:ring-primary border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="acceptPolicy"
                      className="-ms-2 text-sm text-gray-700 leading-relaxed"
                    >
                      I have read and agree to the{" "}
                      <a
                        href="/privacy"
                        className="text-primary font-semibold hover:text-primary-hover  hover:underline underline-offset-2 transition-colors duration-150"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Privacy Policy
                      </a>{" "}
                      and{" "}
                      <a
                        href="/terms"
                        className="text-primary font-semibold hover:text-primary-hover hover:underline underline-offset-2 transition-colors duration-150"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Terms of Service
                      </a>
                      <span className="text-red-500 font-bold ml-1">*</span>
                    </label>
                    <p className="text-xs -ms-2 text-gray-500 mt-1">
                      By checking this box, you confirm that you understand and
                      accept our terms and conditions.
                    </p>
                  </div>
                </div>
                <ErrorMessage
                  error={
                    formik.touched.acceptPolicy &&
                    formik.errors.acceptPolicy ? (
                      <span className="flex items-center gap-1 text-red-500 text-sm mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v2m0 4h.01M21 12A9 9 0 11 3 12a9 9 0 0118 0z"
                          />
                        </svg>
                        {formik.errors.acceptPolicy}
                      </span>
                    ) : null
                  }
                />
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              {currentStep === 2 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="flex items-center gap-2 border-primary text-primary hover:bg-primary/10"
                  disabled={isLoading}
                >
                  <ArrowLeft size={16} />
                  Previous
                </Button>
              ) : (
                <div></div>
              )}

              {currentStep === 1 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className={`flex items-center gap-2 bg-primary hover:bg-primary-hover text-white hover:text-white ${
                    !isStep1Valid() ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={!isStep1Valid() || isLoading}
                >
                  Next
                  <ArrowRight size={16} />
                </Button>
              ) : (
                <div className="flex items-center gap-4">
                  {isLoading && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      Processing...
                    </div>
                  )}
                  <Button
                    type="submit"
                    className={`bg-primary hover:bg-primary-hover text-white py-3 px-6 text-base font-medium rounded-lg ${
                      !formik.isValid || isLoading
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={!formik.isValid || isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </div>
              )}
            </div>
          </form>

          <div
            className="mt-5 text-center text-sm"
            style={{ color: "var(--muted-foreground)" }}
          >
            Already have an account?{" "}
            <a
              href="/auth/login"
              className="font-semibold text-primary hover:text-primary-hover transition-colors duration-150 focus:outline-none rounded underline-offset-2 hover:underline"
            >
              Sign In
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
