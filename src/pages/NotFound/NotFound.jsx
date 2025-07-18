import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-svh flex items-center justify-center p-6 md:p-10">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl mx-auto"
      >
        <div className="relative p-8 md:p-12">
          <div className="text-center">
            {/* Main Illustration */}
            <motion.div whileHover="hover" className="mb-8 flex justify-center">
              <motion.div
                variants={floatingVariants}
                animate="animate"
                className="relative"
              >
                <img
                  src="/404 Error Page not Found with people connecting a plug-cuate.svg"
                  alt="Broken Medical Pill"
                  className="w-32 h-32 md:w-80 md:h-80 drop-shadow-lg"
                />
              </motion.div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-4 leading-tight"
            >
              Oops! This <span className="text-primary"> shelf is empty!</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              The page you're looking for seems to have expired or been moved
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="bg-primary hover:bg-primary-hover hover:text-white text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Go Back
              </Button>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              variants={itemVariants}
              className="mt-12 pt-8 border-t border-gray-200"
            >
              <p className="text-sm text-gray-500 mb-4">
                Need help finding something? Try these popular pages:
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/auth/login")}
                  className="text-sm text-gray-600 hover:text-primary hover:bg-primary/10 cursor-pointer"
                >
                  Login
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/signup")}
                  className="text-sm text-gray-600 hover:text-primary hover:bg-primary/10 cursor-pointer"
                >
                  Sign Up
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/contact-us")}
                  className="text-sm text-gray-600 hover:text-primary hover:bg-primary/10 cursor-pointer"
                >
                  Contact Us
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
