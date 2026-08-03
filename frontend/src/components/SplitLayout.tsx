import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import VideoBackground from "./VideoBackground";

interface SplitLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
  isLogin: boolean;
}

export default function SplitLayout({
  children,
  title,
  subtitle,
  description,
  buttonText,
  onButtonClick,
  isLogin,
}: SplitLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <VideoBackground isLogin={isLogin} />

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        {/* Less glossy glass card */}
        <motion.div
          initial={{ x: isLogin ? 0 : "100%" }}
          animate={{ x: 0 }}
          transition={{
            duration: 0.6,
            type: "spring",
            stiffness: 100,
            damping: 20,
          }}
          className={`w-full lg:w-1/2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-white/30 dark:border-gray-800 shadow-xl overflow-y-auto ${
            isLogin
              ? "order-1 lg:order-1 rounded-r-3xl"
              : "order-2 lg:order-2 rounded-l-3xl"
          }`}
        >
          <div className="flex items-center justify-center min-h-screen p-8">
            <div className="w-full max-w-md">{children}</div>
          </div>
        </motion.div>

        {/* Video side content (unchanged) */}
        <div
          className={`w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 ${
            isLogin ? "order-2 lg:order-2" : "order-1 lg:order-1"
          }`}
        >
          <div className="absolute top-6 left-6 z-20">
            <button
              onClick={() => navigate("/")}
              className="group flex items-center gap-2 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full pl-2.5 pr-2.5 py-1.5 transition-all duration-300 hover:pr-4"
            >
              <ArrowLeft size={18} className="text-white shrink-0" />
              <span className="max-w-0 overflow-hidden whitespace-nowrap text-white text-sm transition-all duration-300 group-hover:max-w-xs group-hover:ml-1">
                Retour à l'accueil
              </span>
            </button>
          </div>

          <div className="text-center text-white max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h2 style={{ fontFamily: 'Goodly' }} className="text-4xl md:text-5xl font-bold mb-4">{title}</h2>
              <p className="text-xl md:text-2xl text-gray-200 mb-6">
                {subtitle}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <p className="text-base md:text-lg text-gray-200 mb-8">
                {description}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <button
                onClick={onButtonClick}
                className="px-6 py-2 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-transform transform hover:scale-105 shadow-lg"
              >
                {buttonText}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
