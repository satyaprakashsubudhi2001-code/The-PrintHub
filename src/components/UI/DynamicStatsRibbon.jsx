import React, { useState, useEffect, useRef } from 'react';
import {
  Printer,
  Star,
  Zap,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  MessageCircle,
} from 'lucide-react';

/**
 * Hook to animate number counting up smoothly with cubic easing
 */
function useCountUp(target, duration = 1600, isDecimal = false, shouldStart = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;
    let startTime = null;
    let frameId;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = easeOutCubic(progress);
      const current = eased * target;

      setCount(isDecimal ? parseFloat(current.toFixed(1)) : Math.round(current));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [target, duration, isDecimal, shouldStart]);

  return count;
}

/**
 * DynamicStatsRibbon — Social proof and performance metrics for The PrintHub
 * Conceptually adapted from client performance counters into an industrial
 * custom merchandise atelier showcase:
 * - 2,500+ Custom Prints Delivered
 * - 4.9 / 5 Client Satisfaction
 * - < 15m Avg. Response Time
 * - 100% Zero MOQ Guarantee
 */
export function DynamicStatsRibbon({ isLight = false }) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeMetric, setActiveMetric] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animated metric counters
  const printsCount = useCountUp(2500, 1800, false, isVisible);
  const ratingCount = useCountUp(4.9, 1500, true, isVisible);
  const responseTimeCount = useCountUp(15, 1400, false, isVisible);
  const moqCount = useCountUp(100, 1600, false, isVisible);

  const metrics = [
    {
      id: 'prints',
      value: `${printsCount.toLocaleString()}+`,
      label: 'Custom Prints Delivered',
      sublabel: 'Tees, hoodies & merchandise across 28+ Indian states',
      icon: Printer,
      badge: 'Wash-Tested 300 DPI',
      accentColor: 'from-[#F2CB30] to-[#DA0090]',
    },
    {
      id: 'rating',
      value: `${ratingCount.toFixed(1)}/5`,
      label: 'Client Satisfaction',
      sublabel: 'Over 98% 5-star verified customer feedback',
      icon: Star,
      badge: 'Verified Feedback',
      accentColor: 'from-amber-400 to-yellow-500',
    },
    {
      id: 'response',
      value: `< ${responseTimeCount}m`,
      label: 'Avg. Response Time',
      sublabel: 'Instant mockups & quotes directly on WhatsApp',
      icon: Zap,
      badge: 'Direct Concierge',
      accentColor: 'from-emerald-400 to-teal-500',
    },
    {
      id: 'moq',
      value: `${moqCount}%`,
      label: 'Zero MOQ Guarantee',
      sublabel: 'Order 1 custom piece or bulk team drops with zero penalties',
      icon: ShieldCheck,
      badge: 'No Minimums',
      accentColor: 'from-sky-400 to-blue-500',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="studio-metrics-section"
      className="relative py-12 sm:py-16 border-b border-slate-200 bg-white overflow-hidden"
    >
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header Lockup */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border shadow-xs backdrop-blur-sm bg-[#DA0090]/10 text-[#DA0090] border-[#DA0090]/25">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Why Clients Choose The PrintHub</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#2C0E63]">
            Craftsmanship by the Numbers
          </h2>

          <p className="text-xs sm:text-sm font-normal max-w-xl mx-auto leading-relaxed text-slate-600">
            Proven delivery standards trusted by creators, college fests, startups, and communities across India.
          </p>
        </div>

        {/* Dynamic Interactive Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {metrics.map((item) => {
            const Icon = item.icon;
            const isHovered = activeMetric === item.id;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setActiveMetric(item.id)}
                onMouseLeave={() => setActiveMetric(null)}
                className={`relative rounded-3xl p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between cursor-default group hover:-translate-y-1.5 shadow-sm hover:shadow-md ${
                  isHovered
                    ? 'bg-white border-[#2C0E63] ring-1 ring-[#2C0E63]/20'
                    : 'bg-white border-slate-200'
                }`}
              >
                {/* Top Row: Icon & Micro Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-xs bg-[#2C0E63]/10 text-[#2C0E63] border border-[#2C0E63]/20">
                    <Icon className="w-5 h-5" />
                  </div>

                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border bg-slate-50 text-[#2C0E63] border-slate-200">
                    {item.badge}
                  </span>
                </div>

                {/* Main Dynamic Counter Value */}
                <div className="space-y-1.5 mb-3">
                  <div className="text-4xl sm:text-5xl font-black tracking-tight font-display text-[#12002E]">
                    <span>
                      {item.value}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold tracking-tight text-[#2C0E63]">
                    {item.label}
                  </h3>
                </div>

                {/* Subtitle / Descriptive Context */}
                <p className="text-xs leading-relaxed text-slate-500">
                  {item.sublabel}
                </p>

                {/* Subtle Interactive Bottom Accent Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                  <span className="inline-flex items-center gap-1 text-emerald-600 text-[10px]">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Live Studio Standard</span>
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DA0090] opacity-70 group-hover:scale-150 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default DynamicStatsRibbon;
