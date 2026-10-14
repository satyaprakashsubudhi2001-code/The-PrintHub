import React, { useState, useEffect, useRef } from 'react';
import {
  Printer,
  Star,
  Zap,
  ShieldCheck,
  CheckCircle2,
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
 * Strictly adhering to 4-Color Luxury System:
 * - #183630 (Primary Dark Green)
 * - #E5DAC9 (Primary Beige)
 * - #E5C690 (Primary Soft Gold)
 * - #B8A98F (Highlight Taupe)
 */
export function DynamicStatsRibbon() {
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
    },
    {
      id: 'rating',
      value: `${ratingCount.toFixed(1)}/5`,
      label: 'Client Satisfaction',
      sublabel: 'Over 98% 5-star verified customer feedback',
      icon: Star,
      badge: 'Verified Feedback',
    },
    {
      id: 'response',
      value: `< ${responseTimeCount}m`,
      label: 'Avg. Response Time',
      sublabel: 'Instant mockups & quotes directly on WhatsApp',
      icon: Zap,
      badge: 'Direct Concierge',
    },
    {
      id: 'moq',
      value: `${moqCount}%`,
      label: 'Zero MOQ Guarantee',
      sublabel: 'Order 1 custom piece or bulk team drops with zero penalties',
      icon: ShieldCheck,
      badge: 'No Minimums',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="studio-metrics-section"
      className="relative py-12 sm:py-16 border-b border-[#B8A98F]/30 bg-[#E5DAC9] overflow-hidden"
    >
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header Lockup */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border shadow-xs bg-[#E5C690]/30 text-[#183630] border-[#B8A98F]">
            <span className="w-2 h-2 rounded-full bg-[#183630] animate-pulse" />
            <span>Why Clients Choose The PrintHub</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#183630]">
            Craftsmanship by the Numbers
          </h2>

          <p className="text-xs sm:text-sm font-normal max-w-xl mx-auto leading-relaxed text-[#183630]/80">
            Proven delivery standards trusted by creators, college fests, startups, and enterprises across India.
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
                className={`relative rounded-3xl p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between cursor-default group hover:-translate-y-1.5 shadow-sm ${
                  isHovered
                    ? 'bg-[#E5DAC9] border-[#183630] ring-2 ring-[#B8A98F] shadow-[0_0_16px_rgba(184,169,143,0.45)]'
                    : 'bg-[#E5DAC9] border-[#B8A98F]'
                }`}
              >
                {/* Top Row: Icon & Micro Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-xs bg-[#183630] text-[#E5C690] border border-[#B8A98F]/40">
                    <Icon className="w-5 h-5" />
                  </div>

                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border bg-[#E5C690] text-[#183630] border-[#B8A98F]">
                    {item.badge}
                  </span>
                </div>

                {/* Main Dynamic Counter Value */}
                <div className="space-y-1.5 mb-3">
                  <div className="text-4xl sm:text-5xl font-black tracking-tight text-[#183630]">
                    <span>{item.value}</span>
                  </div>

                  <h3 className="text-base font-extrabold tracking-tight text-[#183630]">
                    {item.label}
                  </h3>
                </div>

                {/* Subtitle / Descriptive Context */}
                <p className="text-xs leading-relaxed text-[#183630]/75">
                  {item.sublabel}
                </p>

                {/* Bottom Status Bar */}
                <div className="mt-4 pt-3 border-t border-[#B8A98F]/30 flex items-center justify-between text-[11px] font-bold">
                  <span className="inline-flex items-center gap-1 text-[#183630] text-[10px]">
                    <CheckCircle2 className="w-3 h-3 text-[#183630]" />
                    <span>Live Atelier Standard</span>
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#E5C690] border border-[#183630] group-hover:scale-125 transition-transform" />
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
