<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const NAV_LINKS = [
  { name: "Home",     to: "/"         },
  { name: "About",    to: "/about"    },
  { name: "Projects", to: "/projects" },
  { name: "Skills",   to: "/skills"   },
  { name: "Contact",  to: "/contact"  },
];

const SOCIALS = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/",
    svg: `<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>`,
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://facebook.com/",
    svg: `<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>`,
  },
  {
    id: "gmail",
    label: "Gmail",
    href: "mailto:justine.buncag@gmail.com",
    svg: `<path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.907 1.528-1.147C21.69 2.28 24 3.434 24 5.457z"/>`,
  },
];
</script>

<template>
  <footer class="footer">
    <div class="footer-top">
      <div class="container footer-inner">

        <div class="footer-brand">
          <a class="footer-logo" @click.prevent="router.push('/')">
            <span class="footer-logo-accent">J.</span>BUNCAG
          </a>
          <p class="footer-tagline">
            Crafting precision-engineered digital<br />experiences through clean code.
          </p>
          <div class="footer-socials">
            <a
              v-for="s in SOCIALS"
              :key="s.id"
              :href="s.href"
              :title="s.label"
              class="footer-social-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" v-html="s.svg" />
            </a>
          </div>
        </div>

        <div class="footer-nav-col">
          <p class="footer-col-heading">Navigation</p>
          <nav class="footer-nav">
            <a
              v-for="link in NAV_LINKS"
              :key="link.to"
              class="footer-nav-link"
              @click.prevent="router.push(link.to)"
            >
              {{ link.name }}
            </a>
          </nav>
        </div>

        <div class="footer-contact-col">
          <p class="footer-col-heading">Get in Touch</p>
          <a href="mailto:justine.buncag@gmail.com" class="footer-email">
            justine.buncag@gmail.com
          </a>
          <p class="footer-location">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            Philippines
          </p>
          <div class="footer-avail">
            <span class="avail-dot" />
            Available for work
          </div>
        </div>

      </div>
    </div>

    <div class="footer-bottom">
      <div class="container footer-bottom-inner">
        <p class="footer-copy">
          © {{ new Date().getFullYear() }} Justine Buncag. All rights reserved.
        </p>
        <p class="footer-built">
          Built with <span class="footer-heart">♥</span> using Vue 3 + Vite
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--border);
  background: var(--bg-2);
  transition: background var(--transition), border-color var(--transition);
}

.footer-top { padding: 4rem 0 3rem; }

.footer-inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}
@media (min-width: 640px) {
  .footer-inner { grid-template-columns: 1fr 1fr; }
}
@media (min-width: 1024px) {
  .footer-inner { grid-template-columns: 2fr 1fr 1fr; gap: 4rem; }
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-logo {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  cursor: none;
  width: fit-content;
}
.footer-logo-accent { color: var(--primary); }

.footer-tagline {
  font-size: 0.85rem;
  line-height: 1.7;
  color: var(--fg-dim);
  font-weight: 300;
  max-width: 280px;
}

.footer-socials {
  display: flex;
  gap: 0.6rem;
  margin-top: 0.5rem;
}

.footer-social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1px solid var(--border);
  color: var(--fg-dim);
  cursor: none;
  transition: color var(--transition), border-color var(--transition), background var(--transition);
}
.footer-social-btn:hover {
  color: var(--primary);
  border-color: rgba(245,166,35,0.4);
  background: var(--primary-glow);
}

.footer-col-heading {
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--fg);
  margin-bottom: 1.25rem;
}

.footer-nav {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.footer-nav-link {
  font-size: 0.88rem;
  font-weight: 400;
  color: var(--fg-dim);
  cursor: none;
  transition: color var(--transition);
  width: fit-content;
}
.footer-nav-link:hover { color: var(--primary); }

.footer-contact-col {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.footer-email {
  font-size: 0.85rem;
  color: var(--fg-dim);
  cursor: none;
  transition: color var(--transition);
  word-break: break-all;
}
.footer-email:hover { color: var(--primary); }

.footer-location {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: var(--fg-dim);
}

.footer-avail {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.78rem;
  color: var(--fg-dim);
  font-weight: 500;
  margin-top: 0.25rem;
}
.avail-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #4ade80;
  animation: pulse 2s ease-in-out infinite;
  flex-shrink: 0;
}
@keyframes pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(74,222,128,0.5); }
  50%       { opacity: 0.8; box-shadow: 0 0 0 5px rgba(74,222,128,0); }
}

.footer-bottom {
  border-top: 1px solid var(--border);
  padding: 1.25rem 0;
}
.footer-bottom-inner {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  text-align: center;
}
@media (min-width: 640px) {
  .footer-bottom-inner {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
}

.footer-copy,
.footer-built {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--fg-dim);
  opacity: 0.6;
}
.footer-heart { color: var(--primary); }
</style>
