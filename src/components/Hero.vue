<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import profileImage from "../assets/profile.jpg";

gsap.registerPlugin(ScrollTrigger);

const router = useRouter();

const sectionRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
let ctx: gsap.Context | null = null;
let animFrameId: number | null = null;

/* ── Only: C#, Python, CSS, Git, HTML, Figma ── */
const LANG_ICONS = [
  {
    id: "html", label: "HTML5",
    top: "0%", left: "8%", delay: 0, size: 36,
    svg: `<rect width="36" height="36" rx="7" fill="#E34F26"/>
          <text x="4" y="25" font-family="monospace" font-size="13" font-weight="900" fill="#fff">H5</text>`,
  },
  {
    id: "python", label: "Python",
    top: "0%", right: "8%", delay: 0.4, size: 38,
    svg: `<rect width="38" height="38" rx="7" fill="#1a1a2e"/>
          <path d="M14 8 Q14 4 19 4 Q24 4 24 8 L24 17 Q24 21 19 21 L14 21 Q8 21 8 17 L8 13" fill="none" stroke="#3776AB" stroke-width="2.2"/>
          <path d="M24 30 Q24 34 19 34 Q14 34 14 30 L14 21 Q14 17 19 17 L24 17 Q30 17 30 21 L30 25" fill="none" stroke="#FFD43B" stroke-width="2.2"/>
          <circle cx="15.5" cy="10.5" r="1.8" fill="#FFD43B"/>
          <circle cx="22.5" cy="27.5" r="1.8" fill="#3776AB"/>`,
  },
  {
    id: "git", label: "Git",
    top: "40%", left: "-10%", delay: 0.6, size: 36,
    svg: `<rect width="36" height="36" rx="7" fill="#F05032"/>
          <circle cx="18" cy="26" r="3" fill="none" stroke="#fff" stroke-width="2"/>
          <circle cx="18" cy="10" r="3" fill="none" stroke="#fff" stroke-width="2"/>
          <circle cx="27" cy="18" r="3" fill="none" stroke="#fff" stroke-width="2"/>
          <line x1="18" y1="13" x2="18" y2="23" stroke="#fff" stroke-width="2"/>
          <path d="M18 13 Q18 18 24.5 18" fill="none" stroke="#fff" stroke-width="2"/>`,
  },
  {
    id: "figma", label: "Figma",
    top: "40%", right: "-10%", delay: 0.8, size: 36,
    svg: `<rect width="36" height="36" rx="7" fill="#1e1e1e"/>
          <rect x="10" y="5"  width="8" height="9" rx="4" fill="#F24E1E"/>
          <rect x="18" y="5"  width="8" height="9" rx="4" fill="#FF7262"/>
          <rect x="10" y="14" width="8" height="9" rx="0" fill="#A259FF"/>
          <circle cx="22" cy="18.5" r="4" fill="#1ABCFE"/>
          <rect x="10" y="23" width="8" height="9" rx="4" fill="#0ACF83"/>`,
  },
  {
    id: "css", label: "CSS3",
    bottom: "0%", left: "8%", delay: 0.2, size: 36,
    svg: `<rect width="36" height="36" rx="7" fill="#1572B6"/>
          <text x="2" y="25" font-family="monospace" font-size="12" font-weight="900" fill="#fff">CSS3</text>`,
  },
  {
    id: "csharp", label: "C#",
    bottom: "0%", right: "8%", delay: 1.0, size: 36,
    svg: `<rect width="36" height="36" rx="7" fill="#9B4F96"/>
          <text x="3" y="25" font-family="monospace" font-size="16" font-weight="900" fill="#fff">C#</text>`,
  },
];

/* ── Particle network canvas ── */
interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  radius: number; alpha: number;
  pulse: number; pulseSpeed: number;
}

const mouse = { x: -9999, y: -9999 };
const PARTICLE_COUNT = 72;
const CONNECTION_DIST = 140;
const MOUSE_REPEL_DIST = 110;
const GOLD = "245,166,35";

