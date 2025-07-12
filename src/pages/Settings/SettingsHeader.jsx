import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PiTagChevronBold } from "react-icons/pi";
import { BsPatchCheckFill } from "react-icons/bs";
import { FaUserEdit, FaCog } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function SettingsHeader({ pharmacistDetails }) {
  // Add null check and default values
  const details = pharmacistDetails || {};
  const getInitials = (name = "") => {
    const words = name.trim().split(" ");
    const firstTwo = words.slice(0, 2);
    return firstTwo.map((word) => word[0]?.toUpperCase()).join("");
  };
  const initials = getInitials(details.fullName || "");

  // Capitalize first character of each word
  const capitalizeWords = (str = "") =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Profile Section */}
        <div className="flex items-center gap-6">
          {/* Avatar with Status */}
          <div className="relative">
            <div className="relative">
              <Avatar className="size-20 shadow-lg border-4 border-white">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {/* Status Indicator */}
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md border-2 border-white">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <BsPatchCheckFill size={12} className="text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                {capitalizeWords(details.fullName)}
              </h1>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 border-green-200"
              >
                <BsPatchCheckFill size={12} className="mr-1" />
                Verified
              </Badge>
            </div>
            <p className="text-gray-600 text-base mb-3">
              Professional Pharmacist • Account Settings
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Active Account
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Profile Complete
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
