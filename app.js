(function () {
  'use strict';

  const SVGS = {
    person: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    car: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H9.3a2 2 0 0 0-1.6.8L5 11l-5.16.86a1 1 0 0 0-.84.99V16h3m10 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0ZM3 16a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z"/></svg>',
    flight: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 3-4 4-3-1-2 1 4 4 1-2-1-3 4-4 3 6 2.3-.7c.4-.2.7-.6.6-1.1z"/></svg>',
    map: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>',
    edit: '<svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>',
    trash: '<svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
    chevronUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>',
    x: '<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
  };

  /* ═══════════════════════════════════════════
     App State
     ═══════════════════════════════════════════ */
  let appData = null;
  let activeDay = -1;
  let countdownInterval = null;
  let editingActivityId = null;
  let editingDayIndex = null;
  let pendingDeleteId = null;
  let pendingDeleteDay = null;
  let lastScrollY = 0;

  const STORAGE_KEYS = {
    data: 'okinawa-data-v5',
    theme: 'okinawa-theme-v5',
    activeDay: 'okinawa-active-day-v5'
  };

  const DEFAULT_DATA = {
    "trip": {
      "title": "8月沖繩輕旅",
      "startDate": "2026-08-13",
      "endDate": "2026-08-17",
      "travelers": [
        { "name": "姊姊", "departureDate": "2026-08-16" },
        { "name": "姊夫", "departureDate": "2026-08-16" },
        { "name": "老媽", "departureDate": "2026-08-17" },
        { "name": "阿保", "departureDate": "2026-08-17" },
        { "name": "孜仁", "departureDate": "2026-08-17" }
      ]
    },
    "days": [
      {
        "date": "2026-08-13", "dayOfWeek": "四", "dayNumber": 1, "label": "第一天", "subtitle": "抵達沖繩", "hasRentalCar": false,
        "activities": [
          { "id": "d1-1", "startTime": "18:05", "endTime": "20:50", "title": "抵達沖繩", "description": "樂桃航空 MM930", "mapUrl": "", "notes": "" },
          { "id": "d1-2", "startTime": "20:55", "endTime": "", "title": "抵達那霸機場", "description": "", "mapUrl": "", "notes": "" },
          { "id": "d1-3", "startTime": "21:30", "endTime": "", "title": "國際通逛逛", "description": "居酒屋／餐廳吃宵夜（國際通屋台村）", "mapUrl": "https://maps.app.goo.gl/6u6qhNjxAkMXf7x57", "notes": "" }
        ]
      },
      {
        "date": "2026-08-14", "dayOfWeek": "五", "dayNumber": 2, "label": "第二天", "subtitle": "水族館 & 南部探索", "hasRentalCar": true,
        "activities": [
          { "id": "d2-1", "startTime": "09:00", "endTime": "19:00", "title": "DMM 水族館", "description": "營業時間 09:00–19:00", "mapUrl": "https://maps.app.goo.gl/J3Sxn8GvXF48GBxb6", "notes": "" },
          { "id": "d2-2", "startTime": "10:00", "endTime": "21:00", "title": "iias 沖繩豐崎", "description": "商場，跟水族館同棟（營業時間 10:00–21:00）", "mapUrl": "https://maps.app.goo.gl/J3Sxn8GvXF48GBxb6", "notes": "" },
          { "id": "d2-3", "startTime": "12:00", "endTime": "", "title": "糸滿魚市場", "description": "在地海鮮市場", "mapUrl": "https://maps.app.goo.gl/odFCotQHGYccxCqG7", "notes": "" },
          { "id": "d2-4", "startTime": "13:30", "endTime": "", "title": "波上宮", "description": "沖繩著名神社", "mapUrl": "https://maps.app.goo.gl/ufJrKjWWRGVAFXww9", "notes": "" },
          { "id": "d2-5", "startTime": "14:30", "endTime": "", "title": "波之上海灘", "description": "那霸市區的美麗海灘", "mapUrl": "https://maps.app.goo.gl/NDVUCtHN36rbvnJr7", "notes": "" },
          { "id": "d2-6", "startTime": "16:00", "endTime": "", "title": "瀨長島", "description": "白色希臘風商店街＋海景", "mapUrl": "https://maps.app.goo.gl/PMqp8EFApnQTmFux5", "notes": "" },
          { "id": "d2-7", "startTime": "19:30", "endTime": "", "title": "晚餐時間", "description": "", "mapUrl": "", "notes": "" },
          { "id": "d2-8", "startTime": "22:00", "endTime": "", "title": "居酒屋", "description": "", "mapUrl": "", "notes": "" }
        ]
      },
      {
        "date": "2026-08-15", "dayOfWeek": "六", "dayNumber": 3, "label": "第三天", "subtitle": "世界遺產 & 美國村", "hasRentalCar": true,
        "activities": [
          { "id": "d3-1", "startTime": "09:00", "endTime": "", "title": "首里城", "description": "世界文化遺產，琉球王國的象徵", "mapUrl": "https://maps.app.goo.gl/x6PA2FSKSXnzPLaG7", "notes": "" },
          { "id": "d3-2", "startTime": "10:30", "endTime": "", "title": "西來院（達摩寺）", "description": "寧靜的古寺", "mapUrl": "https://maps.app.goo.gl/Zy9CaEhQg6Z45rG66", "notes": "" },
          { "id": "d3-3", "startTime": "13:00", "endTime": "", "title": "殘波岬（燈塔）", "description": "壯觀的海岬與白色燈塔", "mapUrl": "https://maps.app.goo.gl/uTzHZ6GgooheYwFZ7", "notes": "" },
          { "id": "d3-4", "startTime": "16:00", "endTime": "", "title": "美國村", "description": "逛街 & Chill", "mapUrl": "https://maps.app.goo.gl/63dfhXpJ9nyLvwxj7", "notes": "" },
          { "id": "d3-5", "startTime": "17:30", "endTime": "", "title": "日落海灘", "description": "海灘看夕陽", "mapUrl": "https://maps.app.goo.gl/JEtSz7oXeaVYTXTJ7", "notes": "" },
          { "id": "d3-6", "startTime": "19:00", "endTime": "", "title": "AEON Mall 永旺夢樂城", "description": "購物中心", "mapUrl": "https://maps.app.goo.gl/fJ2viTEp2RU9pFcd7", "notes": "" },
          { "id": "d3-7", "startTime": "22:00", "endTime": "", "title": "居酒屋", "description": "", "mapUrl": "", "notes": "" }
        ]
      },
      {
        "date": "2026-08-16", "dayOfWeek": "日", "dayNumber": 4, "label": "第四天", "subtitle": "購物 & 姊姊姊夫回程", "hasRentalCar": false,
        "activities": [
          { "id": "d4-1", "startTime": "10:00", "endTime": "22:00", "title": "PARCO CITY", "description": "營業時間 10:00–22:00", "mapUrl": "https://maps.app.goo.gl/aEx75spVL1JSMWWk9", "notes": "" },
          { "id": "d4-2", "startTime": "16:00", "endTime": "", "title": "姊姊 & 姊夫前往機場", "description": "直接從 PARCO CITY 出發去機場", "mapUrl": "", "notes": "" },
          { "id": "d4-3", "startTime": "18:20", "endTime": "18:55", "title": "姊姊 & 姊夫回程", "description": "越捷航空 VZ569", "mapUrl": "", "notes": "" },
          { "id": "d4-4", "startTime": "20:00", "endTime": "", "title": "唐吉訶德最後補給", "description": "阿保、孜仁", "mapUrl": "", "notes": "" },
          { "id": "d4-5", "startTime": "22:00", "endTime": "", "title": "居酒屋", "description": "", "mapUrl": "", "notes": "" }
        ]
      },
      {
        "date": "2026-08-17", "dayOfWeek": "一", "dayNumber": 5, "label": "第五天", "subtitle": "回程", "hasRentalCar": false,
        "activities": [
          { "id": "d5-1", "startTime": "10:10", "endTime": "10:40", "title": "老媽 & 阿保 & 孜仁回程", "description": "虎航 IT231", "mapUrl": "", "notes": "" }
        ]
      }
    ]
  };

  /* ═══════════════════════════════════════════
     Cloud Sync
     ═══════════════════════════════════════════ */
  const GAS_URL = 'https://script.google.com/macros/s/AKfycbyyOxIV_zj1nLN97jCWl8uPY1ecYPDKkbHd3cUjrEH86cPhbphzFL_GzecPzGSSopu5/exec';
  const CloudSync = {
    pollInterval: null, syncTimeout: null, lastKnownHash: null, isSyncing: false, needsSync: false,
    POLL_MS: 15000, DEBOUNCE_MS: 2000,
    init() { console.log('[Sync] Using Google Apps Script Backend'); },
    url() { return GAS_URL; },
    setState(state) {
      const el = document.getElementById('syncIndicator');
      const label = document.getElementById('syncLabel');
      if (!el || !label) return;
      el.dataset.state = state;
      const labels = { saved: '已同步', syncing: '同步中...', unsaved: '未儲存', offline: '離線' };
      label.textContent = labels[state] || '';
    },
    async syncToCloud() {
      if (this.isSyncing) {
        this.needsSync = true;
        return;
      }
      this.isSyncing = true; this.setState('syncing'); this.needsSync = false;
      try {
        appData._lastModified = Date.now();
        appData._modifiedBy = getDeviceId();
        const body = JSON.stringify(appData);
        const res = await fetch(this.url(), { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body });
        if (!res.ok) throw new Error(`POST failed: ${res.status}`);
        this.lastKnownHash = body; this.setState('saved');
        localStorage.setItem(STORAGE_KEYS.data, body);
        console.log('[Sync] Pushed to cloud');
      } catch (err) {
        console.error('[Sync] Push failed:', err); this.setState('offline');
      } finally {
        this.isSyncing = false;
        if (this.needsSync) {
          this.scheduleSave();
        }
      }
    },
    async syncFromCloud(silent = false) {
      try {
        const res = await fetch(`${this.url()}?t=${Date.now()}`);
        if (!res.ok) throw new Error(`GET failed: ${res.status}`);
        const data = await res.json();
        const hash = JSON.stringify(data);
        if (hash !== this.lastKnownHash) {
          const wasOurWrite = data._modifiedBy === getDeviceId() && data._lastModified && (Date.now() - data._lastModified < this.POLL_MS + 2000);
          if (!wasOurWrite || !this.lastKnownHash) {
            appData = data; this.lastKnownHash = hash;
            localStorage.setItem(STORAGE_KEYS.data, hash);
            if (!silent) { renderAll(); showToast('行程已從雲端更新'); }
            console.log('[Sync] Pulled remote update');
          } else { this.lastKnownHash = hash; }
        }
        this.setState('saved'); return true;
      } catch (err) { console.error('[Sync] Pull failed:', err); if (!silent) this.setState('offline'); return false; }
    },
    startPolling() {
      if (this.pollInterval) clearInterval(this.pollInterval);
      this.pollInterval = setInterval(() => { if (!document.hidden) this.syncFromCloud(false); }, this.POLL_MS);
      document.addEventListener('visibilitychange', () => { if (!document.hidden) this.syncFromCloud(false); });
      console.log('[Sync] Polling started (every', this.POLL_MS / 1000, 's)');
    },
    scheduleSave() {
      this.setState('unsaved');
      if (this.syncTimeout) clearTimeout(this.syncTimeout);
      this.syncTimeout = setTimeout(() => { this.syncToCloud(); }, this.DEBOUNCE_MS);
    }
  };

  function getDeviceId() {
    let id = localStorage.getItem('okinawa-device-id');
    if (!id) { id = 'dev-' + Math.random().toString(36).slice(2, 10); localStorage.setItem('okinawa-device-id', id); }
    return id;
  }

  /* ═══════════════════════════════════════════
     Helpers
     ═══════════════════════════════════════════ */
  function sortActivities(activities) {
    return [...activities].sort((a, b) => {
      const ta = a.startTime || '99:99';
      const tb = b.startTime || '99:99';
      return ta.localeCompare(tb);
    });
  }

  function timeDisplay(act) {
    if (act.startTime && act.endTime) return act.startTime + ' — ' + act.endTime;
    if (act.startTime) return act.startTime;
    return '';
  }

  function isFlight(act) {
    const t = (act.title + (act.description || '')).toLowerCase();
    return t.includes('航空') || t.includes('航班') || t.includes('回程') || t.includes('flight');
  }

  /* ═══════════════════════════════════════════
     Initialization
     ═══════════════════════════════════════════ */
  async function initApp() {
    showLoading();
    CloudSync.init();
    try {
      await CloudSync.syncFromCloud(true);
      if (!appData) {
        const saved = localStorage.getItem(STORAGE_KEYS.data);
        if (saved) {
          try { appData = JSON.parse(saved); } catch (e) { appData = JSON.parse(JSON.stringify(DEFAULT_DATA)); }
        } else {
          appData = JSON.parse(JSON.stringify(DEFAULT_DATA));
        }
        await CloudSync.syncToCloud();
      }
      CloudSync.startPolling();
      const savedDay = localStorage.getItem(STORAGE_KEYS.activeDay);
      if (savedDay !== null) {
        activeDay = Math.min(Math.max(-1, parseInt(savedDay, 10)), appData.days.length - 1);
      }
      window.appData = appData;
      renderAll();
      setupEventListeners();
      startCountdown();
      initBackToTop();
      removePageLoader();
    } catch (err) {
      console.error('Init error:', err);
      showError('資料載入失敗，請重新整理頁面。');
    }
  }

  function showLoading() {
    const container = document.getElementById('scheduleContainer');
    if (!container) return;
    let html = '<div class="skeleton-list">';
    for (let i = 0; i < 4; i++) {
      html += `<div class="skeleton-item">
        <div class="skeleton-block skeleton-time"></div>
        <div style="display:flex;flex-direction:column;gap:.5rem;flex:1">
          <div class="skeleton-block skeleton-title"></div>
          <div class="skeleton-block skeleton-desc"></div>
        </div>
      </div>`;
    }
    html += '</div>';
    container.innerHTML = html;
  }

  function showError(msg) {
    const main = document.getElementById('scheduleContainer');
    if (main) main.innerHTML = `<div class="empty-state"><p>${msg}</p></div>`;
  }

  function renderAll() {
    renderHeroTravelers();
    renderDayTabs();
    renderDayViews();
    switchDay(activeDay);
  }

  function renderHeroTravelers() {
    const container = document.getElementById('heroTravelers');
    if (!container || !appData.trip.travelers) return;
    container.innerHTML = appData.trip.travelers.map(t =>
      `<div class="traveler-tag"><span>${t.name}</span></div>`
    ).join('');
  }

  function renderDayTabs() {
    const track = document.getElementById('dayTabsTrack');
    if (!track) return;
    track.innerHTML = appData.days.map((day, i) => {
      const date = new Date(day.date + 'T00:00:00');
      const m = (date.getMonth() + 1) + '月'; const d = date.getDate();
      return `<div class="day-tab${i === activeDay ? ' active' : ''}" data-day="${i}">
        <span class="tab-date">DAY ${day.dayNumber}</span>
        <span class="tab-title">${m}${d}日</span>
      </div>`;
    }).join('');
  }

  function renderDayViews() {
    const container = document.getElementById('scheduleContainer');
    if (!container) return;
    const homeHtml = renderHomeView();
    const daysHtml = appData.days.map((day, dayIndex) => {
      const timeline = renderTimeline(day.activities, dayIndex);
      const badges = renderDayBadges(day);
      return `<div class="day-view${dayIndex === activeDay ? ' active' : ''}" data-day-index="${dayIndex}">
        <div class="day-header">
          <div class="day-header-text">
            <h2>Day ${day.dayNumber} · ${day.label}</h2>
            ${day.subtitle ? `<p class="day-subtitle">${escapeHtml(day.subtitle)}</p>` : ''}
          </div>
          ${badges ? `<div class="day-badges">${badges}</div>` : ''}
        </div>
        <div class="timeline">${timeline}</div>
      </div>`;
    }).join('');
    container.innerHTML = homeHtml + daysHtml;
    setTimeout(initScrollReveal, 100);
  }

  function renderHomeView() {
    const tiles = appData.days.map((day, i) => {
      const date = new Date(day.date + 'T00:00:00');
      const m = date.getMonth() + 1;
      const d = date.getDate();
      const count = (day.activities && day.activities.length) || 0;
      return `<button class="home-tile" data-day="${i}">
        <div class="home-tile-day">Day ${day.dayNumber}</div>
        <div class="home-tile-date">${m}月${d}日 · ${day.dayOfWeek}</div>
        <div class="home-tile-sub">${escapeHtml(day.subtitle || '')}</div>
        <div class="home-tile-meta">${count} 項活動</div>
      </button>`;
    }).join('');
    return `<div class="home-view${activeDay === -1 ? ' active' : ''}">
      <div class="home-guide">
        <p class="home-guide-eyebrow">行程總覽</p>
        <h2 class="home-guide-title">挑一天看看<br>我們要去哪</h2>
      </div>
      <div class="home-tiles">${tiles}</div>
    </div>`;
  }

  function renderDayBadges(day) {
    let badges = '';
    if (day.hasRentalCar) {
      badges += `<span class="day-badge">${SVGS.car} 租車</span>`;
    }
    if (day.activities && day.activities.some(isFlight)) {
      badges += `<span class="day-badge">${SVGS.flight} 航班</span>`;
    }
    if (appData.trip.travelers) {
      appData.trip.travelers.forEach(t => {
        if (day.date > t.departureDate.split('T')[0]) {
          badges += `<span class="day-badge">${SVGS.person} ${t.name} 已回程</span>`;
        }
      });
    }
    return badges;
  }

  function renderTimeline(activities, dayIndex) {
    if (!activities || activities.length === 0) {
      return '<div class="timeline-empty"><div class="empty-title">這天還沒安排活動</div><div class="empty-sub">點右下角 + 開始記下計畫</div></div>';
    }
    const sorted = sortActivities(activities);
    return sorted.map(act => renderActivityCard(act, dayIndex)).join('');
  }

  function renderActivityCard(activity, dayIndex) {
    const mapHtml = activity.mapUrl
      ? `<a href="${escapeHtml(activity.mapUrl)}" target="_blank" rel="noopener noreferrer">${SVGS.map} 地圖連結</a>`
      : '';

    return `<div class="activity-item observer-target" data-id="${activity.id}">
      <div class="act-time"><span class="time-inner">${escapeHtml(timeDisplay(activity))}</span></div>
      <div class="act-content">
        <div class="act-header">
          <div class="act-title">${escapeHtml(activity.title)}</div>
          <div class="act-actions">
            <button class="act-btn" data-action="edit" data-id="${activity.id}" data-day="${dayIndex}" title="編輯">${SVGS.edit}</button>
            <button class="act-btn btn-delete" data-action="delete" data-id="${activity.id}" data-day="${dayIndex}" title="刪除">${SVGS.trash}</button>
          </div>
        </div>
        ${activity.description ? `<div class="act-desc">${escapeHtml(activity.description)}</div>` : ''}
        ${activity.notes ? `<div class="act-notes">${escapeHtml(activity.notes)}</div>` : ''}
        ${mapHtml ? `<div class="act-meta">${mapHtml}</div>` : ''}
      </div>
    </div>`;
  }

  function switchDay(index) {
    if (!appData || index < -1 || index >= appData.days.length) return;
    activeDay = index;
    localStorage.setItem(STORAGE_KEYS.activeDay, index);
    document.querySelectorAll('.day-tab').forEach((tab, i) => tab.classList.toggle('active', i === index));
    document.querySelectorAll('.day-view').forEach((view, i) => view.classList.toggle('active', i === index));
    const homeView = document.querySelector('.home-view');
    if (homeView) homeView.classList.toggle('active', index === -1);
    const hero = document.getElementById('heroSection');
    if (hero) {
      if (index === -1) {
        hero.style.opacity = '1';
        hero.style.pointerEvents = 'auto';
      } else {
        hero.style.opacity = '0';
        hero.style.pointerEvents = 'none';
      }
    }
    const activeTab = document.querySelector('.day-tab.active');
    if (activeTab) activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }

  /* ═══════════════════════════════════════════
     Countdown
     ═══════════════════════════════════════════ */
  function startCountdown() {
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
  }

  function updateCountdown() {
    const startDate = new Date(appData.trip.startDate + 'T00:00:00');
    const endDate = new Date(appData.trip.endDate + 'T23:59:59');
    const now = new Date();
    const group = document.getElementById('countdownGroup');
    if (!group) return;
    if (now >= startDate && now <= endDate) {
      const currentDay = Math.floor((now - startDate) / (1000 * 60 * 60 * 24)) + 1;
      group.innerHTML = `<div class="countdown-status">旅程進行中 — 第 ${currentDay} 天</div>`;
      return;
    }
    if (now > endDate) {
      group.innerHTML = '<div class="countdown-status">旅程已結束</div>';
      clearInterval(countdownInterval); countdownInterval = null;
      return;
    }
    const diff = startDate - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    const ds = document.getElementById('countDays'); const hs = document.getElementById('countHours');
    const ms = document.getElementById('countMins'); const ss = document.getElementById('countSecs');
    if (ds) updateCountdownValue(ds, days);
    if (hs) updateCountdownValue(hs, String(hours).padStart(2, '0'));
    if (ms) updateCountdownValue(ms, String(mins).padStart(2, '0'));
    if (ss) updateCountdownValue(ss, String(secs).padStart(2, '0'));
  }

  function updateCountdownValue(el, value) {
    const str = String(value);
    if (el.textContent !== str) {
      el.textContent = str;
      el.classList.add('tick');
      setTimeout(() => el.classList.remove('tick'), 300);
    }
  }

  function removePageLoader() {
    const loader = document.getElementById('pageLoader');
    if (loader) setTimeout(() => loader.classList.add('hidden'), 1200);
  }

  /* ═══════════════════════════════════════════
     Scroll Reveal
     ═══════════════════════════════════════════ */
  function initScrollReveal() {
    const targets = document.querySelectorAll('.observer-target:not(.observed)');
    if (!('IntersectionObserver' in window)) { targets.forEach(t => t.classList.add('reveal')); return; }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('reveal'), 50);
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -80px 0px', threshold: 0.08 });
    targets.forEach(target => { target.classList.add('observed'); observer.observe(target); });
  }

  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    btn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  function setupScrollHide() {
    const topBar = document.getElementById('topBar');
    const bottomNav = document.getElementById('bottomNav');
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScroll = window.scrollY;
          const scrollDelta = currentScroll - lastScrollY;
          if (scrollDelta > 10 && currentScroll > 120) {
            if (topBar) topBar.classList.add('hidden');
            if (bottomNav) bottomNav.classList.add('hidden');
          } else if (scrollDelta < -5) {
            if (topBar) topBar.classList.remove('hidden');
            if (bottomNav) bottomNav.classList.remove('hidden');
          }
          lastScrollY = currentScroll;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  function setupSwipeGestures() {
    const main = document.getElementById('scheduleContainer');
    if (!main) return;
    let startX = 0, startY = 0, isDragging = false;
    main.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX; startY = e.touches[0].clientY; isDragging = true;
    }, { passive: true });
    main.addEventListener('touchend', (e) => {
      if (!isDragging) return; isDragging = false;
      const endX = e.changedTouches[0].clientX; const endY = e.changedTouches[0].clientY;
      const diffX = endX - startX; const diffY = endY - startY;
      if (Math.abs(diffX) > 60 && Math.abs(diffX) > Math.abs(diffY) * 1.8) {
        if (diffX < 0) switchDay(activeDay + 1);
        else switchDay(activeDay - 1);
      }
    }, { passive: true });
  }

  function setupEventListeners() {
    document.getElementById('brandHome')?.addEventListener('click', () => {
      switchDay(-1); window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.getElementById('btnFab')?.addEventListener('click', openAddModal);
    document.getElementById('dayTabsTrack')?.addEventListener('click', (e) => {
      const tab = e.target.closest('.day-tab');
      if (tab) switchDay(parseInt(tab.dataset.day, 10));
    });
    document.getElementById('scheduleContainer')?.addEventListener('click', (e) => {
      const editBtn = e.target.closest('[data-action="edit"]');
      const deleteBtn = e.target.closest('[data-action="delete"]');
      const homeTile = e.target.closest('.home-tile');
      if (editBtn) { e.stopPropagation(); openEditModal(editBtn.dataset.id, parseInt(editBtn.dataset.day, 10)); }
      else if (deleteBtn) { e.stopPropagation(); requestDelete(deleteBtn.dataset.id, parseInt(deleteBtn.dataset.day, 10)); }
      else if (homeTile) { switchDay(parseInt(homeTile.dataset.day, 10)); }
    });
    document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => btn.addEventListener('click', closeAllModals));
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => { if (e.target === overlay) closeAllModals(); });
    });
    document.querySelector('.modal-save')?.addEventListener('click', saveActivity);
    document.getElementById('btnDeleteCancel')?.addEventListener('click', closeAllModals);
    document.getElementById('btnDeleteConfirm')?.addEventListener('click', confirmDelete);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAllModals(); });
    setupSwipeGestures();
    setupScrollHide();
  }

  /* ═══════════════════════════════════════════
     Modal Functions
     ═══════════════════════════════════════════ */
  function getSmartDefaultDay() {
    if (activeDay >= 0 && activeDay < appData.days.length) return activeDay;
    const todayStr = new Date().toISOString().split('T')[0];
    const todayIdx = appData.days.findIndex(d => d.date === todayStr);
    return todayIdx >= 0 ? todayIdx : 0;
  }

  function renderDayChips(selectedIndex) {
    const container = document.getElementById('dayChips');
    if (!container) return;
    container.innerHTML = appData.days.map((day, i) => {
      const date = new Date(day.date + 'T00:00:00');
      return `<button type="button" class="day-chip${i === selectedIndex ? ' active' : ''}" data-day-idx="${i}">Day ${day.dayNumber} · ${date.getMonth() + 1}/${date.getDate()} (${day.dayOfWeek})</button>`;
    }).join('');
    container.querySelectorAll('.day-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        editingDayIndex = parseInt(chip.dataset.dayIdx, 10);
        container.querySelectorAll('.day-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
      });
    });
  }

  function openAddModal() {
    editingActivityId = null; editingDayIndex = getSmartDefaultDay();
    resetForm(); renderDayChips(editingDayIndex);
    document.getElementById('modalTitle').textContent = '新增活動';
    openModal('activityModal');
  }

  function openEditModal(activityId, dayIndex) {
    editingActivityId = activityId; editingDayIndex = dayIndex;
    const activity = appData.days[dayIndex].activities.find(a => a.id === activityId);
    if (!activity) return;
    renderDayChips(dayIndex);
    document.getElementById('actTitle').value = activity.title || '';
    document.getElementById('actStartTime').value = activity.startTime || '';
    document.getElementById('actEndTime').value = activity.endTime || '';
    document.getElementById('actDesc').value = activity.description || '';
    document.getElementById('actMapUrl').value = activity.mapUrl || '';
    document.getElementById('modalTitle').textContent = '編輯活動';
    openModal('activityModal');
  }

  function saveActivity() {
    const titleInput = document.getElementById('actTitle');
    const title = titleInput.value.trim();
    if (!title) { titleInput.focus(); showToast('請填寫活動名稱'); return; }
    const day = appData.days[editingDayIndex];
    const existing = editingActivityId ? day.activities.find(a => a.id === editingActivityId) : null;
    const activityData = {
      startTime: document.getElementById('actStartTime').value,
      endTime: document.getElementById('actEndTime').value,
      title: title,
      description: document.getElementById('actDesc').value.trim(),
      mapUrl: document.getElementById('actMapUrl').value.trim(),
      notes: existing ? (existing.notes || '') : ''
    };
    if (editingActivityId) {
      const idx = day.activities.findIndex(a => a.id === editingActivityId);
      if (idx !== -1) { activityData.id = editingActivityId; day.activities[idx] = activityData; }
    } else {
      activityData.id = 'd' + (editingDayIndex + 1) + '-' + Date.now();
      day.activities.push(activityData);
    }
    saveData(); closeAllModals();
    renderDayViews(); switchDay(activeDay);
    showToast('已儲存');
  }

  function requestDelete(activityId, dayIndex) { pendingDeleteId = activityId; pendingDeleteDay = dayIndex; openModal('deleteModal'); }

  function confirmDelete() {
    if (pendingDeleteId === null || pendingDeleteDay === null) return;
    const day = appData.days[pendingDeleteDay];
    day.activities = day.activities.filter(a => a.id !== pendingDeleteId);
    saveData(); closeAllModals();
    renderDayViews(); switchDay(activeDay);
    showToast('已刪除');
    pendingDeleteId = null; pendingDeleteDay = null;
  }

  function resetForm() {
    const form = document.getElementById('activityForm');
    if (form) form.reset();
  }

  function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) { modal.classList.add('active'); document.body.style.overflow = 'hidden'; }
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    document.body.style.overflow = '';
  }

  function saveData() {
    localStorage.setItem(STORAGE_KEYS.data, JSON.stringify(appData));
    CloudSync.scheduleSave();
  }

  function showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast'; toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => { toast.classList.add('toast-out'); setTimeout(() => toast.remove(), 350); }, 2500);
  }

  function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); switchDay(activeDay + 1); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); switchDay(activeDay - 1); }
  });

  document.addEventListener('DOMContentLoaded', initApp);
})();
