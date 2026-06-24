<template>
  <div 
    class="activity-item" 
    :class="[actTypeClass, { 'actions-visible': actionsVisible }]" 
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <div class="act-time"><span class="time-inner">{{ displayTime }}</span></div>
    
    <div class="act-content">
      <div class="act-header">
        <div class="act-title">{{ activity.title }}</div>
        
        <div class="act-actions" :class="{ visible: actionsVisible }">
          <button type="button" class="act-btn" title="編輯" @click.stop="emit('edit', activity.id, dayIndex)">
            <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
          <button type="button" class="act-btn btn-delete" title="刪除" @click.stop="emit('delete', activity.id, dayIndex)">
            <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      </div>

      <div v-if="activity.description" class="act-desc">{{ activity.description }}</div>

      <div v-if="activity.notes" class="act-notes-wrap" :class="notesStateClass">
        <div class="act-notes">{{ activity.notes }}</div>
        <button v-if="isNotesLong && !notesExpanded" class="notes-expand" type="button" @click.stop="notesExpanded = true">⋯ 展開</button>
      </div>

      <div v-if="activity.mapUrl" class="act-meta">
        <a :href="activity.mapUrl" target="_blank" rel="noopener noreferrer" @click.stop>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
          地圖連結
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getActivityType, timeDisplay } from '@/stores/trip'

const props = defineProps({
  activity: {
    type: Object,
    required: true
  },
  dayIndex: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete'])

const actType = computed(() => getActivityType(props.activity.title))
const actTypeClass = computed(() => `act-${actType.value}`)
const displayTime = computed(() => timeDisplay(props.activity))

const isNotesLong = computed(() => props.activity.notes && props.activity.notes.length > 60)
const notesExpanded = ref(false)
const notesStateClass = computed(() => {
  if (!isNotesLong.value) return ''
  return notesExpanded.value ? 'expanded' : 'collapsed'
})

const actionsVisible = ref(false)
let pressTimer = null

function handleTouchStart(e) {
  if (pressTimer) clearTimeout(pressTimer)
  pressTimer = setTimeout(() => {
    actionsVisible.value = true
    setTimeout(() => { actionsVisible.value = false }, 3000)
    
    if (navigator.vibrate) navigator.vibrate(50)
  }, 500)
}

function handleTouchMove() {
  if (pressTimer) clearTimeout(pressTimer)
}

function handleTouchEnd() {
  if (pressTimer) clearTimeout(pressTimer)
}
</script>

<style scoped>
.activity-item {
  display: flex; gap: 1.5rem;
  padding: 1.5rem; border-radius: var(--radius-xl);
  background: #fff; box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
  position: relative; overflow: hidden;
  transition: all .4s var(--ease-out);
  opacity: 1; 
}
.activity-item:hover {
  box-shadow: var(--shadow-md); transform: translateY(-2px);
}
.activity-item::before {
  content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 6px;
  background: var(--border-strong);
  transition: width .3s var(--ease-out);
}
.activity-item:hover::before { width: 8px; }

.act-sight::before { background: var(--type-sight-bar); }
.act-food::before { background: var(--type-food-bar); }
.act-transit::before { background: var(--type-transit-bar); }
.act-hotel::before { background: var(--type-hotel-bar); }
.act-shop::before { background: var(--type-shop-bar); }
.act-other::before { background: var(--type-other-bar); }

.act-time {
  flex: 0 0 100px; padding-top: .25rem;
  font-family: var(--font-display); font-size: 1.25rem;
  font-weight: 500; color: var(--text-primary); line-height: 1.1;
}
.act-content { flex: 1; min-width: 0; }

.act-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  gap: 1rem; margin-bottom: .5rem;
}
.act-title {
  font-size: 1.125rem; font-weight: 600; color: var(--text-primary);
  line-height: 1.4;
}

.act-desc {
  font-size: var(--fs-body); color: var(--text-secondary);
  margin-bottom: .75rem; line-height: 1.6;
}

.act-notes-wrap {
  margin: .75rem 0; padding: .75rem 1rem;
  background: var(--bg-raised); border-radius: var(--radius-sm);
  border-left: 2px solid var(--border-strong);
  position: relative;
}
.act-notes {
  font-size: var(--fs-caption); color: var(--text-secondary);
  line-height: 1.6; font-style: italic; white-space: pre-wrap;
}
.act-notes-wrap.collapsed .act-notes {
  display: -webkit-box; -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; overflow: hidden;
}
.notes-expand {
  display: inline-block; margin-top: .5rem;
  font-size: 11px; font-weight: 500; color: var(--accent);
  background: var(--accent-soft); padding: .2rem .6rem;
  border-radius: var(--radius-full);
}

.act-meta {
  display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 1rem;
  font-size: var(--fs-caption);
}
.act-meta a {
  display: flex; align-items: center; gap: .35rem;
  color: var(--accent); font-weight: 500;
  background: var(--accent-soft); padding: .4rem .8rem;
  border-radius: var(--radius-full); transition: all .2s;
}
.act-meta a:hover { background: var(--accent-glow); color: var(--accent-deep); }

.act-actions {
  display: flex; gap: .5rem; opacity: 0; transform: translateX(10px);
  transition: all .3s var(--ease-out); pointer-events: none;
}
.activity-item:hover .act-actions,
.act-actions.visible {
  opacity: 1; transform: translateX(0); pointer-events: auto;
}
.act-btn {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--bg-raised); color: var(--text-secondary);
  display: flex; align-items: center; justify-content: center;
  border: 1px solid var(--border); transition: all .2s;
}
.act-btn:hover { background: #fff; color: var(--text-primary); border-color: var(--text-tertiary); transform: scale(1.05); }
.act-btn:active { transform: scale(0.95); }
.btn-delete:hover { color: #F44336; border-color: #ffcdd2; background: #ffebee; }

@media (max-width: 600px) {
  .activity-item {
    flex-direction: column; gap: .75rem; padding: 1.25rem;
    border-radius: 20px;
  }
  .act-time { flex: none; font-size: 1.15rem; display: flex; align-items: center; gap: .5rem; }
  .act-time::after { content: ''; flex: 1; height: 1px; background: var(--border-light); }
  
  .act-actions {
    position: absolute; right: 1rem; top: 1rem;
    opacity: 0; visibility: hidden; pointer-events: none;
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(4px);
    padding: .5rem; border-radius: var(--radius-full);
    box-shadow: var(--shadow-md);
  }
  
  .act-actions.visible {
    opacity: 1; visibility: visible; pointer-events: auto;
  }
  .act-btn {
    width: 44px; height: 44px;
    background: #f5f5f5;
  }
  .act-actions {
    gap: 12px; padding: 8px;
  }
}
</style>
