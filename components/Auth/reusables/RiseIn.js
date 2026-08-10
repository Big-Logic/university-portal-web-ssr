"use client";

import { motion } from "framer-motion";

/**
 * The entrance every auth card makes: a short rise and fade, once, on
 * mount. All three shells had their own copy of these numbers.
 *
 * It wraps the card rather than being applied to the card itself so the
 * animation belongs to the mount and not to the contents -- the panel
 * inside can swap (form to confirmation, form to dead link) without
 * replaying it.
 */
export default function RiseIn({ maxWidth, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{ width: "100%", maxWidth }}
    >
      {children}
    </motion.div>
  );
}
