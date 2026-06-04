"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function SplashScreen() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "radial-gradient(circle at center, #111827, #020617)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <motion.div
        initial={{ opacity: 0.4, scale: 0.9 }}
        animate={{
          opacity: [0.4, 1, 0.7, 1],
          scale: [0.9, 1.02, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
        style={{
          textAlign: "center",
        }}
      >
        <Image
          src="/logo.png"
          alt="Aurevia AI"
          width={700}
          height={260}
          priority
          style={{
            objectFit: "contain",
            filter:
              "drop-shadow(0px 0px 40px rgba(192,132,252,0.55))",
          }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 1,
            duration: 1.2,
          }}
          style={{
            marginTop: "20px",
            color: "#d8b4fe",
            letterSpacing: "10px",
            fontSize: "22px",
            fontWeight: 300,
          }}
        >
          AI CAREER ASSISTANT
        </motion.p>
      </motion.div>
    </div>
  );
}