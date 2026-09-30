"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

import { usePrefersReducedMotion } from "@/components/motion/usePrefersReducedMotion";

export default function HeroAnimated() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className="mt-10 flex justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col items-center gap-2 text-low"
      >
        <motion.span
          animate={reducedMotion ? undefined : { y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-sm">Scroll to explore</span>
          <ArrowDown className="h-5 w-5" />
        </motion.span>
      </motion.div>
    </div>
  );
}
