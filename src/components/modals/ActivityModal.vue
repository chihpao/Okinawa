<template>
  <div class="modal-overlay" :class="{ active: visible }" id="activityModal" @click.self="closeModal" data-lenis-prevent>
    <div class="modal" @click.stop>
      <div class="modal-drag-handle"></div>
      <div class="modal-header">
        <h3 class="modal-title">{{ isEdit ? '編輯活動' : '新增活動' }}</h3>
        <button type="button" class="icon-btn modal-close" aria-label="關閉" @click="closeModal">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
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
        <button type="button" class="btn btn-primary modal-save" @click="save">儲存</button>
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

const formData = ref({
  title: '',
  startTime: '',
  endTime: '',
  description: '',
  mapUrl: ''
})

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

function closeModal() {
  emit('close')
}

function save() {
  if (!formData.value.title.trim()) {
    showToast('請填寫活動名稱')
    if (titleInput.value) titleInput.value.focus()
    return
  }
  if (formData.value.mapUrl.trim()) {
    try {
      new URL(formData.value.mapUrl.trim())
    } catch (_) {
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
</script>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(28,28,26,0.4); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
  display: flex; align-items: stretch; justify-content: flex-end;
  opacity: 0; visibility: hidden; pointer-events: none; transition: opacity .3s var(--ease-out), visibility .3s;
}
.modal-overlay.active { opacity: 1; visibility: visible; pointer-events: auto; }
.modal {
  width: 100%; max-width: 440px; background: var(--bg-raised);
  display: flex; flex-direction: column; transform: translateX(100%); transition: transform .4s var(--ease-out-expo); height: 100%; max-height: 100vh;
}
.modal-overlay.active .modal { transform: translateX(0); }
.modal-drag-handle { display: none; }
.modal-header { padding: 1.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
.modal-title { font-size: 1.25rem; font-weight: 600; letter-spacing: -.02em; }
.icon-btn { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--text-secondary); transition: background .2s; }
.icon-btn:hover { background: var(--bg-deep); color: var(--text-primary); }
.modal-body { padding: 1.5rem; flex: 1; overflow-y: auto; min-height: 0; scrollbar-width: thin; scrollbar-color: var(--border-strong) transparent; }
.modal-body::-webkit-scrollbar { width: 6px; }
.modal-body::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 6px; }
.clean-form { display: flex; flex-direction: column; gap: 1.25rem; }
.form-group { display: flex; flex-direction: column; gap: .5rem; }
.form-row { display: flex; gap: 1rem; }
.form-row .form-group { flex: 1; }
.form-label { font-size: var(--fs-caption); font-weight: 500; color: var(--text-secondary); }
.form-input {
  background: #fff; border: 1px solid var(--border); border-radius: var(--radius-sm);
  padding: .75rem 1rem; font-size: var(--fs-body); color: var(--text-primary); transition: border-color .2s, box-shadow .2s;
}
.form-input:focus { border-color: var(--accent); outline: none; box-shadow: 0 0 0 3px var(--accent-glow); }
.modal-footer { padding: 1.5rem; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 1rem; background: var(--bg-raised); }
.btn { padding: .75rem 1.5rem; border-radius: var(--radius-full); font-weight: 500; font-size: var(--fs-body); transition: all .2s; }
.btn-outline { background: transparent; border: 1px solid var(--border-strong); color: var(--text-primary); }
.btn-outline:hover { background: var(--bg-deep); }
.btn-primary { background: var(--text-primary); border: 1px solid var(--text-primary); color: #fff; }
.btn-primary:hover { transform: translateY(-1px); box-shadow: var(--shadow-sm); }
.btn-primary:active { transform: scale(0.98); }

@media (max-width: 600px) {
  .modal-overlay { align-items: stretch; justify-content: center; }
  .modal { max-width: 100%; border-radius: 0; height: 100%; max-height: 100dvh; transform: translateY(100%); }
  .modal-overlay.active .modal { transform: translateY(0); }
  .modal-drag-handle { display: none; }
  .modal-header { padding: env(safe-area-inset-top, 1rem) 1.5rem 1rem; border-bottom: 1px solid var(--border); }
  .modal-body { padding: 1.5rem; overflow-y: auto; }
  .modal-footer { padding-bottom: calc(env(safe-area-inset-bottom, 1rem) + 0.5rem); }
}
</style>
