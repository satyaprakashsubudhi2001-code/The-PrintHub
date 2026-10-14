export const FONTS = [
  { name: 'Outfit Modern', fontFamily: 'Outfit, sans-serif', category: 'Clean Sans' },
  { name: 'Impact Heavy', fontFamily: 'Impact, sans-serif', category: 'Bold & Punchy' },
  { name: 'Bebas Neue', fontFamily: 'Bebas Neue, sans-serif', category: 'Display Tall' },
  { name: 'Montserrat Bold', fontFamily: 'Montserrat, sans-serif', category: 'Geometric' },
  { name: 'Oswald Condensed', fontFamily: 'Oswald, sans-serif', category: 'Sporty' },
  { name: 'Pacifico Script', fontFamily: 'Pacifico, cursive', category: 'Handwritten' },
  { name: 'Playfair Display', fontFamily: 'Playfair Display, serif', category: 'Luxury Serif' },
  { name: 'Permanent Marker', fontFamily: 'Permanent Marker, cursive', category: 'Street Urban' },
  { name: 'Righteous Retro', fontFamily: 'Righteous, cursive', category: 'Vintage 80s' },
  { name: 'Space Grotesk', fontFamily: 'Space Grotesk, sans-serif', category: 'Cyber Tech' },
  { name: 'Cinzel Royal', fontFamily: 'Cinzel, serif', category: 'Classic Heritage' },
  { name: 'Lobster Brush', fontFamily: 'Lobster, cursive', category: 'Retro Script' },
  { name: 'Anton Block', fontFamily: 'Anton, sans-serif', category: 'Heavy Block' },
  { name: 'Caveat Casual', fontFamily: 'Caveat, cursive', category: 'Organic Pen' },
];

