import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Mail, Phone, MapPin, Send, Clock, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { requestContact } from "@/api/contact";
import { ErrorHandler } from "@/utils/errorHandler";
import { ErrorDisplay, ErrorMessage } from "@/components/ui/error-display";
import { cn } from "@/lib/utils";

// Create motion version of Button
const MotionButton = motion(Button);

const ContactSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .matches(
      /^1[0-9]{9}$/,
      "Phone number must be 10 digits and start with 1 (e.g., 1002708889)"
    )
    .required("Phone number is required"),
  subject: Yup.string().required("Subject is required"),
  message: Yup.string()
    .min(10, "Message must be at least 10 characters")
    .required("Message is required"),
});

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function ContactUs() {
  const [error, setError] = useState(null);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setError(null);
    
    try {
      // Prepend '+20' to the phone number
      const payload = { ...values, phone: `+20${values.phone}` };
      await requestContact(payload);
      
      // Show success message
      ErrorHandler.handleSuccess("Message sent successfully! We'll get back to you soon.");
      
      resetForm();
    } catch (error) {
      console.error("Contact error:", error);
      setError(error.message || "Failed to send message");
      // Error toast is handled by the API
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-background to-muted/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <motion.div
          className="text-center mb-16 px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Contact Us
          </motion.h1>
          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 lg:gap-12 px-2 sm:px-4 md:px-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Contact Information */}
          <motion.div className="h-full" variants={itemAnimation}>
            <Card className="py-3 px-4 overflow-hidden shadow-2xl border-0 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative w-full max-w-2xl mx-auto px-4 py-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-10" style={{ background: "var(--primary)" }}></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full -ml-20 -mb-20 opacity-10" style={{ background: "var(--primary)" }}></div>
              <CardHeader>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <CardTitle className="text-xl md:text-2xl">Get in Touch</CardTitle>
                  <CardDescription>
                    We're here to help and answer any questions you might have.
                  </CardDescription>
                </motion.div>
              </CardHeader>
              <CardContent>
                  <motion.div
                    className="flex items-center space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors mb-0 last:mb-4 md:last:mb-6"
                    whileHover={{ x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className="p-3 rounded-full bg-primary/10"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Mail className="h-6 w-6 text-primary" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-lg">Email</h3>
                      <p className="text-muted-foreground">support@dawaback.com</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors mb-0 last:mb-4 md:last:mb-6"
                    whileHover={{ x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className="p-3 rounded-full bg-primary/10"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Phone className="h-6 w-6 text-primary" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-lg">Phone</h3>
                      <p className="text-muted-foreground">+20 (100) 270-8887</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors mb-0 last:mb-4 md:last:mb-6"
                    whileHover={{ x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className="p-3 rounded-full bg-primary/10"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Building2 className="h-6 w-6 text-primary" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-lg">Address</h3>
                      <p className="text-muted-foreground">
                        123 Business Street
                        <br />
                        Suite 100
                        <br />
                        City, State 12345
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors mb-0 last:mb-4 md:last:mb-6"
                    whileHover={{ x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className="p-3 rounded-full bg-primary/10"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Clock className="h-6 w-6 text-primary" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-lg">Business Hours</h3>
                      <p className="text-muted-foreground">
                        Monday - Friday: 9:00 AM - 6:00 PM
                        <br />
                        Saturday: 10:00 AM - 4:00 PM
                        <br />
                        Sunday: Closed
                      </p>
                    </div>
                  </motion.div>
                </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div variants={itemAnimation} className="h-full">
            <Card className="py-3 px-4 overflow-hidden shadow-2xl border-0 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative w-full max-w-2xl mx-auto px-4 py-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-10" style={{ background: "var(--primary)" }}></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full -ml-20 -mb-20 opacity-10" style={{ background: "var(--primary)" }}></div>
              <CardHeader>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <CardTitle className="text-xl md:text-2xl">Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you shortly.
                  </CardDescription>
                </motion.div>
              </CardHeader>
              <CardContent>
                {/* Error Display */}
                <ErrorDisplay error={error} />
                
                <Formik
                  initialValues={{
                    name: "",
                    email: "",
                    phone: "",
                    subject: "",
                    message: "",
                  }}
                  validationSchema={ContactSchema}
                  onSubmit={handleSubmit}
                >
                  {({ errors, touched, isSubmitting }) => (
                    <Form className="space-y-6 h-full flex flex-col">
                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                      >
                        <Label htmlFor="name" className="text-sm font-medium">
                          Name <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {/* User icon */}
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                          </span>
                          <Field
                            as={Input}
                            id="name"
                            name="name"
                            placeholder="Enter your full name"
                            className={cn(
                              "pl-10 border-gray-300 focus:border-primary focus:ring-primary",
                              {
                                "border-red-500": touched.name && errors.name,
                              }
                            )}
                          />
                        </div>
                        <ErrorMessage error={touched.name && errors.name ? errors.name : null} />
                      </motion.div>

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.9 }}
                      >
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {/* Mail icon */}
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </span>
                          <Field
                            as={Input}
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email address"
                            className={cn(
                              "pl-10 border-gray-300 focus:border-primary focus:ring-primary",
                              {
                                "border-red-500": touched.email && errors.email,
                              }
                            )}
                          />
                        </div>
                        <ErrorMessage error={touched.email && errors.email ? errors.email : null} />
                      </motion.div>

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.0 }}
                      >
                        <Label htmlFor="phone" className="text-sm font-medium">
                          Phone Number <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {/* Phone icon */}
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </span>
                          <Field
                            as={Input}
                            id="phone"
                            name="phone"
                            placeholder="Enter your phone number"
                            className={cn(
                              "pl-10 border-gray-300 focus:border-primary focus:ring-primary",
                              {
                                "border-red-500": touched.phone && errors.phone,
                              }
                            )}
                          />
                        </div>
                        <ErrorMessage error={touched.phone && errors.phone ? errors.phone : null} />
                      </motion.div>

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.1 }}
                      >
                        <Label htmlFor="subject" className="text-sm font-medium">
                          Subject <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {/* Tag icon */}
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M3 11l7.293-7.293a1 1 0 011.414 0l7.293 7.293a1 1 0 010 1.414l-7.293 7.293a1 1 0 01-1.414 0L3 12.414a1 1 0 010-1.414z" />
                            </svg>
                          </span>
                          <Field
                            as={Input}
                            id="subject"
                            name="subject"
                            placeholder="Enter the subject"
                            className={cn(
                              "pl-10 border-gray-300 focus:border-primary focus:ring-primary",
                              {
                                "border-red-500": touched.subject && errors.subject,
                              }
                            )}
                          />
                        </div>
                        <ErrorMessage error={touched.subject && errors.subject ? errors.subject : null} />
                      </motion.div>

                      <motion.div
                        className="space-y-2 flex-1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.2 }}
                      >
                        <Label htmlFor="message" className="text-sm font-medium">
                          Message <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative flex-1">
                          <span className="absolute left-3 mt-2.5 text-gray-400">
                            {/* Info icon */}
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                            </svg>
                          </span>
                          <Field
                            as={Textarea}
                            id="message"
                            name="message"
                            placeholder="Tell us more about your inquiry..."
                            className={cn(
                              "pl-10 border-gray-300 focus:border-primary focus:ring-primary min-h-[120px] resize-none",
                              {
                                "border-red-500": touched.message && errors.message,
                              }
                            )}
                          />
                        </div>
                        <ErrorMessage error={touched.message && errors.message ? errors.message : null} />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.3 }}
                      >
                        <MotionButton
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-primary hover:bg-primary-hover text-white mb-4 md:mb-6"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {isSubmitting ? (
                            <div className="flex items-center justify-center">
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
                              Sending...
                            </div>
                          ) : (
                            <div className="flex items-center justify-center">
                              <Send className="mr-2 h-4 w-4" />
                              Send Message
                            </div>
                          )}
                        </MotionButton>
                      </motion.div>
                    </Form>
                  )}
                </Formik>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
