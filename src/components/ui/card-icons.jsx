import React from "react";

export const VisaIcon = ({ className = "w-6 h-6" }) => (
  <svg
    className={className}
    viewBox="0 0 48 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="32" rx="6" fill="#fff" />
    <g>
      <path
        d="M17.6 21.2L20.1 10.8C20.2 10.3 20 10 19.5 10H16.7C16.3 10 16 10.3 15.9 10.7L13 21.2C12.9 21.7 13.2 22 13.7 22H16.1C16.5 22 16.8 21.7 16.9 21.3L17.6 21.2ZM23.2 10.1C22.7 10.1 22.3 10.4 22.2 10.8L19.3 21.2C19.2 21.7 19.5 22 20 22H22.4C22.8 22 23.1 21.7 23.2 21.3L26.1 10.8C26.2 10.3 25.9 10 25.4 10H23.2ZM32.2 10.1C31.7 10.1 31.3 10.4 31.2 10.8L28.3 21.2C28.2 21.7 28.5 22 29 22H31.4C31.8 22 32.1 21.7 32.2 21.3L35.1 10.8C35.2 10.3 34.9 10 34.4 10H32.2Z"
        fill="#1A1F71"
      />
      <path
        d="M36.5 10.1C36.1 10.1 35.8 10.4 35.7 10.8L32.8 21.2C32.7 21.7 33 22 33.5 22H35.9C36.3 22 36.6 21.7 36.7 21.3L39.6 10.8C39.7 10.3 39.4 10 38.9 10H36.5Z"
        fill="#1A1F71"
      />
    </g>
  </svg>
);

export const MastercardIcon = ({ className = "w-6 h-6" }) => (
  <svg
    className={className}
    viewBox="0 0 48 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="32" rx="6" fill="#fff" />
    <circle cx="20" cy="16" r="9" fill="#EB001B" />
    <circle cx="28" cy="16" r="9" fill="#F79E1B" />
    <path d="M24 7a9 9 0 0 0 0 18a9 9 0 0 0 0-18z" fill="#FF5F00" />
  </svg>
);

export const CardIcon = ({ type, className = "w-6 h-6" }) => {
  switch (type?.toLowerCase()) {
    case "visa":
      return <VisaIcon className={className} />;
    case "mastercard":
      return <MastercardIcon className={className} />;
    default:
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="24" rx="4" fill="#6B7280" />
          <path d="M4 8H20V10H4V8Z" fill="white" />
          <path d="M4 12H16V14H4V12Z" fill="white" />
          <path d="M4 16H12V18H4V16Z" fill="white" />
        </svg>
      );
  }
};
