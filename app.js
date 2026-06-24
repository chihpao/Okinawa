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

  let appData = null;
  let activeDay = 0;
  let viewMode = 'home';
  let countdownInterval = null;
  let editingActivityId = null;
  let editingDayIndex = null;
  let pendingDeleteId = null;
  let pendingDeleteDay = null;
  let lastScrollY = 0;

  const Motion = {
    lenis: null,
    gsap: null,
    ScrollTrigger: null,
    init() {
      this.gsap = window.gsap;
      this.ScrollTrigger = window.ScrollTrigger;
      if (this.gsap && this.ScrollTrigger) {
        this.gsap.registerPlugin(this.ScrollTrigger);
        this.ScrollTrigger.config({ ignoreMobileResize: true });
      }
      if (window.Lenis) {
        this.lenis = new window.Lenis({
          duration: 1.1,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          smoothTouch: false,
        });
        if (this.gsap) {
          this.gsap.ticker.add((time) => this.lenis.raf(time * 1000));
          this.gsap.ticker.lagSmoothing(0);
        } else {
          const lenisRef = this.lenis;
          requestAnimationFrame(function raf(time) {
            lenisRef.raf(time);
            requestAnimationFrame(raf);
          });
        }
      }
    },
    stopLenis() { if (this.lenis) this.lenis.stop(); },
    startLenis() { if (this.lenis) this.lenis.start(); },
    scrollToTop() {
      if (this.lenis) this.lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
    },
    hasGsap() { return !!(this.gsap && this.ScrollTrigger); },
  };

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

  async function initApp() {
    Motion.init();
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
        activeDay = Math.min(Math.max(0, parseInt(savedDay, 10)), appData.days.length - 1);
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
    if (main) main.innerHTML = `<div class="empty-state"><div class="empty-state-msg">${msg}</div><div class="empty-state-hint">重新整理頁面試試，或等一下再回來</div></div>`;
  }

  function renderAll() {
    renderHeroTravelers();
    renderDayTabs();
    renderDayViews();
    if (viewMode === 'day') switchDay(activeDay);
    else applyHomeView();
    initHeroMotion();
  }

  function initHeroMotion() {
    const heroImg = document.querySelector('.hero-image');
    const heroWrap = document.querySelector('.hero-image-wrap');
    if (!heroImg) return;

    if (heroImg.complete) { heroImg.classList.add('loaded'); }
    else { heroImg.addEventListener('load', () => heroImg.classList.add('loaded')); }

    if (Motion.hasGsap() && heroWrap) {
      const stOpts = { trigger: heroWrap, start: 'top top', end: 'bottom top', scrub: 1 };
      Motion.gsap.to(heroImg, {
        yPercent: 12, ease: 'none',
        scrollTrigger: stOpts,
      });
    }
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
      const dlabel = day.dayOfWeek ? '(' + day.dayOfWeek + ')' : '';
      const count = day.activities ? day.activities.length : 0;
      return `<div class="day-frame${i === activeDay ? ' active' : ''}" data-day="${i}">
        <div class="frame-top">
          <span class="frame-rec"></span>
        </div>
        <span class="frame-num">${day.dayNumber}</span>
        <span class="frame-date">${m}${d}日 ${dlabel}</span>
        ${day.subtitle ? `<span class="frame-sub">${escapeHtml(day.subtitle)}</span>` : ''}
        <div class="frame-bottom">
          <span>${count} 項行程</span>
        </div>
      </div>`;
    }).join('');
    renderTopDayNav();
  }

  function renderTopDayNav() {
    const track = document.getElementById('topDayTrack');
    if (!track) return;
    track.innerHTML = appData.days.map((day, i) => {
      const date = new Date(day.date + 'T00:00:00');
      const label = (date.getMonth() + 1) + '/' + date.getDate();
      return `<button type="button" class="top-day-tab${i === activeDay ? ' active' : ''}" data-day="${i}">${label}</button>`;
    }).join('');
  }

  function renderDayViews() {
    const container = document.getElementById('scheduleContainer');
    if (!container) return;
    const daysHtml = appData.days.map((day, dayIndex) => {
      const timeline = renderTimeline(day.activities, dayIndex);
      const badges = renderDayBadges(day);
      return `<div class="day-view${dayIndex === activeDay ? ' active' : ''}" data-day-index="${dayIndex}">
        <div class="day-header">
          <div class="day-header-text">
            <h2><span class="day-num">Day ${day.dayNumber}</span> · ${escapeHtml(day.label)}</h2>
            ${day.subtitle ? `<p class="day-subtitle">${escapeHtml(day.subtitle)}</p>` : ''}
          </div>
          ${badges ? `<div class="day-badges">${badges}</div>` : ''}
        </div>
        <div class="timeline">${timeline}</div>
      </div>`;
    }).join('');
    container.innerHTML = daysHtml;
    setTimeout(initScrollReveal, 100);
  }



  function renderDayBadges(day) {
    let badges = '';
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
      return '<div class="timeline-empty"><div class="empty-title">這天還沒有安排，也許是最好的一天。</div></div>';
    }
    const sorted = sortActivities(activities);
    return sorted.map(act => renderActivityCard(act, dayIndex)).join('');
  }

  const ACT_KEYWORDS = {
      transit: ['抵達', '機場', '回程', '航空', '前往', '出發'],
      food: ['居酒屋', '晚餐', '宵夜', '市場', '餐廳', '吃'],
      shop: ['PARCO', 'AEON', '唐吉訶德', '商場', '購物', 'iias', 'Mall'],
      sight: ['水族館', '海灘', '神社', '寺', '城', '岬', '島', '美國村', '通', '宮'],
      hotel: ['飯店', '民宿', '旅館', '住宿', 'hotel', 'Hotel', 'Hostel', 'チェックイン']
    };
    function getActivityType(title) {
      if (!title) return 'other';
      for (const [type, keywords] of Object.entries(ACT_KEYWORDS)) {
        if (keywords.some(kw => title.includes(kw))) return type;
      }
      return 'other';
    }

  function renderActivityCard(activity, dayIndex) {
    const mapHtml = activity.mapUrl
      ? `<a href="${escapeHtml(activity.mapUrl)}" target="_blank" rel="noopener noreferrer">${SVGS.map} 地圖連結</a>`
      : '';
    const actType = getActivityType(activity.title);

    // Notes: journal style with collapse if > 60 chars
    let notesHtml = '';
    if (activity.notes) {
      const noteText = escapeHtml(activity.notes);
      const isLong = activity.notes.length > 60;
      if (isLong) {
        notesHtml = `<div class="act-notes-wrap collapsed"><div class="act-notes">${noteText}</div><button class="notes-expand" type="button">⋯ 展開</button></div>`;
      } else {
        notesHtml = `<div class="act-notes">${noteText}</div>`;
      }
    }

    return `<div class="activity-item act-${actType}" data-id="${activity.id}">
      <div class="act-time"><span class="time-inner">${escapeHtml(timeDisplay(activity))}</span></div>
      <div class="act-content">
        <div class="act-header">
          <div class="act-title">
            ${escapeHtml(activity.title)}
          </div>
          <div class="act-actions">
            <button class="act-btn" data-action="edit" data-id="${activity.id}" data-day="${dayIndex}" title="編輯">${SVGS.edit}</button>
            <button class="act-btn btn-delete" data-action="delete" data-id="${activity.id}" data-day="${dayIndex}" title="刪除">${SVGS.trash}</button>
          </div>
        </div>
        ${activity.description ? `<div class="act-desc">${escapeHtml(activity.description)}</div>` : ''}
        ${notesHtml}
        ${mapHtml ? `<div class="act-meta">${mapHtml}</div>` : ''}
      </div>
    </div>`;
  }

  function applyHomeView() {
    document.getElementById('app')?.classList.remove('day-mode');
    const hero = document.getElementById('heroSection');
    if (hero) {
      hero.style.display = '';
      hero.style.opacity = '1';
      hero.style.pointerEvents = 'auto';
    }
    const dayNav = document.querySelector('.day-nav-container');
    if (dayNav) dayNav.classList.remove('nav-hidden');
    document.querySelectorAll('.day-frame').forEach(f => f.classList.remove('active'));
    document.querySelectorAll('.day-view').forEach(v => v.classList.remove('active'));
  }

  function goHome() {
    viewMode = 'home';
    activeDay = 0;
    localStorage.setItem(STORAGE_KEYS.activeDay, 0);
    applyHomeView();
    Motion.scrollToTop();
  }

  function switchDay(index) {
    if (!appData || index < 0 || index >= appData.days.length) return;
    viewMode = 'day';
    const prevDay = activeDay;
    activeDay = index;
    localStorage.setItem(STORAGE_KEYS.activeDay, index);
    document.getElementById('app')?.classList.add('day-mode');
    document.querySelectorAll('.day-frame').forEach((tab, i) => tab.classList.toggle('active', i === index));
    document.querySelectorAll('.top-day-tab').forEach((tab, i) => tab.classList.toggle('active', i === index));

    const hero = document.getElementById('heroSection');
    if (hero) hero.style.display = 'none';

    const dayNav = document.querySelector('.day-nav-container');
    if (dayNav) dayNav.classList.add('nav-hidden');

    const showTarget = document.querySelector('.day-view[data-day-index="' + index + '"]');
    const prevTarget = prevDay !== index ? document.querySelector('.day-view[data-day-index="' + prevDay + '"]') : null;

    // Exit animation for previous day
    if (prevTarget && prevTarget.classList.contains('active')) {
      prevTarget.classList.remove('active');
      prevTarget.classList.add('day-exit');
      prevTarget.addEventListener('animationend', function handler() {
        prevTarget.classList.remove('day-exit');
        prevTarget.removeEventListener('animationend', handler);
      }, { once: true });
    } else {
      document.querySelectorAll('.day-view').forEach(v => v.classList.remove('active'));
    }

    // Enter animation for new day
    if (showTarget) {
      // Reset activity items for re-reveal
      showTarget.querySelectorAll('.activity-item').forEach(item => {
        item.classList.remove('revealed');
        item.classList.remove('observed');
      });

      showTarget.classList.remove('day-exit');
      showTarget.classList.add('day-enter');
      showTarget.classList.add('active');
      showTarget.addEventListener('animationend', function handler() {
        showTarget.classList.remove('day-enter');
        showTarget.removeEventListener('animationend', handler);
        if (Motion.ScrollTrigger) Motion.ScrollTrigger.refresh();
      }, { once: true });
    }

    const activeTab = document.querySelector('.top-day-tab.active');
    if (activeTab) activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    Motion.scrollToTop();
    // Staggered reveal after a brief delay for day-enter to kick in
    setTimeout(() => revealActivities(showTarget), 150);
  }

  let revealObserver = null;
  function revealActivities(container) {
    if (!container) return;
    const items = container.querySelectorAll('.activity-item:not(.revealed)');
    if (!items.length) return;
    if (revealObserver) revealObserver.disconnect();

    // Staggered reveal: each card enters 60ms after the previous
    let revealIndex = 0;
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const item = entry.target;
          const delay = revealIndex * 60;
          item.style.transitionDelay = delay + 'ms';
          requestAnimationFrame(() => {
            item.classList.add('revealed');
            // Clean up transition-delay after animation
            setTimeout(() => { item.style.transitionDelay = ''; }, 400 + delay);
          });
          revealIndex++;
          revealObserver.unobserve(item);
        }
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.06 });
    items.forEach(function (item) { revealObserver.observe(item); });
  }

  function startCountdown() {
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
  }

  function updateCountdown() {
    const startDate = new Date(appData.trip.startDate + 'T00:00:00');
    const endDate = new Date(appData.trip.endDate + 'T23:59:59');
    const now = new Date();
    const group = document.getElementById('countdownGroup');
    const hero = document.getElementById('heroSection');
    if (!group) return;

    // State 2: Trip is ongoing — cherish mode
    if (now >= startDate && now <= endDate) {
      const currentDay = Math.floor((now - startDate) / (1000 * 60 * 60 * 24)) + 1;
      const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
      const remaining = totalDays - currentDay;
      const html = `<div class="countdown-during">
        <span class="countdown-text">旅行第 </span><span class="countdown-num">${currentDay}</span>
        <span class="countdown-text"> 天 · 還有 </span><span class="countdown-num">${remaining}</span>
        <span class="countdown-text"> 天</span>
      </div>`;
      if (group.innerHTML !== html) group.innerHTML = html;
      if (hero) hero.classList.remove('hero-ended');
      return;
    }

    // State 3: Trip is over — closed album
    if (now > endDate) {
      const daysSince = Math.floor((now - endDate) / (1000 * 60 * 60 * 24));
      const html = `<div class="countdown-after">
        <span class="countdown-text">結束了 </span><span class="countdown-num">${daysSince}</span>
        <span class="countdown-text"> 天</span>
        <span class="countdown-memoir">那段時光還在這裡。</span>
      </div>`;
      if (group.innerHTML !== html) group.innerHTML = html;
      if (hero) hero.classList.add('hero-ended');
      clearInterval(countdownInterval); countdownInterval = null;
      return;
    }

    // State 1: Trip hasn't started — anticipation mode
    const diff = startDate - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (hero) hero.classList.remove('hero-ended');
    const html = `<div class="countdown-before">
      <span class="countdown-num">${days}</span>
      <span class="countdown-unit">天後出發</span>
    </div>`;
    if (group.innerHTML !== html) group.innerHTML = html;
  }

  function updateCountdownValue(el, value) {
    const str = String(value);
    if (el.textContent === str) return;
    if (Motion.hasGsap()) {
      Motion.gsap.fromTo(el,
        { y: -12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out',
          onStart: () => { el.textContent = str; } });
    } else {
      el.textContent = str;
    }
  }

  function removePageLoader() {
    const loader = document.getElementById('pageLoader');
    if (loader) setTimeout(() => loader.classList.add('hidden'), 1200);
  }

  function initScrollReveal() {
    const targets = document.querySelectorAll('.activity-item:not(.observed)');

    if (!targets.length) return;
    targets.forEach(t => t.classList.add('observed'));

    if (Motion.hasGsap()) {
      Motion.gsap.set(targets, { opacity: 0, y: 24 });
      Motion.ScrollTrigger.batch(targets, {
        start: 'top 88%',
        onEnter: (batch) => Motion.gsap.to(batch, {
          opacity: 1, y: 0, duration: 0.4, ease: 'power2.out',
          stagger: 0.06, overwrite: true,
        }),
      });
      Motion.ScrollTrigger.refresh();
    } else {
      targets.forEach(t => t.classList.add('reveal'));
    }
  }

  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    btn.addEventListener('click', () => {
      if (Motion.lenis) Motion.lenis.scrollTo(0, { duration: 1 });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function setupScrollHide() {
    const topBar = document.getElementById('topBar');
    const bottomNav = document.getElementById('bottomNav');
    const dayNav = document.querySelector('.day-nav-container');
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScroll = window.scrollY;
          const scrollDelta = currentScroll - lastScrollY;
          const hideOnScroll = viewMode === 'day';
          if (scrollDelta > 10 && currentScroll > 120) {
            if (topBar) topBar.classList.add('hidden');
            if (bottomNav) bottomNav.classList.add('hidden');
            if (hideOnScroll && dayNav) dayNav.classList.add('nav-hidden');
          } else if (scrollDelta < -5) {
            if (topBar) topBar.classList.remove('hidden');
            if (bottomNav) bottomNav.classList.remove('hidden');
            if (hideOnScroll && dayNav) dayNav.classList.remove('nav-hidden');
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
        if (diffX < 0 && activeDay < appData.days.length - 1) switchDay(activeDay + 1);
        else if (diffX > 0 && activeDay > 0) switchDay(activeDay - 1);
      }
    }, { passive: true });
  }

  function setupEventListeners() {
    document.getElementById('brandHome')?.addEventListener('click', () => {
      goHome();
    });
    document.getElementById('btnFab')?.addEventListener('click', openAddModal);
    document.getElementById('dayTabsTrack')?.addEventListener('click', (e) => {
      const frame = e.target.closest('.day-frame');
      if (frame) switchDay(parseInt(frame.dataset.day, 10));
    });
    document.getElementById('topDayTrack')?.addEventListener('click', (e) => {
      const tab = e.target.closest('.top-day-tab');
      if (tab) switchDay(parseInt(tab.dataset.day, 10));
    });
    document.getElementById('scheduleContainer')?.addEventListener('click', (e) => {
      const editBtn = e.target.closest('[data-action="edit"]');
      const deleteBtn = e.target.closest('[data-action="delete"]');
      const expandBtn = e.target.closest('.notes-expand');
      if (editBtn) { e.stopPropagation(); openEditModal(editBtn.dataset.id, parseInt(editBtn.dataset.day, 10)); }
      else if (deleteBtn) { e.stopPropagation(); requestDelete(deleteBtn.dataset.id, parseInt(deleteBtn.dataset.day, 10)); }
      else if (expandBtn) {
        // Toggle notes expand/collapse
        e.stopPropagation();
        const wrap = expandBtn.closest('.act-notes-wrap');
        if (wrap) {
          wrap.classList.remove('collapsed');
          wrap.classList.add('expanded');
          expandBtn.style.display = 'none';
        }
      }
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
    setupMobileLongPress();
    setupDismissActions();
  }

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
    const overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    Motion.stopLenis();
    const panel = overlay.querySelector('.modal');
    if (panel) panel.scrollTop = 0;
    if (panel && Motion.hasGsap()) {
      const isConfirm = panel.classList.contains('modal-confirm');
      if (isConfirm) {
        Motion.gsap.fromTo(panel,
          { opacity: 0, scale: 0.94, y: 10 },
          { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power3.out' });
      } else {
        Motion.gsap.fromTo(panel,
          { xPercent: 100 },
          { xPercent: 0, duration: 0.5, ease: 'power3.out' });
      }
      Motion.gsap.fromTo(overlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' });
    }
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      const panel = overlay.querySelector('.modal');
      if (panel && Motion.hasGsap() && overlay.classList.contains('active')) {
        const isConfirm = panel.classList.contains('modal-confirm');
        if (isConfirm) {
          Motion.gsap.to(panel, { opacity: 0, scale: 0.96, duration: 0.2, ease: 'power2.in' });
        } else {
          Motion.gsap.to(panel, { xPercent: 100, duration: 0.3, ease: 'power3.in' });
        }
        Motion.gsap.to(overlay, {
          opacity: 0, duration: 0.25, ease: 'power2.in',
          onComplete: () => { overlay.classList.remove('active'); overlay.style.opacity = ''; },
        });
      } else {
        overlay.classList.remove('active');
        overlay.style.opacity = '';
      }
    });
    document.body.style.overflow = '';
    Motion.startLenis();
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

  // Mobile long-press to reveal edit/delete actions (500ms hold)
  function setupMobileLongPress() {
    const isMobile = () => window.innerWidth <= 600;
    const container = document.getElementById('scheduleContainer');
    if (!container) return;

    let pressTimer = null;
    let pressTarget = null;

    container.addEventListener('touchstart', (e) => {
      if (!isMobile()) return;
      const item = e.target.closest('.activity-item');
      if (!item) return;
      pressTarget = item;
      pressTimer = setTimeout(() => {
        // Dismiss any previously open actions
        document.querySelectorAll('.activity-item.actions-visible').forEach(el => {
          if (el !== item) el.classList.remove('actions-visible');
        });
        item.classList.add('actions-visible');
        pressTimer = null;
      }, 500);
    }, { passive: true });

    container.addEventListener('touchmove', () => {
      if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; }
    }, { passive: true });

    container.addEventListener('touchend', () => {
      if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; }
    }, { passive: true });
  }

  // Dismiss action buttons when tapping outside on mobile
  function setupDismissActions() {
    document.addEventListener('click', (e) => {
      if (window.innerWidth > 600) return;
      const item = e.target.closest('.activity-item');
      if (!item || !item.classList.contains('actions-visible')) {
        document.querySelectorAll('.activity-item.actions-visible').forEach(el => {
          el.classList.remove('actions-visible');
        });
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    if ((e.key === 'ArrowRight' || e.key === 'ArrowDown') && activeDay < appData?.days?.length - 1) { e.preventDefault(); switchDay(activeDay + 1); }
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowUp') && activeDay > 0) { e.preventDefault(); switchDay(activeDay - 1); }
  });

  document.addEventListener('DOMContentLoaded', initApp);
})();
