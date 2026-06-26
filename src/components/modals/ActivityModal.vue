<template>
  <div class="modal-overlay" :class="{ active: visible }" id="activityModal" @click.self="closeModal" data-lenis-prevent>
    <div
      class="modal"
      :style="{ transform: dragOffset ? `translateY(${baseY + dragOffset}px)` : null }"
      @click.stop
      @touchstart.passive="onTouchStart"
      @touchmove.passive="onTouchMove"
      @touchend.passive="onTouchEnd"
    >
      <div class="modal-drag-handle"></div>
      <div class="modal-header">
        <h3 class="modal-title">{{ isEdit ? '編輯活動' : '新增活動' }}</h3>
        <button type="button" class="icon-btn modal-close" aria-label="關閉" @click="closeModal">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <form class="clean-form" id="activityForm" @submit.prevent="save">
          <DayChips :days="tripStore.days" :selected-day="localDayIndex" @update:selectedDay="(val) => localDayIndex = val" />
          <div class="form-group">
            <label class="form-label" for="actTitle">活動名稱 *</label>
            <input ref="titleInput" type="text" id="actTitle" class="form-input" v-model="formData.title" placeholder="例如：首里城、居酒屋晚餐" required>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="actStartTime">開始時間</label>
              <input type="time" id="actStartTime" class="form-input" v-model="formData.startTime">
            </div>
            <div class="form-group">
              <label class="form-label" for="actEndTime">結束時間</label>
              <input type="time" id="actEndTime" class="form-input" v-model="formData.endTime">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" for="actDesc">描述或備註</label>
            <input type="text" id="actDesc" class="form-input" v-model="formData.description" placeholder="航班號碼、營業時間...">
          </div>
          <div class="form-group">
            <label class="form-label" for="actMapUrl">Google Maps 連結</label>
            <input ref="mapUrlInput" type="url" id="actMapUrl" class="form-input" v-model="formData.mapUrl" placeholder="https://maps.app.goo.gl/...">
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline modal-cancel" @click="closeModal">取消</button>
        <button
          type="button"
          class="btn btn-primary modal-save"
          :class="{ active: isValid }"
          @click="save"
        >儲存</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useTripStore } from '@/stores/trip'
import DayChips from '../ui/DayChips.vue'
import { useToast } from '@/composables/useToast'

const props = defineProps({
  visible: { type: Boolean, default: false },
  editId: { type: String, default: null },
  editDayIndex: { type: Number, default: 0 }
})
const emit = defineEmits(['close', 'save'])
const tripStore = useTripStore()
const { showToast } = useToast()

const isEdit = computed(() => !!props.editId)
const localDayIndex = ref(0)
const titleInput = ref(null)
const mapUrlInput = ref(null)

const formData = ref({ title: '', startTime: '', endTime: '', description: '', mapUrl: '' })
const isValid = computed(() => !!formData.value.title.trim())

watch(() => props.visible, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
    localDayIndex.value = props.editDayIndex
    if (isEdit.value && tripStore.days[props.editDayIndex]) {
      const activity = tripStore.days[props.editDayIndex].activities.find(a => a.id === props.editId)
      if (activity) {
        formData.value = {
          title: activity.title || '',
          startTime: activity.startTime || '',
          endTime: activity.endTime || '',
          description: activity.description || '',
          mapUrl: activity.mapUrl || ''
        }
      }
    } else {
      formData.value = { title: '', startTime: '', endTime: '', description: '', mapUrl: '' }
    }
  } else {
    document.body.style.overflow = ''
  }
})

function closeModal() { emit('close') }

function save() {
  if (!formData.value.title.trim()) {
    showToast('請填寫活動名稱')
    if (titleInput.value) titleInput.value.focus()
    return
  }
  if (formData.value.mapUrl.trim()) {
    try { new URL(formData.value.mapUrl.trim()) }
    catch (_) {
      showToast('請輸入有效的地圖連結 (需包含 http:// 或 https://)')
      if (mapUrlInput.value) mapUrlInput.value.focus()
      return
    }
  }
  emit('save', {
    dayIndex: localDayIndex.value,
    originalDayIndex: props.editDayIndex,
    activityId: props.editId,
    formData: { ...formData.value, mapUrl: formData.value.mapUrl.trim() }
  })
}

