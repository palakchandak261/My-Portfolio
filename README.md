<div align="center">

# 🌐 Palak Chandak — Developer Portfolio

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-myportfolio--omega--ashen.vercel.app-7e15f7?style=for-the-badge)](https://myportfolio-omega-ashen.vercel.app/)
[![Built With](https://img.shields.io/badge/Built_With-React_%2B_TypeScript_%2B_Vite-61DAFB?style=for-the-badge&logo=react)](https://vitejs.dev/)
[![Deployed On](https://img.shields.io/badge/Deployed_On-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> A modern, dark-themed personal portfolio with a fixed sidebar layout, particle canvas, 3D glassmorphism cards, AI typewriter effect, and 9+ project showcases — built entirely in React + TypeScript.

**[🔗 View Live →](https://myportfolio-omega-ashen.vercel.app/)**

</div>

---

## 📸 Preview

| Section | Preview |
|---|---|
| **Hero** | Particle canvas background, orbiting profile ring, typewriter role cycling, Resume + GitHub + LinkedIn CTAs |
| **About** | Photo with gradient border, 4 stat cards, bio, highlight cards, Positions of Responsibility |
| **Skills** | 6 colored category cards with skill pills + "Also Familiar With" section |
| **Projects** | Image preview cards with hover overlay, Featured badge, GitHub + Live Demo buttons |
| **Achievements** | Click-to-view certificate modal with tag badges |
| **Education** | Vertical timeline with gradient icon dots and score badges |
| **Contact** | Two-column: contact info + working Formspree contact form |

---

## ✨ Features

- 🎨 **Dark glassmorphism UI** — dark navy background with purple/pink gradient system
- ✨ **Particle canvas hero** — animated connected particle network using HTML5 Canvas
- 🔄 **Typewriter role cycling** — smooth type/delete animation for developer roles
- 🌀 **Orbiting profile image** — spinning rings + orbiting dot around circular photo
- 📌 **Fixed sidebar navigation** — desktop sidebar with active section detection via IntersectionObserver
- 📱 **Fully responsive** — mobile drawer sidebar with hamburger toggle
- 🃏 **3D card tilt effect** — CSS perspective transform on hover for project and skill cards
- 🖼️ **Project image previews** — real screenshots or styled gradient placeholders with browser chrome mockup
- 🏆 **Certificate modal** — click any achievement to view the certificate image
- 📬 **Working contact form** — Formspree integration with loading state and success confirmation
- 📄 **Resume download** — PDF download button in hero and sidebar
- 🎯 **"Open to SDE Internships · 2026"** — specific availability badge with green pulse
- 🌈 **Shimmer gradient buttons** — animated gradient CTA buttons
- 📊 **Stats with glow numbers** — CGPA, Projects, DSA count with gradient text glow

---

## 🗂️ Sections

| Section | ID | Description |
|---|---|---|
| Hero | — | Full-screen intro with photo, typewriter, CTAs, stats |
| About | `#about` | Photo + stat cards + bio + highlights + positions of responsibility |
| Skills | `#skills` | 6 color-coded category cards + "Also Familiar With" pill cloud |
| Projects | `#projects` | 6 featured cards (3 large + 3 compact) + View All link |
| Achievements | `#achievements` | 5 achievement cards with clickable certificate modal |
| Education | `#education` | Vertical timeline with 5 academic entries |
| Contact | `#contact` | Email/phone/location cards + Formspree contact form |
| /projects | Route | Separate full page — all 9 projects with category filter |

---

## 🚀 Tech Stack

| Category | Technologies |
|---|---|
| **Framework** | React 18 + TypeScript |
| **Build Tool** | Vite 5 |
| **Styling** | Tailwind CSS 3 + custom CSS (glassmorphism, gradients, animations) |
| **UI Components** | shadcn/ui (Radix UI primitives) |
| **Icons** | Lucide React |
| **Routing** | React Router DOM v6 |
| **State Management** | React useState / useEffect |
| **Animations** | CSS keyframes (float, fadeUp, pulseGlow, orbit, shimmer) |
| **Canvas** | HTML5 Canvas API (particle network) |
| **Observer** | IntersectionObserver API (active nav section) |
| **Contact Form** | Formspree (no backend needed) |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
My-Portfolio/
│
├── public/
│   ├── professional.png          # Profile photo
│   ├── resume.pdf                # Downloadable resume
│   ├── projects/                 # Project screenshots
│   │   ├── twinforge.png
│   │   ├── pocket-court.png
│   │   ├── contradiction-ledger.png
│   │   ├── foodie-hub.png
│   │   ├── tree-visualizer.png
│   │   ├── os-simulator.png
│   │   ├── smart-fridge.png
│   │   ├── red-light.png
│   │   └── medisure.png
│   └── certificates/             # Achievement certificates
│       ├── tesseract.jpeg
│       ├── leetcode.png
│       ├── Isro.png
│       ├── PICT.png
│       └── DSA.png
│
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx           # Fixed left sidebar with nav + resume button
│   │   ├── HeroSection.tsx       # Particle canvas + typewriter + orbiting photo
│   │   ├── AboutSection.tsx      # Photo + stats + bio + positions of responsibility
│   │   ├── SkillsSection.tsx     # Color-coded skill category cards
│   │   ├── ProjectsSection.tsx   # Featured project cards with image previews
│   │   ├── AchievementsSection.tsx  # Achievement cards + certificate modal
│   │   ├── EducationSection.tsx  # Vertical timeline
│   │   ├── ContactSection.tsx    # Contact info + Formspree form
│   │   ├── Footer.tsx            # Footer with social links
│   │   ├── Navbar.tsx            # Top navbar (only on /projects page)
│   │   └── ui/                   # shadcn/ui components
│   │
│   ├── pages/
│   │   ├── Index.tsx             # Main portfolio page (sidebar layout)
│   │   ├── Projects.tsx          # All 9 projects page with category filter
│   │   └── NotFound.tsx          # 404 page
│   │
│   ├── lib/
│   │   └── utils.ts              # Tailwind merge utility
│   │
│   ├── index.css                 # Global CSS — dark theme variables, animations, utilities
│   ├── App.tsx                   # Router setup
│   └── main.tsx                  # React entry point
│
├── index.html                    # HTML with Open Graph meta tags
├── tailwind.config.ts            # Tailwind configuration
├── vite.config.ts                # Vite configuration
└── package.json
```

---

## 🛠️ Getting Started

### Prerequisites

- Node.js v18+
- npm or bun

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/palakchandak261/My-Portfolio.git
cd My-Portfolio

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
npm run build
npm run preview
```

---

## ⚙️ Configuration

### 1. Add Your Resume

Place your resume PDF at:
```
public/resume.pdf
```

### 2. Add Project Screenshots

Place project screenshots in `public/projects/` with these exact filenames:

| Filename | Project |
|---|---|
| `twinforge.png` | TwinForge |
| `pocket-court.png` | Pocket Court |
| `contradiction-ledger.png` | Semantic Contradiction Ledger |
| `foodie-hub.png` | Foodie Hub |
| `tree-visualizer.png` | Advanced Tree Visualizer |
| `os-simulator.png` | MULTI/PROG OS Simulator |
| `smart-fridge.png` | Smart Kitchen System |
| `red-light.png` | Red Light Override |
| `medisure.png` | MediSure |

> **Recommended size:** 1280×720px (16:9 landscape). If no file exists, a styled gradient placeholder is shown automatically.

### 3. Enable Contact Form (Formspree)

1. Sign up free at [formspree.io](https://formspree.io)
2. Create a new form → copy your Form ID (e.g. `xpwzabcd`)
3. Open `src/components/ContactSection.tsx` and update:

```ts
const FORMSPREE_ID = "xpwzabcd"; // ← replace with your actual ID
```

Free tier: 50 submissions/month, no backend needed.

---

## 🎨 Design System

### Color Palette

```css
--background:  hsl(224 20% 6%)     /* Dark navy */
--card:        hsl(224 18% 10%)    /* Slightly lighter navy */
--primary:     hsl(252 87% 67%)    /* Purple #7e5bef */
--accent:      hsl(316 80% 65%)    /* Pink */
--border:      hsl(224 15% 18%)    /* Subtle border */
--foreground:  hsl(210 40% 96%)    /* Near white text */
```

### Key CSS Utilities

```css
.glass          /* Glassmorphism: backdrop-blur + semi-transparent bg */
.card-3d        /* 3D perspective tilt on hover */
.text-gradient  /* Purple → pink gradient text */
.btn-shimmer    /* Animated shimmer gradient button */
.dot-grid       /* Subtle dot pattern background */
.typing-cursor  /* Blinking cursor for typewriter */
.stat-number    /* Gradient + glow for stat numbers */
.animate-orbit  /* CSS orbit animation for profile ring dot */
```

---

## 📦 Key Dependencies

```json
"react": "^18.3.1"
"react-router-dom": "^6.30.1"
"typescript": "^5.8.3"
"vite": "^5.4.19"
"tailwindcss": "^3.4.17"
"lucide-react": "^0.462.0"
"@tanstack/react-query": "^5.83.0"
"tailwindcss-animate": "^1.0.7"
```

---

## 🚀 Deployment

This portfolio is deployed on **Vercel** with automatic deployments on every push to `main`.

**To deploy your own:**

1. Fork this repository
2. Go to [vercel.com](https://vercel.com) → New Project → Import your fork
3. Framework: **Vite** (auto-detected)
4. Click Deploy — done in ~30 seconds

**Live URL:** [https://myportfolio-omega-ashen.vercel.app/](https://myportfolio-omega-ashen.vercel.app/)

---

## 📊 Portfolio Content

### Projects Showcased (9 total)

| # | Project | Domain | Live |
|---|---|---|---|
| 1 | TwinForge | AI / Full-Stack / DevOps | — |
| 2 | Pocket Court | Mobile / AI / Legal Tech | — |
| 3 | Semantic Contradiction Ledger | NLP / Blockchain | [🔗](https://palakchandak25-contradiction-ledger.hf.space) |
| 4 | Foodie Hub | Full-Stack Web | [🔗](https://foodiehub-ib7u.onrender.com) |
| 5 | Advanced Tree Visualizer | DSA / C++ / Visualization | [🔗](https://advanced-tree-rotation-visualizer-s.vercel.app) |
| 6 | MULTI/PROG OS Simulator | Systems / OS | — |
| 7 | Smart Kitchen System | Frontend / MVC | — |
| 8 | Red Light Override | Web App | — |
| 9 | MediSure | AI / Healthcare | Coming Soon |

---

## 👩‍💻 About the Developer

**Palak Chandak** — Computer Engineering student at VIT Pune (CGPA 8.97)

- 📍 Pune, India
- 📧 chandakpalak78@gmail.com
- 💼 [LinkedIn](https://linkedin.com/in/palakchandak-44b84733a)
- 🐙 [GitHub](https://github.com/palakchandak261)

---

## 📄 License

MIT License — free to use as a template. If you do, a star ⭐ would be appreciated!

---

<div align="center">

Built with ❤️ using **React + TypeScript + Tailwind CSS** · Deployed on **Vercel**

⭐ Star this repo if it helped you build your own portfolio!

</div>
