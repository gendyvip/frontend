import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MdPayment, 
  MdCardMembership, 
  MdCreditCard, 
  MdReceipt,
  MdUpgrade,
  MdCheckCircle,
  MdWarning,
  MdInfo
} from "react-icons/md";
import { FaCrown, FaStar, FaGem } from "react-icons/fa";
import { motion } from "framer-motion";

const BILLING_HISTORY = [
  {
    id: 1,
    date: "2024-01-15",
    amount: "EGP100.00",
    status: "Paid",
    description: "Plus Plan - Monthly",
    invoice: "INV-2024-001"
  },
  {
    id: 2,
    date: "2023-12-15",
    amount: "EGP100.00",
    status: "Paid",
    description: "Plus Plan - Monthly",
    invoice: "INV-2023-012"
  },
  {
    id: 3,
    date: "2023-11-15",
    amount: "EGP100.00",
    status: "Paid",
    description: "Plus Plan - Monthly",
    invoice: "INV-2023-011"
  }
];

export default function BillingPlansCard({ pharmacistDetails }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const getStatusBadge = (status) => {
    const variants = {
      paid: "success",
      pending: "warning",
      failed: "destructive"
    };
    return <Badge variant={variants[status.toLowerCase()] || "secondary"}>{status}</Badge>;
  };

  const handleUpgrade = (plan) => {
    setSelectedPlan(plan);
    setShowUpgradeModal(true);
  };

  return (
    <div className="space-y-8">
      {/* Current Plan Section */}
      <Card className="p-6 shadow-lg rounded-2xl border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center rounded-full bg-primary/10 shadow-sm w-10 h-10">
              <MdCardMembership size={20} className="text-primary" />
            </span>
            <span className="font-bold text-lg">Current Plan</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <FaCrown size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Plus Plan</h3>
                <p className="text-gray-600">Limited Features</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    Current Plan
                  </Badge>
                  <span className="text-xs text-gray-500">Active since Jan 2024</span>
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={() => handleUpgrade(PLANS[1])}>
              <MdUpgrade className="mr-2" />
              Upgrade Plan
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Usage Statistics */}
      <Card className="p-6 shadow-lg rounded-2xl border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center rounded-full bg-primary/10 shadow-sm w-10 h-10">
              <MdInfo size={20} className="text-primary" />
            </span>
            <span className="font-bold text-lg">Usage Statistics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-600">Pharmacies</h4>
              <p className="text-2xl font-bold">1 / 2</p>
              <p className="text-sm text-gray-500">50% used</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-600">P2P Chats</h4>
              <p className="text-2xl font-bold">60</p>
              <p className="text-sm text-gray-500">This month</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-600">Storage</h4>
              <p className="text-2xl font-bold">2.1 GB</p>
              <p className="text-sm text-gray-500">Of 5 GB used</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card className="p-6 shadow-lg rounded-2xl border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center rounded-full bg-primary/10 shadow-sm w-10 h-10">
              <MdReceipt size={20} className="text-primary" />
            </span>
            <span className="font-bold text-lg">Billing History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {BILLING_HISTORY.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <MdReceipt size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">{invoice.description}</p>
                    <p className="text-sm text-gray-500">{invoice.date} • {invoice.invoice}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{invoice.amount}</span>
                  {getStatusBadge(invoice.status)}
                  <Button variant="ghost" size="sm">Download</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>


    </div>
  );
} 