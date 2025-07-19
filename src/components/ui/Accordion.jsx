import React, { useState } from "react";

export default function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="w-full rounded-xl border bg-white/80 shadow-sm divide-y">
      {items.map((item, idx) => (
        <div key={idx}>
          <button
            className={`flex w-full items-center justify-between px-6 py-4 text-left font-medium text-gray-900 transition-colors hover:bg-gray-50 focus:outline-none ${
              openIndex === idx ? "bg-gray-50" : ""
            }`}
            onClick={() => toggle(idx)}
            aria-expanded={openIndex === idx}
          >
            <span>{item.title}</span>
            <svg
              className={`w-4 h-4 ml-2 transition-transform ${
                openIndex === idx ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {openIndex === idx && (
            <div className="px-6 pb-4 text-gray-700 animate-fade-in">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
