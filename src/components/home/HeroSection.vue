<template>
  <section class="hero" :class="{ 'hero-ended': state === 'after' }" id="heroSection" v-show="uiStore.viewMode === 'home'">
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
      <div class="hero-eyebrow">
        <span class="hero-eyebrow-line"></span>
        2026.08.13 — 08.17 · 沖繩
      </div>
      <h1 class="hero-title">
        <span class="hero-title-row">Okinawa</span>
        <span class="hero-title-row hero-title-row-italic">Trip<span class="dot">.</span></span>
      </h1>

      <div class="dashboard-panel">
        <div class="countdown-group" id="countdownGroup">
          <div class="countdown-before" v-if="state === 'before'">
            <div class="countdown-item">
              <FlipNumber :value="days" digit="2" /><span class="countdown-unit">天</span>
            </div>
            <div class="countdown-sep">:</div>
            <div class="countdown-item">
              <FlipNumber :value="hours" digit="2" /><span class="countdown-unit">時</span>
            </div>
            <div class="countdown-sep">:</div>
            <div class="countdown-item">
              <FlipNumber :value="minutes" digit="2" /><span class="countdown-unit">分</span>
            </div>
            <div class="countdown-sep">:</div>
            <div class="countdown-item">
              <FlipNumber :value="seconds" digit="2" /><span class="countdown-unit">秒</span>
            </div>
          </div>
          <div class="countdown-during" v-else-if="state === 'during'">
            <span class="countdown-text">旅行第</span>
            <span class="countdown-emphasis">{{ currentDay }}</span>
            <span class="countdown-text">天 · 還有</span>
            <span class="countdown-emphasis">{{ remaining }}</span>
            <span class="countdown-text">天</span>
          </div>
          <div class="countdown-after" v-else>
            <span class="countdown-text">過了</span>
            <span class="countdown-emphasis">{{ daysSince }}</span>
            <span class="countdown-text">天</span>
            <span class="countdown-memoir">{{ memoirText }}</span>
          </div>
        </div>

        <div class="travelers-list" id="heroTravelers">
          <div
            v-for="(traveler, index) in tripStore.travelers"
            :key="index"
            class="traveler-tag"
            :style="{ animationDelay: (0.45 + index * 0.06) + 's' }"
          >
            <span class="traveler-dot"></span>
            {{ traveler.name }}
          </div>
        </div>
      </div>

      <div class="hero-hint" v-if="state !== 'after'">
        <span class="hero-hint-text">點開每一天 · 翻閱行程</span>
        <span class="hero-hint-arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </span>
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
import FlipNumber from '@/components/ui/FlipNumber.vue'

const uiStore = useUiStore()
const tripStore = useTripStore()
const motion = useMotion()

const heroImg = ref(null)
const heroWrap = ref(null)
const isImgLoaded = ref(false)

const tripRef = computed(() => tripStore.trip)
const {
  state,
  days,
  hours,
  minutes,
  seconds,
  currentDay,
  totalDays,
  remaining,
  daysSince,
  memoirText
} = useCountdown(tripRef)

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
    motion.gsap.value.to(imgEl, {
      yPercent: 14, ease: 'none',
      scrollTrigger: { trigger: wrapEl, start: 'top top', end: 'bottom top', scrub: 1 }
    })
  }
}
</script>

<style scoped>
.hero {
  position: relative;
  display: flex; flex-direction: column;
  min-height: 88vh; padding-top: calc(var(--top-bar-h) + var(--safe-top) + 2rem);
  padding-bottom: 1.5rem;
  padding-left: max(1.25rem, calc((100vw - var(--content-w)) / 2));
  padding-right: max(1.25rem, calc((100vw - var(--content-w)) / 2));
  transition: opacity .4s var(--ease-out);
}
.hero-ended .hero-image { filter: grayscale(100%) contrast(1.05) brightness(0.92); }

