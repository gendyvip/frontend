import React from "react";
import { motion } from "framer-motion";
import Accordion from "@/components/ui/Accordion";

const termsSections = [
  {
    title: (
      <div className="flex items-center gap-3">
        <span className="text-primary p-2">1</span>
        <span className="font-bold text-lg">
          Deal Limits & Subscription Plans
        </span>
      </div>
    ),
    content: (
      <div>
        <p className="mb-3">
          Dawaback offers two main subscription plans for posting deals:
        </p>
        <ul className="list-disc pl-6 mb-3 space-y-1">
          <li>
            <strong>Limited Plan (Monthly):</strong> You can add up to{" "}
            <b>10 deals per month</b>.
          </li>
          <li>
            <strong>Limited Plan (Yearly):</strong> You can add up to{" "}
            <b>120 deals per year</b>.
          </li>
          <li>
            <strong>Unlimited Plan:</strong> You can add <b>unlimited deals</b>{" "}
            during your subscription period.
          </li>
        </ul>
        <p className="mb-2">
          <b>Important:</b> If your subscription period ends (monthly or yearly)
          and you have not used all your allowed deals,{" "}
          <b>the remaining (unused) deals do not carry over</b> to the next
          period. For example, if you only add 7 deals in a month, the remaining
          3 are lost when the month ends.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-[300px] w-full text-sm border mt-2">
            <thead>
              <tr className="bg-primary/10 text-primary">
                <th className="py-2 px-3 font-semibold text-left">Plan Type</th>
                <th className="py-2 px-3 font-semibold text-left">
                  Deal Limit
                </th>
                <th className="py-2 px-3 font-semibold text-left">
                  Unused Deals
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-3">Limited (Monthly)</td>
                <td className="py-2 px-3">10 deals/month</td>
                <td className="py-2 px-3">Lost at month’s end</td>
              </tr>
              <tr>
                <td className="py-2 px-3">Limited (Yearly)</td>
                <td className="py-2 px-3">120 deals/year</td>
                <td className="py-2 px-3">Lost at year’s end</td>
              </tr>
              <tr>
                <td className="py-2 px-3">Unlimited</td>
                <td className="py-2 px-3">Unlimited</td>
                <td className="py-2 px-3">No limit</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
  {
    title: (
      <div className="flex items-center gap-3">
        <span className="text-primary p-2">2</span>
        <span className="font-bold text-lg">User Eligibility & Accounts</span>
      </div>
    ),
    content: (
      <ul className="list-disc pl-6 space-y-1">
        <li>
          Only licensed pharmacists, verified pharmacy owners, and authorized
          company representatives may register.
        </li>
        <li>
          All users must provide accurate, up-to-date information and complete
          the verification process (including ID and license uploads).
        </li>
        <li>
          You are responsible for maintaining the confidentiality of your
          account and password.
        </li>
      </ul>
    ),
  },
  {
    title: (
      <div className="flex items-center gap-3">
        <span className="text-primary p-2">3</span>
        <span className="font-bold text-lg">Platform Services</span>
      </div>
    ),
    content: (
      <ul className="list-disc pl-6 space-y-1">
        <li>
          List your pharmacy for sale, browse available pharmacies, and manage
          your pharmacy profile.
        </li>
        <li>
          Post, browse, and manage medication deals and surplus stock offers.
        </li>
        <li>
          Use the secure chat system to communicate with other users about
          deals, sales, or inquiries.
        </li>
        <li>
          Access analytics and insights about your listings, deals, and platform
          activity.
        </li>
        <li>
          Receive real-time notifications about new listings, messages, and
          platform updates.
        </li>
      </ul>
    ),
  },
  {
    title: (
      <div className="flex items-center gap-3">
        <span className="text-primary p-2">4</span>
        <span className="font-bold text-lg">
          User Conduct & Prohibited Activities
        </span>
      </div>
    ),
    content: (
      <ul className="list-disc pl-6 space-y-1">
        <li>
          No fraudulent, misleading, or illegal activity is permitted (including
          fake listings, false information, or unauthorized access).
        </li>
        <li>
          Do not harass, spam, or abuse other users via chat or any other
          feature.
        </li>
        <li>
          Do not attempt to scrape, hack, or disrupt the platform or its users.
        </li>
        <li>Respect all applicable laws and professional standards.</li>
      </ul>
    ),
  },
  {
    title: (
      <div className="flex items-center gap-3">
        <span className="text-primary p-2">5</span>
        <span className="font-bold text-lg">
          Payments, Subscriptions & Advertising
        </span>
      </div>
    ),
    content: (
      <ul className="list-disc pl-6 space-y-1">
        <li>
          Some features (such as premium listings or advertising) may require
          payment or subscription.
        </li>
        <li>
          All payments are processed securely via our payment partners (e.g.,
          Paymob). Refunds and cancellations are subject to our policies.
        </li>
        <li>
          Advertisers must comply with all applicable laws and platform
          guidelines.
        </li>
      </ul>
    ),
  },
  {
    title: (
      <div className="flex items-center gap-3">
        <span className="text-primary p-2">6</span>
        <span className="font-bold text-lg">Data & Privacy</span>
      </div>
    ),
    content: (
      <ul className="list-disc pl-6 space-y-1">
        <li>
          We collect and use your data as described in our Privacy Policy,
          including for verification, analytics, and service improvement.
        </li>
        <li>
          We do not sell your personal data. See our Privacy Policy for full
          details.
        </li>
      </ul>
    ),
  },
  {
    title: (
      <div className="flex items-center gap-3">
        <span className="text-primary p-2">7</span>
        <span className="font-bold text-lg">Changes & Contact</span>
      </div>
    ),
    content: (
      <ul className="list-disc pl-6 space-y-1">
        <li>
          We may update these Terms from time to time. Continued use of Dawaback
          means you accept the latest version.
        </li>
        <li>For questions, contact us via the Contact Us page.</li>
      </ul>
    ),
  },
];

export default function TermsOfService() {
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
          Terms of Service
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-center max-w-xl">
          Welcome to Dawaback, the trusted platform for pharmacy deals, sales,
          and professional networking. By using our services, you agree to these
          terms designed to keep our marketplace safe, fair, and effective for
          all users.
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
        <Accordion items={termsSections} />
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
            Contact our support team for any questions about these terms.
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