/* 行動端下拉關閉 */
const baseY = 0
const dragOffset = ref(0)
let touchStartY = null
function onTouchStart(e) {
  if (e.touches[0].clientY > 80) { touchStartY = e.touches[0].clientY }
}
function onTouchMove(e) {
  if (touchStartY === null) return
  dragOffset.value = Math.max(0, e.touches[0].clientY - touchStartY)
}
function onTouchEnd() {
  if (dragOffset.value > 110) closeModal()
  dragOffset.value = 0
  touchStartY = null
}
</script>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(26,25,22,0.42);
  backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
  display: flex; align-items: stretch; justify-content: flex-end;
  opacity: 0; visibility: hidden; pointer-events: none;
  transition: opacity var(--dur-base) var(--ease-out), visibility var(--dur-base);
}
.modal-overlay.active { opacity: 1; visibility: visible; pointer-events: auto; }
.modal {
  width: 100%; max-width: 440px;
  background: var(--bg-raised);
  display: flex; flex-direction: column;
  transform: translateX(100%);
  transition: transform var(--dur-page) var(--ease-out-expo);
  height: 100%; max-height: 100vh;
  will-change: transform;
}
.modal-overlay.active .modal { transform: translateX(0); }
.modal-drag-handle { display: none; }
.modal-header {
  padding: 1.25rem 1.5rem 1rem; display: flex; justify-content: space-between; align-items: center;
  border-bottom: 1px solid var(--border-light);
}
.modal-title { font-size: 1.125rem; font-weight: 600; letter-spacing: -.02em; }
.icon-btn {
  width: 34px; height: 34px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-secondary);
  transition: background .2s, color .2s, transform .2s var(--ease-out-back);
}
.icon-btn:hover { background: var(--bg-deep); color: var(--text-primary); }
.icon-btn:active { transform: rotate(90deg); }
.modal-body { padding: 1.5rem; flex: 1; overflow-y: auto; min-height: 0; scrollbar-width: thin; scrollbar-color: var(--border-strong) transparent; }
.modal-body::-webkit-scrollbar { width: 6px; }
.modal-body::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 6px; }
.clean-form { display: flex; flex-direction: column; gap: 1.1rem; }
.form-group { display: flex; flex-direction: column; gap: .45rem; }
.form-row { display: flex; gap: .85rem; }
.form-row .form-group { flex: 1; }
.form-label {
  font-size: var(--fs-micro); font-weight: 500; color: var(--text-tertiary);
  letter-spacing: .12em; text-transform: uppercase;
}
.form-input {
  background: var(--bg-deep); border: 1px solid transparent;
  border-radius: var(--radius-sm);
  padding: .75rem 1rem; font-size: var(--fs-body); color: var(--text-primary);
  transition: border-color .22s, box-shadow .22s, background .22s;
}
.form-input::placeholder { color: var(--text-muted); }
.form-input:focus {
  background: #fff;
  border-color: var(--accent);
  outline: none;
  box-shadow: 0 0 0 3px var(--accent-glow);
}
input[type="time"].form-input { font-variant-numeric: tabular-nums; }
.modal-footer {
  padding: 1rem 1.5rem;
  display: flex; justify-content: flex-end; gap: .75rem;
  background: var(--bg-raised);
  border-top: 1px solid var(--border-light);
}
.btn {
  padding: .7rem 1.5rem; border-radius: var(--radius-full);
  font-weight: 500; font-size: var(--fs-body);
  transition: transform .18s var(--ease-out-back), background .2s, color .2s, opacity .2s;
}
.btn:active { transform: scale(0.95); }
.btn-outline { background: transparent; border: 1px solid var(--border-strong); color: var(--text-primary); }
.btn-outline:hover { background: var(--bg-deep); }
.btn-primary {
  background: var(--text-tertiary); color: #fff; border: none;
  transition: background .3s var(--ease-out), transform .18s var(--ease-out-back);
}
.btn-primary.active { background: var(--accent); }
.btn-primary.active:hover { background: var(--accent-deep); }

@media (max-width: 600px) {
  .modal-overlay { align-items: stretch; justify-content: stretch; }
  .modal {
    max-width: 100%; height: 100%; max-height: 100dvh;
    transform: translateY(100%);
    border-radius: 24px 24px 0 0;
    box-shadow: var(--shadow-xl);
  }
  .modal-overlay.active .modal { transform: translateY(0); }
  .modal-drag-handle {
    display: block; width: 36px; height: 4px; border-radius: 2px;
    background: var(--border-strong); margin: 8px auto 0; flex-shrink: 0;
  }
  .modal-header { padding-top: .4rem; }
  .modal-body { padding: 1.25rem; }
  .modal-footer { padding: .9rem 1.25rem; padding-bottom: calc(env(safe-area-inset-bottom, 0px) + .8rem); }
  .modal-footer .btn { flex: 1; }
  .modal-footer .modal-cancel { flex: 0 0 96px; }
}
</style>