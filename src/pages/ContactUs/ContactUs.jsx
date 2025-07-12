import React from "react";
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
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send, Clock, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { requestContact } from "@/api/contact";

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
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Prepend '+20' to the phone number
      const payload = { ...values, phone: `+20${values.phone}` };
      await requestContact(payload);
      toast.success("Message sent successfully!");
      resetForm();
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Failed to send message");
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
                        <Field
                          as={Input}
                          name="name"
                          placeholder="Your Name"
                          disabled={isSubmitting}
                          className="h-12"
                        />
                        <AnimatePresence>
                          {errors.name && touched.name && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-sm text-red-500"
                            >
                              {errors.name}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.85 }}
                      >
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <div
                          className="flex items-center group border border-primary/30 rounded-lg transition-all duration-200 bg-white focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary"
                        >
                          <span
                            className="px-4 py-2 bg-primary/10 border-r border-primary/30 rounded-l-lg text-primary font-semibold text-base transition-colors duration-200 group-focus-within:bg-primary/20 group-hover:bg-primary/20 select-none"
                            style={{ minWidth: '56px', textAlign: 'center' }}
                          >
                            +20
                          </span>
                          <Field
                            as={Input}
                            id="phone"
                            name="phone"
                            placeholder="1234567890"
                            disabled={isSubmitting}
                            className="h-12 rounded-l-none rounded-r-lg border-0 focus:ring-0 focus:border-0 text-base shadow-none"
                            maxLength={10}
                            pattern="1[0-9]{9}"
                            inputMode="numeric"
                            autoComplete="tel"
                            aria-label="Egyptian phone number, 10 digits after +20"
                          />
                        </div>
                        <AnimatePresence>
                          {errors.phone && touched.phone && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-sm text-red-500"
                            >
                              {errors.phone}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.9 }}
                      >
                        <Field
                          as={Input}
                          name="email"
                          type="email"
                          placeholder="Your Email"
                          disabled={isSubmitting}
                          className="h-12"
                        />
                        <AnimatePresence>
                          {errors.email && touched.email && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-sm text-red-500"
                            >
                              {errors.email}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.0 }}
                      >
                        <Field
                          as={Input}
                          name="subject"
                          placeholder="Subject"
                          disabled={isSubmitting}
                          className="h-12"
                        />
                        <AnimatePresence>
                          {errors.subject && touched.subject && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-sm text-red-500"
                            >
                              {errors.subject}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      <motion.div
                        className="space-y-2 flex-grow"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.1 }}
                      >
                        <Field
                          as={Textarea}
                          name="message"
                          placeholder="Your Message"
                          className="min-h-[200px] max-h-[200px] resize-none h-full overflow-y-auto"
                          disabled={isSubmitting}
                        />
                        <AnimatePresence>
                          {errors.message && touched.message && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-sm text-red-500"
                            >
                              {errors.message}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.2 }}
                      >
                        <MotionButton
                          type="submit"
                          className="w-full h-12 text-lg font-semibold mb-11"
                          disabled={isSubmitting}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {isSubmitting ? (
                            <motion.div
                              className="flex items-center gap-2"
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              <div className="h-5 w-5 rounded-full border-2 border-background border-t-transparent"></div>
                              Sending...
                            </motion.div>
                          ) : (
                            <>
                              <Send className="mr-2 h-5 w-5" />
                              Send Message
                            </>
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
