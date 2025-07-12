import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/useAuth";
import { LoadingPage } from "./ui/loading";

export default function ProfileRedirect() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Extract user ID from the user object
      // The user object structure might vary, so we need to handle different cases
      let userId;
      
      if (user.data && user.data.id) {
        userId = user.data.id;
      } else if (user.id) {
        userId = user.id;
      } else if (typeof user === 'string') {
        // If user is stored as a string (ID), use it directly
        userId = user;
      }

      if (userId) {
        navigate(`/profile/${userId}`, { replace: true });
      } else {
        // If we can't get the user ID, redirect to login
        navigate('/login', { replace: true });
      }
    } else {
      // If not authenticated, redirect to login
      navigate('/login', { replace: true });
    }
  }, [user, isAuthenticated, navigate]);

  // Show loading while redirecting
  return <LoadingPage message="Redirecting to your profile..." />;
} 