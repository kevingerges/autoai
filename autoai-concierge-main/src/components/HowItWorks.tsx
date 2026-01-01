import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Smartphone, Brain, Handshake, Check } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Smartphone,
    title: "Instant Response",
    description:
      "Customer reaches out through any channel—SMS, chat, social media. AutoAI responds within seconds with contextual, personalized messages.",
    features: [
      "< 2 second response time",
      "Works across all channels",
      "Personalized greetings",
      "Captures lead information",
    ],
  },
  {
    number: "02",
    icon: Brain,
    title: "Context-Aware Conversation",
    description:
      "AutoAI remembers every detail—previous interactions, preferences, deal stage—and applies proven sales methodologies to move conversations forward.",
    features: [
      "Full conversation memory",
      "Sales playbook integration",
      "Objection handling",
      "Sentiment detection",
    ],
  },
  {
    number: "03",
    icon: Handshake,
    title: "Seamless Handoff",
    description:
      "When it's time for a human touch, AutoAI prepares a complete briefing and transfers the conversation with full context preserved.",
    features: [
      "One-click manual takeover",
      "Complete context briefing",
      "Appointment scheduling",
      "Deal stage tracking",
    ],
  },
];

export const HowItWorks = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-24 lg:py-40 bg-background"
    >
      <div className="container-max section-padding">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-24">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-eyebrow uppercase text-gray-400 tracking-widest mb-4"
          >
            The Process
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-h3 md:text-h2 font-medium text-foreground tracking-tight mb-4"
          >
            From Inquiry to Close, Completely Automated
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-body-lg text-gray-500"
          >
            AutoAI orchestrates every step of the sales conversation with
            context-aware intelligence
          </motion.p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          {/* Connection lines (desktop only) */}
          <div className="hidden lg:block absolute top-32 left-1/3 right-1/3 h-px">
            <svg className="w-full h-8" preserveAspectRatio="none">
              <path
                d="M0,16 L100%,16"
                stroke="hsl(var(--border))"
                strokeWidth="2"
                strokeDasharray="8 8"
                fill="none"
              />
            </svg>
          </div>

          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.2 }}
              className="group relative"
            >
              <div className="relative bg-gray-50 rounded-2xl p-8 lg:p-10 border border-border hover-lift h-full">
                {/* Large Step Number */}
                <span className="absolute top-6 right-6 text-[120px] font-light text-gray-100 leading-none select-none">
                  {step.number}
                </span>

                {/* Icon */}
                <div className="relative z-10 mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-background border border-border">
                    <step.icon className="w-7 h-7 text-foreground" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-h5 font-medium text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-body text-gray-500 mb-6">
                    {step.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3">
                    {step.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-3 text-body-sm text-gray-600"
                      >
                        <Check className="w-4 h-4 text-success flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
