import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { initFlowbite } from "flowbite";
import { useFormik } from "formik";
import * as Yup from "yup";
import { requestAdvertise } from "../../api/advertise";
import { Card } from "../../components/ui/card";
import { ErrorHandler } from "@/utils/errorHandler";
import { ErrorDisplay, ErrorMessage } from "@/components/ui/error-display";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";

const advertiseSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .required("Name is required"),
  phone: Yup.string()
    .min(11, "Phone number must be at least 11 characters")
    .required("Phone number is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  content: Yup.string()
    .required("Message is required")
    .max(2500, "Message maximum length is 2500 characters"),
});

export default function Advertise() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showAlternativeContact, setShowAlternativeContact] = useState(false);

  useEffect(() => {
    initFlowbite();
  }, []);

  // Clear error when user starts typing
  const handleInputChange = (e) => {
    if (error) {
      setError(null);
      setShowAlternativeContact(false);
    }
    formik.handleChange(e);
  };

  // Handle retry submission
  const handleRetry = () => {
    setError(null);
    setShowAlternativeContact(false);
    formik.submitForm();
  };

  // Show alternative contact methods for certain errors
  const showAlternativeContactMethods = () => {
    setShowAlternativeContact(true);
  };

  const formik = useFormik({
    initialValues: {
      fullName: "",
      phone: "",
      email: "",
      content: "",
    },
    validationSchema: advertiseSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const res = await requestAdvertise(values);
        console.log("Form submitted:", res);

        // Use the specialized advertise success handler
        const successResult = ErrorHandler.handleAdvertiseSuccess(
          res,
          "submission"
        );

        // Save to localStorage with response data if available
        localStorage.setItem(
          "advertise_request",
          JSON.stringify({
            fullName: values.fullName,
            phone: values.phone,
            email: values.email,
            content: values.content,
            submittedAt: new Date().toISOString(),
            requestId: res.data?.id || res.id || null,
            status: res.data?.status || res.status || "submitted",
          })
        );

        resetForm();
      } catch (error) {
        console.error("Advertise error:", error);

        // Use the specialized advertise error handler
        const errorResult = ErrorHandler.handleAdvertiseError(
          error,
          "submission"
        );
        setError(errorResult.message);

        // Don't show toast here as it's handled by the API
        // But we can add additional context-specific handling
        if (errorResult.type === "warning") {
          // For duplicate requests, provide additional guidance
          console.log(
            "Duplicate request detected - user should contact support"
          );
        } else if (errorResult.type === "info") {
          // For service issues, suggest alternative contact methods
          console.log("Service issue detected - suggest alternative contact");
        }
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <motion.div
      className="min-h-screen font-sans  dark:bg-background text-foreground dark:text-foreground"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-4">
            <h1 className="text-5xl font-extrabold mb-2 text-primary dark:text-primary">
              Advertise with Dawaback
            </h1>
          </div>
          <p className="text-md text-muted-foreground dark:text-muted-foreground">
            Reach health-conscious customers and grow your pharmaceutical or
            healthcare brand with Dawaback, your trusted online medical
            pharmacy.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="max-w-7xl mx-auto mb-16 px-4">
        <motion.div
          className="flex flex-col lg:flex-row gap-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Form Container */}
          <div className="overflow-hidden shadow-2xl border-0 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-background dark:via-card dark:to-background text-card-foreground dark:text-card-foreground relative flex-1 p-8">
            {/* Decorative Elements */}
            <div
              className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-10 bg-blue-100 dark:bg-primary"
              style={{ background: "var(--primary)" }}
            ></div>
            <div
              className="absolute bottom-0 left-0 w-40 h-40 rounded-full -ml-20 -mb-20 opacity-10 bg-indigo-100 dark:bg-primary"
              style={{ background: "var(--primary)" }}
            ></div>
            <h2 className="text-3xl font-bold mb-1 text-center text-primary dark:text-primary">
              Get In Touch
            </h2>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground mb-6 text-center">
              Fill out the form below to learn more about our advertising
              opportunities.
            </p>

            {/* Error Display */}
            <ErrorDisplay error={error} />

            {/* Alternative Contact Methods */}
            {showAlternativeContact && (
              <div className="mb-6 mt-3 p-6 bg-primary/30 border border-primary rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-primary">
                    Alternative Contact Methods
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAlternativeContact(false)}
                    className="text-primary hover:text-primary-hover transition-colors p-1"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="space-y-3 text-sm text-primary">
                  <div className="flex items-center space-x-3">
                    <svg
                      className="h-4 w-4 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>
                      <strong>Email:</strong> advertise@dawaback.com
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg
                      className="h-4 w-4 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span>
                      <strong>Phone:</strong> +20 (100) 270-8887
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg
                      className="h-4 w-4 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      <strong>Business Hours:</strong> Monday - Friday, 9:00 AM
                      - 6:00 PM
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Recovery Actions */}
            {error && (
              <div className="my-3 flex flex-wrap flex-end gap-4">
                <button
                  type="button"
                  onClick={handleRetry}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                >
                  {isSubmitting ? "Retrying..." : "Try Again"}
                </button>
                <button
                  type="button"
                  onClick={showAlternativeContactMethods}
                  className="px-6 py-3 bg-white text-gray-700 border-gray-300 border rounded-lg hover:bg-gray-100 text-sm font-medium transition-colors"
                >
                  Contact Support
                </button>
              </div>
            )}

            <form className="space-y-8" onSubmit={formik.handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="font-semibold">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {/* User icon */}
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                        />
                      </svg>
                    </span>
                    <Input
                      type="text"
                      id="fullName"
                      name="fullName"
                      className={cn(
                        "pl-10 h-9 shadow-xs",
                        formik.touched.fullName &&
                          formik.errors.fullName &&
                          "border-red-500"
                      )}
                      placeholder="Enter your full name"
                      onChange={handleInputChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.fullName}
                    />
                  </div>
                  <ErrorMessage
                    error={
                      formik.touched.fullName && formik.errors.fullName
                        ? formik.errors.fullName
                        : null
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-semibold">
                    Contact Number <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {/* Phone icon */}
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </span>
                    <Input
                      type="text"
                      id="phone"
                      name="phone"
                      className={cn(
                        "pl-10 h-9 shadow-xs",
                        formik.touched.phone &&
                          formik.errors.phone &&
                          "border-red-500"
                      )}
                      placeholder="Enter your phone number"
                      onChange={handleInputChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.phone}
                    />
                  </div>
                  <ErrorMessage
                    error={
                      formik.touched.phone && formik.errors.phone
                        ? formik.errors.phone
                        : null
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-semibold">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {/* Envelope icon */}
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </span>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    className={cn(
                      "pl-10 h-9 shadow-xs",
                      formik.touched.email &&
                        formik.errors.email &&
                        "border-red-500"
                    )}
                    placeholder="Enter your email address"
                    onChange={handleInputChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                  />
                </div>
                <ErrorMessage
                  error={
                    formik.touched.email && formik.errors.email
                      ? formik.errors.email
                      : null
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content" className="font-semibold">
                  Message or Product/Service Details{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <div className="relative flex-1">
                  <span className="absolute left-3 mt-2.5 text-gray-400">
                    {/* Info icon */}
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                      />
                    </svg>
                  </span>
                  <Textarea
                    id="content"
                    name="content"
                    placeholder="Tell us more about your advertising needs..."
                    className={cn(
                      "pl-10 border-gray-300 focus:border-primary focus:ring-primary min-h-[120px] resize-none",
                      formik.touched.content &&
                        formik.errors.content &&
                        "border-red-500"
                    )}
                    onChange={handleInputChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.content}
                  />
                </div>
                <ErrorMessage
                  error={
                    formik.touched.content && formik.errors.content
                      ? formik.errors.content
                      : null
                  }
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary cursor-pointer hover:bg-primary-hover text-white font-bold py-3 px-6 rounded-lg w-full transition-all shadow-md mb-11 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </button>
            </form>
          </div>

          {/* Information Container */}
          <div className="overflow-hidden shadow-2xl border-0 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-background dark:via-card dark:to-background text-card-foreground dark:text-card-foreground relative flex-1 p-8">
            {/* Decorative Elements */}
            <div
              className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-10 bg-blue-100 dark:bg-primary"
              style={{ background: "var(--primary)" }}
            ></div>
            <div
              className="absolute bottom-0 left-0 w-40 h-40 rounded-full -ml-20 -mb-20 opacity-10 bg-indigo-100 dark:bg-primary"
              style={{ background: "var(--primary)" }}
            ></div>
            <h2 className="text-3xl font-bold mb-6 text-center text-primary dark:text-primary">
              Why Advertise with Us?
            </h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Targeted Audience
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Reach health-conscious customers actively seeking
                    pharmaceutical and healthcare solutions.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    High Engagement
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Our platform sees high engagement rates with users actively
                    browsing and purchasing healthcare products.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Trusted Platform
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Partner with a trusted healthcare platform that customers
                    rely on for their medical needs.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Competitive Pricing
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Get competitive advertising rates with flexible packages to
                    suit your budget and goals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
}