export const SAMPLE_ARTWORKS = [
  {
    id: 'sample_printhub_crest',
    name: 'PrintHub Original Crest',
    category: 'Brand',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23f97316"/><stop offset="100%" stop-color="%23ea580c"/></linearGradient></defs><circle cx="250" cy="250" r="230" fill="none" stroke="url(%23g1)" stroke-width="14"/><circle cx="250" cy="250" r="200" fill="rgba(249,115,22,0.12)"/><path d="M160 330 L250 150 L340 330 L250 270 Z" fill="url(%23g1)"/><text x="250" y="380" font-family="Arial,sans-serif" font-weight="900" font-size="34" fill="%23ffffff" text-anchor="middle" letter-spacing="4">THE PRINTHUB</text><text x="250" y="415" font-family="Arial,sans-serif" font-weight="700" font-size="18" fill="%23f97316" text-anchor="middle" letter-spacing="8">CUSTOM STUDIO</text></svg>`
  },
  {
    id: 'sample_cyber_skull',
    name: 'Cyberpunk Neon Ronin',
    category: 'Streetwear',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><defs><linearGradient id="cy" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2306b6d4"/><stop offset="100%" stop-color="%23ec4899"/></linearGradient></defs><polygon points="250,50 420,160 420,340 250,450 80,340 80,160" fill="none" stroke="url(%23cy)" stroke-width="12"/><path d="M170 210 Q250 140 330 210 Q350 310 250 360 Q150 310 170 210 Z" fill="%230b0f17" stroke="%2306b6d4" stroke-width="8"/><circle cx="210" cy="240" r="22" fill="%23ec4899"/><circle cx="290" cy="240" r="22" fill="%23ec4899"/><path d="M210 300 Q250 330 290 300" fill="none" stroke="%2306b6d4" stroke-width="8" stroke-linecap="round"/><text x="250" y="420" font-family="Impact" font-size="42" fill="%23ffffff" text-anchor="middle" letter-spacing="6">TOKYO SPEED</text></svg>`
  },
  {
    id: 'sample_athletic_shield',
    name: 'Championship 99 Shield',
    category: 'Athletic',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><path d="M100 100 L400 100 L380 320 Q250 440 250 440 Q250 440 120 320 Z" fill="%231e3a8a" stroke="%23fbbf24" stroke-width="16"/><text x="250" y="270" font-family="Impact" font-size="170" font-weight="bold" fill="%23ffffff" text-anchor="middle">99</text><text x="250" y="360" font-family="Arial" font-size="30" font-weight="900" fill="%23fbbf24" text-anchor="middle" letter-spacing="6">ALL STARS</text></svg>`
  },
  {
    id: 'sample_vintage_surf',
    name: 'California Sunset Wave',
    category: 'Vintage',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><defs><linearGradient id="sun" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="%23f59e0b"/><stop offset="50%" stop-color="%23ea580c"/><stop offset="100%" stop-color="%23be123c"/></linearGradient></defs><circle cx="250" cy="220" r="150" fill="url(%23sun)"/><path d="M120 300 C180 240, 240 330, 320 270 C350 250, 370 290, 380 300 L380 370 L120 370 Z" fill="%230284c7"/><text x="250" y="425" font-family="Brush Script MT, cursive, Arial" font-size="44" font-weight="bold" fill="%23ffffff" text-anchor="middle">Endless Summer</text><text x="250" y="460" font-family="Arial" font-size="16" font-weight="bold" fill="%2394a3b8" text-anchor="middle" letter-spacing="10">PACIFIC COAST</text></svg>`
  },
  {
    id: 'sample_mountain_badge',
    name: 'Alpine Expedition Club',
    category: 'Outdoors',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><polygon points="250,60 440,390 60,390" fill="none" stroke="%23ffffff" stroke-width="12"/><polygon points="250,130 390,380 110,380" fill="%2315803d"/><polygon points="250,130 200,220 230,230 250,190 280,240 300,220" fill="%23ffffff"/><text x="250" y="440" font-family="Arial" font-size="34" font-weight="900" fill="%23ffffff" text-anchor="middle" letter-spacing="8">WILDERNESS</text></svg>`
  },
  {
    id: 'sample_golden_lion',
    name: 'Imperial Golden Crest',
    category: 'Luxury',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><defs><linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23fef08a"/><stop offset="50%" stop-color="%23eab308"/><stop offset="100%" stop-color="%23a16207"/></linearGradient></defs><circle cx="250" cy="250" r="220" fill="none" stroke="url(%23gold)" stroke-width="10" stroke-dasharray="16,8"/><path d="M250 90 L280 160 L350 160 L295 205 L315 275 L250 230 L185 275 L205 205 L150 160 L220 160 Z" fill="url(%23gold)"/><text x="250" y="350" font-family="Cinzel, serif" font-size="36" font-weight="bold" fill="url(%23gold)" text-anchor="middle" letter-spacing="6">EXECUTIVE</text><text x="250" y="390" font-family="Cinzel, serif" font-size="18" fill="%23e2e8f0" text-anchor="middle" letter-spacing="8">EDITION MMXXVI</text></svg>`
  }
];

