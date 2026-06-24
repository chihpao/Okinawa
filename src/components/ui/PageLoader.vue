<template>
  <div class="loader-overlay" :class="{ hidden: !visible }" id="pageLoader">
    <div class="loader-content">
      <div class="loader-logo">OKINAWA</div>
      <div class="loader-bar"><div class="loader-progress"></div></div>
      <div class="loader-tagline">Loading Memories...</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const visible = ref(true)

onMounted(() => {
  setTimeout(() => {
    visible.value = false
  }, 1200)
})
</script>

<style scoped>
.loader-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: var(--bg-base);
  display: flex; align-items: center; justify-content: center;
  transition: opacity .6s var(--ease-out-expo), visibility .6s;
}
.loader-overlay.hidden {
  opacity: 0; visibility: hidden; pointer-events: none;
}
.loader-content {
  text-align: center;
}
.loader-logo {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700; letter-spacing: .2em;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}
.loader-bar {
  width: 120px; height: 2px; margin: 0 auto 1.5rem;
  background: var(--border); border-radius: 2px;
  overflow: hidden; position: relative;
}
.loader-progress {
  position: absolute; left: 0; top: 0; bottom: 0; width: 40%;
  background: var(--accent); border-radius: 2px;
  animation: loaderSlide 1.5s cubic-bezier(0.65, 0, 0.35, 1) infinite;
}
.loader-tagline {
  font-family: var(--font-body);
  font-size: var(--fs-micro);
  letter-spacing: .1em; color: var(--text-tertiary);
  text-transform: uppercase;
  animation: loaderPulse 2s ease-in-out infinite;
}
</style>
