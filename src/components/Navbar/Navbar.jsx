import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import styles from "./navbar.module.css";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/useAuth";
import { usePharmacist } from "../../store/usePharmacist";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FiBell } from "react-icons/fi";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import useChat from "../../store/useChat";
import { useOffline } from "../../hooks/useOffline";

export default function Navbar() {
  const isOffline = useOffline();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, initializeAuth, token } = useAuth();
  const userMenuRef = useRef(null);
  const userButtonRef = useRef(null);

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
    navigate("/");
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
          href="https://flowbite.com/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src="/DawabackNewLogo.png"
            className="h-10"
            alt="Flowbite Logo"
          />
          <div className="flex flex-col mb-2">
            <span className="font-bold  text-2xl  whitespace-nowrap text-primary dark:text-white">
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
                  <Button variant="ghost" size="icon" className="mr-2">
                    <FiBell className="w-5 h-5" />
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
              <motion.button
                ref={userButtonRef}
                type="button"
                className="flex text-xl bg-purple-800 rounded-full md:me-0 focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-600 relative"
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
                    className="z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600 absolute top-12 right-0 md:right-2 lg:right-8 xl:right-2 2xl:right-42"
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
                        {/* <Link
                          to="/chat"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                          Messages
                          {unreadCount > 0 && (
                            <Badge className="ml-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs font-semibold">
                              {unreadCount}
                            </Badge>
                          )}
                        </Link> */}
                        <Link to="/profile"
                         className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="all-deals"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                          Deals
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="pharmacies-for-sale"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                          Pharamacies
                        </Link>
                      </li>
                                            <li>
                        <Link
                          to="/settings"
                          onClick={() => setIsUserMenuOpen(false)}
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
            </>
          ) : (
            <div className="flex items-center space-x-4 max-md:hidden">
              <MotionLink
                to="login"
                whileTap="tap"
                whileHover="hover"
                variants={buttonVariants}
                className="text-white bg-primary hover:bg-[var(--primary-hover)] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-primary focus:outline-none dark:focus:ring-blue-800"
              >
                Login
              </MotionLink>
              <MotionLink
                to="SignUp"
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
                    className="block py-2 px-3 text-white bg-primary rounded-sm md:bg-transparent md:text-primary md:p-0 md:dark:text-blue-500"
                    aria-current="page"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/advertise"
                    className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    Advertise
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    Contact
                  </Link>
                </li>

                {!isAuthenticated && (
                  <li className={`flex space-x-4 ${styles.centerBtns}`}>
                    <div className={`flex space-x-4 ${styles.centerBtns}`}>
                      <MotionLink
                        to={"login"}
                        whileTap="tap"
                        whileHover="hover"
                        variants={buttonVariants}
                        className="text-white bg-primary hover:bg-[var(--primary-hover)] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-primary focus:outline-none dark:focus:ring-blue-800"
                      >
                        Login
                      </MotionLink>
                      <MotionLink
                        to={"SignUp"}
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
            {!isAuthenticated ? 
           (
              <>
                <li>
                  <Link
                    to="/"
                    className="block py-2 px-3 text-white bg-primary rounded-sm md:bg-transparent md:text-primary md:p-0 md:dark:text-blue-500"
                    aria-current="page"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/advertise"
                    className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    Advertise
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    Contact
                  </Link>
                </li>
              </>
            ):""}
          </ul>
        </div>
      </div>
    </nav>
  );
}
