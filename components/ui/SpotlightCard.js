import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { useEffect } from "react";

export const SpotlightCard = ({
  children,
  className = "",
  spotlightColor = "rgba(99, 102, 241, 0.25)",
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const backgroundStyle = useMotionTemplate`
    radial-gradient(
      800px circle at ${mouseX}px ${mouseY}px,
      ${spotlightColor},
      transparent 80%
    )
  `;

  return (
    <div
      className={`group relative border border-white/[0.08] bg-black/40 dark:bg-black/40 backdrop-blur-2xl overflow-hidden rounded-2xl ${className}`}
      onMouseMove={handleMouseMove}
    >
      {/* Animated Gradient Border Layer - Subtler liquid edge */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Spotlight Effect with Liquid Blur */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 group-hover:opacity-100 z-10"
        style={{
          background: backgroundStyle,
        }}
      />

      {/* Content - Ensure it sits above effects */}
      <div className="relative h-full z-20">{children}</div>
    </div>
  );
};

export default SpotlightCard;
