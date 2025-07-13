import React from "react";
import {
  Heart,
  Shield,
  GraduationCap,
  ShoppingBag,
  Car,
  Wifi,
} from "lucide-react";

export default function AreaRatings() {
  const ratings = [
    {
      icon: Heart,
      label: "Health",
      score: 8.5,
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
    {
      icon: Shield,
      label: "Safety",
      score: 9.2,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      icon: GraduationCap,
      label: "Education",
      score: 7.8,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: ShoppingBag,
      label: "Shopping",
      score: 8.9,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      icon: Car,
      label: "Transportation",
      score: 8.1,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      icon: Wifi,
      label: "Connectivity",
      score: 9.0,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
    },
  ];

  const getScoreColor = (score) => {
    if (score >= 9) return "text-green-600";
    if (score >= 8) return "text-blue-600";
    if (score >= 7) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score) => {
    if (score >= 9) return "bg-green-100";
    if (score >= 8) return "bg-blue-100";
    if (score >= 7) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Heart className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Area Ratings</h2>
          <p className="text-sm text-gray-500">Community quality scores</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {ratings.map((rating, index) => {
          const IconComponent = rating.icon;
          return (
            <div
              key={index}
              className={`p-4 rounded-xl border border-gray-100 ${rating.bgColor}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-8 h-8 rounded-lg bg-white flex items-center justify-center`}
                >
                  <IconComponent className={`w-4 h-4 ${rating.color}`} />
                </div>
                <span className="font-medium text-gray-900">
                  {rating.label}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={`px-2 py-1 rounded-full text-sm font-bold ${getScoreColor(
                    rating.score
                  )} ${getScoreBg(rating.score)}`}
                >
                  {rating.score}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getScoreBg(rating.score)
                      .replace("bg-", "bg-")
                      .replace("-100", "-500")}`}
                    style={{ width: `${(rating.score / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall Score */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-600 font-medium">
              Overall Area Score
            </p>
            <p className="text-2xl font-bold text-blue-900">8.6/10</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-600">Excellent</p>
            <p className="text-xs text-blue-500">Based on 6 categories</p>
          </div>
        </div>
      </div>
    </div>
  );
}
