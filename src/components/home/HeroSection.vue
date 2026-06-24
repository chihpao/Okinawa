<template>
  <section class="hero" :class="{ 'hero-ended': countdown.state === 'after' }" id="heroSection" v-show="uiStore.viewMode === 'home'">
    <div ref="heroWrap" class="hero-image-wrap">
      <div class="hero-image-tint"></div>
      <img 
        ref="heroImg" 
        src="/assets/hero.jpg" 
        alt="Okinawa" 
        class="hero-image" 
        :class="{ loaded: isImgLoaded }"
        @load="isImgLoaded = true"
        id="heroImg" 
      />
    </div>

    <div class="hero-content">
      <div class="hero-eyebrow">2026.08.13 — 08.17 . 沖繩</div>
      <h1 class="hero-title">Okinawa<br>Trip<span class="dot">.</span></h1>

      <div class="dashboard-panel">
        <div class="countdown-group" id="countdownGroup">
          <div class="countdown-before" v-if="countdown.state === 'before'">
            <div class="countdown-item">
              <span class="countdown-num">{{ countdown.days }}</span>
              <span class="countdown-unit">天</span>
            </div>
            <div class="countdown-item">
              <span class="countdown-num">{{ countdown.hours }}</span>
              <span class="countdown-unit">時</span>
            </div>
            <div class="countdown-item">
              <span class="countdown-num">{{ countdown.minutes }}</span>
              <span class="countdown-unit">分</span>
            </div>
            <div class="countdown-item">
              <span class="countdown-num">{{ countdown.seconds }}</span>
              <span class="countdown-unit">秒後出發</span>
            </div>
          </div>
          <div class="countdown-during" v-else-if="countdown.state === 'during'">
            <span class="countdown-text">旅行第 </span><span class="countdown-num">{{ countdown.currentDay }}</span>
            <span class="countdown-text"> 天 · 還有 </span><span class="countdown-num">{{ countdown.remaining }}</span>
            <span class="countdown-text"> 天</span>
          </div>
          <div class="countdown-after" v-else>
            <span class="countdown-text">結束了 </span><span class="countdown-num">{{ countdown.daysSince }}</span>
            <span class="countdown-text"> 天</span>
            <span class="countdown-memoir">{{ countdown.memoirText }}</span>
          </div>
        </div>

        <div class="travelers-list" id="heroTravelers">
          <div v-for="(traveler, index) in tripStore.travelers" :key="index" class="traveler-tag">
            <span>{{ traveler.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUiStore } from '@/stores/ui'
import { useTripStore } from '@/stores/trip'
import { useCountdown } from '@/composables/useCountdown'
import { useMotion } from '@/composables/useMotion'

const uiStore = useUiStore()
const tripStore = useTripStore()
const motion = useMotion()

const heroImg = ref(null)
const heroWrap = ref(null)
const isImgLoaded = ref(false)

const tripRef = computed(() => tripStore.trip)
const countdown = useCountdown(tripRef)

onMounted(() => {
  if (heroImg.value && heroImg.value.complete) {
    isImgLoaded.value = true
  }
  initHeroMotion()
})

function initHeroMotion() {
  const imgEl = heroImg.value
  const wrapEl = heroWrap.value
  if (!imgEl) return

  if (motion.hasGsap() && wrapEl) {
    const stOpts = { trigger: wrapEl, start: 'top top', end: 'bottom top', scrub: 1 }
    motion.gsap.value.to(imgEl, {
      yPercent: 12, ease: 'none',
      scrollTrigger: stOpts,
    })
  }
}
</script>

<style scoped>
.hero {
  position: relative;
  display: flex; flex-direction: column;
  min-height: 85vh; padding-top: calc(var(--top-bar-h) + 2rem);
  padding-bottom: 2rem;
  padding-left: max(1.5rem, calc((100vw - var(--content-w)) / 2));
  padding-right: max(1.5rem, calc((100vw - var(--content-w)) / 2));
  transition: opacity .4s var(--ease-out);
}
.hero-ended .hero-image { filter: grayscale(100%) contrast(1.1) brightness(0.9); }
.hero-image-wrap {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  z-index: -1; overflow: hidden;
}
.hero-image-tint {
  position: absolute; inset: 0; z-index: 1;
  background: linear-gradient(180deg, var(--bg-overlay) 0%, rgba(247,244,238,0.4) 40%, var(--bg-base) 100%);
}
.hero-image {
  width: 100%; height: 120%; object-fit: cover;
  object-position: center 20%;
  opacity: 0; transform: scale(1.05);
  transition: opacity 1.5s ease-out, transform 2s ease-out;
}
.hero-image.loaded { opacity: 1; transform: scale(1); }

.hero-content {
  position: relative; z-index: 2; margin-top: auto;
  text-align: left;
}

.hero-eyebrow {
  font-family: var(--font-body); font-size: var(--fs-caption);
  letter-spacing: .25em; text-transform: uppercase;
  color: var(--accent); margin-bottom: 1.25rem; font-weight: 500;
  animation: fadeUp .8s var(--ease-out-expo) .1s both;
}
.hero-title {
  font-family: var(--font-display);
  font-size: var(--fs-display);
  line-height: .9; letter-spacing: -.04em;
  color: var(--text-primary);
  font-style: italic; font-weight: 500;
  word-break: break-word;
  animation: fadeUp .8s var(--ease-out-expo) .2s both;
}
.hero-title .dot { color: var(--accent); }

.dashboard-panel {
  margin-top: clamp(2rem, 5vw, 3.5rem);
  display: flex; flex-direction: column; gap: 2rem;
}
@media (min-width: 700px) {
  .dashboard-panel { flex-direction: row; justify-content: space-between; align-items: flex-end; }
}

.countdown-group {
  display: flex; gap: clamp(1rem, 3vw, 2rem); flex-wrap: wrap;
  animation: blurReveal 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) .35s both;
}
.countdown-before { display: flex; align-items: baseline; gap: 12px; }
.countdown-item { display: flex; align-items: baseline; gap: 4px; }
.countdown-num {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1; font-weight: 500;
}
.countdown-unit {
  font-size: var(--fs-caption); color: var(--text-secondary);
  letter-spacing: .1em; font-weight: 500;
}
.countdown-during, .countdown-after { display: flex; align-items: baseline; gap: 6px; flex-wrap: wrap; }
.countdown-during .countdown-num, .countdown-after .countdown-num { font-size: clamp(2rem, 5vw, 3rem); color: var(--accent); }
.countdown-text { font-size: var(--fs-subhead); font-weight: 500; }
.countdown-memoir {
  display: block; width: 100%; margin-top: .5rem;
  font-size: var(--fs-caption); color: var(--text-tertiary);
  font-style: italic; letter-spacing: .05em;
}

.travelers-list {
  display: flex; flex-wrap: wrap; gap: .5rem;
  animation: fadeUp .8s var(--ease-out-expo) .4s both;
}
.traveler-tag {
  background: var(--bg-raised); border: 1px solid var(--border);
  padding: .4rem 1rem; border-radius: var(--radius-full);
  font-size: var(--fs-caption); font-weight: 500; color: var(--text-secondary);
  box-shadow: var(--shadow-sm);
}
</style>
