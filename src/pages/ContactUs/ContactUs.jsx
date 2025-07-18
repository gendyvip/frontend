import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 px-4 sm:px-6 lg:px-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Contact Information */}
          <motion.div className="h-full" variants={itemAnimation}>
            <Card className="border-2 border-primary/10 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden hover:border-primary/20 transition-colors p-6 h-full min-h-[400px] lg:h-[500px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-100 rounded-full -ml-20 -mb-20 opacity-50"></div>
              <CardHeader>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <CardTitle className="text-2xl">Get in Touch</CardTitle>
                  <CardDescription>
                    We're here to help and answer any questions you might have.
                  </CardDescription>
                </motion.div>
              </CardHeader>
              <CardContent className="space-y-6">
                <motion.div
                  className="flex items-center space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
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
                  className="flex items-center space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
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
                  className="flex items-center space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
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
                  className="flex items-center space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
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
            <Card className="border-2 border-primary/10 hover:border-primary/20 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden transition-colors p-6 h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-100 rounded-full -ml-20 -mb-20 opacity-50"></div>
              <CardHeader>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <CardTitle className="text-2xl">Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you shortly.
                  </CardDescription>
                </motion.div>
              </CardHeader>
              <CardContent className="h-full">
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
                        <label htmlFor="name" className="text-sm font-medium">
                          Name
                        </label>
                        <Field
                          as={Input}
                          id="name"
                          name="name"
                          placeholder="Your full name"
                          className={cn(
                            "border-gray-300 focus:border-primary focus:ring-primary",
                            {
                              "border-red-500": touched.name && errors.name,
                            }
                          )}
                        />
                        <ErrorMessage error={touched.name && errors.name ? errors.name : null} />
                      </motion.div>

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.9 }}
                      >
                        <label htmlFor="email" className="text-sm font-medium">
                          Email
                        </label>
                        <Field
                          as={Input}
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your.email@example.com"
                          className={cn(
                            "border-gray-300 focus:border-primary focus:ring-primary",
                            {
                              "border-red-500": touched.email && errors.email,
                            }
                          )}
                        />
                        <ErrorMessage error={touched.email && errors.email ? errors.email : null} />
                      </motion.div>

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.0 }}
                      >
                        <label htmlFor="phone" className="text-sm font-medium">
                          Phone Number
                        </label>
                        <Field
                          as={Input}
                          id="phone"
                          name="phone"
                          placeholder="1002708889"
                          className={cn(
                            "border-gray-300 focus:border-primary focus:ring-primary",
                            {
                              "border-red-500": touched.phone && errors.phone,
                            }
                          )}
                        />
                        <ErrorMessage error={touched.phone && errors.phone ? errors.phone : null} />
                      </motion.div>

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.1 }}
                      >
                        <label htmlFor="subject" className="text-sm font-medium">
                          Subject
                        </label>
                        <Field
                          as={Input}
                          id="subject"
                          name="subject"
                          placeholder="What's this about?"
                          className={cn(
                            "border-gray-300 focus:border-primary focus:ring-primary",
                            {
                              "border-red-500": touched.subject && errors.subject,
                            }
                          )}
                        />
                        <ErrorMessage error={touched.subject && errors.subject ? errors.subject : null} />
                      </motion.div>

                      <motion.div
                        className="space-y-2 flex-1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.2 }}
                      >
                        <label htmlFor="message" className="text-sm font-medium">
                          Message
                        </label>
                        <Field
                          as={Textarea}
                          id="message"
                          name="message"
                          placeholder="Tell us more about your inquiry..."
                          className={cn(
                            "border-gray-300 focus:border-primary focus:ring-primary min-h-[120px] resize-none",
                            {
                              "border-red-500": touched.message && errors.message,
                            }
                          )}
                        />
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
                          className="w-full bg-primary hover:bg-primary-hover text-white"
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
