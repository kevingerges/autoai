import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Plus, X } from "lucide-react";

const faqs = [
  {
    question: "How long does setup take?",
    answer:
      "AutoAI can be set up in 10-15 minutes. Simply connect your communication channels, configure your preferences, and you're ready to go. Our team provides onboarding support to ensure a smooth start.",
  },
  {
    question: "What happens when AI can't handle a conversation?",
    answer:
      "AutoAI seamlessly hands off to a human agent when it detects complex situations or when customers specifically request human assistance. The handoff includes a complete context briefing so your team can pick up right where the AI left off.",
  },
  {
    question: "Can we customize the AI's responses?",
    answer:
      "Absolutely! You can customize playbooks, adjust the AI's tone and personality, add your dealership's specific information, and create custom responses for common scenarios. The AI learns from your preferences over time.",
  },
  {
    question: "What channels does AutoAI support?",
    answer:
      "AutoAI supports SMS, web chat, Facebook Messenger, Instagram DM, WhatsApp, email, and more. We're constantly adding new channels. All conversations sync to a unified inbox for easy management.",
  },
  {
    question: "Is there a contract?",
    answer:
      "No long-term contracts required. We offer month-to-month billing, and you can cancel anytime. For annual plans, we offer a 20% discount with a 30-day money-back guarantee.",
  },
  {
    question: "How is pricing calculated?",
    answer:
      "Pricing is based on the number of locations, users, and monthly conversation volume. Each plan includes a set number of conversations, and you can purchase additional capacity as needed.",
  },
  {
    question: "Can we try it before committing?",
    answer:
      "Yes! We offer a free 14-day trial with full access to all features. No credit card required to start. You can experience the full power of AutoAI risk-free before making any commitment.",
  },
  {
    question: "What kind of support do you offer?",
    answer:
      "Support varies by plan: Starter includes email support, Growth includes priority support with faster response times, and Enterprise includes a dedicated account manager and SLA guarantees. All plans include access to our knowledge base and community.",
  },
];

export const FAQ = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="py-24 lg:py-40 bg-gray-50 noise-texture border-t border-border"
    >
      <div className="container-max section-padding">
        {/* Section Header */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-h3 md:text-h2 font-medium text-foreground tracking-tight text-center mb-16"
        >
          Frequently Asked Questions
        </motion.h2>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
            >
              <div
                className={`bg-background rounded-xl border transition-colors duration-200 ${
                  openIndex === index ? "border-gray-300" : "border-border"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left hover:bg-gray-50/50 transition-colors rounded-xl"
                >
                  <span className="text-body md:text-body-lg font-medium text-foreground pr-4">
                    {faq.question}
                  </span>
                  <div
                    className={`flex-shrink-0 w-6 h-6 flex items-center justify-center transition-transform duration-300 ${
                      openIndex === index ? "rotate-45" : ""
                    }`}
                  >
                    <Plus className="w-5 h-5 text-foreground" />
                  </div>
                </button>

                <motion.div
                  initial={false}
                  animate={{
                    height: openIndex === index ? "auto" : 0,
                    opacity: openIndex === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 md:px-8 pb-6 md:pb-8 pt-0">
                    <div className="border-t border-gray-100 pt-5">
                      <p className="text-body text-gray-500 leading-relaxed max-w-2xl">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
