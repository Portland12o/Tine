<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

const cursorX = ref(-100);
const cursorY = ref(-100);
const dotX = ref(-100);
const dotY = ref(-100);
const isHovering = ref(false);
const isTyping = ref(false);

let animFrame: number;
let lerpX = -100, lerpY = -100;

const onMouseMove = (e: MouseEvent) => {
  cursorX.value = e.clientX;
  cursorY.value = e.clientY;
};

const onMouseOver = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  isTyping.value = !!(
    target.closest("input") ||
    target.closest("textarea") ||
    target.closest("select") ||
    target.closest("[contenteditable]")
  );
  isHovering.value = !isTyping.value && !!(
    target.closest("a") ||
    target.closest("button") ||
    target.closest("[data-cursor]")
  );
};

const animate = () => {
  lerpX += (cursorX.value - lerpX) * 0.12;
  lerpY += (cursorY.value - lerpY) * 0.12;
  dotX.value = lerpX;
  dotY.value = lerpY;
  animFrame = requestAnimationFrame(animate);
};

onMounted(() => {
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseover", onMouseOver);
  animFrame = requestAnimationFrame(animate);
});

onUnmounted(() => {
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseover", onMouseOver);
  cancelAnimationFrame(animFrame);
});
</script>

<template>
  <div
    class="cursor-ring"
    :class="{ hovering: isHovering, typing: isTyping }"
    :style="{ left: cursorX + 'px', top: cursorY + 'px' }"
  />
  <div
    class="cursor-dot"
    :class="{ typing: isTyping }"
    :style="{ left: dotX + 'px', top: dotY + 'px' }"
  />
  <div
    v-if="isTyping"
    class="cursor-caret"
    :style="{ left: cursorX + 'px', top: cursorY + 'px' }"
  />
</template>

<style scoped>
.cursor-ring {
  position: fixed;
  width: 36px;
  height: 36px;
  border: 1.5px solid rgba(245, 166, 35, 0.5);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
  transform: translate(-50%, -50%);
  transition: transform 0.15s ease, width 0.25s ease, height 0.25s ease,
    background 0.25s ease, border-color 0.25s ease, opacity 0.2s ease,
    border-radius 0.25s ease;
}
.cursor-ring.hovering {
  width: 50px;
  height: 50px;
  background: rgba(245, 166, 35, 0.08);
  border-color: var(--primary);
}
.cursor-ring.typing {
  opacity: 0;
}

.cursor-dot {
  position: fixed;
  width: 5px;
  height: 5px;
  background: var(--primary);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  transition: opacity 0.2s ease;
}
.cursor-dot.typing {
  opacity: 0;
}

/* ── Vertical caret ──────────────────────────── */
.cursor-caret {
  position: fixed;
  width: 2px;
  height: 22px;
  background: var(--primary);
  border-radius: 1px;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 8px rgba(245, 166, 35, 0.6);
  animation: caret-blink 1s ease-in-out infinite;
}

@keyframes caret-blink {
  0%, 45%  { opacity: 1; }
  55%, 100% { opacity: 0; }
}

@media (pointer: coarse) {
  .cursor-ring,
  .cursor-dot,
  .cursor-caret { display: none; }
}
</style>
