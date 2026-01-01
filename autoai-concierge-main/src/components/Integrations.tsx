import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  MessageCircle,
  Smartphone,
  MessageSquare,
  Instagram,
  Mail,
  Globe,
  MessagesSquare,
  Apple,
} from "lucide-react";

const platforms = [
  { name: "Facebook Messenger", icon: MessageCircle, status: "live" },
  { name: "SMS", icon: Smartphone, status: "live" },
  { name: "WhatsApp", icon: MessageSquare, status: "live" },
  { name: "Instagram DM", icon: Instagram, status: "live" },
  { name: "Email", icon: Mail, status: "live" },
  { name: "Web Chat", icon: Globe, status: "live" },
  { name: "Google Business", icon: MessagesSquare, status: "coming" },
  { name: "Apple Business", icon: Apple, status: "coming" },
];

const orbitIcons = [
  Mail,
  Instagram,
  Globe,
  MessageCircle,
  Smartphone,
  MessageSquare,
];

const IntegrationsOrbit = () => {
  return (
    <div className="flex flex-col items-center justify-center pt-0 pb-0 -mt-4">
      {/* Container - Further reduced size */}
      <div className="relative flex items-center justify-center w-[200px] h-[200px]">
        {/* Inner A (Static Center) - Scaled down */}
        <div className="z-10 w-20 h-20 bg-black rounded-[24px] flex items-center justify-center shadow-2xl relative">
          <span className="text-white text-3xl font-light font-sans tracking-tight">A</span>
        </div>

        {/* Orbiting Ring */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        >
          {orbitIcons.map((Icon, index) => {
            const total = orbitIcons.length;
            const angle = (index * 360) / total;
            const radius = 80; // Further reduced radius

            return (
              <div
                key={index}
                className="absolute top-1/2 left-1/2 w-10 h-10 -ml-5 -mt-5 bg-white rounded-xl shadow-[0_4px_16px_rgb(0,0,0,0.08)] border border-slate-100 flex items-center justify-center"
                style={{
                  transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`,
                }}
              >
                {/* Counter-rotation to keep icon upright */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                  className="flex items-center justify-center"
                >
                  <Icon strokeWidth={1.5} className="w-4 h-4 text-slate-600" />
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Text below orbit */}
      <h3 className="mt-6 text-base font-medium text-gray-400 text-center">
        All channels sync to one unified inbox
      </h3>
    </div>
  );
};

export const Integrations = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="integrations"
      ref={sectionRef}
      className="py-24 lg:py-32 bg-background border-t border-border overflow-hidden"
    >
      <div className="container-max section-padding">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-eyebrow uppercase text-gray-400 tracking-widest mb-4"
          >
            Integrations
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-h3 md:text-h2 font-medium text-foreground tracking-tight mb-4"
          >
            Post and Respond Everywhere
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-body-lg text-gray-500"
          >
            Connect your existing channels and manage everything from one place
          </motion.p>
        </div>

        {/* Platform Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-12">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.06 }}
              className="group"
            >
              <div className="aspect-square bg-gray-50 rounded-2xl border border-border p-6 flex flex-col items-center justify-center hover:bg-background hover:border-gray-300 hover-lift transition-all duration-300 cursor-pointer">
                <platform.icon className="w-10 h-10 text-gray-400 group-hover:text-foreground transition-colors duration-300 mb-4" />
                <span className="text-body-sm font-medium text-foreground text-center mb-2">
                  {platform.name}
                </span>
                <span
                  className={`text-caption font-medium px-2 py-0.5 rounded-md ${platform.status === "live"
                      ? "bg-success/10 text-success"
                      : "bg-warning/10 text-warning"
                    }`}
                >
                  {platform.status === "live" ? "Live" : "Coming Soon"}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Integration Hub Visual (Replaced with Custom Orbit) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <IntegrationsOrbit />
        </motion.div>
      </div>
    </section>
  );
};
