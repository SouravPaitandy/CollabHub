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
      className={`group relative border border-white/5 bg-gray-900/40 overflow-hidden rounded-2xl ${className}`}
      onMouseMove={handleMouseMove}
    >
      {/* Animated Gradient Border Layer */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-500/0 via-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:via-purple-500/5 group-hover:to-indigo-500/10 transition-all duration-700" />

      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 group-hover:opacity-100 z-10"
        style={{
          background: backgroundStyle,
        }}
      />

      {/* Content */}
      <div className="relative h-full z-20">{children}</div>
    </div>
  );
};

export default SpotlightCard;
