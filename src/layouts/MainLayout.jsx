import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./../pages/Home/Home";
import Login from "./../pages/Login/Login";
import SignUp from "./../pages/SignUp/SignUp";
import Advertise from "../pages/Advertise/Advertise";
import ContactUs from "./../pages/ContactUs/ContactUs";
import ResetPassword from "./../pages/ResetPassword/ResetPassword";
import Otp from "./../pages/OTP/Otp";
import SharedLayout from "./SharedLayout";
import Deals from "../pages/MyDeals/Deals";
import Subscription from "../pages/Subscription/Subscription";
import DealFormPage from "../pages/DealForm/DealFormPage";
import Profile from "../pages/Profile/Profile";
import ConfirmPassword from "../pages/ConfirmPassword/ConfirmPassword";
import AddPharmacy from "../pages/AddPharmcy/AddPharmacy";
import NotFound from "../pages/NotFound/notFound";
import ProtectedRoute from "../components/ProtectedRoute";
import AvailableDeals from "../pages/AvailableDeals/AvailableDeals";
import DealDetails from "../pages/AvailableDeals/DealDetails";



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
            <Route path="/settings" element={<ProtectedRoute><Profile /></ProtectedRoute> } />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/otp" element={<Otp message="Reset Password" />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/deals" element={<ProtectedRoute><Deals /></ProtectedRoute> } />
            <Route path="/all-deals/:dealId" element={<ProtectedRoute><DealDetails /></ProtectedRoute> } />
            <Route path="/reset" element={<ResetPassword />} />
            <Route path="/confirm-password" element={<ConfirmPassword />} />
            <Route path="/deals/new" element={<ProtectedRoute><DealFormPage /></ProtectedRoute> } />
            <Route path="/deals/edit/:id" element={<ProtectedRoute><DealFormPage /></ProtectedRoute> } />
            <Route path="/add-pharmacy" element={<ProtectedRoute><AddPharmacy /></ProtectedRoute> } />
            <Route path="/add-pharmacy/:id" element={<ProtectedRoute><AddPharmacy /></ProtectedRoute> } />
             <Route path="/all-deals" element={<ProtectedRoute><AvailableDeals /></ProtectedRoute> } />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}
