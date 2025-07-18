import { useEffect } from "react";
import MainLayout from "./layouts/MainLayout";
import OfflinePage from "./components/OfflinePage";
import InstallApp from "./components/InstallApp";
import { useOffline } from "./hooks/useOffline";
import { initializeStores } from "./utils/stateManager";

export default function App() {
  const isOffline = useOffline();
  const currentPath = window.location.pathname;

  // Initialize stores when the app loads
  useEffect(() => {
    initializeStores();
  }, []);

  // Allow home page to show in offline mode
  if (isOffline && currentPath !== "/") {
    return (
      <>
        <OfflinePage />
        <InstallApp />
      </>
    );
  }

  if (isOffline && currentPath == "/") {
    return (
      <>
        <MainLayout />
        <InstallApp />
      </>
    );
  }
  if (isOffline && currentPath !== "/deals") {
    return <OfflinePage />;
  }
  if (isOffline && currentPath !== "/deals/:id") {
    return <OfflinePage />;
  }
  if (isOffline && currentPath !== "/profile") {
    return <OfflinePage />;
  }

  return (
    <>
      <MainLayout />
      <InstallApp />
    </>
  );
}
