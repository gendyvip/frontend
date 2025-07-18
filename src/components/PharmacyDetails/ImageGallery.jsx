import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Camera } from "lucide-react";

export default function ImageGallery({ images = [] }) {
  const [mainIndex, setMainIndex] = useState(0);

  if (!images.length) {
    return (
      <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center rounded-2xl border border-gray-200">
        <div className="text-center">
          <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <span className="text-gray-500 font-medium">No Images Available</span>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setMainIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setMainIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Image Container */}
      <div className="relative group">
        <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
          <img
            src={images[mainIndex]}
            alt={`Pharmacy ${mainIndex + 1}`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
          {mainIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails Grid */}
      <div className="grid grid-cols-5 gap-3">
        {images.slice(0, 5).map((img, idx) => (
          <button
            key={img + idx}
            onClick={() => setMainIndex(idx)}
            className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-102 cursor-pointer ${
              mainIndex === idx
                ? "border-primary shadow-lg"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <img
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
