import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FaUserMd, FaIdCard, FaBirthdayCake, FaVenusMars } from "react-icons/fa";

export default function PersonalInfoCard({pharmacistDetails}) {
  // Add null check and default values
  const details = pharmacistDetails || {};
  
  const infoFields = [
    {
      key: 'fullName',
      label: 'Full Name',
      value: details.fullName || 'Not available',
      icon: <FaUserMd className="text-amber-500" />,
    },
    {
      key: 'id',
      label: 'ID Number',
      value: details.id || 'Not available',
      icon: <FaIdCard className="text-green-500" />,
    },
    {
      key: 'birthOfDate',
      label: 'Date of Birth',
      value: details.birthOfDate || 'Not available',
      icon: <FaBirthdayCake className="text-zinc-600" />,
    },
    {
      key: 'gender',
      label: 'Gender',
      value: details.gender || 'Not available',
      icon: <FaVenusMars className="text-red-400" />,
    }
  ];


  
  return (
    <Card className="mb-8 shadow-lg rounded-xl border border-gray-200 bg-white px-4 py-8">
      <CardHeader>
        <CardTitle>
          <div className="inline-flex items-center gap-3 font-bold text-xl tracking-wide">
            <span className="inline-flex items-center justify-center rounded-full bg-primary/10 shadow-sm" style={{ width: 48, height: 48 }}>
              <FaUserMd size={24} className="text-primary" />
            </span>
            <div className="flex flex-col">
            <span className="text-gray-900">
              Personal Information
            </span>
            <p className="text-sm text-gray-600 font-normal">Your basic profile information and identification details</p>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {infoFields.map((field) => (
            <div
              key={field.key}
              className="group relative p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md hover:border-primary/30 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-primary/10 transition-colors duration-200">
                    {field.icon}
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {field.label}
                    </span>
                  </div>
                </div>
              </div>
              <div className="pl-11">
                <div className={`font-semibold text-base transition-colors duration-200 ${
                  field.value === 'Not available' 
                    ? 'text-gray-400 italic' 
                    : 'text-gray-900'
                }`}>
                  {field.value}
                </div>
                {field.value === 'Not available' && (
                  <p className="text-xs text-gray-400 mt-1">
                    Please update your profile to add this information
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      
      </CardContent>
    </Card>
  );
} 