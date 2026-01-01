import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const plans = [
  {
    name: "Starter",
    monthlyPrice: 499,
    annualPrice: 399,
    description: "Perfect for single-location dealerships getting started with AI",
    features: [
      { category: "Basics", items: ["1 location", "Up to 5 salespeople", "100 conversations/month"] },
      { category: "Channels", items: ["SMS & Web Chat"] },
      { category: "Integrations", items: ["Basic integrations"] },
      { category: "Support", items: ["Email support"] },
    ],
    popular: false,
  },
  {
    name: "Growth",
    monthlyPrice: 999,
    annualPrice: 799,
    description: "For growing dealerships ready to scale their sales operations",
    features: [
      { category: "Basics", items: ["Up to 3 locations", "Up to 15 salespeople", "500 conversations/month"] },
      { category: "Channels", items: ["All channels (SMS, social, web, email)"] },
      { category: "Integrations", items: ["Advanced integrations (CRM, DMS)"] },
      { category: "Features", items: ["Custom playbooks", "Analytics dashboard"] },
      { category: "Support", items: ["Priority support"] },
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    monthlyPrice: null,
    annualPrice: null,
    description: "Custom solutions for large dealership groups and franchises",
    features: [
      { category: "Basics", items: ["Unlimited locations", "Unlimited users", "Unlimited conversations"] },
      { category: "Features", items: ["White-label options", "Custom integrations", "Advanced analytics"] },
      { category: "Support", items: ["Dedicated account manager", "SLA guarantees"] },
    ],
    popular: false,
  },
];

export const Pricing = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="py-24 lg:py-40 bg-background border-t border-border"
    >
      <div className="container-max section-padding">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-eyebrow uppercase text-gray-400 tracking-widest mb-4"
          >
            Pricing
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-h3 md:text-h2 font-medium text-foreground tracking-tight mb-4"
          >
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-body-lg text-gray-500"
          >
            Choose the plan that fits your dealership size
          </motion.p>
        </div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-center gap-4 mb-16"
        >
          <span className={`text-body ${!isAnnual ? "text-foreground font-medium" : "text-gray-400"}`}>
            Monthly
          </span>
          <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
          <span className={`text-body ${isAnnual ? "text-foreground font-medium" : "text-gray-400"}`}>
            Annually
          </span>
          {isAnnual && (
            <span className="text-caption font-medium text-success bg-success/10 px-2 py-1 rounded-md">
              Save 20%
            </span>
          )}
        </motion.div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              className={`relative ${plan.popular ? "lg:-mt-4 lg:mb-4" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-foreground text-background text-caption font-medium px-4 py-1.5 rounded-lg">
                  Most Popular
                </div>
              )}

              <div
                className={`h-full rounded-2xl p-8 flex flex-col ${
                  plan.popular
                    ? "bg-background border-2 border-foreground shadow-strong"
                    : "bg-gray-50 border border-border"
                }`}
              >
                {/* Plan Name */}
                <p className="text-eyebrow uppercase text-gray-400 tracking-widest mb-4">
                  {plan.name}
                </p>

                {/* Price */}
                <div className="mb-2">
                  {plan.monthlyPrice ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-h1 font-medium text-foreground tracking-tight">
                        ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                      </span>
                      <span className="text-h6 text-gray-400">/mo</span>
                    </div>
                  ) : (
                    <span className="text-h2 font-medium text-foreground">Custom</span>
                  )}
                </div>
                <p className="text-body-sm text-gray-400 mb-2">
                  {plan.monthlyPrice
                    ? isAnnual
                      ? "Billed annually"
                      : "Billed monthly"
                    : "Contact for pricing"}
                </p>

                {/* Description */}
                <p className="text-body-sm text-gray-500 mb-6">{plan.description}</p>

                {/* CTA */}
                <Button
                  variant={plan.popular ? "primary" : "outline"}
                  className="w-full mb-8 group"
                >
                  {plan.monthlyPrice ? "Start Free Trial" : "Contact Sales"}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>

                {/* Features */}
                <div className="flex-1 border-t border-border pt-6 space-y-6">
                  {plan.features.map((category) => (
                    <div key={category.category}>
                      <p className="text-eyebrow uppercase text-gray-400 tracking-wider mb-3 text-xs">
                        {category.category}
                      </p>
                      <ul className="space-y-3">
                        {category.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-3 text-body-sm text-gray-600"
                          >
                            <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-14"
        >
          <p className="text-body-sm text-gray-500">
            Have questions about pricing?{" "}
            <a href="#faq" className="text-foreground font-medium link-underline">
              View FAQ
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};
