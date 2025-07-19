import { Pricing2 } from "../../components/pricing2";
import Accordion from "../../components/ui/Accordion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { toast } from "sonner";

const accordionItems = [
  {
    title: "What is the subscription plan?",
    content:
      "The subscription gives you extra features like faster support, highlighted listings, and more depending on the plan type.",
  },
  {
    title: "How can I make a payment?",
    content:
      "You can pay using credit cards, bank transfers, or other available electronic payment methods.",
  },
  {
    title: "Can I cancel my subscription?",
    content:
      "Yes, you can cancel your subscription anytime from your account settings. No further charges will apply.",
  },
  {
    title: "Who can use the platform?",
    content:
      "The platform is designed for licensed pharmacists and pharmacy owners. Verification may be required upon registration.",
  },
  {
    title: "Can I list an entire pharmacy for sale?",
    content:
      "Yes, the platform allows you to list your pharmacy for sale with full details, location, and images.",
  },
  {
    title: "Is it safe to exchange near-expiry medicines?",
    content:
      "All users are verified, and the platform encourages safe, legal, and transparent exchange according to local regulations.",
  },
  {
    title: "Do you offer support for advertisers?",
    content:
      "Yes, pharmaceutical companies can contact our support team to run targeted campaigns directly to our network of pharmacists.",
  },
];

export default function Subscription() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for success parameters in URL
    const success = searchParams.get('success');
    const paymentStatus = searchParams.get('payment_status');
    const orderId = searchParams.get('order_id');
    const transactionId = searchParams.get('transaction_id');
    const status = searchParams.get('status');
    const result = searchParams.get('result');

    // Check if any success indicators are present
    const isSuccess = 
      success === 'true' || 
      paymentStatus === 'success' || 
      status === 'success' ||
      result === 'success' ||
      orderId ||
      transactionId;

    // Also check if URL contains 'success' anywhere
    const urlContainsSuccess = location.search.includes('success') || 
                              location.pathname.includes('success') ||
                              location.hash.includes('success');

    if (isSuccess || urlContainsSuccess) {
      // Show success message
      toast.success("Payment completed successfully! Redirecting to profile...");
      
      // Redirect to profile after a short delay
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } else {
      // No success parameters, show normal subscription page
      setIsLoading(false);
    }
  }, [searchParams, navigate, location]);

  // Show loading state while checking URL parameters
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-700">Processing payment...</p>
            <p className="text-sm text-gray-500 mt-2">Please wait while we verify your payment</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <Pricing2 />
      <Card className="py-6 max-sm:mx-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-black m-auto">
            Frequently Asked Questions
          </CardTitle>
          <span className="text-center">
            Find answers to common questions about advertising with Dawaback
          </span>
        </CardHeader>
        <CardContent>
          <Accordion items={accordionItems} />
        </CardContent>
      </Card>
    </div>
  );
}