function initCanvas() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const c = canvas.getContext("2d")!;
  let particles: Particle[] = [];
  let W = 0, H = 0;

  function resize() {
    const rect = canvas!.getBoundingClientRect();
    W = canvas!.width  = rect.width;
    H = canvas!.height = rect.height;
  }

  function spawn(): Particle {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.38,
      vy: (Math.random() - 0.5) * 0.38,
      radius: Math.random() * 1.8 + 0.7,
      alpha: Math.random() * 0.5 + 0.25,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.012 + 0.006,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, spawn);
  }

  function draw() {
    c.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.pulse += p.pulseSpeed;
      const pAlpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));

      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const mdist = Math.sqrt(dx * dx + dy * dy);
      if (mdist < MOUSE_REPEL_DIST && mdist > 0) {
        const force = (MOUSE_REPEL_DIST - mdist) / MOUSE_REPEL_DIST * 0.6;
        p.vx -= (dx / mdist) * force;
        p.vy -= (dy / mdist) * force;
      }

      p.vx *= 0.985;
      p.vy *= 0.985;

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -10) p.x = W + 10;
      else if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      else if (p.y > H + 10) p.y = -10;

      c.beginPath();
      c.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      c.fillStyle = `rgba(${GOLD},${pAlpha})`;
      c.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const cx = p.x - q.x;
        const cy = p.y - q.y;
        const dist = Math.sqrt(cx * cx + cy * cy);
        if (dist < CONNECTION_DIST) {
          const lineAlpha = (1 - dist / CONNECTION_DIST) * 0.18;
          c.beginPath();
          c.moveTo(p.x, p.y);
          c.lineTo(q.x, q.y);
          c.strokeStyle = `rgba(${GOLD},${lineAlpha})`;
          c.lineWidth = 0.7;
          c.stroke();
        }
      }

      const mdistClose = Math.sqrt((mouse.x - p.x) ** 2 + (mouse.y - p.y) ** 2);
      if (mdistClose < CONNECTION_DIST * 1.4) {
        const mouseLineAlpha = (1 - mdistClose / (CONNECTION_DIST * 1.4)) * 0.32;
        c.beginPath();
        c.moveTo(p.x, p.y);
        c.lineTo(mouse.x, mouse.y);
        c.strokeStyle = `rgba(${GOLD},${mouseLineAlpha})`;
        c.lineWidth = 0.9;
        c.stroke();
      }
    }

    animFrameId = requestAnimationFrame(draw);
  }

  const ro = new ResizeObserver(init);
  ro.observe(canvas);
  init();
  draw();

  return () => {
    ro.disconnect();
    if (animFrameId) cancelAnimationFrame(animFrameId);
  };
}

function onMouseMove(e: MouseEvent) {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
}

function onMouseLeave() {
  mouse.x = -9999;
  mouse.y = -9999;
}

let cleanupCanvas: (() => void) | undefined;

onMounted(() => {
  cleanupCanvas = initCanvas();

  ctx = gsap.context(() => {
    gsap.to(".hero-orb", {
      y: "25%", ease: "none",
      scrollTrigger: { trigger: sectionRef.value, start: "top top", end: "bottom top", scrub: true },
    });
  }, sectionRef.value!);
});

onUnmounted(() => {
  ctx?.revert();
  cleanupCanvas?.();
});

const navigateTo = (path: string) => router.push(path);
</script>

<template>
  <section
    id="hero"
    ref="sectionRef"
    class="hero"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <div class="hero-bg">
      <canvas ref="canvasRef" class="hero-canvas" />
      <div class="hero-orb orb-1" />
      <div class="hero-orb orb-2" />
    </div>

    <div class="container hero-inner">
      <!-- LEFT: Photo + icons -->
      <div class="hero-photo-col">
        <div class="photo-wrap">

          <!-- Floating language icons -->
          <div
            v-for="icon in LANG_ICONS"
            :key="icon.id"
            class="lang-icon"
            :title="icon.label"
            :style="{
              top: icon.top, bottom: icon.bottom,
              left: icon.left, right: icon.right,
              animationDelay: icon.delay + 's',
              width: icon.size + 'px', height: icon.size + 'px',
            }"
          >
            <svg
              :width="icon.size" :height="icon.size"
              :viewBox="`0 0 ${icon.size} ${icon.size}`"
              xmlns="http://www.w3.org/2000/svg"
              v-html="icon.svg"
            />
          </div>

          <!-- Photo frame -->
          <div class="photo-frame">
            <span class="corner corner-tr" />
            <span class="corner corner-bl" />
            <div class="photo-glow" />
            <div class="photo-img-wrap">
              <img :src="profileImage" alt="Justine Buncag" class="photo-img" data-testid="img-profile" />
              <div class="photo-overlay" />
            </div>
          </div>

          <!-- Available badge -->
          <div class="avail-badge">
            <span class="avail-dot" />
            Available for work
          </div>
        </div>
      </div>

      <!-- RIGHT: Text -->
      <div class="hero-text-col">
        <div class="hero-role-badge">Front-End Developer</div>

        <h1 class="hero-name">
          JUSTINE<br />
          <span class="hero-name-accent">BUNCAG</span>
        </h1>

        <p class="hero-sub">
          Crafting <strong>precision-engineered</strong> digital experiences
          through clean code and intentional design.
        </p>

        <div class="hero-cta">
          <a class="btn-primary" @click.prevent="navigateTo('/projects')" data-testid="btn-view-projects">
            View Projects
          </a>
          <a class="btn-ghost" @click.prevent="navigateTo('/contact')" data-testid="btn-contact-me">
            Contact Me
          </a>
        </div>

        <div class="hero-stats">
          <div class="stat">
            <div class="stat-num">8mo</div>
            <div class="stat-label">Experience</div>
          </div>
          <div class="stat-divider" />
          <div class="stat">
            <div class="stat-num">3</div>
            <div class="stat-label">Projects</div>
          </div>
          <div class="stat-divider" />
          <div class="stat">
            <div class="stat-num">100%</div>
            <div class="stat-label">Passion</div>
          </div>
        </div>
      </div>
    </div>

    <div class="scroll-indicator">
      <span class="scroll-label">Scroll</span>
      <div class="scroll-line"><div class="scroll-line-fill" /></div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding-top: 80px;
}

