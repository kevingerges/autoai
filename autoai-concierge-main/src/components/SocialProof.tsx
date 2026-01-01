import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface StatProps {
  value: string;
  suffix?: string;
  label: string;
  description: string;
  delay?: number;
}

const AnimatedStat = ({ value, suffix, label, description, delay = 0 }: StatProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (isInView) {
      const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""));
      const duration = 1500;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);

        if (value.includes("×")) {
          setDisplayValue(`${(numericValue * easeOut).toFixed(1)}×`);
        } else if (value.includes("%")) {
          setDisplayValue(`${Math.round(numericValue * easeOut)}%`);
        } else if (value === "24/7") {
          setDisplayValue(progress > 0.5 ? "24/7" : "0/0");
        } else {
          setDisplayValue(value);
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayValue(value);
        }
      };

      const timer = setTimeout(() => {
        requestAnimationFrame(animate);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isInView, value, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: delay / 1000 }}
      className="text-center"
    >
      <div className="text-h1 md:text-display font-medium text-foreground tracking-tight mb-2">
        {displayValue}
        {suffix && <span className="text-gray-400">{suffix}</span>}
      </div>
      <p className="text-body font-medium text-foreground mb-1">{label}</p>
      <p className="text-body-sm text-gray-400 max-w-[240px] mx-auto">{description}</p>
    </motion.div>
  );
};

const stats = [
  {
    value: "20×",
    label: "Conversation Capacity",
    description: "Each salesperson handles 20+ conversations simultaneously",
  },
  {
    value: "92%",
    label: "Response Rate",
    description: "Never miss a customer inquiry, day or night",
  },
  {
    value: "3.2×",
    label: "Deal Velocity",
    description: "Close deals faster with AI-assisted conversations",
  },
  {
    value: "24/7",
    label: "Always Available",
    description: "No holidays, no sick days, no overtime",
  },
];

export const SocialProof = () => {
  return (
    <section className="relative py-24 lg:py-32 bg-gray-50 noise-texture border-t border-border">
      <div className="relative z-10 container-max section-padding">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {stats.map((stat, index) => (
            <AnimatedStat
              key={stat.label}
              {...stat}
              delay={index * 150}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
