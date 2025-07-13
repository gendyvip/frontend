import React from "react";
import { MapPin, ExternalLink, Navigation } from "lucide-react";

export default function MapSection({ location, address }) {
  if (!location?.coordinates || location.coordinates.length < 2) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Location</h2>
            <p className="text-sm text-gray-500">
              Pharmacy location and address
            </p>
          </div>
        </div>

        <div className="w-full h-64 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              No Map Location Available
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Location coordinates not provided
            </p>
          </div>
        </div>

        {address && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Address</p>
            <p className="text-gray-900 font-medium">{address}</p>
          </div>
        )}
      </div>
    );
  }

  const [lng, lat] = location.coordinates;
  const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
          <MapPin className="w-5 h-5 text-gray-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Location</h2>
          <p className="text-sm text-gray-500">Pharmacy location and address</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Map */}
        <div className="w-full h-80 rounded-xl overflow-hidden shadow-sm border border-gray-200 relative">
          <iframe
            title="Pharmacy Location"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`}
          ></iframe>
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-sm border border-gray-200 p-2">
            <MapPin className="w-5 h-5 text-gray-600" />
          </div>
        </div>

        {/* Address and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {address && (
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Address</p>
              <p className="text-gray-900 font-medium">{address}</p>
            </div>
          )}

          <div className="flex gap-3">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors border border-gray-200"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="text-sm font-medium">View on Maps</span>
            </a>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors border border-blue-200"
            >
              <Navigation className="w-4 h-4" />
              <span className="text-sm font-medium">Get Directions</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