.hero-bg {
  position: absolute; inset: 0;
  pointer-events: none; overflow: hidden; z-index: 0;
}

.hero-canvas {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  pointer-events: none;
}

.hero-orb { position: absolute; border-radius: 50%; filter: blur(130px); }
.orb-1 {
  top: 15%; left: 25%; width: 560px; height: 560px;
  background: radial-gradient(circle, rgba(245,166,35,0.07) 0%, transparent 70%);
}
.orb-2 {
  bottom: 5%; right: 5%; width: 480px; height: 480px;
  background: radial-gradient(circle, rgba(245,166,35,0.035) 0%, transparent 70%);
}

.hero-inner {
  position: relative; z-index: 1;
  display: grid; grid-template-columns: 1fr;
  gap: 3rem; align-items: center;
  padding-top: 3rem; padding-bottom: 6rem;
}
@media (min-width: 1024px) {
  .hero-inner { grid-template-columns: 5fr 7fr; gap: 4rem; }
}

.hero-photo-col { display: flex; justify-content: center; }
@media (min-width: 1024px) { .hero-photo-col { justify-content: flex-start; } }

.photo-wrap {
  position: relative;
  width: 230px;
  margin: 52px 60px 60px 60px;
}
@media (min-width: 768px)  { .photo-wrap { width: 260px; } }
@media (min-width: 1024px) { .photo-wrap { width: 280px; } }

.lang-icon {
  position: absolute; z-index: 20;
  border-radius: 8px; overflow: hidden;
  box-shadow: 0 6px 24px rgba(0,0,0,0.35);
  pointer-events: none;
  animation: icon-float 5s ease-in-out infinite;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.45));
}
@keyframes icon-float {
  0%, 100% { transform: translateY(0)    rotate(-1.5deg); opacity: 0.92; }
  50%       { transform: translateY(-11px) rotate(1.5deg);  opacity: 0.72; }
}

.photo-frame { position: relative; z-index: 2; }
.corner {
  position: absolute; width: 38px; height: 38px;
  border-color: rgba(245,166,35,0.55); border-style: solid; z-index: 10;
}
.corner-tr { top: -10px; right: -10px; border-width: 2px 2px 0 0; }
.corner-bl { bottom: -10px; left: -10px; border-width: 0 0 2px 2px; }

.photo-glow {
  position: absolute; inset: -3px;
  background: linear-gradient(135deg, rgba(245,166,35,0.35) 0%, rgba(245,166,35,0.08) 50%, transparent 100%);
  border-radius: 2px; z-index: 0; filter: blur(2px);
}
.photo-img-wrap {
  position: relative; z-index: 1; overflow: hidden; aspect-ratio: 3/4;
}
.photo-img {
  width: 100%; height: 100%;
  object-fit: cover; object-position: top; display: block;
}
.photo-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(9,9,12,0.35) 0%, transparent 50%);
}

