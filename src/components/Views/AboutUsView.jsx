import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Quote,
  Palette,
  Check,
  ShieldCheck,
  HeartHandshake,
  Compass,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { WhatsAppIcon } from '../UI/WhatsAppIcon';

/**
 * AboutUsView — Minimalist Brand Story & Founder Spotlight
 * Strictly compliant 4-Color Luxury System:
 * - #183630 (Primary Dark Green)
 * - #E5DAC9 (Primary Beige)
 * - #E5C690 (Primary Soft Gold)
 * - #B8A98F (Highlight Taupe)
 */
export function AboutUsView() {
  const { navigateTo } = useStore();

  const whatsappNumber = '917992801158';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hi Satya! I read The PrintHub story and would love to discuss a custom printing project.'
  )}`;

  return (
    <div className="min-h-screen select-none pb-20 bg-[#E5DAC9] text-[#183630]">
      {/* =========================================================================
         1. HERO SECTION (#183630 Dark Green Background)
         ========================================================================= */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-12 sm:pb-16 border-b bg-[#183630] border-[#B8A98F]/30 text-[#E5DAC9]">
        {/* Subtle Ambient Glow */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 blur-3xl rounded-full bg-[#E5C690]/10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-5">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider border shadow-xs backdrop-blur-sm bg-[#E5DAC9]/10 text-[#E5C690] border-[#B8A98F]/40">
            <Sparkles className="w-3.5 h-3.5 text-[#E5C690]" />
            <span>Est. September 2024 • The PrintHub Atelier</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-[#E5DAC9]">
            We turn ideas into{' '}
            <span className="text-[#E5C690]">
              wearable craft.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal text-[#E5DAC9]/85">
            The PrintHub is a boutique printing atelier built to make high-grade custom apparel,
            headwear, and merchandise genuinely accessible. No rigid minimum orders, no automated runaround —
            just dependable craft and real creative partnership.
          </p>

          {/* Quick CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
            <button
              onClick={() => {
                navigateTo('design-by-customer');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-xl bg-[#E5C690] hover:bg-[#d9b87c] text-[#183630] font-extrabold text-xs sm:text-sm shadow-md shadow-[#183630]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Palette className="w-4 h-4" />
              <span>Launch 3D Customizer</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl font-bold text-xs sm:text-sm border border-[#B8A98F]/60 bg-[#E5DAC9]/10 hover:bg-[#E5DAC9]/20 text-[#E5DAC9] transition-all flex items-center gap-2 cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4" size={16} />
              <span>Talk with Founder</span>
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
         2. OUR ORIGIN & STUDIO (#E5DAC9 Base with #183630 & #E5C690 accents)
         ========================================================================= */}
      <section className="relative py-14 sm:py-20 border-b border-[#B8A98F]/30 bg-[#E5DAC9] overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Origin Story */}
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#183630]/75 block">
                The Story
              </span>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#183630]">
                Every Great Idea Deserves to Be Seen.
              </h2>

              <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[#183630]/85">
                <p>
                  Founded in <strong className="text-[#183630] font-bold">September 2024</strong> by{' '}
                  <strong className="text-[#183630] font-bold">Satya Prakash Subudhi</strong>, The PrintHub began with
                  a straightforward goal: remove the frustration from personalized merchandise.
                </p>

                <p>
                  Traditionally, bringing custom apparel to life meant navigating stiff minimum order thresholds,
                  unreliable print durability, or distant suppliers who treated customers like invoice numbers.
                  The PrintHub was engineered to offer the opposite: responsive personal communication, precision DTF
                  heat transfers, and absolute freedom to order 1 piece or 1,000.
                </p>
              </div>

              {/* Founder Quote Card with cohesive theme background */}
              <div className="p-5 rounded-2xl border-l-4 border-[#E5C690] border-y border-r border-[#B8A98F]/40 bg-[#183630]/5 flex items-start gap-3.5 shadow-sm">
                <Quote className="w-5 h-5 text-[#E5C690] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs sm:text-sm italic leading-relaxed text-[#183630]">
                    “We wanted to build a creative partner that says yes to your ideas — whether you need a single custom tee for yourself or an entire uniform drop for your squad.”
                  </p>
                  <span className="block not-italic font-bold text-xs text-[#183630] mt-2">
                    — Satya Prakash Subudhi, Founder
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Studio Imagery (Uncropped 1:1 Full Photo Stage) */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden border border-[#B8A98F]/40 shadow-xl bg-[#183630]">
                {/* 1:1 Aspect Ratio container preserves 100% of the image uncropped */}
                <div className="aspect-square w-full relative overflow-hidden bg-[#183630]">
                  <img
                    src="/printhub-facility.jpg"
                    alt="The PrintHub Workshop and Production Facility"
                    className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
                  />
                </div>

                {/* Atelier Information Bar */}
                <div className="px-5 py-3.5 flex items-center justify-between gap-3 text-xs border-t border-[#B8A98F]/30 bg-[#183630] text-[#E5DAC9]">
                  <div className="flex items-center gap-2 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E5C690] animate-pulse" />
                    <span>Active Production Atelier</span>
                  </div>

                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-[#B8A98F]/40 bg-[#E5DAC9]/10 text-[#E5DAC9]">
                    Bhubaneswar, India
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
         3. MEET THE FOUNDER — Clean & Direct (Founder Image & #183630 Brand)
         ========================================================================= */}
      <section className="py-14 sm:py-20 border-b border-[#B8A98F]/30 bg-[#E5DAC9]/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#183630]/75">
              Leadership
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#183630]">
              Meet the Founder
            </h2>
          </div>

          <div className="p-6 sm:10 rounded-3xl border border-[#B8A98F]/40 shadow-md grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center bg-[#E5DAC9]">
            {/* Avatar with Founder Photo */}
            <div className="md:col-span-4 flex flex-col items-center text-center space-y-3">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-3 border-[#183630] shadow-xl relative overflow-hidden bg-[#183630] shrink-0">
                <img
                  src="/founder.jpg"
                  alt="Satya Prakash Subudhi — Founder & Lead Craftsman"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute -bottom-0.5 inset-x-0 py-0.5 bg-[#E5C690] text-[#183630] font-extrabold text-[9px] uppercase tracking-wider text-center shadow-xs">
                  Founder
                </div>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#183630]">
                  Satya Prakash Subudhi
                </h3>
                <p className="text-xs text-[#183630]/80 font-semibold">
                  Founder & Lead Craftsman
                </p>
              </div>
            </div>

            {/* Narrative */}
            <div className="md:col-span-8 space-y-3.5 text-xs sm:text-sm leading-relaxed">
              <p className="font-semibold text-[#183630]">
                Satya launched The PrintHub with an entrepreneur’s determination to turn a passion for graphic design,
                modern fabrics, and tactile printing into a customer-first brand.
              </p>

              <p className="text-[#183630]/85">
                By personally overseeing fabric sourcing, print press calibration, and customer design consultations,
                Satya ensures that every order — whether for a college fest, startup team, or personal keepsake —
                receives hands-on care instead of being treated like an automated ticket.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#183630]/10 text-[#183630] border border-[#B8A98F]/40">
                  <Check className="w-3 h-3 text-[#183630]" />
                  <span>Hands-on Quality Checks</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#183630]/10 text-[#183630] border border-[#B8A98F]/40">
                  <Check className="w-3 h-3 text-[#183630]" />
                  <span>Zero MOQ Guarantee</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#183630]/10 text-[#183630] border border-[#B8A98F]/40">
                  <Check className="w-3 h-3 text-[#183630]" />
                  <span>Direct Creator Support</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
         4. CORE PILLARS — 3 Distinctive Tenets
         ========================================================================= */}
      <section className="py-14 sm:py-20 border-b border-[#B8A98F]/30 bg-[#E5DAC9]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#183630]/75">
              Our Guiding Principles
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#183630]">
              Why We Do What We Do
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 sm:p-7 rounded-3xl border border-[#B8A98F]/40 bg-[#E5DAC9]/50 hover:border-[#183630] shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-10 h-10 rounded-xl bg-[#183630] text-[#E5C690] flex items-center justify-center mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold mb-2 text-[#183630]">
                Creative Autonomy
              </h3>
              <p className="text-xs leading-relaxed text-[#183630]/85">
                Whether you bring a quick sketch, a digital vector, or a simple slogan, we provide the tools and guidance to make it tangible in full color.
              </p>
            </div>

            <div className="p-6 sm:p-7 rounded-3xl border border-[#B8A98F]/40 bg-[#E5DAC9]/50 hover:border-[#183630] shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-10 h-10 rounded-xl bg-[#183630] text-[#E5C690] flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold mb-2 text-[#183630]">
                Dependable Quality
              </h3>
              <p className="text-xs leading-relaxed text-[#183630]/85">
                Combed cotton blends, wash-tested resilient DTF pigmentation, and multi-point seam inspection ensure apparel you'll actually wear repeatedly.
              </p>
            </div>

            <div className="p-6 sm:p-7 rounded-3xl border border-[#B8A98F]/40 bg-[#E5DAC9]/50 hover:border-[#183630] shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-10 h-10 rounded-xl bg-[#183630] text-[#E5C690] flex items-center justify-center mb-4">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold mb-2 text-[#183630]">
                Direct Dialogue
              </h3>
              <p className="text-xs leading-relaxed text-[#183630]/85">
                We believe in genuine communication. You can speak directly with our team on WhatsApp for design advice, fabric samples, or bulk queries.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUsView;
