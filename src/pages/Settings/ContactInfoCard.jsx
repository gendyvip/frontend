import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaEnvelope, FaPhone, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { UpdateInfo } from "../../api/profile/UpdateInfo";
import { useAuth } from "../../store/useAuth";
import { usePharmacist } from "../../store/usePharmacist";
import { toast } from "sonner";

export default function ContactInfoCard({ pharmacistDetails }) {
  // Add null check and default values
  const details = pharmacistDetails || {};
  const { user, token } = useAuth();
  const { fetchPharmacistDetails } = usePharmacist();
  
  // Get user ID from localStorage if not available from auth store
  const getUserId = () => {
    if (user) return user;
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  };
  
  // State for form data
  const [formData, setFormData] = useState({
    email: details.email || "",
    phone: details.phone || "",
  });
  
  // State for loading and validation
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Update form data when pharmacistDetails changes
  useEffect(() => {
    if (pharmacistDetails) {
      setFormData({
        email: pharmacistDetails.email || "",
        phone: pharmacistDetails.phone || "",
      });
    }
  }, [pharmacistDetails]);

  // Check for changes
  useEffect(() => {
    const hasFormChanges = 
      formData.email !== (details.email || "") ||
      formData.phone !== (details.phone || "");
    setHasChanges(hasFormChanges);
  }, [formData, details]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^01[0-2,5]{1}[0-9]{8}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid Egyptian phone number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!hasChanges) {
      toast.error("No changes to save");
      return;
    }

    setIsLoading(true);
    
    try {
      const userId = getUserId();
      if (!userId) {
        throw new Error("User ID not found");
      }

      const updateData = {
        email: formData.email,
        phone: formData.phone,
      };

      await UpdateInfo(userId, updateData);
      
      toast.success("Contact information updated successfully!");
      setHasChanges(false);
      setIsEditing(false);
      
      // Refresh pharmacist details to get updated data
      if (userId && token) {
        await fetchPharmacistDetails(userId, token);
      }
      
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(error.message || "Failed to update contact information");
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldStatus = (fieldName) => {
    const value = formData[fieldName];
    if (!value) return 'empty';
    if (errors[fieldName]) return 'error';
    if (value === details[fieldName]) return 'unchanged';
    return 'changed';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'changed':
        return <FaCheckCircle className="text-green-500" size={16} />;
      case 'error':
        return <FaExclamationTriangle className="text-red-500" size={16} />;
      default:
        return null;
    }
  };

  return (
    <Card className="mb-8 shadow-lg rounded-xl border border-gray-200 bg-white px-4 py-8">
      <CardHeader>
        <CardTitle>
          <div className="inline-flex items-center gap-3 font-bold text-xl tracking-wide">
            <span className="inline-flex items-center justify-center rounded-full bg-primary/10 shadow-sm" style={{ width: 48, height: 48 }}>
              <FaEnvelope size={24} className="text-primary" />
            </span>
            <div className="flex flex-col">
            <span className="text-gray-900">
              Contact Information
            </span>
            <p className="text-sm text-gray-600 font-normal">Manage your email and phone number for account communications</p>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Field */}
            <div className="group relative">
              <div className="flex items-center gap-3 mb-3">
                <div>
                  <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Email Address
                  </Label>
                </div>
              </div>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`pl-12 pr-4 py-3 border-2 transition-all duration-200 ${
                    errors.email 
                      ? 'border-red-300 bg-red-50 focus:border-red-500' 
                      : getFieldStatus('email') === 'changed'
                      ? 'border-green-300 bg-green-50 focus:border-green-500'
                      : 'border-gray-200 focus:border-primary'
                  }`}
                  disabled={isLoading || !isEditing}
                  placeholder="Enter your email address"
                />
                <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
              {errors.email && (
                <div className="flex items-center gap-2 mt-2 text-red-500 text-xs">
                  <FaExclamationTriangle size={12} />
                  {errors.email}
                </div>
              )}
            </div>

            {/* Phone Field */}
            <div className="group relative">
              <div className="flex items-center gap-3 mb-3">
                <div>
                  <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Phone Number
                  </Label>
                </div>
              </div>
              <div className="relative">
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`pl-12 pr-4 py-3 border-2 transition-all duration-200 ${
                    errors.phone 
                      ? 'border-red-300 bg-red-50 focus:border-red-500' 
                      : getFieldStatus('phone') === 'changed'
                      ? 'border-green-300 bg-green-50 focus:border-green-500'
                      : 'border-gray-200 focus:border-primary'
                  }`}
                  disabled={isLoading || !isEditing}
                  placeholder="01XXXXXXXXX"
                />
                <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
              {errors.phone && (
                <div className="flex items-center gap-2 mt-2 text-red-500 text-xs">
                  <FaExclamationTriangle size={12} />
                  {errors.phone}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-4">
              {!isEditing ? (
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="px-6 py-2 rounded-md text-base"
                >
                  Edit Information
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      email: details.email || "",
                      phone: details.phone || "",
                    });
                    setErrors({});
                  }}
                  variant="outline"
                  className="px-6 py-2 rounded-md text-base"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              )}
            </div>
            
            {isEditing && (
              <Button 
                type="submit"
                disabled={isLoading || !hasChanges}
                className={`px-6 py-2 rounded-md text-base transition-all duration-200 ${
                  hasChanges 
                    ? 'bg-primary hover:bg-primary/90 text-white' 
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <FaCheckCircle size={16} />
                    Save Changes
                  </div>
                )}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