.hero-image-wrap {
  position: absolute; top: 0; left: 0; right: 0; bottom: -8%;
  z-index: -1; overflow: hidden;
}
.hero-image-tint {
  position: absolute; inset: 0; z-index: 1;
  background:
    linear-gradient(180deg, rgba(246,241,232,0.55) 0%, rgba(246,241,232,0.15) 38%, var(--bg-base) 96%);
}
.hero-image {
  width: 100%; height: 116%; object-fit: cover;
  object-position: center 22%;
  opacity: 0; transform: scale(1.06);
  transition: opacity 1.4s ease-out, transform 2s ease-out;
}
.hero-image.loaded { opacity: 1; transform: scale(1); animation: kenBreathe 32s ease-in-out infinite 2s; }

.hero-content {
  position: relative; z-index: 2;
  margin-top: auto;
  max-width: 640px;
}

.hero-eyebrow {
  display: inline-flex; align-items: center; gap: .65rem;
  font-family: var(--font-body); font-size: var(--fs-caption);
  letter-spacing: .28em; text-transform: uppercase;
  color: var(--accent); margin-bottom: 1.5rem; font-weight: 500;
  animation: fadeUp .8s var(--ease-out-expo) .1s both;
}
.hero-eyebrow-line {
  width: 28px; height: 1px; background: var(--accent);
  display: inline-block;
}

.hero-title {
  font-family: var(--font-display);
  font-size: var(--fs-display);
  line-height: .92; letter-spacing: -.035em;
  color: var(--text-primary);
  font-weight: 600;
  word-break: break-word;
  animation: fadeUp .85s var(--ease-out-expo) .18s both;
}
.hero-title-row { display: block; }
.hero-title-row-italic { font-style: italic; font-weight: 500; }
.hero-title .dot { color: var(--accent); }

.dashboard-panel {
  margin-top: clamp(2rem, 5vw, 3.5rem);
  display: flex; flex-direction: column; gap: 2rem;
}
@media (min-width: 760px) {
  .dashboard-panel { flex-direction: row; justify-content: space-between; align-items: flex-end; }
}

.countdown-group {
  display: flex; gap: clamp(.2rem, 1vw, .65rem); flex-wrap: wrap;
  animation: blurReveal 1.1s cubic-bezier(0.2, 0.8, 0.2, 1) .32s both;
  align-items: baseline;
}
.countdown-before { display: flex; align-items: baseline; gap: clamp(.35rem, 1vw, .7rem); flex-wrap: wrap; }
.countdown-item { display: flex; align-items: flex-end; gap: .3rem; }
.countdown-sep {
  font-family: var(--font-display); font-size: clamp(1.8rem, 4.5vw, 2.8rem); font-weight: 300;
  color: var(--text-muted); align-self: center; transform: translateY(-.15em);
}
.countdown-unit {
  font-size: var(--fs-caption); color: var(--text-secondary);
  letter-spacing: .08em; font-weight: 500;
  padding-bottom: .25rem;
}
.countdown-during, .countdown-after { display: flex; align-items: baseline; gap: .35rem; flex-wrap: wrap; }
.countdown-emphasis {
  font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 500; color: var(--accent); line-height: 1;
}
.countdown-text { font-size: var(--fs-subhead); font-weight: 500; color: var(--text-secondary); }
.countdown-memoir {
  display: block; width: 100%; margin-top: .55rem;
  font-size: var(--fs-caption); color: var(--text-tertiary);
  font-style: italic; letter-spacing: .04em;
}

.travelers-list {
  display: flex; flex-wrap: wrap; gap: .5rem;
  align-items: center;
}
.traveler-tag {
  display: inline-flex; align-items: center; gap: .4rem;
  background: var(--bg-overlay); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--border-light);
  padding: .4rem .9rem; border-radius: var(--radius-full);
  font-size: var(--fs-caption); font-weight: 500; color: var(--text-secondary);
  box-shadow: var(--shadow-xs);
  opacity: 0; transform: translateY(10px);
  animation: fadeUp .6s var(--ease-out-expo) forwards;
}
.traveler-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: var(--accent);
}

.hero-hint {
  margin-top: 1.75rem;
  display: flex; align-items: center; gap: .5rem;
  color: var(--text-tertiary);
  font-size: .75rem; letter-spacing: .15em; text-transform: uppercase;
  animation: fadeUp .7s var(--ease-out-expo) .6s both;
}
.hero-hint-arrow {
  display: inline-flex; animation: nudgeY 2.4s ease-in-out infinite;
}
</style>