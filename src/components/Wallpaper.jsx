import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Wallpaper = ({ currentWallpaper = "/images/stranger-things-3840x2160-18568.jpg" }) => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden bg-black">
      <AnimatePresence mode="popLayout">
        <motion.img
          key={currentWallpaper}
          src={currentWallpaper}
          initial={{ opacity: 0.4, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.4 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="w-full h-full object-cover select-none"
          alt="macOS Desktop Wallpaper"
          draggable={false}
        />
      </AnimatePresence>
      {/* Subtle dark vignette overlay for readability */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />
    </div>
  );
};

export default Wallpaper;
