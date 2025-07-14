import React from "react";
import { MapPin, ExternalLink, Navigation, Map } from "lucide-react";

export default function MapSection({ location, address }) {
  if (!location?.coordinates || location.coordinates.length < 2) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
            <MapPin className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Location</h2>
            <p className="text-xs text-gray-500">Pharmacy location</p>
          </div>
        </div>

        <div className="w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 font-medium text-sm">
              No Map Available
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Location coordinates not provided
            </p>
          </div>
        </div>

        {address && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 mb-1 font-medium">Address</p>
            <p className="text-gray-900 text-sm">{address}</p>
          </div>
        )}
      </div>
    );
  }

  const [lng, lat] = location.coordinates;
  const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
            <MapPin className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Location</h2>
            <p className="text-xs text-gray-500">
              Pharmacy location and address
            </p>
          </div>
        </div>

        {/* Address Display */}
        {address && (
          <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-blue-700 font-medium mb-1">Address</p>
              <p className="text-gray-900 text-sm leading-relaxed">{address}</p>
            </div>
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className="relative">
        <div className="w-full h-56 relative overflow-hidden">
          <iframe
            title="Pharmacy Location"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
          ></iframe>

          {/* Map Overlay with Location Pin */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="w-2 h-8 bg-red-500 mx-auto mt-1 relative">
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Overlay */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 rounded-lg transition-all duration-200 shadow-lg border border-gray-200 hover:shadow-xl"
          >
            <ExternalLink className="w-3 h-3" />
            <span className="text-xs font-medium">View</span>
          </a>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 bg-blue-600/90 backdrop-blur-sm hover:bg-blue-600 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Navigation className="w-3 h-3" />
            <span className="text-xs font-medium">Directions</span>
          </a>
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Map className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-600">Interactive map</span>
          </div>
          <div className="text-xs text-gray-500">
            Click buttons for navigation
          </div>
        </div>
      </div>
    </div>
  );
}
