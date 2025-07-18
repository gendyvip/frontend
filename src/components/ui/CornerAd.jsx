import React, { useState, useEffect } from "react";
import { X, ExternalLink, Star } from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { getAllAds } from "../../api/ads";

const CornerAd = ({ position = "dealDetails" }) => {
  const [ads, setAds] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getAllAds()
      .then((allAds) => {
        if (!isMounted) return;
        // Filter ads by position prop
        const filtered = allAds.filter((ad) =>
          Array.isArray(ad.targetPosition)
            ? ad.targetPosition.includes(position)
            : ad.targetPosition === position
        );
        setAds(filtered);
        setCurrentAdIndex(0);
        setLoading(false);
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [position]);

  useEffect(() => {
    if (ads.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prev) => (prev + 1) % ads.length);
      }, 5000); // Change ad every 5 seconds
      return () => clearInterval(interval);
    }
  }, [ads.length]);

  if (loading || !isVisible || !ads.length) return null;

  const currentAd = ads[currentAdIndex] || ads[0];

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleClick = () => {
    if (currentAd.link) {
      window.open(currentAd.link, "_blank");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div
        className={`bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 ${
          isExpanded ? "w-80" : "w-72"
        }`}
      >
        {/* Header */}
        <div className="relative">
          <img
            src={currentAd.imageUrl}
            alt={currentAd.title}
            className="w-full h-32 object-cover"
          />

          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExpand}
              className="h-6 w-6 p-0 bg-white/90 hover:bg-white"
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0 bg-white/90 hover:bg-white"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="font-semibold text-sm text-gray-900 mb-1">
            {currentAd.title}
          </h3>
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
            {currentAd.description}
          </p>
          {currentAd.link ? (
            <Button
              onClick={handleClick}
              className="w-full h-8 text-xs font-medium"
              size="sm"
            >
              Learn More
            </Button>
          ) : null}
        </div>

        {/* Dots indicator */}
        {ads.length > 1 && (
          <div className="flex justify-center gap-1 pb-3">
            {ads.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentAdIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentAdIndex ? "bg-primary" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CornerAd;