.avail-badge {
  position: absolute; bottom: -28px; left: 50%; transform: translateX(-50%);
  display: flex; align-items: center; gap: 8px;
  background: var(--bg-2); border: 1px solid var(--border);
  padding: 6px 16px; border-radius: 999px;
  font-size: 0.72rem; font-weight: 500; color: var(--fg-dim);
  white-space: nowrap; z-index: 10;
  transition: background var(--transition), border-color var(--transition);
}
.avail-dot {
  width: 8px; height: 8px; border-radius: 50%; background: #4ade80;
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(74,222,128,0.5); }
  50%       { opacity: 0.8; box-shadow: 0 0 0 6px rgba(74,222,128,0); }
}

.hero-text-col {
  display: flex; flex-direction: column;
  text-align: center; margin-top: 3.5rem;
}
@media (min-width: 1024px) { .hero-text-col { text-align: left; margin-top: 0; } }

.hero-role-badge {
  display: inline-flex; align-self: center;
  font-size: 0.65rem; font-weight: 500;
  letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--primary);
  border: 1px solid rgba(245,166,35,0.3);
  background: var(--primary-glow);
  padding: 6px 16px; border-radius: 999px; margin-bottom: 1.5rem;
}
@media (min-width: 1024px) { .hero-role-badge { align-self: flex-start; } }

.hero-name {
  font-size: clamp(3rem, 8vw, 6rem); font-weight: 800;
  letter-spacing: -0.05em; line-height: 0.92;
  text-transform: uppercase; color: var(--fg); margin-bottom: 1.5rem;
}
.hero-name-accent { color: var(--primary); }

.hero-sub {
  font-size: 1rem; line-height: 1.7; color: var(--fg-dim);
  font-weight: 300; max-width: 500px; margin: 0 auto 2.5rem;
}
@media (min-width: 1024px) { .hero-sub { margin-left: 0; } }
.hero-sub strong { color: var(--fg); font-weight: 600; }

.hero-cta {
  display: flex; flex-direction: column;
  gap: 1rem; align-items: center; margin-bottom: 3rem;
}
@media (min-width: 480px) { .hero-cta { flex-direction: row; justify-content: center; } }
@media (min-width: 1024px) { .hero-cta { justify-content: flex-start; } }

.btn-primary {
  display: inline-block; padding: 1rem 2.5rem;
  background: var(--primary); color: #000;
  font-size: 0.85rem; font-weight: 700; letter-spacing: 0.05em;
  cursor: none; position: relative; overflow: hidden;
  transition: box-shadow var(--transition);
  width: 100%; text-align: center;
}
@media (min-width: 480px) { .btn-primary { width: auto; } }
.btn-primary::after {
  content: ''; position: absolute; inset: 0;
  background: rgba(255,255,255,0.2); transform: translateY(100%);
  transition: transform 0.3s ease;
}
.btn-primary:hover { box-shadow: 0 0 40px rgba(245,166,35,0.35); }
.btn-primary:hover::after { transform: translateY(0); }

.btn-ghost {
  display: inline-block; padding: 1rem 2.5rem;
  background: transparent; color: var(--fg);
  font-size: 0.85rem; font-weight: 500;
  border: 1px solid var(--border); cursor: none;
  transition: border-color var(--transition), color var(--transition);
  width: 100%; text-align: center;
}
@media (min-width: 480px) { .btn-ghost { width: auto; } }
.btn-ghost:hover { border-color: rgba(245,166,35,0.5); color: var(--primary); }

.hero-stats {
  display: flex; gap: 2rem; align-items: center;
  justify-content: center; padding-top: 2rem;
  border-top: 1px solid var(--border);
}
@media (min-width: 1024px) { .hero-stats { justify-content: flex-start; } }

.stat { text-align: center; }
.stat-num {
  font-family: var(--font-display); font-size: 1.6rem;
  font-weight: 700; color: var(--fg); letter-spacing: -0.04em;
}
.stat-label {
  font-size: 0.62rem; letter-spacing: 0.15em;
  text-transform: uppercase; color: var(--fg-dim); margin-top: 2px;
}
.stat-divider { width: 1px; height: 32px; background: var(--border); }

.scroll-indicator {
  position: absolute; bottom: 2.5rem; left: 50%; transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  z-index: 2;
}
.scroll-label {
  font-size: 0.58rem; letter-spacing: 0.22em;
  text-transform: uppercase; color: var(--fg-dim);
}
.scroll-line {
  width: 1px; height: 36px; background: var(--border);
  overflow: hidden; position: relative;
}
.scroll-line-fill {
  position: absolute; inset: 0; background: var(--primary);
  animation: scroll-run 1.6s linear infinite;
}
@keyframes scroll-run {
  0%   { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}
</style>
