import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BootScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const progressRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    let pct = 0;
    progressRef.current = window.setInterval(() => {
      pct += 1.6;
      setProgress(Math.min(pct, 100));
      if (pct >= 100) {
        window.clearInterval(progressRef.current);
        window.setTimeout(() => {
          setExiting(true);
          window.setTimeout(() => onCompleteRef.current?.(), 850);
        }, 350);
      }
    }, 28);

    return () => window.clearInterval(progressRef.current);
  }, []);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85, ease: "easeInOut" }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            boxSizing: "border-box", padding: "24px 16px",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "clamp(16px, 4vh, 32px)",
            background: "#000", overflow: "hidden", userSelect: "none",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <img src="/navbar-icons/apple.svg" alt="" width="52" height="68" draggable="false" style={{ display: "block", maxWidth: "100%", height: "auto" }} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ textAlign: "center" }}
          >
            <p style={{ color: "#fff", fontSize: "clamp(22px, 7vw, 28px)", fontWeight: 200, letterSpacing: "0.14em", margin: 0 }}>
              HarshitOS
            </p>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", marginTop: 6, fontWeight: 300 }}>
              Developer Portfolio
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scaleX: 0.5 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            style={{ width: "min(200px, 70vw)" }}
          >
            <div style={{ width: "100%", height: 4, borderRadius: 999, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
              <motion.div style={{ height: "100%", borderRadius: 999, background: "rgba(255,255,255,0.88)", width: `${progress}%` }} />
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.18 }}
            transition={{ duration: 1.5, delay: 1 }}
            style={{ position: "absolute", left: 16, right: 16, bottom: "max(16px, env(safe-area-inset-bottom))", margin: 0, textAlign: "center", color: "#fff", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 300, lineHeight: 1.5, overflowWrap: "anywhere" }}
          >
            Designed &amp; Built by Harshit Tiwari
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BootScreen;
