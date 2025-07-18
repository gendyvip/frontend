import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { getAllAds } from "../../api/ads";

function AdsSliderSkeleton() {
  return (
    <div className="w-full bg-gray-50">
      <div className="w-full">
        <div className="relative w-full h-[400px] rounded-2xl overflow-hidden bg-gray-200 animate-pulse">
          <div
            className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"
            style={{ backgroundSize: "200% 100%" }}
          />
        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite linear;
        }
      `}</style>
    </div>
  );
}

export default function AdsSlider({ position }) {
  const [ads, setAds] = useState([]);
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
        setLoading(false);
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [position]);

  if (loading) {
    return <AdsSliderSkeleton />;
  }
  if (!ads.length) {
    return null;
  }

  return (
    <div className="w-full bg-gray-50">
      <div className="w-full ">
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          loop
          modules={[Autoplay, Navigation, Pagination]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          pagination={{
            clickable: true,
            el: ".swiper-pagination",
          }}
          allowTouchMove={true}
          className="main-ads-swiper"
        >
          {ads.map((ad) => (
            <SwiperSlide key={ad.id}>
              <div className="relative w-full h-[400px] overflow-hidden">
                <img
                  src={ad.imageUrl}
                  alt={ad.imageAlt || ad.title}
                  className="w-full h-full object-cover object-center"
                />
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/30" />

                {/* Content overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white max-w-4xl mx-auto px-6">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                      {ad.title}
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-200 mb-6 drop-shadow-lg">
                      {ad.subtitle}
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      <span className="text-lg font-medium drop-shadow-lg">
                        {ad.companyName}
                      </span>
                      {ad.link && (
                        <a
                          href={ad.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                          Learn More
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}

          {/* Custom Navigation Arrows */}
          <div className="swiper-button-prev !text-white !w-12 !h-12 !bg-transparent  rounded-full transition-colors"></div>
          <div className="swiper-button-next !text-white !w-12 !h-12 !bg-transparent  rounded-full transition-colors"></div>

          {/* Custom Pagination */}
          <div className="swiper-pagination !bottom-6"></div>
        </Swiper>
      </div>
    </div>
  );
}
