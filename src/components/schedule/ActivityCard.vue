<template>
  <div class="activity-item" :class="actTypeClass" @click="onCardTap">
    <div class="act-rail">
      <span class="rail-dot"></span>
      <span class="rail-bar" :style="barStyle"></span>
    </div>

    <div class="act-card">
      <div class="act-top">
        <div class="act-time">
          <span class="time-start">{{ activity.startTime || '--:--' }}</span>
          <span v-if="activity.endTime" class="time-arrow">→</span>
          <span v-if="activity.endTime" class="time-end">{{ activity.endTime }}</span>
        </div>
        <div class="act-actions" :class="{ open: actionsOpen }">
          <button type="button" class="act-btn" title="編輯" @click.stop="emit('edit', activity.id, dayIndex)">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button type="button" class="act-btn btn-delete" title="刪除" @click.stop="emit('delete', activity.id, dayIndex)">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>

      <div class="act-title-wrap">
        <span class="act-type-badge" :class="actTypeClass">{{ typeLabel }}</span>
        <div class="act-title">{{ activity.title }}</div>
      </div>

      <div v-if="activity.description" class="act-desc">{{ activity.description }}</div>

      <div v-if="activity.notes" class="act-notes-wrap" :class="notesStateClass">
        <div class="act-notes" ref="notesEl">{{ activity.notes }}</div>
        <button v-if="isNotesLong" class="notes-expand" type="button" @click.stop="notesExpanded = !notesExpanded">
          <span class="notes-expand-text">{{ notesExpanded ? '收合' : '展開' }}</span>
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" class="notes-expand-icon"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
      </div>

      <div v-if="activity.mapUrl" class="act-meta">
        <a :href="activity.mapUrl" target="_blank" rel="noopener noreferrer" class="act-link" @click.stop>
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
          地圖連結
          <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" class="act-link-ext"><path d="M7 17L17 7"/><polyline points="7 7 17 7 17 17"/></svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getActivityType, timeDisplay } from '@/stores/trip'

const props = defineProps({
  activity: { type: Object, required: true },
  dayIndex: { type: Number, required: true },
  staggerIndex: { type: Number, default: 0 }
})
const emit = defineEmits(['edit', 'delete'])

const actType = computed(() => getActivityType(props.activity.title))
const actTypeClass = computed(() => `act-${actType.value}`)

const TYPE_LABELS = {
  sight: '景點', food: '美食', transit: '交通', hotel: '住宿', shop: '購物', other: '其他'
}
const typeLabel = computed(() => TYPE_LABELS[actType.value] || '其他')

const isNotesLong = computed(() => props.activity.notes && props.activity.notes.length > 60)
const notesExpanded = ref(false)
const notesStateClass = computed(() => {
  if (!isNotesLong.value) return ''
  return notesExpanded.value ? 'expanded' : 'collapsed'
})

const actionsOpen = ref(false)
function onCardTap() {
  if (window.matchMedia('(hover: hover)').matches) return
  actionsOpen.value = !actionsOpen.value
}

const barStyle = computed(() => {
  return { '--bar-color': `var(--${actType.value.replace('act-','type-')}-bar)` }
})
</script>

<style scoped>
.activity-item {
  display: flex; gap: 16px; position: relative;
  padding-right: 4px;
}

/* 左軸 */
.act-rail {
  flex: 0 0 18px; position: relative; align-self: stretch;
  display: flex; flex-direction: column; align-items: center;
  min-height: 64px;
}
.rail-dot {
  position: absolute; left: 50%; top: 18px; transform: translateX(-50%);
  width: 10px; height: 10px; border-radius: 50%;
  background: var(--paper-2);
  border: 2px solid var(--bar-color, var(--border-strong));
  box-shadow: var(--shadow-xs);
  z-index: 2;
  transition: transform .25s var(--ease-out-back);
}
.activity-item:hover .rail-dot { transform: translateX(-50%) scale(1.25); background: var(--bar-color); }
.rail-bar {
  flex: 1; width: 2px; margin-top: 4px;
  background: var(--bar-color, var(--border-light));
  opacity: 0.45; border-radius: 2px;
}

/* 卡片本體（純實色避免捲動時 backdrop-filter 重繪卡頓） */
.act-card {
  flex: 1; min-width: 0;
  background: var(--bg-raised);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 1rem 1.1rem;
  box-shadow: var(--shadow-xs);
  position: relative;
  transition: transform .28s var(--ease-out), box-shadow .28s var(--ease-out), border-color .28s var(--ease-out);
  overflow: hidden;
}
.activity-item:hover .act-card { will-change: transform; }
.act-card::before {
  content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px;
  background: var(--bar-color);
  opacity: 0.85;
  transition: width .25s var(--ease-out);
}
.activity-item:hover .act-card {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--border-strong);
}
.activity-item:hover .act-card::before { width: 6px; }

