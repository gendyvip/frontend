import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Core Layout Components
import SharedLayout from "./SharedLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import ProfileRedirect from "../components/ProfileRedirect";

// Main Pages
import Home from "./../pages/Home/Home";
import NotFound from "../pages/NotFound/NotFound";
import UnderReview from "../pages/UnderReview/UnderReview";

// Authentication Pages
import Login from "./../pages/Login/Login";
import SignUp from "./../pages/SignUp/SignUp";
import ResetPassword from "./../pages/ResetPassword/ResetPassword";
import ConfirmPassword from "../pages/ConfirmPassword/ConfirmPassword";
import Otp from "./../pages/OTP/Otp";

// Lazy Loaded Components
const Advertise = React.lazy(() => import("../pages/Advertise/Advertise"));
const ContactUs = React.lazy(() => import("../pages/ContactUs/ContactUs"));
const Subscription = React.lazy(() =>
  import("../pages/Subscription/Subscription")
);
const SuccessPayment = React.lazy(() =>
  import("./../pages/SuccessPayment/SuccessPayment")
);
const FailedPayment = React.lazy(() =>
  import("./../pages/FailedPayment/FailedPayment")
);

// User Management Pages
const Profile = React.lazy(() => import("../pages/Profile/Profile"));
const Settings = React.lazy(() => import("../pages/Settings/Settings"));
const Favorites = React.lazy(() => import("../pages/Favorites/Favorites"));

// Deals Management Pages
const Deals = React.lazy(() => import("../pages/MyDeals/Deals"));
const AvailableDeals = React.lazy(() =>
  import("../pages/AvailableDeals/AvailableDeals")
);
const DealDetails = React.lazy(() =>
  import("../pages/AvailableDeals/DealDetails")
);
const DealFormPage = React.lazy(() => import("../pages/DealForm/DealFormPage"));

// Pharmacy Management Pages
const AddPharmacy = React.lazy(() => import("../pages/AddPharmcy/AddPharmacy"));
const PharmaciesForSale = React.lazy(() =>
  import("../pages/PharmaciesForSale/PharmaciesForSale")
);
const PharmacyDetails = React.lazy(() =>
  import("../pages/PharmaciesForSale/PharmacyDetails")
);

// Communication Pages
const Chat = React.lazy(() => import("../pages/Chat/Chat"));

export default function MainLayout() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<SharedLayout />}>
            {/* Public Routes */}
            <Route index element={<Home />} />
            <Route path="under-review" element={<UnderReview />} />

            {/* Authentication Routes */}
            <Route path="auth">
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<SignUp />} />
              <Route path="reset-password">
                <Route index element={<ResetPassword />} />
                <Route path="confirm" element={<ConfirmPassword />} />
                <Route
                  path="verify-otp"
                  element={<Otp message="Reset Password" />}
                />
              </Route>
            </Route>

            {/* Public Service Routes */}
            <Route path="/advertise" element={<Advertise />} />
            <Route path="contact" element={<ContactUs />} />

            {/* Subscription Routes */}
            <Route path="subscription">
              <Route index element={<Subscription />} />
              <Route path=":id/success" element={<SuccessPayment />} />
              <Route path=":id/failed" element={<FailedPayment />} />
            </Route>

            {/* Protected User Routes */}
            <Route
              path="settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route path="me">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <ProfileRedirect />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path=":id"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route
              path="pharmacists/:id"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />

            {/* Protected My Deals Routes */}
            <Route
              path="my-deals"
              element={
                <ProtectedRoute>
                  <Deals />
                </ProtectedRoute>
              }
            />

            {/* Protected Deals Routes */}
            <Route path="deals">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <AvailableDeals />
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <DealFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":id"
                element={
                  <ProtectedRoute>
                    <DealDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="edit/:id"
                element={
                  <ProtectedRoute>
                    <DealFormPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Protected Pharmacy Routes */}
            <Route path="pharmacies">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <PharmaciesForSale />
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <AddPharmacy />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":id"
                element={
                  <ProtectedRoute>
                    <PharmacyDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":id/edit"
                element={
                  <ProtectedRoute>
                    <AddPharmacy />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* NotFound Route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>

        {/* Global Chat Widget */}
        <Chat />
      </div>
    </Router>
  );
}
