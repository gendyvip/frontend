import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserDetails } from "../../api/profile/UserDetails";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { LoadingPage } from "../../components/ui/loading";
import { Button } from "../../components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Building2,
  Package,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
} from "lucide-react";

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dealsPerPage] = useState(5);

  const handleViewDeal = (dealId) => {
    navigate(`/deal/${dealId}`);
  };

  const handleViewPharmacy = (pharmacyId) => {
    navigate(`/pharmacy/${pharmacyId}`);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const data = await getUserDetails(id);
        setUserData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserDetails();
    }
  }, [id]);

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Profile</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">User Not Found</h2>
          <p className="text-muted-foreground">
            The requested user profile could not be found.
          </p>
        </div>
      </div>
    );
  }

  const { user, deals: dealsRaw, pharmacies: pharmaciesRaw = [] } = userData;
  const deals = Array.isArray(dealsRaw) ? dealsRaw : [];
  const pharmacies = Array.isArray(pharmaciesRaw) ? pharmaciesRaw : [];

  // Pagination logic
  const indexOfLastDeal = currentPage * dealsPerPage;
  const indexOfFirstDeal = indexOfLastDeal - dealsPerPage;
  const currentDeals = deals.slice(indexOfFirstDeal, indexOfLastDeal);
  const totalPages = Math.ceil(deals.length / dealsPerPage);

  // Get user details from the first deal's postedBy or use basic user data
  const userDetails = deals.length > 0 ? deals[0].postedBy : user;

  // Chart data preparation
  const dealsByStatus = [
    {
      name: "Active",
      value: deals.filter((deal) => !deal.isClosed).length,
      color: "#10b981",
    },
    {
      name: "Closed",
      value: deals.filter((deal) => deal.isClosed).length,
      color: "#ef4444",
    },
  ];

  const dealsByType = deals.reduce((acc, deal) => {
    acc[deal.dealType] = (acc[deal.dealType] || 0) + 1;
    return acc;
  }, {});

  const dealsByTypeData = Object.entries(dealsByType).map(([type, count]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: count,
  }));

  const activeDealsValue = deals
    .filter((deal) => !deal.isClosed)
    .reduce((sum, deal) => sum + parseFloat(deal.price), 0);

  const pharmacyStats = {
    total: pharmacies.length,
    forSale: pharmacies.filter((p) => p.isForSale).length,
    totalValue: pharmacies
      .filter((p) => p.isForSale)
      .reduce((sum, p) => sum + parseFloat(p.pharmacyPrice || 0), 0),
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <Avatar className="h-20 w-20 sm:h-20 sm:w-20">
                <AvatarImage src={userDetails.profilePhotoUrl} />
                <AvatarFallback className="text-xl sm:text-2xl">
                  {userDetails.fullName?.charAt(0) ||
                    userDetails.email?.charAt(0) ||
                    "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {userDetails.fullName || "Unknown User"}
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-gray-600 text-sm sm:text-base">
                  <div className="flex items-center justify-center sm:justify-start space-x-1">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{userDetails.email}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start space-x-1">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{userDetails.phone}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start space-x-1">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span>
                      Joined{" "}
                      {new Date(userDetails.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mt-3">
                  <Badge
                    variant={
                      userDetails.isIdVerified ? "success" : "destructive"
                    }
                    className="text-xs"
                  >
                    {userDetails.isIdVerified ? "Verified" : "Unverified"}
                  </Badge>
                  <Badge
                    variant={
                      userDetails.isWorkIdVerified === "confirmed"
                        ? "success"
                        : "secondary"
                    }
                    className="text-xs"
                  >
                    {userDetails.isWorkIdVerified === "confirmed"
                      ? "Work ID Verified"
                      : "Work ID Pending"}
                  </Badge>
                  <Badge
                    variant={
                      userDetails.subscriptionStatus ? "success" : "outline"
                    }
                    className="text-xs"
                  >
                    {userDetails.subscriptionStatus ? "Premium" : "Free"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Deals
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {deals.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Deals
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {deals.filter((deal) => !deal.isClosed).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Pharmacies
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {pharmacyStats.total}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Details */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Deals</TabsTrigger>
            <TabsTrigger value="pharmacies">Pharmacies</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Deals Status Chart */}
              <Card>
                <CardHeader className="p-6 pb-4">
                  <CardTitle>Deals by Status</CardTitle>
                  <CardDescription>
                    Distribution of active vs closed deals
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  {deals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64">
                      {/* Pie Chart SVG for Deals by Status */}
                      <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" strokeWidth="2" stroke="currentColor" fill="none" />
                        <path d="M12 2a10 10 0 0 1 10 10h-10z" fill="currentColor" />
                      </svg>
                      <p className="text-gray-500 text-lg font-medium">No data to display</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={dealsByStatus}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {dealsByStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              {/* Deals by Type */}
              <Card>
                <CardHeader className="p-6 pb-4">
                  <CardTitle>Deals by Type</CardTitle>
                  <CardDescription>
                    Distribution of deal types
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  {deals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64">
                      {/* Bar Chart SVG for Deals by Type */}
                      <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <rect x="4" y="10" width="3" height="10" fill="currentColor" />
                        <rect x="10.5" y="6" width="3" height="14" fill="currentColor" />
                        <rect x="17" y="2" width="3" height="18" fill="currentColor" />
                      </svg>
                      <p className="text-gray-500 text-lg font-medium">No data to display</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={dealsByTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          innerRadius={40}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {dealsByTypeData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={["#4a4957", "#4f46e5", "#ffb500"][index % 3]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* All Deals Table */}
            <Card>
              <CardHeader className="p-6 pb-0">
                <CardTitle>All Deals</CardTitle>
                <CardDescription>Complete list of user deals</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  {deals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Package className="w-12 h-12 text-gray-300 mb-4" />
                      <p className="text-gray-500 text-lg font-medium">No deals found</p>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4">Medicine</th>
                          <th className="text-left p-4">Type</th>
                          <th className="text-left p-4">Price</th>
                          <th className="text-left p-4">Status</th>
                          <th className="text-left p-4">Created</th>
                          <th className="text-left p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentDeals.map((deal) => (
                          <tr key={deal.id} className="border-b hover:bg-gray-50">
                            <td className="p-4">
                              <div>
                                <p className="font-medium">{deal.medicineName}</p>
                                <p className="text-sm text-gray-600">
                                  {deal.description}
                                </p>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge
                                variant="outline"
                                className={
                                  deal.dealType === "both"
                                    ? "bg-[#4a4957] text-white border-[#4a4957]"
                                    : deal.dealType === "sell"
                                    ? "bg-[#4f46e5] text-white border-[#4f46e5]"
                                    : deal.dealType === "exchange"
                                    ? "bg-[#ffb500] text-white border-[#ffb500]"
                                    : "bg-[#8dd1e1] text-white border-[#8dd1e1]"
                                }
                              >
                                {deal.dealType}
                              </Badge>
                            </td>
                            <td className="p-4 font-medium">
                              EGP{Number(deal.price).toFixed(2)}
                            </td>
                            <td className="p-4">
                              <Badge
                                variant={
                                  deal.isClosed ? "destructive" : "success"
                                }
                              >
                                {deal.isClosed ? "Closed" : "Active"}
                              </Badge>
                            </td>
                            <td className="p-4 text-sm text-gray-600">
                              {new Date(deal.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDeal(deal.id)}
                                className="flex items-center space-x-1"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Details</span>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  {deals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Package className="w-12 h-12 text-gray-300 mb-4" />
                      <p className="text-gray-500 text-lg font-medium">No deals found</p>
                    </div>
                  ) : (
                    currentDeals.map((deal) => (
                      <div
                        key={deal.id}
                        className="border rounded-lg p-4 bg-white hover:bg-gray-50"
                      >
                        <div className="space-y-3">
                          {/* Medicine Info */}
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {deal.medicineName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {deal.description}
                            </p>
                          </div>

                          {/* Deal Details */}
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500 text-xs">Type</span>
                              <div className="mt-1">
                                <Badge
                                  variant="outline"
                                  className={
                                    deal.dealType === "both"
                                      ? "bg-[#4a4957] text-white border-[#4a4957]"
                                      : deal.dealType === "sell"
                                      ? "bg-[#4f46e5] text-white border-[#4f46e5]"
                                      : deal.dealType === "exchange"
                                      ? "bg-[#ffb500] text-white border-[#ffb500]"
                                      : "bg-[#8dd1e1] text-white border-[#8dd1e1]"
                                  }
                                >
                                  {deal.dealType}
                                </Badge>
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-500 text-xs">Price</span>
                              <p className="font-medium text-gray-900">
                                EGP{Number(deal.price).toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-500 text-xs">
                                Status
                              </span>
                              <div className="mt-1">
                                <Badge
                                  variant={
                                    deal.isClosed ? "destructive" : "success"
                                  }
                                >
                                  {deal.isClosed ? "Closed" : "Active"}
                                </Badge>
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-500 text-xs">
                                Created
                              </span>
                              <p className="text-gray-900">
                                {new Date(deal.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDeal(deal.id)}
                              className="w-full flex items-center justify-center space-x-2"
                            >
                              <Eye className="w-4 h-4" />
                              <span>Show Details</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Showing {indexOfFirstDeal + 1} to{" "}
                      {Math.min(indexOfLastDeal, deals.length)} of{" "}
                      {deals.length} deals
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>

                      <div className="flex items-center space-x-1">
                        {Array.from(
                          { length: totalPages },
                          (_, index) => index + 1
                        ).map((page) => (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pharmacies" className="space-y-6">
            {/* Pharmacy Details */}
            <Card>
              <CardHeader className="p-6 pb-4">
                <CardTitle>Pharmacy Details</CardTitle>
                <CardDescription>
                  Detailed information about each pharmacy
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pharmacies.map((pharmacy) => (
                    <div key={pharmacy.id} className="border rounded-lg p-4">
                      <div className="flex justify-between mb-4">
                        <div className="flex flex-row  space-x-2">
                          <Building2 className="h-6 w-6 text-primary" />
                          <h3 className="text-lg font-semibold">
                            {pharmacy.name}
                          </h3>
                        </div>
                        <Badge
                          variant={pharmacy.isForSale ? "success" : "destructive"}
                        >
                          {pharmacy.isForSale ? "For Sale" : "Not for Sale"}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-primary"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <div className="flex justify-between flex-1">
                            <span className="text-gray-600 font-medium">
                              License:
                            </span>
                            <span className="font-medium">
                              {pharmacy.licenseNum}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                          </div>
                          <div className="flex justify-between flex-1">
                            <span className="text-gray-600 font-medium">
                              Phone:
                            </span>
                            <span className="font-medium">
                              {pharmacy.pharmacyPhone}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 bg-purple-100 rounded flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-purple-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div className="flex justify-between flex-1">
                            <span className="text-gray-600 font-medium">
                              Hours:
                            </span>
                            <span className="font-medium">
                              {pharmacy.startHour} - {pharmacy.endHour}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 bg-orange-100 rounded flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-orange-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                              />
                            </svg>
                          </div>
                          <div className="flex justify-between flex-1">
                            <span className="text-gray-600 font-medium">
                              Monthly Sales:
                            </span>
                            <span className="font-medium">
                              EGP{pharmacy.monthlySales}
                            </span>
                          </div>
                        </div>
                        {pharmacy.isForSale && (
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 bg-red-100 rounded flex items-center justify-center">
                              <svg
                                className="w-3 h-3 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                                />
                              </svg>
                            </div>
                            <div className="flex justify-between flex-1">
                              <span className="text-gray-600 font-medium">
                                Sale Price:
                              </span>
                              <span className="font-medium text-green-600">
                                EGP{pharmacy.pharmacyPrice}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center">
                            <MapPin className="h-3 w-3 text-gray-600" />
                          </div>
                          <span className="text-sm text-gray-600 font-medium">
                            Address:
                          </span>
                        </div>
                        <div className="ml-7 space-y-1">
                          <p className="text-sm text-gray-900">
                            {pharmacy.addressLine1}
                            {pharmacy.addressLine2 && (
                              <>
                                <br />
                                {pharmacy.addressLine2}
                              </>
                            )}
                          </p>
                          <p className="text-sm text-gray-600">
                            {pharmacy.city}, {pharmacy.governorate}{" "}
                            {pharmacy.zipCode}
                          </p>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewPharmacy(pharmacy.id)}
                          className="w-full flex items-center justify-center space-x-2"
                        >
                          <Building2 className="w-4 h-4" />
                          <span>View Pharmacy Details</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
