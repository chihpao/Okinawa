<template>
  <div :class="{ 'day-mode': uiStore.viewMode === 'day' }">
    <PageLoader />
    <TopBar @go-home="uiStore.goHome()" />

    <main id="scheduleContainer">
      <HeroSection />
      
      <FilmStrip v-if="tripStore.days.length" />

      <div v-if="uiStore.viewMode === 'day'">
        <DayView 
          v-for="(day, index) in tripStore.days" 
          :key="index"
          :day="day"
          :day-index="index"
          :is-active="uiStore.activeDay === index"
          @edit="openEditModal"
          @delete="openDeleteModal"
        />
      </div>
    </main>

    <BottomNav @add="openAddModal" />
    <BackToTop />
    <ToastContainer />

    <ActivityModal 
      :visible="isActivityModalVisible"
      :edit-id="editingActivityId"
      :edit-day-index="editingDayIndex"
      @close="closeActivityModal"
      @save="onSaveActivity"
    />

    <DeleteModal 
      :visible="isDeleteModalVisible"
      @close="closeDeleteModal"
      @confirm="onConfirmDelete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useUiStore } from '@/stores/ui'
import { useTripStore } from '@/stores/trip'
import { useMotion } from '@/composables/useMotion'
import { useToast } from '@/composables/useToast'

import PageLoader from '@/components/ui/PageLoader.vue'
import TopBar from '@/components/layout/TopBar.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import BackToTop from '@/components/layout/BackToTop.vue'
import ToastContainer from '@/components/ui/ToastContainer.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import FilmStrip from '@/components/home/FilmStrip.vue'
import DayView from '@/components/schedule/DayView.vue'
import ActivityModal from '@/components/modals/ActivityModal.vue'
import DeleteModal from '@/components/modals/DeleteModal.vue'

const uiStore = useUiStore()
const tripStore = useTripStore()
const motion = useMotion()
const { showToast } = useToast()

const isActivityModalVisible = ref(false)
const isDeleteModalVisible = ref(false)
const editingActivityId = ref(null)
const editingDayIndex = ref(0)

onMounted(async () => {
  uiStore.init()
  motion.init()
  
  try {
    await tripStore.loadData(() => {
      showToast('行程已從雲端更新')
    })
  } catch (err) {
    showToast('資料載入失敗，請重新整理頁面。')
  }

  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

let ticking = false
let lastY = 0

function handleScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      const currentY = window.scrollY
      const delta = currentY - lastY
      
      if (uiStore.viewMode === 'day') {
        if (delta > 10 && currentY > 120) {
          uiStore.isNavHidden = true
        } else if (delta < -5) {
          uiStore.isNavHidden = false
        }
      } else {
        uiStore.isNavHidden = false
      }
      
      uiStore.lastScrollY = currentY
      lastY = currentY
      ticking = false
    })
    ticking = true
  }
}

function openAddModal() {
  editingActivityId.value = null
  editingDayIndex.value = uiStore.getSmartDefaultDay(tripStore.days.length)
  isActivityModalVisible.value = true
}

function openEditModal(id, dayIndex) {
  editingActivityId.value = id
  editingDayIndex.value = dayIndex
  isActivityModalVisible.value = true
}

function closeActivityModal() {
  isActivityModalVisible.value = false
}

function onSaveActivity({ dayIndex, originalDayIndex, activityId, formData }) {
  tripStore.editingDayIndex = dayIndex
  tripStore.editingActivityId = activityId
  tripStore.saveActivity(formData, originalDayIndex)
  
  isActivityModalVisible.value = false
  showToast('已儲存')
  
  setTimeout(() => {
    if (motion.ScrollTrigger.value) motion.ScrollTrigger.value.refresh()
  }, 100)
}

function openDeleteModal(id, dayIndex) {
  tripStore.requestDelete(id, dayIndex)
  isDeleteModalVisible.value = true
}

function closeDeleteModal() {
  tripStore.cancelDelete()
  isDeleteModalVisible.value = false
}

function onConfirmDelete() {
  tripStore.confirmDelete()
  isDeleteModalVisible.value = false
  showToast('已刪除')
  
  setTimeout(() => {
    if (motion.ScrollTrigger.value) motion.ScrollTrigger.value.refresh()
  }, 100)
}
</script>

<style>
#scheduleContainer {
  min-height: 100vh;
}
</style>
