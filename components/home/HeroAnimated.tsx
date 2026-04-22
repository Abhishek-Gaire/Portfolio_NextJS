"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export default function HeroAnimated() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
    >
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="flex flex-col items-center space-y-2 text-gray-400"
      >
        <span className="text-sm">Scroll to explore</span>
        <ArrowDown className="w-5 h-5" />
      </motion.div>
    </motion.div>
  );
}