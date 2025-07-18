import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import styles from "./navbar.module.css";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../store/useAuth";
import { usePharmacist } from "../../store/usePharmacist";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FiBell } from "react-icons/fi";
import { Heart } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import useChat from "../../store/useChat";
import { useOffline } from "../../hooks/useOffline";
import { useFav } from "../../store/useFav";

export default function Navbar() {
  const isOffline = useOffline();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, initializeAuth, token } = useAuth();
  const userMenuRef = useRef(null);
  const userButtonRef = useRef(null);
  const { favorites, fetchFavorites } = useFav();

  const navigate = useNavigate();
  const MotionLink = motion(Link);
  const {
    pharmacistDetails,
    isLoading,
    error,
    fetchPharmacistDetails,
    clearError,
  } = usePharmacist();

  // Use real unread messages count from chat store
  const unreadCount = useChat((state) => state.totalUnreadCount);
  const { loadUserChats, initializeSocket, getCurrentUserId } = useChat();

  const location = useLocation();

  useEffect(() => {
    if (user && token) {
      // Ensure we always pass the user id, not the whole object
      const userId = typeof user === "object" && user !== null ? user.id : user;
      if (userId) {
        fetchPharmacistDetails(userId, token);
      }
    }
  }, [user, token, fetchPharmacistDetails]);

  useEffect(() => {
    // Initialize auth state from localStorage
    initializeAuth();
  }, [initializeAuth]);

  // Load chats when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const currentUserId = getCurrentUserId();
      if (currentUserId) {
        initializeSocket();
        loadUserChats();
      }
    }
  }, [isAuthenticated, initializeSocket, loadUserChats, getCurrentUserId]);

  // Fetch favorites when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated, fetchFavorites]);

  // Handle clicking outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isUserMenuOpen &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target) &&
        userButtonRef.current &&
        !userButtonRef.current.contains(event.target)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate("/auth/login");
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: "-100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const burgerVariants = {
    closed: { rotate: 0, scale: 1 },
    open: { rotate: 90, scale: 1 },
    tap: { scale: 0.95 },
    hover: { scale: 1.05 },
  };

  const buttonVariants = {
    tap: { scale: 0.95 },
    hover: { scale: 1.05 },
  };

  const getInitials = (name = "") => {
    const words = name.trim().split(" ");
    const firstTwo = words.slice(0, 2);
    return firstTwo.map((word) => word[0]?.toUpperCase()).join("");
  };

  return (
    <nav
      className=" border-gray-200 dark:bg-gray-900"
      style={{ paddingTop: isOffline ? "2rem" : "0" }}
    >
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          to="/deals"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src="/logo.svg"
            className="h-15"
            alt="Flowbite Logo"
          />
          <div className="flex flex-col mb-3">
            <span className="font-bold  text-4xl  whitespace-nowrap text-primary dark:text-white">
              Dawaback
            </span>
            <p className="text-sm text-gray-500  leading-0 mt-1 dark:text-gray-400">
              Before it expires, Dawaback it
            </p>
          </div>
        </Link>
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {isAuthenticated ? (
            <>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="mr-2 hidden md:inline-flex" style={{ width: 46, height: 46 }}>
                    <FiBell className="text-zinc-600" style={{ width: 30, height: 30 }} />
                    <span className="sr-only">Notifications</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 p-0">
                  <div className="p-4 border-b font-semibold text-base">
                    Notifications
                  </div>
                  <ul className="divide-y">
                    <li className="p-4 hover:bg-muted cursor-pointer text-sm">
                      <span className="font-medium">Welcome!</span> This is a
                      demo notification.
                    </li>
                    <li className="p-4 hover:bg-muted cursor-pointer text-sm">
                      <span className="font-medium">System:</span> Your profile
                      was updated successfully.
                    </li>
                    <li className="p-4 hover:bg-muted cursor-pointer text-sm">
                      <span className="font-medium">Reminder:</span> Check your
                      messages for new offers.
                    </li>
                  </ul>
                  <div className="p-2 text-center border-t">
                    <Link
                      to="/notifications"
                      className="text-primary text-sm hover:underline"
                    >
                      View all notifications
                    </Link>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Favorites Icon */}
              <Link to="/favorites" className="relative font-bold mr-4 hidden md:inline-flex">
                <Button variant="ghost" className="" style={{ width: 46, height: 46 }}>
                  <Heart className="text-zinc-600" style={{ width: 30, height: 30 }} />
                  <span className="sr-only">Favorites</span>
                </Button>
                {favorites.deals.length + favorites.pharmacies.length > 0 && (
                  <Badge className="absolute bottom-6 left-7 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs font-semibold min-w-[24px] h-[24px] flex items-center justify-center">
                    {favorites.deals.length + favorites.pharmacies.length}
                  </Badge>
                )}
              </Link>
              {/* Avatar and Dropdown */}
              <div className="relative flex items-center">
                <motion.button
                  ref={userButtonRef}
                  type="button"
                  className="flex items-center justify-center mr-2 text-xl bg-primary rounded-full md:me-0 focus:ring-4 focus:ring-primary/30 dark:focus:ring-primary/30 relative"
                  style={{ width: 46, height: 46 }}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  whileTap="tap"
                  whileHover="hover"
                  variants={buttonVariants}
                >
                  <span className="sr-only">Open user menu</span>
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>
                      {getInitials(pharmacistDetails?.fullName || "User")}
                    </AvatarFallback>
                  </Avatar>
                </motion.button>
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      ref={userMenuRef}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="z-50 mt-2 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600 absolute right-0 top-full"
                    >
                      <div className="px-4 py-3">
                        <span className="block text-sm text-gray-900 dark:text-white">
                          {pharmacistDetails?.fullName || "User"}
                        </span>
                        <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                          {pharmacistDetails?.email || "user@example.com"}
                        </span>
                      </div>
                      <ul className="py-2" aria-labelledby="user-menu-button">
                        <li>
                          <Link
                            to="/me"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            Profile
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/deals"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            Deals
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/pharmacies"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            Pharmacies
                          </Link>
                        </li>

                        <li>
                          <Link
                            to="/settings"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            Settings
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            Sign out
                          </button>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4 max-md:hidden">
              <MotionLink
                to="/auth/login"
                whileTap="tap"
                whileHover="hover"
                variants={buttonVariants}
                className="text-white bg-primary hover:bg-[var(--primary-hover)] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-primary focus:outline-none dark:focus:ring-blue-800"
              >
                Login
              </MotionLink>
              <MotionLink
                to="/auth/signup"
                whileTap="tap"
                whileHover="hover"
                variants={buttonVariants}
                className="text-gray-900 border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-md text-sm px-4 py-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              >
                Sign up
              </MotionLink>
            </div>
          )}
          <motion.button
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            animate={isMenuOpen ? "open" : "closed"}
            whileTap="tap"
            whileHover="hover"
            variants={burgerVariants}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </motion.button>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
              className="items-center justify-between w-full md:hidden md:w-auto md:order-1"
            >
              <ul className="flex flex-col  font-medium p-4 md:p-0 mt-4 border rounded-lg  md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                <li>
                  <Link
                    to="/"
                    className={location.pathname === "/" ? "block py-2 px-3 text-white bg-primary rounded-sm md:bg-transparent md:text-primary md:p-0 md:dark:text-blue-500" : "block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"}
                    aria-current="page"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/advertise"
                    className={location.pathname === "/advertise" ? "block py-2 px-3 text-white bg-primary rounded-sm md:bg-transparent md:text-primary md:p-0 md:dark:text-blue-500" : "block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"}
                  >
                    Advertise
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className={location.pathname === "/contact" ? "block py-2 px-3 text-white bg-primary rounded-sm md:bg-transparent md:text-primary md:p-0 md:dark:text-blue-500" : "block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"}
                  >
                    Contact
                  </Link>
                </li>
                {/* Notifications (mobile menu) */}
                {isAuthenticated && (
                  <li>
                    <Link
                      to="/notifications"
                      className={location.pathname === "/notifications" ? "flex items-center justify-between gap-2 py-2 px-3 text-white bg-primary rounded-sm md:bg-transparent md:text-primary md:p-0 md:dark:text-blue-500" : "flex items-center justify-between gap-2 py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"}
                    >
                      <span>Notifications</span>
                      <FiBell className={location.pathname === "/notifications" ? "text-white w-5 h-5" : "w-5 h-5 text-zinc-600"} />
                      {/* Add a badge here if you have a notifications count */}
                      {/* <Badge className="ml-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs font-semibold min-w-[18px] h-[18px] flex items-center justify-center">0</Badge> */}
                    </Link>
                  </li>
                )}
                {/* Favorites (mobile menu) */}
                {isAuthenticated && (
                  <li>
                    <Link
                      to="/favorites"
                      className={location.pathname === "/favorites" ? "flex items-center justify-between gap-2 py-2 px-3 text-white bg-primary rounded-sm md:bg-transparent md:text-primary md:p-0 md:dark:text-blue-500" : "flex items-center justify-between gap-2 py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"}
                    >
                      <span>Favorites</span>
                      <span className="relative">
                        <Heart className={location.pathname === "/favorites" ? "text-white w-5 h-5" : "w-5 h-5 text-zinc-600"}  />
                        {(favorites.deals.length + favorites.pharmacies.length > 0) && (
                          <Badge className="absolute bottom-3 left-3 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs font-semibold min-w-[18px] h-[18px] flex items-center justify-center">
                            {favorites.deals.length + favorites.pharmacies.length}
                          </Badge>
                        )}
                      </span>
                    </Link>
                  </li>
                )}

                {!isAuthenticated && (
                  <li className={`flex space-x-4 ${styles.centerBtns}`}>
                    <div className={`flex space-x-4 ${styles.centerBtns}`}>
                      <MotionLink
                        to={"/auth/login"}
                        whileTap="tap"
                        whileHover="hover"
                        variants={buttonVariants}
                        className="text-white bg-primary hover:bg-[var(--primary-hover)] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-primary focus:outline-none dark:focus:ring-blue-800"
                      >
                        Login
                      </MotionLink>
                      <MotionLink
                        to={"/auth/signup"}
                        whileTap="tap"
                        whileHover="hover"
                        variants={buttonVariants}
                        className="text-gray-900 bg-secondary border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-md text-sm px-4 py-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                      >
                        Sign up
                      </MotionLink>
                    </div>
                  </li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="hidden md:flex items-center justify-between w-full md:w-auto md:order-1">
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border  rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0  dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {!isAuthenticated ? (
              <>
                <li>
                  <Link
                    to="/"
                    className={location.pathname === "/" ? "block py-2 px-3 text-white bg-primary rounded-sm md:bg-transparent md:text-primary md:p-0 md:dark:text-blue-500" : "block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"}
                    aria-current="page"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/advertise"
                    className={location.pathname === "/advertise" ? "block py-2 px-3 text-white bg-primary rounded-sm md:bg-transparent md:text-primary md:p-0 md:dark:text-blue-500" : "block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"}
                  >
                    Advertise
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className={location.pathname === "/contact" ? "block py-2 px-3 text-white bg-primary rounded-sm md:bg-transparent md:text-primary md:p-0 md:dark:text-blue-500" : "block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"}
                  >
                    Contact
                  </Link>
                </li>
              </>
            ) : (
              ""
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}