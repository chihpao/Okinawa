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
        duration: 1.1,
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
      lenis.value.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
  }

  function hasGsap() {
    return !!(gsap.value && ScrollTrigger.value)
  }

  return {
    init,
    stopLenis,
    startLenis,
    scrollToTop,
    hasGsap,
    gsap,
    ScrollTrigger,
    lenis
  }
}
