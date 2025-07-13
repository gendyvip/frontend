import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FaUser, FaLock, FaClinicMedical, FaUserMd } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import SettingsHeader from "./SettingsHeader";
import PersonalInfoCard from "./PersonalInfoCard";
import ContactInfoCard from "./ContactInfoCard";
import SecurityCard from "./SecurityCard";
import PharmaciesCard from "./PharmaciesCard";
import BillingPlansCard from "./BillingPlansCard";
import { useAuth } from "../../store/useAuth";
import { usePharmacist } from "../../store/usePharmacist";
import { LoadingPage } from "../../components/ui/loading";

const TABS = [
  { key: "info", label: "Info", icon: <FaUser size={16} /> },
  { key: "security", label: "Security", icon: <FaLock size={16} /> },
  { key: "pharmacies", label: "My Pharmacies", icon: <FaClinicMedical size={16} /> },
  { key: "billing", label: "Billing & Plans", icon: <MdPayment size={16} /> },
];

export default function Settings() {
  // Simple state for active tab
  const [activeTab, setActiveTab] = useState("info");
  
  const { user, token } = useAuth();
  const { 
    pharmacistDetails, 
    isLoading, 
    error, 
    fetchPharmacistDetails,
    clearError 
  } = usePharmacist();

  // Fetch data only once on mount
  useEffect(() => {
    if (user && token) {
      fetchPharmacistDetails(user, token);
    }
  }, []);

  const handleRetry = () => {
    clearError();
    if (user && token) {
      fetchPharmacistDetails(user, token);
    }
  };

  // Simple tab click handler
  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-2 md:px-0">
      {/* Top Bar with My Deals and Verified Badge */}
      <SettingsHeader pharmacistDetails={pharmacistDetails} />
    
      {/* Tabs */}
      <div className="flex gap-2 mb-8 justify-center flex-col sm:flex-row">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`rounded-lg px-4 py-2 capitalize flex items-center gap-2 text-sm font-medium transition-colors duration-150 w-full sm:w-auto ${
              activeTab === tab.key 
                ? 'bg-primary text-white shadow-sm' 
                : 'bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-300'
            }`}
            onClick={() => handleTabClick(tab.key)}
          >
            <span className={activeTab === tab.key ? 'text-white' : 'text-primary'}>
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "info" && (
          <div className="space-y-6">
            {isLoading ? (
              <LoadingPage message="Loading personal information..." />
            ) : error ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="text-red-500 mb-4">
                    <FaUserMd size={32} className="mx-auto" />
                  </div>
                  <p className="text-red-600 mb-4 text-sm">{error}</p>
                  <Button onClick={handleRetry} size="sm">
                    Try Again
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <PersonalInfoCard pharmacistDetails={pharmacistDetails} />
                <ContactInfoCard pharmacistDetails={pharmacistDetails} />
              </>
            )}
          </div>
        )}
        
        {activeTab === "security" && (
          <div>
            {isLoading ? (
             <LoadingPage message="Loading security settings..." />
            ) : error ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="text-red-500 mb-4">
                    <FaLock size={32} className="mx-auto" />
                  </div>
                  <p className="text-red-600 mb-4 text-sm">{error}</p>
                  <Button onClick={handleRetry} size="sm">
                    Try Again
                  </Button>
                </div>
              </div>
            ) : (
              <SecurityCard pharmacistDetails={pharmacistDetails} />
            )}
          </div>
        )}
        
        {activeTab === "pharmacies" && (
          <div>
            {isLoading ? (
              <LoadingPage message="Loading pharmacies..." />
            ) : error ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="text-red-500 mb-4">
                    <FaClinicMedical size={32} className="mx-auto" />
                  </div>
                  <p className="text-red-600 mb-4 text-sm">{error}</p>
                  <Button onClick={handleRetry} size="sm">
                    Try Again
                  </Button>
                </div>
              </div>
            ) : (
              <PharmaciesCard pharmacistDetails={pharmacistDetails} />
            )}
          </div>
        )}
        
        {activeTab === "billing" && (
          <div>
            {isLoading ? (
              <LoadingPage message="Loading billing information..." />
            ) : error ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="text-red-500 mb-4">
                    <MdPayment size={32} className="mx-auto" />
                  </div>
                  <p className="text-red-600 mb-4 text-sm">{error}</p>
                  <Button onClick={handleRetry} size="sm">
                    Try Again
                  </Button>
                </div>
              </div>
            ) : (
              <BillingPlansCard pharmacistDetails={pharmacistDetails} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}