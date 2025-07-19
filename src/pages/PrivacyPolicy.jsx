import React from "react";
import { motion } from "framer-motion";
import Accordion from "@/components/ui/Accordion";

const privacySections = [
  {
    title: (
      <div className="flex items-center gap-3">
        <span className="text-primary p-2">1</span>
        <span className="font-bold text-lg">Information We Collect</span>
      </div>
    ),
    content: (
      <ul className="list-disc pl-6 space-y-1">
        <li>
          Personal information (name, email, phone, license, ID, profile photo)
          for account creation and verification.
        </li>
        <li>
          Pharmacy details (name, address, license, images, sales data) for
          listings and management.
        </li>
        <li>Deal and transaction data (offers, bids, messages, analytics).</li>
        <li>
          Chat messages and communication logs (for user safety and support).
        </li>
        <li>
          Usage analytics, device info, and cookies for improving our services.
        </li>
      </ul>
    ),
  },
  {
    title: (
      <div className="flex items-center gap-3">
        <span className="text-primary p-2">2</span>
        <span className="font-bold text-lg">How We Use Your Information</span>
      </div>
    ),
    content: (
      <ul className="list-disc pl-6 space-y-1">
        <li>
          To verify your identity and eligibility as a pharmacy professional.
        </li>
        <li>
          To provide, maintain, and improve Dawaback’s features (deals, pharmacy
          sales, chat, analytics, etc.).
        </li>
        <li>
          To communicate with you about your account, listings, and platform
          updates.
        </li>
        <li>
          To ensure security, prevent fraud, and enforce our Terms of Service.
        </li>
        <li>To send notifications and updates relevant to your activity.</li>
      </ul>
    ),
  },
  {
    title: (
      <div className="flex items-center gap-3">
        <span className="text-primary p-2">3</span>
        <span className="font-bold text-lg">Your Rights & Choices</span>
      </div>
    ),
    content: (
      <ul className="list-disc pl-6 space-y-1">
        <li>
          You can access, update, or delete your personal information at any
          time via your profile settings.
        </li>
        <li>
          You may request account deletion or data export by contacting support.
        </li>
        <li>
          You can manage notification and privacy preferences in your account
          settings.
        </li>
      </ul>
    ),
  },
  {
    title: (
      <div className="flex items-center gap-3">
        <span className="text-primary p-2">4</span>
        <span className="font-bold text-lg">Data Sharing & Disclosure</span>
      </div>
    ),
    content: (
      <ul className="list-disc pl-6 space-y-1">
        <li>We do not sell your personal data.</li>
        <li>
          We may share data with trusted partners (e.g., payment processors,
          analytics providers) only as needed to operate Dawaback.
        </li>
        <li>
          We may disclose information if required by law or to protect the
          safety of users and the platform.
        </li>
      </ul>
    ),
  },
  {
    title: (
      <div className="flex items-center gap-3">
        <span className="text-primary p-2">5</span>
        <span className="font-bold text-lg">Data Security</span>
      </div>
    ),
    content: (
      <ul className="list-disc pl-6 space-y-1">
        <li>
          We use industry-standard security measures to protect your data,
          including encryption and access controls.
        </li>
        <li>
          No method of transmission over the Internet is 100% secure, but we
          strive to protect your information.
        </li>
      </ul>
    ),
  },
  {
    title: (
      <div className="flex items-center gap-3">
        <span className="text-primary p-2">6</span>
        <span className="font-bold text-lg">Changes & Contact</span>
      </div>
    ),
    content: (
      <ul className="list-disc pl-6 space-y-1">
        <li>
          We may update this Privacy Policy from time to time. Continued use of
          Dawaback means you accept the latest version.
        </li>
        <li>
          For questions or data requests, contact us via the Contact Us page.
        </li>
      </ul>
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <motion.div
      className="relative min-h-screen flex flex-col items-center py-10 px-2"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {/* Logo and Title */}
      <motion.div
        className="flex flex-col items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
      >
        <div className="bg-primary/10 rounded-full p-4 mb-4 shadow">
          <img
            src="/logo.svg"
            alt="Dawaback Logo"
            className="w-16 h-16 object-contain"
          />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2 text-center">
          Privacy Policy
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-center max-w-xl">
          Dawaback is committed to protecting your privacy and ensuring
          transparency in how we use your data. This policy explains what we
          collect, how we use it, and your rights as a user of our pharmacy
          marketplace.
        </p>
        <span className="mt-2 text-xs text-muted-foreground">
          Last updated: June 2024
        </span>
      </motion.div>
      {/* Accordion */}
      <motion.div
        className="w-full max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
      >
        <Accordion items={privacySections} />
      </motion.div>
      {/* Contact Support CTA */}
      <motion.div
        className="mt-10 flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
      >
        <div className="text-center">
          <h2 className="text-lg font-semibold text-primary mb-2">
            Need more help?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-3">
            Contact our support team for any questions about this policy.
          </p>
          <a
            href="/contact"
            className="inline-block bg-primary text-white px-6 py-2 rounded-lg shadow hover:bg-primary/90 transition"
          >
            Contact Support
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