.act-top {
  display: flex; align-items: center; justify-content: space-between; gap: .65rem;
  margin-bottom: .4rem;
}
.act-time {
  font-family: var(--font-display); font-weight: 500;
  font-size: 1.0625rem; color: var(--text-secondary);
  display: inline-flex; align-items: baseline; gap: .35rem;
  font-variant-numeric: tabular-nums;
  letter-spacing: -.01em;
}
.time-start { color: var(--text-primary); }
.time-arrow { color: var(--text-muted); font-size: .85em; font-weight: 300; }
.time-end { color: var(--text-tertiary); }

.act-actions { display: flex; gap: 6px; }
@media (hover: hover) {
  .act-actions { opacity: 0; transform: translateX(6px); transition: all .3s var(--ease-out); pointer-events: none; }
  .activity-item:hover .act-actions { opacity: 1; transform: none; pointer-events: auto; }
}
@media (hover: none) {
  .act-actions { opacity: 0; transform: translateX(6px); pointer-events: none; transition: all .25s var(--ease-out); }
  .act-actions.open { opacity: 1; transform: none; pointer-events: auto; }
}
.act-btn {
  width: 30px; height: 30px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: var(--bg-deep); color: var(--text-tertiary);
  transition: transform .18s var(--ease-out-back), background .18s, color .18s;
}
.act-btn:active { transform: scale(0.86); }
.btn-delete { color: #B95F4E; }
.btn-delete:hover { color: #D43F2A; background: #F8E0D8; }

.act-title-wrap {
  display: flex; align-items: center; gap: .55rem; flex-wrap: wrap;
  margin-bottom: .35rem;
}
.act-type-badge {
  font-size: var(--fs-micro); font-weight: 500;
  padding: .18rem .55rem; border-radius: var(--radius-xs);
  letter-spacing: .1em; text-transform: uppercase;
  color: var(--bar-color); background: color-mix(in srgb, var(--bar-color) 10%, transparent);
  flex-shrink: 0;
  white-space: nowrap;
}
.act-title {
  font-size: 1.0625rem; font-weight: 600; color: var(--text-primary);
  line-height: 1.4;
}
.act-desc {
  font-size: var(--fs-body); color: var(--text-secondary);
  margin: .25rem 0 .3rem; line-height: 1.65;
}
.act-notes-wrap {
  margin: .55rem 0;
  background: var(--bg-deep);
  border-left: 2px solid var(--bar-color);
  border-radius: 0 var(--radius-xs) var(--radius-xs) 0;
  padding: .65rem .85rem .55rem;
  position: relative;
  overflow: hidden;
}
.act-notes-wrap.collapsed .act-notes {
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.act-notes {
  font-size: var(--fs-caption); color: var(--text-secondary);
  line-height: 1.65; font-style: italic; white-space: pre-wrap;
}
.notes-expand {
  display: inline-flex; align-items: center; gap: 3px;
  margin-top: .5rem;
  font-size: 11px; font-weight: 500;
  color: var(--bar-color);
  text-transform: uppercase; letter-spacing: .08em;
}
.notes-expand-icon { transition: transform .3s var(--ease-out); }
.notes-expand.expanded .notes-expand-icon,
.act-notes-wrap.expanded .notes-expand-icon { transform: rotate(180deg); }

.act-meta { display: flex; flex-wrap: wrap; gap: .65rem; margin-top: .65rem; }
.act-link {
  display: inline-flex; align-items: center; gap: .35rem;
  font-size: var(--fs-caption); font-weight: 500;
  color: var(--accent);
  padding: .4rem .85rem;
  border-radius: var(--radius-full);
  background: var(--accent-soft);
  transition: background .22s, color .22s, transform .22s;
}
.act-link:hover { background: var(--accent-glow); color: var(--accent-deep); transform: translateY(-1px); }
.act-link:active { transform: translateY(0) scale(0.96); }
.act-link-ext { opacity: 0.7; }

/* type bar color mapping */
.act-sight { --bar-color: var(--type-sight-bar); }
.act-food { --bar-color: var(--type-food-bar); }
.act-transit { --bar-color: var(--type-transit-bar); }
.act-hotel { --bar-color: var(--type-hotel-bar); }
.act-shop { --bar-color: var(--type-shop-bar); }
.act-other { --bar-color: var(--type-other-bar); }

@media (max-width: 600px) {
  .activity-item { gap: 10px; }
  .act-rail { flex: 0 0 14px; }
  .rail-dot { width: 8px; height: 8px; top: 14px; }
  .act-card { padding: .85rem .9rem; border-radius: 14px; }
  .act-time { font-size: .95rem; }
  .act-title { font-size: 1rem; }
  .act-desc { font-size: .875rem; }
  .act-actions { gap: 4px; }
  .act-btn { width: 28px; height: 28px; }
}

@media (prefers-reduced-motion: reduce) {
  .activity-item.stagger-in { animation: none; opacity: 1; }
}
</style>