import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./../pages/Home/Home";
import Login from "./../pages/Login/Login";
import SignUp from "./../pages/SignUp/SignUp";
import ResetPassword from "./../pages/ResetPassword/ResetPassword";
import Otp from "./../pages/OTP/Otp";
import SharedLayout from "./SharedLayout";
import ConfirmPassword from "../pages/ConfirmPassword/ConfirmPassword";
import ProtectedRoute from "../components/ProtectedRoute";
import ProfileRedirect from "../components/ProfileRedirect";
import NotFound from "../pages/NotFound/NotFound";

const Advertise = React.lazy(() => import("../pages/Advertise/Advertise"));
const ContactUs = React.lazy(() => import("../pages/ContactUs/ContactUs"));
const Deals = React.lazy(() => import("../pages/MyDeals/Deals"));
const Subscription = React.lazy(() =>
  import("../pages/Subscription/Subscription")
);
const AddPharmacy = React.lazy(() => import("../pages/AddPharmcy/AddPharmacy"));
const AvailableDeals = React.lazy(() =>
  import("../pages/AvailableDeals/AvailableDeals")
);
const DealDetails = React.lazy(() =>
  import("../pages/AvailableDeals/DealDetails")
);
const PharmaciesForSale = React.lazy(() =>
  import("../pages/PharmaciesForSale/PharmaciesForSale")
);
const PharmacyDetails = React.lazy(() =>
  import("../pages/PharmaciesForSale/PharmacyDetails")
);
const Chat = React.lazy(() => import("../pages/Chat/Chat"));
const Settings = React.lazy(() => import("../pages/Settings/Settings"));
const Profile = React.lazy(() => import("../pages/Profile/Profile"));
const Favorites = React.lazy(() => import("../pages/Favorites/Favorites"));
const SuccessPayment = React.lazy(() =>
  import("./../pages/SuccessPayment/SuccessPayment")
);
const FailedPayment = React.lazy(() =>
  import("./../pages/FailedPayment/FailedPayment")
);
const DealFormPage = React.lazy(() => import("../pages/DealForm/DealFormPage"));

export default function MainLayout() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<SharedLayout />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/advertise" element={<Advertise />} />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route path="/subscription" element={<Subscription />} />
            <Route
              path="/subscription/:id/success"
              element={
                <ProtectedRoute>
                  <SuccessPayment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/subscription/:id/failed"
              element={
                <ProtectedRoute>
                  <FailedPayment />
                </ProtectedRoute>
              }
            />
            <Route path="/otp" element={<Otp message="Reset Password" />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route
              path="/deals"
              element={
                <ProtectedRoute>
                  <Deals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/all-deals/:dealId"
              element={
                <ProtectedRoute>
                  <DealDetails />
                </ProtectedRoute>
              }
            />
            <Route path="/reset" element={<ResetPassword />} />
            <Route path="/confirm-password" element={<ConfirmPassword />} />
            <Route
              path="/deals/new"
              element={
                <ProtectedRoute>
                  <DealFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/deals/edit/:id"
              element={
                <ProtectedRoute>
                  <DealFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-pharmacy"
              element={
                <ProtectedRoute>
                  <AddPharmacy />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-pharmacy/:id"
              element={
                <ProtectedRoute>
                  <AddPharmacy />
                </ProtectedRoute>
              }
            />
            <Route
              path="/all-deals"
              element={
                <ProtectedRoute>
                  <AvailableDeals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pharmacies-for-sale"
              element={
                <ProtectedRoute>
                  <PharmaciesForSale />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pharmacies-for-sale/:id"
              element={
                <ProtectedRoute>
                  <PharmacyDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileRedirect />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:id"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        {/* Render Chat widget globally, outside of <Routes> */}
        <Chat />
      </div>
    </Router>
  );
}