// Pre-made Curated Templates ready to inject into customizer with 1 click
export const DESIGN_TEMPLATES = [
  {
    id: 'tmpl_streetwear_cyber',
    title: 'Neon Ronin Streetwear',
    category: 'Streetwear',
    thumbnail: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=400&q=80',
    designs: [
      {
        name: 'Cyber Ronin Mask',
        dataUrl: SAMPLE_ARTWORKS[1].dataUrl,
        scale: 1.15,
        rotation: 0,
        x: 0,
        y: -0.05,
      }
    ],
    texts: [
      {
        text: 'NIGHT RUNNER // 2026',
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize: 32,
        fillColor: '#06b6d4',
        bold: true,
        letterSpacing: 4,
        y: 0.55,
      }
    ]
  },
  {
    id: 'tmpl_varsity_athletics',
    title: 'Varsity Athletics Club',
    category: 'Sports',
    thumbnail: 'https://images.unsplash.com/photo-1580087433295-ab2600c1030e?auto=format&fit=crop&w=400&q=80',
    designs: [
      {
        name: 'Championship Shield',
        dataUrl: SAMPLE_ARTWORKS[2].dataUrl,
        scale: 1.0,
        rotation: 0,
        x: 0,
        y: -0.1,
      }
    ],
    texts: [
      {
        text: 'STATE CHAMPIONS',
        fontFamily: 'Impact, sans-serif',
        fontSize: 36,
        fillColor: '#fbbf24',
        bold: true,
        letterSpacing: 3,
        y: 0.5,
      }
    ]
  },
  {
    id: 'tmpl_corporate_minimal',
    title: 'Corporate Executive',
    category: 'Business',
    thumbnail: 'https://images.unsplash.com/photo-1625910513413-5bc25e656d29?auto=format&fit=crop&w=400&q=80',
    designs: [
      {
        name: 'Executive Lion Gold',
        dataUrl: SAMPLE_ARTWORKS[5].dataUrl,
        scale: 0.85,
        rotation: 0,
        x: 0,
        y: -0.08,
      }
    ],
    texts: [
      {
        text: 'VENTURES CAPITAL',
        fontFamily: 'Cinzel, serif',
        fontSize: 28,
        fillColor: '#e2e8f0',
        bold: true,
        letterSpacing: 6,
        y: 0.48,
      }
    ]
  },
  {
    id: 'tmpl_sunset_surf',
    title: 'Endless Summer Surf',
    category: 'Vintage',
    thumbnail: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
    designs: [
      {
        name: 'California Sunset Wave',
        dataUrl: SAMPLE_ARTWORKS[3].dataUrl,
        scale: 1.1,
        rotation: 0,
        x: 0,
        y: -0.05,
      }
    ],
    texts: [
      {
        text: 'PACIFIC WAVE CREW',
        fontFamily: 'Pacifico, cursive',
        fontSize: 34,
        fillColor: '#ffffff',
        bold: false,
        letterSpacing: 2,
        y: 0.52,
      }
    ]
  },
  {
    id: 'tmpl_wilderness_club',
    title: 'Alpine Wilderness Club',
    category: 'Outdoors',
    thumbnail: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80',
    designs: [
      {
        name: 'Alpine Badge',
        dataUrl: SAMPLE_ARTWORKS[4].dataUrl,
        scale: 1.05,
        rotation: 0,
        x: 0,
        y: -0.06,
      }
    ],
    texts: [
      {
        text: 'EST. 1984 • BASECAMP',
        fontFamily: 'Bebas Neue, sans-serif',
        fontSize: 32,
        fillColor: '#86efac',
        bold: true,
        letterSpacing: 5,
        y: 0.54,
      }
    ]
  },
  {
    id: 'tmpl_printhub_studio',
    title: 'PrintHub Signature',
    category: 'Minimal',
    thumbnail: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80',
    designs: [
      {
        name: 'PrintHub Crest Original',
        dataUrl: SAMPLE_ARTWORKS[0].dataUrl,
        scale: 1.1,
        rotation: 0,
        x: 0,
        y: 0,
      }
    ],
    texts: []
  }
];

