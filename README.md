# The PrintHub — 3D & 2D Custom Merchandise Studio & Business Command Center

> Premium custom printing atelier, real-time 3D interactive studio, and comprehensive business administration command center.

[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.174-black?logo=threedotjs&logoColor=white)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 🌟 Key Features

### 1. Interactive 3D & 2D Customizer
- **Real-Time 3D Viewport**: Interactive orbital 3D models powered by Three.js and React Three Fiber with procedural garment meshes, realistic fabric shading, dynamic specular highlights, and studio lighting controls.
- **Physical Print Calibration**: Accurate DPI scaling and dimension mapping (front, back, pocket, sleeves) for DTF, sublimation, and screen printing.
- **Multi-Layer Artwork Compositor**: Upload raster/vector artwork, adjust rotation, scale, position, color swatches, text layers, and fonts with instant 3D projection.
- **Automated Design Bundling**: Automated ZIP packaging engine (`packageExporter.js`) bundling design specifications (`design.json`), markdown summaries (`summary.md`), original high-res artwork, and rendered mockups.

### 2. Complete Admin Command Center
- **Executive Analytics**: Real-time gross revenue, order volume, net margins, customer acquisition, and inventory metrics.
- **Order Management**: End-to-end processing for online web orders, manual orders, WhatsApp orders, and walk-in counter sales.
- **Inventory & Stock Movements**: SKU-level tracking, threshold re-order alerts, batch stock movements, and valuation audits.
- **Financial & Expense Engine**: Track operational expenses, printing ink/film costs, fabric blanks, courier bills, and real-time net P&L calculations.
- **Customer CRM**: Profile tracking, WhatsApp quick-launch messaging, purchase history, and custom loyalty notes.
- **Homepage CMS & Announcements**: Live WYSIWYG editor for storefront banners, featured collections, marquee announcement bars, and contact info without redeploying.
- **Role-Based Access Control**: Tiered permission system (Owner, Production Manager, Sales Representative, Inventory Clerk).

### 3. Storefront & E-Commerce Workflows
- **Ready-to-Buy Catalog**: Curated blank apparel, drinkware, stationery, and personalized gift blanks with filters, categories, and quick-view modals.
- **Direct Checkout & Payments**: Razorpay, UPI QR integration, cash-on-delivery options, and automated bill calculations.
- **Logistics & Tracking**: Integrated delivery workflows with pin-code serviceability checks and real-time tracking modals.

---

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 (Hooks, Context API)
- **Build Tool**: Vite 6
- **3D Graphics & Rendering**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Styling**: Tailwind CSS, PostCSS, Lucide React Icons
- **Packaging & Compression**: JSZip
- **Business Data Engine**: Persistent reactive database store (`src/services/adminDb.js`)

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Installation & Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/satyaprakashsubudhi2001-code/The-PrintHub.git
   cd The-PrintHub
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173` to explore the storefront and 3D Studio.

4. **Access the Admin Command Center:**
   Navigate to:
   ```text
   http://localhost:5173/admin
   ```
   Default Admin Email: `theprinthub.in@gmail.com`

---

## 📦 Production Build & Deployment

To build an optimized production bundle:
```bash
npm run build
```
The output will be generated in the `dist/` directory, ready to deploy to **Vercel**, **Netlify**, or any static/cloud hosting platform.

- **Vercel**: Configured with `vercel.json` for SPA routing rewrites.
- **Netlify**: Configured with `netlify.toml` and `public/_redirects`.

---

## 📄 License

Private & Proprietary — Developed for **The PrintHub Atelier**.
