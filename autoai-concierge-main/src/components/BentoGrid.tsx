import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  MessageSquare,
  Brain,
  Zap,
  BookOpen,
  LayoutDashboard,
  ShieldCheck,
  CalendarCheck,
  Puzzle,
  Check,
} from "lucide-react";

const features = [
  {
    id: "multi-channel",
    size: "large",
    icon: MessageSquare,
    title: "Multi-Channel Orchestration",
    description:
      "Engage customers wherever they are. AutoAI manages conversations across SMS, web chat, social media, and email—all from one unified interface.",
    features: [
      "Unified inbox for all channels",
      "Auto-routing based on channel preference",
      "Seamless context switching",
      "Real-time sync across platforms",
    ],
  },
  {
    id: "context",
    size: "medium",
    icon: Brain,
    title: "Context Memory",
    description:
      "Every conversation picks up where it left off. AutoAI remembers customer details, preferences, and deal stage across all touchpoints.",
  },
  {
    id: "instant",
    size: "small",
    icon: Zap,
    title: "Instant Responses",
    description: "< 2 second response time. Never leave a customer waiting.",
  },
  {
    id: "playbooks",
    size: "small",
    icon: BookOpen,
    title: "Sales Playbooks",
    description:
      "Built-in best practices from top performers guide every conversation.",
  },
  {
    id: "dashboard",
    size: "large",
    icon: LayoutDashboard,
    title: "Live Dashboard",
    description:
      "Monitor all active conversations, deal progress, and team performance in real-time. Jump in manually whenever needed.",
    features: [
      "Real-time conversation monitoring",
      "One-click manual takeover",
      "Performance analytics",
      "Alert notifications for VIP leads",
    ],
  },
  {
    id: "objection",
    size: "medium",
    icon: ShieldCheck,
    title: "Objection Handling",
    description:
      "Trained on thousands of sales conversations. AutoAI recognizes objections and responds with proven counter-strategies.",
  },
  {
    id: "scheduling",
    size: "small",
    icon: CalendarCheck,
    title: "Smart Scheduling",
    description: "Books test drives and appointments directly from chat conversations.",
  },
  {
    id: "integrations",
    size: "tall",
    icon: Puzzle,
    title: "Integration Ecosystem",
    description:
      "Connects seamlessly with your existing tools. No workflow disruption.",
    integrations: ["Salesforce", "HubSpot", "CDK", "Reynolds", "Twilio"],
  },
];

const getSizeClasses = (size: string) => {
  switch (size) {
    case "large":
      return "col-span-1 md:col-span-2 row-span-1 md:row-span-2";
    case "medium":
      return "col-span-1 md:col-span-2 row-span-1";
    case "tall":
      return "col-span-1 row-span-1 md:row-span-2";
    default:
      return "col-span-1 row-span-1";
  }
};

export const BentoGrid = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="features"
      ref={sectionRef}
      className="py-24 lg:py-40 bg-gray-50 noise-texture border-t border-border"
    >
      <div className="container-max section-padding">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-eyebrow uppercase text-gray-400 tracking-widest mb-4"
          >
            Capabilities
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-h3 md:text-h2 font-medium text-foreground tracking-tight mb-4"
          >
            Everything You Need to Scale Your Sales
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-body-lg text-gray-500"
          >
            Unified platform for multi-channel, context-rich customer
            conversations
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-fr">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
              className={`${getSizeClasses(feature.size)} group`}
            >
              <div className="h-full bg-background rounded-2xl border border-border p-6 md:p-8 hover-lift transition-all duration-300 hover:border-gray-300">
                {/* Icon */}
                <div className="mb-5">
                  <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gray-50 border border-border group-hover:bg-foreground group-hover:border-foreground transition-colors duration-300">
                    <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-foreground group-hover:text-background transition-colors duration-300" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-h6 md:text-h5 font-medium text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-body-sm text-gray-500 leading-relaxed mb-4">
                  {feature.description}
                </p>

                {/* Features List (Large Cards) */}
                {feature.features && (
                  <ul className="space-y-2 mt-4 pt-4 border-t border-border">
                    {feature.features.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-body-sm text-gray-600"
                      >
                        <Check className="w-4 h-4 text-success flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Integrations (Tall Card) */}
                {feature.integrations && (
                  <div className="mt-4 pt-4 border-t border-border space-y-2">
                    {feature.integrations.map((integration) => (
                      <div
                        key={integration}
                        className="flex items-center gap-2 text-body-sm text-gray-600"
                      >
                        <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center">
                          <span className="text-caption font-medium text-gray-500">
                            {integration[0]}
                          </span>
                        </div>
                        {integration}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