export const CLIPARTS = [
  { id: 'icon_star', name: 'Star Badge', icon: '⭐', svg: '<svg viewBox="0 0 100 100"><polygon points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36" fill="#facc15"/></svg>' },
  { id: 'icon_fire', name: 'Flame Fire', icon: '🔥', svg: '<svg viewBox="0 0 100 100"><path d="M50 10 C35 35 15 50 15 70 A35 35 0 0 0 85 70 C85 45 65 30 50 10 Z M50 45 C55 55 65 65 65 75 A15 15 0 0 1 35 75 C35 65 45 55 50 45 Z" fill="#ea580c"/></svg>' },
  { id: 'icon_crown', name: 'Royal Crown', icon: '👑', svg: '<svg viewBox="0 0 100 100"><path d="M10 75 L90 75 L80 35 L60 55 L50 25 L40 55 L20 35 Z" fill="#eab308" stroke="#ca8a04" stroke-width="4"/><circle cx="20" cy="30" r="5" fill="#fef08a"/><circle cx="50" cy="20" r="5" fill="#fef08a"/><circle cx="80" cy="30" r="5" fill="#fef08a"/></svg>' },
  { id: 'icon_lightning', name: 'Thunder Volt', icon: '⚡', svg: '<svg viewBox="0 0 100 100"><polygon points="60,5 20,55 50,55 40,95 80,45 50,45" fill="#eab308" stroke="#ca8a04" stroke-width="3"/></svg>' },
  { id: 'icon_heart', name: 'Neon Heart', icon: '💖', svg: '<svg viewBox="0 0 100 100"><path d="M50 85 C15 55 10 30 25 15 C40 0 50 20 50 20 C50 20 60 0 75 15 C90 30 85 55 50 85 Z" fill="#ec4899" stroke="#be185d" stroke-width="3"/></svg>' },
  { id: 'icon_shield', name: 'Honor Shield', icon: '🛡️', svg: '<svg viewBox="0 0 100 100"><path d="M50 10 L85 25 L85 60 C85 80 50 95 50 95 C50 95 15 80 15 60 L15 25 Z" fill="#0284c7" stroke="#38bdf8" stroke-width="4"/></svg>' },
  { id: 'icon_skull', name: 'Urban Skull', icon: '💀', svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="45" r="35" fill="#f8fafc"/><rect x="35" y="65" width="30" height="20" rx="5" fill="#f8fafc"/><circle cx="38" cy="45" r="8" fill="#0f172a"/><circle cx="62" cy="45" r="8" fill="#0f172a"/><polygon points="50,55 45,65 55,65" fill="#0f172a"/><line x1="42" y1="75" x2="42" y2="85" stroke="#0f172a" stroke-width="3"/><line x1="50" y1="75" x2="50" y2="85" stroke="#0f172a" stroke-width="3"/><line x1="58" y1="75" x2="58" y2="85" stroke="#0f172a" stroke-width="3"/></svg>' },
  { id: 'icon_bull', name: 'Raging Bull', icon: '🐂', svg: '<svg viewBox="0 0 100 100"><path d="M20 30 C30 20 40 30 50 35 C60 30 70 20 80 30 C75 55 65 75 50 85 C35 75 25 55 20 30 Z" fill="#dc2626" stroke="#991b1b" stroke-width="4"/><path d="M15 25 C10 10 25 15 30 25" stroke="#ffffff" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M85 25 C90 10 75 15 70 25" stroke="#ffffff" stroke-width="5" fill="none" stroke-linecap="round"/></svg>' },
];

export const STUDIO_ENVIRONMENTS = [
  {
    id: 'studio_clean',
    name: 'Photo Studio Neutral',
    desc: 'Soft key lights with natural studio daylight balance.',
    bgColor: '#0f172a',
    floorColor: '#0b0f17',
    ambientIntensity: 0.85,
    keyIntensity: 1.5,
    keyColor: '#ffffff',
    fillColor: '#93c5fd',
    preset: 'studio',
  },
  {
    id: 'warm_golden',
    name: 'Golden Hour Sunset',
    desc: 'Warm amber tones and rich cinematic highlights.',
    bgColor: '#1a1012',
    floorColor: '#120a0d',
    ambientIntensity: 0.75,
    keyIntensity: 1.8,
    keyColor: '#fde047',
    fillColor: '#f97316',
    preset: 'sunset',
  },
  {
    id: 'cyber_neon',
    name: 'Cyberpunk Neon Stage',
    desc: 'Electric cyan and magenta rim lights for streetwear aesthetics.',
    bgColor: '#070b14',
    floorColor: '#030712',
    ambientIntensity: 0.6,
    keyIntensity: 1.9,
    keyColor: '#06b6d4',
    fillColor: '#ec4899',
    preset: 'city',
  },
  {
    id: 'dramatic_dark',
    name: 'Dramatic Shadow Noir',
    desc: 'Deep high-contrast studio spotlight.',
    bgColor: '#05070a',
    floorColor: '#020305',
    ambientIntensity: 0.45,
    keyIntensity: 2.2,
    keyColor: '#ffffff',
    fillColor: '#64748b',
    preset: 'night',
  },
  {
    id: 'pure_minimal',
    name: 'Minimal Clean Daylight',
    desc: 'Ultra clean light grey catalog backdrop.',
    bgColor: '#1e293b',
    floorColor: '#182234',
    ambientIntensity: 1.1,
    keyIntensity: 1.4,
    keyColor: '#ffffff',
    fillColor: '#e2e8f0',
    preset: 'city',
  },
];
