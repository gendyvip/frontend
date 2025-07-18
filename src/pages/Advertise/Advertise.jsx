import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { initFlowbite } from "flowbite";
import { useFormik } from "formik";
import * as Yup from "yup";
import { requestAdvertise } from "../../api/advertise";
import { Card } from "../../components/ui/card";
import { ErrorHandler } from "@/utils/errorHandler";
import { ErrorDisplay, ErrorMessage } from "@/components/ui/error-display";

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
  content: Yup.string().required("Message is required").max(2500, "Message maximum length is 2500 characters"),
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
        const successResult = ErrorHandler.handleAdvertiseSuccess(res, "submission");
        
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
            status: res.data?.status || res.status || "submitted"
          })
        );
        
        resetForm();
      } catch (error) {
        console.error("Advertise error:", error);
        
        // Use the specialized advertise error handler
        const errorResult = ErrorHandler.handleAdvertiseError(error, "submission");
        setError(errorResult.message);
        
        // Don't show toast here as it's handled by the API
        // But we can add additional context-specific handling
        if (errorResult.type === "warning") {
          // For duplicate requests, provide additional guidance
          console.log("Duplicate request detected - user should contact support");
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
    <div className="min-h-screen font-sans">
      {/* Hero Section */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
              {/* Medical Icon SVG */}
              <svg
                className="w-10 h-10 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 2v20m10-10H2"
                />
              </svg>
            </span>
          </div>
          <h1 className="text-5xl font-extrabold mb-2 text-primary">
            Advertise with Dawaback
          </h1>
          <p className="text-md text-muted-foreground mb-6">
            Reach health-conscious customers and grow your pharmaceutical or
            healthcare brand with Dawaback, your trusted online medical pharmacy.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="max-w-7xl mx-auto mb-16 px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Container */}
          <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden rounded-2xl shadow-lg p-8 flex flex-col justify-center border border-gray-100 flex-1">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-100 rounded-full -ml-20 -mb-20 opacity-50"></div>
            <h2 className="text-3xl font-bold mb-1 text-center">Get In Touch</h2>
            <p className="text-sm text-muted-foreground mb-6 text-center">
              Fill out the form below to learn more about our advertising
              opportunities.
            </p>
            
            {/* Error Display */}
            <ErrorDisplay error={error} />
            
            {/* Alternative Contact Methods */}
            {showAlternativeContact && (
              <div className="mb-6 mt-3 p-6 bg-primary/30 border border-primary rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-primary">Alternative Contact Methods</h3>
                  <button
                    type="button"
                    onClick={() => setShowAlternativeContact(false)}
                    className="text-primary hover:text-primary-hover transition-colors p-1"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-3 text-sm text-primary">
                  <div className="flex items-center space-x-3">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span><strong>Email:</strong> advertise@dawaback.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span><strong>Phone:</strong> +20 (100) 270-8887</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM</span>
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
            
            <form className="space-y-5" onSubmit={formik.handleSubmit}>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full">
                  <label
                    htmlFor="fullName"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    className={cn(
                      "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5",
                      {
                        "border-red-500":
                          formik.touched.fullName && formik.errors.fullName,
                      }
                    )}
                    placeholder="Full Name"
                    onChange={handleInputChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.fullName}
                  />
                  <ErrorMessage error={formik.touched.fullName && formik.errors.fullName ? formik.errors.fullName : null} />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="phone"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Contact Number
                  </label>
                  <input
                    type="text"
                    id="phone"
                    className={cn(
                      "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5",
                      {
                        "border-red-500":
                          formik.touched.phone && formik.errors.phone,
                      }
                    )}
                    placeholder="Your best contact number"
                    onChange={handleInputChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.phone}
                  />
                  <ErrorMessage error={formik.touched.phone && formik.errors.phone ? formik.errors.phone : null} />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className={cn(
                    "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5",
                    {
                      "border-red-500":
                        formik.touched.email && formik.errors.email,
                    }
                  )}
                  placeholder="Your professional email address"
                  onChange={handleInputChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                <ErrorMessage error={formik.touched.email && formik.errors.email ? formik.errors.email : null} />
              </div>
              <div>
                <label
                  htmlFor="content"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Message or Product/Service Details
                </label>
                <textarea
                  id="content"
                  rows="8"
                  className={cn(
                    "bg-gray-50 border resize-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5",
                    {
                      "border-red-500":
                        formik.touched.content && formik.errors.content,
                    }
                  )}
                  placeholder="Tell us about your advertising needs..."
                  onChange={handleInputChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.content}
                ></textarea>
                <ErrorMessage error={formik.touched.content && formik.errors.content ? formik.errors.content : null} />
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
          <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden rounded-2xl shadow-lg p-8 border border-gray-100 flex-1">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-100 rounded-full -ml-20 -mb-20 opacity-50"></div>
            <h2 className="text-3xl font-bold mb-6 text-center">Why Advertise with Us?</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
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
                  <h3 className="text-lg font-semibold mb-2">Targeted Audience</h3>
                  <p className="text-gray-600">
                    Reach health-conscious customers actively seeking pharmaceutical
                    and healthcare solutions.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
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
                  <h3 className="text-lg font-semibold mb-2">High Engagement</h3>
                  <p className="text-gray-600">
                    Our platform sees high engagement rates with users actively
                    browsing and purchasing healthcare products.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
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
                  <h3 className="text-lg font-semibold mb-2">Trusted Platform</h3>
                  <p className="text-gray-600">
                    Partner with a trusted healthcare platform that customers rely
                    on for their medical needs.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
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
                  <h3 className="text-lg font-semibold mb-2">Competitive Pricing</h3>
                  <p className="text-gray-600">
                    Get competitive advertising rates with flexible packages to
                    suit your budget and goals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
