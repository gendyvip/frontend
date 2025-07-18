"use client";
import { CircleCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

const Pricing2 = ({
  heading = "Pricing",
  description = "Check out our affordable pricing plans",

  plans = [
    {
      id: "Basic",
      name: "Basic",
      description: "Limited features",
      monthlyPrice: "EGP50",
      yearlyPrice: "EGP400",
      features: [
        { text: "Add up to 2 pharmacies" },
        { text: "Add up to 10 deals" },
        { text: "Chat with 100 pharmacists" },
      ],
      button: {
        text: "Purchase",
        url: "https://shadcnblocks.com",
      },
    },
    {
      id: "pro",
      name: "Pro",
      description: "Full features",
      monthlyPrice: "EGP400",
      yearlyPrice: "EGP1500",
      features: [
        { text: "Add up to 5 pharmacies" },
        { text: "Add unlimited deals" },
        { text: "Chat with unlimited pharmacists" },
        { text: "List pharmacies for sale" },
      ],
      button: {
        text: "Purchase",
        url: "https://shadcnblocks.com",
      },
    },
  ],
}) => {
  const [isYearly, setIsYearly] = useState(false);
  const { user } = useAuth();
  const { subscribe, loading, error, success } = useSubscribe();
  const navigate = useNavigate();
  const [iframeUrl, setIframeUrl] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(null);

  const planIdMap = {
    Basic: "regular",
    pro: "premium",
  };

  const handleSubscribe = async (planId) => {
    if (!user) {
      navigate("/auth/login");
      return;
    }
    try {
      setLoadingPlan(planId);
      const res = await subscribe({
        userId: user,
        planName: planIdMap[planId],
        planType: isYearly ? "yearly" : "monthly",
      });
      if (res && res.iframeUrl) {
        window.open(res.iframeUrl, "_blank");
      } else {
        alert("تم الاشتراك بنجاح!");
      }
    } catch (err) {
      // error state handled below
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
