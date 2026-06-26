<template>
  <div class="loader-overlay" :class="{ hidden: !visible }" id="pageLoader">
    <div class="loader-content">
      <div class="loader-mark">
        <span v-for="(ch, i) in mark" :key="i" class="loader-char" :style="{ animationDelay: (i * 80) + 'ms' }">{{ ch }}</span>
      </div>
      <div class="loader-meta">
        <span class="loader-dot"></span>
        <span class="loader-tagline">{{ tagline }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const visible = ref(true)
const mark = 'OKINAWA'.split('')
const taglines = ['Loading the days ahead', 'Arranging the waves', 'Opening the camera roll']
const tagline = ref('')

onMounted(() => {
  let i = 0
  tagline.value = taglines[0]
  const timer = setInterval(() => {
    i = (i + 1) % taglines.length
    tagline.value = taglines[i]
  }, 600)

  setTimeout(() => {
    clearInterval(timer)
    visible.value = false
  }, 1100)
})
</script>

<style scoped>
.loader-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: var(--bg-base);
  display: flex; align-items: center; justify-content: center;
  transition: opacity .6s var(--ease-out-expo), visibility .6s, clip-path .8s var(--ease-out-expo);
  clip-path: inset(0 0 0 0);
}
.loader-overlay.hidden {
  opacity: 0; visibility: hidden; pointer-events: none;
  clip-path: inset(0 0 100% 0);
}
.loader-content {
  text-align: center;
}
.loader-mark {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 5vw, 2.4rem);
  font-weight: 700; letter-spacing: .28em;
  margin-right: -.28em;
  color: var(--text-primary);
  display: inline-flex;
}
.loader-char {
  display: inline-block;
  opacity: 0;
  transform: translateY(0.5em);
  filter: blur(6px);
  animation: letterFly .7s var(--ease-out-expo) forwards;
}
.loader-char:nth-child(8) { color: var(--accent); }

.loader-meta {
  margin-top: 1.5rem;
  display: flex; align-items: center; justify-content: center; gap: .5rem;
  opacity: 0; animation: fadeUp .5s var(--ease-out-expo) .5s both;
}
.loader-dot {
  width: 5px; height: 5px; border-radius: 50%; background: var(--accent);
  animation: pulse 1.6s ease-in-out infinite;
}
.loader-tagline {
  font-family: var(--font-body);
  font-size: var(--fs-micro);
  letter-spacing: .22em; text-transform: uppercase;
  color: var(--text-tertiary);
  transition: opacity .3s var(--ease-out);
}
</style>