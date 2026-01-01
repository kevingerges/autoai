import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    name: "Michael Chen",
    title: "Sales Manager",
    company: "Premier Auto Group",
    quote:
      "AutoAI handles our after-hours inquiries flawlessly. We went from losing 40% of evening leads to closing deals we never knew existed. It's like having our best salesperson working 24/7.",
    metric: "3.2×",
    metricLabel: "more test drives booked",
  },
  {
    name: "Sarah Williams",
    title: "General Manager",
    company: "Citywide Motors",
    quote:
      "We scaled from 2 to 8 locations without adding a single BDC rep. AutoAI handles the volume we couldn't manage before, and the quality of conversations is remarkable.",
    metric: "400%",
    metricLabel: "increase in handled leads",
  },
  {
    name: "David Rodriguez",
    title: "BDC Director",
    company: "Summit Automotive",
    quote:
      "Our response times dropped from hours to seconds. Customers can't tell they're talking to AI until we tell them. The objection handling is better than some of our junior reps.",
    metric: "92%",
    metricLabel: "customer satisfaction rate",
  },
  {
    name: "Jennifer Park",
    title: "Owner",
    company: "Park Family Dealership",
    quote:
      "As an independent dealership, I couldn't afford a full BDC team. AutoAI gave me enterprise-level capabilities at a fraction of the cost. It paid for itself in the first week.",
    metric: "15×",
    metricLabel: "ROI in first month",
  },
];

export const Testimonials = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="py-24 lg:py-40 bg-gradient-to-b from-gray-50 to-gray-100 border-t border-border"
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
            Customer Stories
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-h3 md:text-h2 font-medium text-foreground tracking-tight mb-4"
          >
            Trusted by Top Dealerships
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-body-lg text-gray-500"
          >
            See how AutoAI transformed their sales operations
          </motion.p>
        </div>

        {/* Testimonial Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation Arrows */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all z-10"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all z-10"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>

          {/* Testimonial Card */}
          <div className="bg-background rounded-2xl border border-border p-8 md:p-14 shadow-soft">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row gap-8 md:gap-12 items-center"
              >
                {/* Customer Info */}
                <div className="text-center md:text-left shrink-0">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gray-200 mx-auto md:mx-0 mb-5" />
                  <h4 className="text-h6 font-medium text-foreground">
                    {currentTestimonial.name}
                  </h4>
                  <p className="text-body-sm text-gray-500">
                    {currentTestimonial.title}
                  </p>
                  <p className="text-body-sm font-medium text-foreground">
                    {currentTestimonial.company}
                  </p>
                </div>

                {/* Quote */}
                <div className="flex-1">
                  <div className="relative">
                    <span className="absolute -top-6 -left-4 text-[80px] font-light text-gray-100 leading-none select-none">
                      "
                    </span>
                    <p className="text-h5 md:text-h4 font-normal text-foreground leading-relaxed relative z-10">
                      {currentTestimonial.quote}
                    </p>
                  </div>

                  {/* Metric */}
                  <div className="mt-8 flex items-baseline gap-2">
                    <span className="text-h3 font-medium text-accent">
                      {currentTestimonial.metric}
                    </span>
                    <span className="text-body text-gray-500">
                      {currentTestimonial.metricLabel}
                    </span>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 mt-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-warning text-warning"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-foreground scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
