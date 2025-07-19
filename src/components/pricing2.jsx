"use client";
import { CircleCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/store/useAuth";
import { useSubscribe } from "@/store/useSubscribe";
import { checkSubscriptionStatus } from "@/api/subscription";

const Pricing2 = ({
  heading = "Pricing",
  description = "Check out our affordable pricing plans",

  plans = [
    {
      id: "Regular",
      name: "Regular",
      description: "Limited features",
      monthlyPrice: "EGP50",
      yearlyPrice: "EGP100",
      features: [
        { text: "Add up to 10 deals" },
        { text: "Can't list pharmacies for sale" },
        { text: "Can't subscribe to drug alert" },
      ],
      button: {
        text: "Purchase",
        url: "https://shadcnblocks.com",
      },
    },
    {
      id: "Premium",
      name: "Premium",
      description: "Full features",
      monthlyPrice: "EGP100",
      yearlyPrice: "EGP400",
      features: [
        { text: "Add unlimited deals" },
        { text: "List pharmacies for sale" },
        { text: "Subscribe to drug alert" },
      ],
      button: {
        text: "Purchase",
        url: "https://shadcnblocks.com",
      },
    },
  ],
}) => {
  const [isYearly, setIsYearly] = useState(false);
  const { user, token } = useAuth();
  const { subscribe, loading, error, success } = useSubscribe();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [paymentWindow, setPaymentWindow] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'processing', 'completed', 'failed'
  const [paymentCheckInterval, setPaymentCheckInterval] = useState(null);

  const planIdMap = {
    Regular: "regular",
    Premium: "premium",
  };

  const closePaymentWindow = () => {
    if (paymentWindow && !paymentWindow.closed) {
      paymentWindow.close();
    }
    setPaymentWindow(null);
    setPaymentStatus(null);
    // Clear payment check interval
    if (paymentCheckInterval) {
      clearInterval(paymentCheckInterval);
      setPaymentCheckInterval(null);
    }
  };

  // Check if payment window is closed and handle completion
  useEffect(() => {
    const checkWindowClosed = setInterval(() => {
      if (paymentWindow && paymentWindow.closed) {
        setPaymentWindow(null);
        setPaymentStatus(null);
        
        // Clear payment check interval
        if (paymentCheckInterval) {
          clearInterval(paymentCheckInterval);
          setPaymentCheckInterval(null);
        }
        
        // Check if payment was successful by looking for success indicators
        const checkPaymentStatus = async () => {
          try {
            // Check subscription status from the server
            const userData = await checkSubscriptionStatus(token);
            
            if (userData.subscriptionStatus) {
              toast.success("Payment completed successfully! Redirecting to subscription page...");
              // Redirect to subscription page after successful payment
              navigate('/subscription?success=true&payment_status=success');
            } else {
              toast.info("Payment window closed. Please check your subscription status.");
            }
          } catch (error) {
            console.error("Error checking payment status:", error);
            toast.info("Payment window closed. Please check your subscription status.");
          }
        };
        checkPaymentStatus();
      }
    }, 1000);

    return () => clearInterval(checkWindowClosed);
  }, [paymentWindow, paymentCheckInterval, token, navigate]);

  // Cleanup intervals on component unmount
  useEffect(() => {
    return () => {
      if (paymentCheckInterval) {
        clearInterval(paymentCheckInterval);
      }
    };
  }, [paymentCheckInterval]);

  // Listen for messages from payment window (if payment provider supports postMessage)
  useEffect(() => {
    const handleMessage = (event) => {
      // Check if the message is from the payment provider
      if (event.data && event.data.type === 'PAYMENT_COMPLETED') {
        // Close the payment window
        if (paymentWindow && !paymentWindow.closed) {
          paymentWindow.close();
        }
        setPaymentWindow(null);
        setPaymentStatus('completed');
        
        // Handle success redirect
        if (event.data.successUrl) {
          window.location.href = event.data.successUrl;
        } else {
          toast.success("Payment completed successfully!");
          // Redirect to subscription page after successful payment
          navigate('/subscription?success=true&payment_status=success');
        }
      } else if (event.data && event.data.type === 'PAYMENT_FAILED') {
        // Handle failed payment
        if (paymentWindow && !paymentWindow.closed) {
          paymentWindow.close();
        }
        setPaymentWindow(null);
        setPaymentStatus('failed');
        toast.error("Payment failed. Please try again.");
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [paymentWindow, navigate]);



  const handleSubscribe = async (planId) => {
    if (!user || !token) {
      toast.error("Please login to subscribe");
      navigate("/auth/login");
      return;
    }
    try {
      setLoadingPlan(planId);
      const res = await subscribe({
        planName: planIdMap[planId],
        planType: isYearly ? "yearly" : "monthly",
        token,
      });
      if (res && res.iframeUrl) {
        // Open payment URL in a new tab and store reference
        const newWindow = window.open(res.iframeUrl, '_blank');
        setPaymentWindow(newWindow);
        setPaymentStatus('processing');
        toast.success("Payment page opened in new tab. Please complete your payment.");
        
        // Start polling for payment status every 5 seconds
        const interval = setInterval(async () => {
          try {
            const userData = await checkSubscriptionStatus(token);
            if (userData.subscriptionStatus) {
              // Payment completed successfully
              clearInterval(interval);
              setPaymentCheckInterval(null);
              setPaymentWindow(null);
              setPaymentStatus('completed');
              toast.success("Payment completed successfully! Redirecting to subscription page...");
              navigate('/subscription?success=true&payment_status=success');
            }
          } catch (error) {
            console.error("Error checking payment status:", error);
          }
        }, 5000); // Check every 5 seconds
        
        setPaymentCheckInterval(interval);
      } else {
        toast.success("تم الاشتراك بنجاح!");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      toast.error("Failed to subscribe", {
        description: err.response?.data?.message || "Please try again later",
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section className="py-8">
      <div className="container">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
          <h2 className="text-4xl font-semibold text-pretty lg:text-6xl">
            {heading}
          </h2>
          <p className="text-muted-foreground lg:text-xl">{description}</p>
          <div className="flex items-center gap-3 text-lg">
            Monthly
            <Switch
              checked={isYearly}
              onCheckedChange={() => setIsYearly(!isYearly)}
            />
            Yearly
          </div>

          {/* Payment Status Indicator */}
          {paymentStatus === 'processing' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <div>
                    <p className="font-medium text-blue-900">Payment in Progress</p>
                    <p className="text-sm text-blue-700">Please complete your payment in the new tab</p>
                  </div>
                </div>
                <button
                  onClick={closePaymentWindow}
                  className="text-gray-500 hover:text-gray-700"
                  title="Close payment window"
                >
                  ✕
                </button>
              </div>
              {paymentWindow && (
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => {
                      if (paymentWindow && !paymentWindow.closed) {
                        paymentWindow.focus();
                      }
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Focus payment window
                  </button>
                  <span className="text-gray-400">|</span>
                  <button
                    onClick={closePaymentWindow}
                    className="text-sm text-red-600 hover:text-red-800 underline"
                  >
                    Cancel payment
                  </button>
                </div>
              )}
            </div>
          )}



          <div className="flex flex-col items-stretch gap-6 md:flex-row">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className="flex w-80 flex-col justify-between text-left px-4 py-8"
              >
                <CardHeader>
                  <CardTitle>
                    <p>{plan.name}</p>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                  <div className="flex items-end">
                    <span className="text-4xl font-semibold">
                      {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-2xl font-semibold text-muted-foreground">
                      {isYearly ? "/yr" : "/mo"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-6" />
                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CircleCheck className="size-4" />
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button
                    className="w-full text-white"
                    disabled={loadingPlan === plan.id}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {loadingPlan === plan.id ? "Loading..." : "Purchase"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </div>
      </div>
    </section>
  );
};

export { Pricing2 };
