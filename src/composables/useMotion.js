import { ref, markRaw } from 'vue'

const gsap = ref(null)
const ScrollTrigger = ref(null)
const lenis = ref(null)

export function useMotion() {
  function init() {
    gsap.value = window.gsap ? markRaw(window.gsap) : null
    ScrollTrigger.value = window.ScrollTrigger ? markRaw(window.ScrollTrigger) : null

    if (gsap.value && ScrollTrigger.value) {
      gsap.value.registerPlugin(ScrollTrigger.value)
      ScrollTrigger.value.config({ ignoreMobileResize: true })
    }

    if (window.Lenis) {
      lenis.value = markRaw(new window.Lenis({
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: false,
      }))

      if (gsap.value) {
        gsap.value.ticker.add((time) => lenis.value.raf(time * 1000))
        gsap.value.ticker.lagSmoothing(0)
      } else {
        const lenisRef = lenis.value
        requestAnimationFrame(function raf(time) {
          lenisRef.raf(time)
          requestAnimationFrame(raf)
        })
      }
    }
  }

  function stopLenis() {
    if (lenis.value) lenis.value.stop()
  }

  function startLenis() {
    if (lenis.value) lenis.value.start()
  }

  function scrollToTop() {
    if (lenis.value) {
      lenis.value.scrollTo(0, { immediate: false, duration: 0.9 })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function smoothScrollTo(target, offset = 0) {
    if (lenis.value) {
      lenis.value.scrollTo(target, { offset, duration: 1 })
    } else if (typeof target === 'number') {
      window.scrollTo({ top: target + offset, behavior: 'smooth' })
    } else if (target && target.getBoundingClientRect) {
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset, behavior: 'smooth' })
    }
  }

  function hasGsap() {
    return !!(gsap.value && ScrollTrigger.value)
  }

  /* 通用 stag 進場（使用 CSS class，避免依賴 GSAP） */
  function staggerReveal(elements, opts = {}) {
    const delay = opts.delay || 0
    const step = opts.step || 70
    const cls = opts.cls || 'stagger-in'
    if (!elements || !elements.length) return
    const list = Array.from(elements)
    list.forEach((el, i) => {
      if (!el) return
      el.style.animationDelay = `${delay + i * step}ms`
      el.classList.add(cls)
    })
  }

  /* 漣漪點擊反饋（純 DOM/SVG），不依賴框架 */
  function createRipple(event) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const target = event.currentTarget
    if (!target) return
    const rect = target.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = (event.clientX !== undefined ? event.clientX : rect.left + rect.width / 2) - rect.left - size / 2
    const y = (event.clientY !== undefined ? event.clientY : rect.top + rect.height / 2) - rect.top - size / 2
    const span = document.createElement('span')
    span.className = 'ripple'
    span.style.cssText = `position:absolute;border-radius:50%;pointer-events:none;background:rgba(26,25,22,0.18);width:${size}px;height:${size}px;left:${x}px;top:${y}px;transform:scale(0);opacity:1;mix-blend-mode:multiply;animation:rippleGo 0.62s cubic-bezier(0,0,0.2,1) forwards;`
    const prev = getComputedStyle(target).position
    if (prev === 'static') target.style.position = 'relative'
    target.appendChild(span)
    setTimeout(() => span.remove(), 640)
  }

  return {
    init,
    stopLenis,
    startLenis,
    scrollToTop,
    smoothScrollTo,
    hasGsap,
    staggerReveal,
    createRipple,
    gsap,
    ScrollTrigger,
    lenis
  }
}