import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "../components/Footer/Footer";
import OfflineIndicator from "../components/OfflineIndicator";
import { Suspense } from "react";
import { LoaderPinwheelIcon } from "lucide-react";

export default function SharedLayout() {
  return (
    <Suspense fallback={<LoaderPinwheelIcon/>}>
      <Navbar />
      <OfflineIndicator />

      <Outlet />
      <Toaster />
      {/* <Footer /> */}
    </Suspense>
  );
}
