import { motion } from "framer-motion";
import { ArrowRight, Play, MessageSquare, Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const trustLogos = ["BMW", "Mercedes", "Toyota", "Ford", "Chevrolet"];

export const Hero = () => {
  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-background via-background to-gray-50 opacity-60" />
      <div className="absolute inset-0 grid-pattern opacity-40" />

      <div className="relative container-max section-padding">
        <div className="max-w-4xl mx-auto text-center">
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-eyebrow uppercase text-gray-400 tracking-widest mb-6"
          >
            AI-Powered Sales Assistant
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-display font-medium text-foreground tracking-tight mb-6"
          >
            <span className="block">One Salesperson.</span>
            <span className="block">Twenty Conversations.</span>
            <span className="block">Zero Compromise.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-body-lg text-gray-500 max-w-2xl mx-auto mb-10"
          >
            AutoAI handles customer conversations on autopilot—remembering context,
            applying proven sales techniques, and closing deals across every channel
            while your team focuses on what matters.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link to="/demo">
              <Button variant="primary" size="lg" className="group w-full sm:w-auto">
                Try Live Demo
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo Video
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-16"
          >
            <p className="text-body-sm text-gray-400 mb-6">
              Trusted by 100+ dealerships nationwide
            </p>
            <div className="flex items-center justify-center gap-8 flex-wrap">
              {trustLogos.map((logo) => (
                <span
                  key={logo}
                  className="text-body-sm font-medium text-gray-300 opacity-60"
                >
                  {logo}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Hero Visual - Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="relative rounded-2xl border border-border bg-background shadow-card overflow-hidden animate-float">
            {/* Dashboard Header */}
            <div className="flex items-center gap-2 p-4 border-b border-border bg-gray-50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-gray-300" />
                <div className="w-3 h-3 rounded-full bg-gray-300" />
                <div className="w-3 h-3 rounded-full bg-gray-300" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-md bg-gray-100 text-caption text-gray-500">
                  dashboard.autoai.com
                </div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-6 bg-gray-50/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Stats Cards */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="bg-background rounded-xl p-4 border border-border"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <MessageSquare className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-caption text-gray-500">Active Chats</span>
                  </div>
                  <span className="text-h4 text-foreground">18</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="bg-background rounded-xl p-4 border border-border"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-success/10">
                      <CheckCircle className="h-4 w-4 text-success" />
                    </div>
                    <span className="text-caption text-gray-500">Deals Closed</span>
                  </div>
                  <span className="text-h4 text-foreground">12</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="bg-background rounded-xl p-4 border border-border"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-warning/10">
                      <Users className="h-4 w-4 text-warning" />
                    </div>
                    <span className="text-caption text-gray-500">Response Rate</span>
                  </div>
                  <span className="text-h4 text-foreground">92%</span>
                </motion.div>
              </div>

              {/* Conversation Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3 }}
                  className="bg-background rounded-xl p-4 border border-border"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200" />
                    <div>
                      <p className="text-body-sm font-medium text-foreground">John D.</p>
                      <p className="text-caption text-gray-400">Toyota Camry 2024</p>
                    </div>
                    <span className="ml-auto px-2 py-0.5 rounded-full bg-success/10 text-success text-caption">
                      Active
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="px-3 py-2 rounded-lg bg-gray-100 text-body-sm text-gray-600 max-w-[80%]">
                        Is the Camry still available?
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <div className="px-3 py-2 rounded-lg bg-foreground text-body-sm text-background max-w-[80%]">
                        Yes! Would you like to schedule a test drive?
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4 }}
                  className="bg-background rounded-xl p-4 border border-border"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200" />
                    <div>
                      <p className="text-body-sm font-medium text-foreground">Sarah M.</p>
                      <p className="text-caption text-gray-400">Honda Accord 2023</p>
                    </div>
                    <span className="ml-auto px-2 py-0.5 rounded-full bg-accent/10 text-accent text-caption">
                      Typing...
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="px-3 py-2 rounded-lg bg-gray-100 text-body-sm text-gray-600 max-w-[80%]">
                        What financing options do you have?
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end items-center">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse-soft" />
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse-soft delay-100" />
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse-soft delay-200" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
