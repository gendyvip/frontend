import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FaEnvelope } from "react-icons/fa";
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

  return (
    <Card className="mb-8 p-6 max-sm:px-0 shadow-lg rounded-2xl border border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle>
          <span className="inline-flex items-center gap-3 font-bold text-lg tracking-wide">
            <span
              className="inline-flex items-center justify-center rounded-full bg-primary/10 shadow-sm"
              style={{ width: 36, height: 36 }}
            >
              <FaEnvelope size={18} className="text-primary" />
            </span>
            Contact Information
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="email" className="text-xs font-medium uppercase">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
              disabled={isLoading}
            />
            {errors.email && (
              <span className="text-red-500 text-xs mt-1">{errors.email}</span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="phone" className="text-xs font-medium uppercase">
              Phone Number
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              className={`mt-1 ${errors.phone ? 'border-red-500' : ''}`}
              disabled={isLoading}
              placeholder="01XXXXXXXXX"
            />
            {errors.phone && (
              <span className="text-red-500 text-xs mt-1">{errors.phone}</span>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="justify-end pt-4">
        <Button 
          type="submit"
          onClick={handleSubmit}
          disabled={isLoading || !hasChanges}
          className="px-6 py-2 rounded-md text-base max-sm:m-auto"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
}
