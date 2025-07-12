import React, { useState, useEffect } from "react";
import {
  XCircle,
  RefreshCw,
  ArrowRight,
  AlertTriangle,
  CreditCard,
  User,
  DollarSign,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CardIcon } from "@/components/ui/card-icons";

export default function FailedPayment() {
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock failed payment data (replace with actual API call)
  const mockPaymentData = {
    id: "316832593",
    pending: "false",
    amount_cents: "20000",
    success: "false",
    is_auth: "false",
    is_capture: "false",
    is_standalone_payment: "true",
    is_voided: "false",
    is_refunded: "false",
    is_3d_secure: "true",
    integration_id: "5166890",
    profile_id: "1056026",
    has_parent_transaction: "false",
    order: "354457329",
    created_at: "2025-07-12T03:04:12.244843",
    currency: "EGP",
    merchant_commission: "0",
    discount_details: [],
    is_void: "false",
    is_refund: "false",
    error_occured: "false",
    refunded_amount_cents: "0",
    captured_amount: "0",
    updated_at: "2025-07-12T03:12:31.055939",
    is_settled: "false",
    bill_balanced: "false",
    is_bill: "false",
    owner: "1991862",
    merchant_order_id:
      "sub_6ba93f90-e511-41fe-a7d2-9e9c5faccd2e_regular_monthly_1752278637121",
    data: {
      message: "AUTHENTICATION_FAILED",
    },
    source_data: {
      type: "card",
      pan: "1111",
      sub_type: "Visa",
    },
    acq_response_code: "DO_NOT_PROCEED",
    hmac: "af052b9f29704ddaa54f9604a5333f01aee903b082bf5b9dc810c8d6b95d10a9b6a832c331e6913975934c9ce574a1ae28511936719b7dc5e50ffa4b0ead94ad",
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPaymentData(mockPaymentData);
      setLoading(false);
    }, 800);
  }, []);

  // Helper functions
  const formatAmount = (amountCents, currency = "EGP") => {
    const amount = parseInt(amountCents) / 100;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPlanName = (merchantOrderId) => {
    if (merchantOrderId?.includes("premium")) return "Premium";
    if (merchantOrderId?.includes("regular")) return "Regular";
    return "Standard";
  };

  const getLastFourDigits = (pan) => {
    return pan?.slice(-4) || "****";
  };

  const handleRetry = () => {
    navigate("/subscription");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Failed Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Failed!
          </h1>
          <p className="text-gray-600">
            We couldn't process your payment. Please try again.
          </p>
        </div>

        {/* Payment Failure Details Card */}
        <Card className="mb-6 shadow-lg">
          <CardHeader className="text-center pt-4">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Payment Failure Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Transaction ID */}
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-500">Transaction ID</p>
                <p className="font-medium text-gray-900 font-mono">
                  {paymentData?.id}
                </p>
              </div>
            </div>

            {/* Amount */}
            <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-medium text-orange-900 text-lg">
                  {formatAmount(
                    paymentData?.amount_cents,
                    paymentData?.currency
                  )}
                </p>
              </div>
            </div>

            {/* Plan Name */}
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {getPlanName(paymentData?.merchant_order_id) === "Premium"
                    ? "P"
                    : "R"}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Plan Type</p>
                <p className="font-medium text-blue-900">
                  {getPlanName(paymentData?.merchant_order_id) === "Premium"
                    ? "Premium Plan"
                    : "Regular Plan"}
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <CardIcon
                type={paymentData?.source_data?.sub_type}
                className="w-6 h-6"
              />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Payment Method</p>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-purple-900">
                    {paymentData?.source_data?.sub_type} ••••{" "}
                    {getLastFourDigits(paymentData?.source_data?.pan)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Date */}
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-500">Payment Date</p>
                <p className="font-medium text-gray-900">
                  {formatDate(paymentData?.created_at)}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium text-red-900">Payment Declined</p>
              </div>
            </div>

            {/* Error Message */}
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg mb-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-500">Error Message</p>
                <p className="font-medium text-yellow-900">
                  {paymentData?.data?.message || "Unknown error"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleGoHome}
            variant="outline"
            className="w-full bg-red-600 hover:bg-red-700 text-white hover:text-white"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            No charges were made to your account
          </p>
          <p className="text-xs text-gray-400 mt-2">
            If you continue to experience issues, please contact our support
            team
          </p>
        </div>
      </div>
    </div>
  );
}
