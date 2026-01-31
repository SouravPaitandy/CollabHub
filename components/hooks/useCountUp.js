import { useEffect, useState } from "react";
import { useSpring, useMotionValue } from "framer-motion";

export const useCountUp = (to, duration = 1.5) => {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 20,
    stiffness: 100,
    duration: duration * 1000,
  });
  const [value, setValue] = useState(0);

  useEffect(() => {
    motionValue.set(to);
  }, [to, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setValue(Math.round(latest));
    });
    return () => unsubscribe();
  }, [springValue]);

  return value;
};
