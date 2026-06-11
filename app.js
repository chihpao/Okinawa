(function () {
  'use strict';

  const SVGS = {
    sightseeing: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
    food: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',
    shopping: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
    transport: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 3-4 4-3-1-2 1 4 4 1-2-1-3 4-4 3 6l1.2-.7c.4-.2.7-.6.6-1.1z"/></svg>',
    hotel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 20v-6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6"/><path d="M2 20h20"/><path d="M6 12v-4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/></svg>',
    leisure: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
    morning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>',
    afternoon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="19.78" y1="10.22" x2="18.36" y2="11.64"/><line x1="2" y1="18" x2="22" y2="18"/></svg>',
    evening: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v4m0 14v-4m-7-5H3m18 0h-2m-1.636-5.364l-1.414 1.414M6.05 6.05L4.636 7.464"/><circle cx="12" cy="12" r="4"/></svg>',
    night: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    latenight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/><path d="M19 3v4"/><path d="M21 5h-4"/></svg>',
    person: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    car: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H9.3a2 2 0 0 0-1.6.8L5 11l-5.16.86a1 1 0 0 0-.84.99V16h3m10 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0ZM3 16a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z"/></svg>',
    flight: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 3-4 4-3-1-2 1 4 4 1-2-1-3 4-4 3 6l1.2-.7c.4-.2.7-.6.6-1.1z"/></svg>',
    map: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>',
    edit: '<svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>',
    trash: '<svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>'
  };

  const CATEGORIES = {
    sightseeing: { svg: SVGS.sightseeing, label: '觀光景點' },
    food:        { svg: SVGS.food,        label: '美食餐廳' },
    shopping:    { svg: SVGS.shopping,    label: '購物逛街' },
    transport:   { svg: SVGS.transport,   label: '交通移動' },
    hotel:       { svg: SVGS.hotel,       label: '住宿休息' },
    leisure:     { svg: SVGS.leisure,     label: '休閒體驗' }
  };

  const PERIODS = [
    { value: '上午', svg: SVGS.morning },
    { value: '下午', svg: SVGS.afternoon },
    { value: '傍晚', svg: SVGS.evening },
    { value: '晚上', svg: SVGS.night },
    { value: '夜間', svg: SVGS.latenight }
  ];

  const PERIOD_ORDER = ['上午', '下午', '傍晚', '晚上', '夜間'];

  let appData = null;
  let activeDay = -1;
  let countdownInterval = null;
  let editingActivityId = null;
  let editingDayIndex = null;
  let pendingDeleteId = null;
  let pendingDeleteDay = null;
  let lastScrollY = 0;

  const STORAGE_KEYS = {
    data: 'okinawa-data-v3',
    theme: 'okinawa-theme-v3',
    activeDay: 'okinawa-active-day'
  };

  const DEFAULT_DATA = {
    "trip": {
      "title": "☀ 8月沖繩輕旅 ☀",
      "startDate": "2026-08-13",
      "endDate": "2026-08-17",
      "travelers": [
        { "name": "姊姊", "emoji": "👩", "departureDate": "2026-08-16" },
        { "name": "姊夫", "emoji": "👨", "departureDate": "2026-08-16" },
        { "name": "老媽", "emoji": "👩‍🦳", "departureDate": "2026-08-17" },
        { "name": "阿保", "emoji": "🧑", "departureDate": "2026-08-17" },
        { "name": "孜仁", "emoji": "🧒", "departureDate": "2026-08-17" }
      ]
    },
    "days": [
      {
        "date": "2026-08-13", "dayOfWeek": "四", "dayNumber": 1,
        "label": "第一天", "subtitle": "抵達沖繩", "hasRentalCar": false,
        "activities": [
          { "id": "d1-1", "period": "傍晚", "time": "18:05–20:50", "title": "抵達沖繩", "description": "樂桃航空 MM930", "category": "transport", "mapUrl": "", "notes": "" },
          { "id": "d1-2", "period": "晚上", "time": "", "title": "抵達那霸機場", "description": "", "category": "transport", "mapUrl": "", "notes": "" },
          { "id": "d1-3", "period": "夜間", "time": "", "title": "國際通逛逛", "description": "居酒屋／餐廳吃宵夜（國際通屋台村）", "category": "food", "mapUrl": "https://maps.app.goo.gl/6u6qhNjxAkMXf7x57", "notes": "" }
        ]
      },
      {
        "date": "2026-08-14", "dayOfWeek": "五", "dayNumber": 2,
        "label": "第二天", "subtitle": "水族館 & 南部探索", "hasRentalCar": true,
        "activities": [
          { "id": "d2-1", "period": "上午", "time": "09:00–19:00", "title": "DMM 水族館", "description": "營業時間 09:00–19:00", "category": "sightseeing", "mapUrl": "https://maps.app.goo.gl/J3Sxn8GvXF48GBxb6", "notes": "" },
          { "id": "d2-2", "period": "上午", "time": "10:00–21:00", "title": "iias 沖繩豐崎", "description": "商場，跟水族館同棟（營業時間 10:00–21:00）", "category": "shopping", "mapUrl": "https://maps.app.goo.gl/J3Sxn8GvXF48GBxb6", "notes": "" },
          { "id": "d2-3", "period": "下午", "time": "", "title": "糸滿魚市場", "description": "在地海鮮市場", "category": "food", "mapUrl": "https://maps.app.goo.gl/odFCotQHGYccxCqG7", "notes": "" },
          { "id": "d2-4", "period": "下午", "time": "", "title": "波上宮", "description": "沖繩著名神社", "category": "sightseeing", "mapUrl": "https://maps.app.goo.gl/ufJrKjWWRGVAFXww9", "notes": "" },
          { "id": "d2-5", "period": "下午", "time": "", "title": "波之上海灘", "description": "那霸市區的美麗海灘", "category": "sightseeing", "mapUrl": "https://maps.app.goo.gl/NDVUCtHN36rbvnJr7", "notes": "" },
          { "id": "d2-6", "period": "下午", "time": "", "title": "瀨長島", "description": "白色希臘風商店街＋海景", "category": "leisure", "mapUrl": "https://maps.app.goo.gl/PMqp8EFApnQTmFux5", "notes": "" },
          { "id": "d2-7", "period": "晚上", "time": "", "title": "晚餐時間", "description": "", "category": "food", "mapUrl": "", "notes": "" },
          { "id": "d2-8", "period": "夜間", "time": "", "title": "居酒屋", "description": "", "category": "food", "mapUrl": "", "notes": "" }
        ]
      },
      {
        "date": "2026-08-15", "dayOfWeek": "六", "dayNumber": 3,
        "label": "第三天", "subtitle": "世界遺產 & 美國村", "hasRentalCar": true,
        "activities": [
          { "id": "d3-1", "period": "上午", "time": "", "title": "首里城", "description": "世界文化遺產，琉球王國的象徵", "category": "sightseeing", "mapUrl": "https://maps.app.goo.gl/x6PA2FSKSXnzPLaG7", "notes": "" },
          { "id": "d3-2", "period": "上午", "time": "", "title": "西來院（達摩寺）", "description": "寧靜的古寺", "category": "sightseeing", "mapUrl": "https://maps.app.goo.gl/Zy9CaEhQg6Z45rG66", "notes": "" },
          { "id": "d3-3", "period": "下午", "time": "", "title": "殘波岬（燈塔）", "description": "壯觀的海岬與白色燈塔", "category": "sightseeing", "mapUrl": "https://maps.app.goo.gl/uTzHZ6GgooheYwFZ7", "notes": "" },
          { "id": "d3-4", "period": "傍晚", "time": "", "title": "美國村", "description": "逛街 & Chill", "category": "leisure", "mapUrl": "https://maps.app.goo.gl/63dfhXpJ9nyLvwxj7", "notes": "" },
          { "id": "d3-5", "period": "傍晚", "time": "", "title": "日落海灘", "description": "海灘看夕陽", "category": "leisure", "mapUrl": "https://maps.app.goo.gl/JEtSz7oXeaVYTXTJ7", "notes": "" },
          { "id": "d3-6", "period": "晚上", "time": "", "title": "AEON Mall 永旺夢樂城", "description": "購物中心", "category": "shopping", "mapUrl": "https://maps.app.goo.gl/fJ2viTEp2RU9pFcd7", "notes": "" },
          { "id": "d3-7", "period": "夜間", "time": "", "title": "居酒屋", "description": "", "category": "food", "mapUrl": "", "notes": "" }
        ]
      },
      {
        "date": "2026-08-16", "dayOfWeek": "日", "dayNumber": 4,
        "label": "第四天", "subtitle": "購物 & 姊姊姊夫回程", "hasRentalCar": false,
        "activities": [
          { "id": "d4-1", "period": "上午", "time": "10:00–22:00", "title": "PARCO CITY", "description": "營業時間 10:00–22:00", "category": "shopping", "mapUrl": "https://maps.app.goo.gl/aEx75spVL1JSMWWk9", "notes": "" },
          { "id": "d4-2", "period": "下午", "time": "16:00", "title": "姊姊 & 姊夫前往機場", "description": "直接從 PARCO CITY 出發去機場", "category": "transport", "mapUrl": "", "notes": "" },
          { "id": "d4-3", "period": "下午", "time": "18:20–18:55", "title": "姊姊 & 姊夫回程 ✈", "description": "越捷航空 VZ569", "category": "transport", "mapUrl": "", "notes": "" },
          { "id": "d4-4", "period": "晚上", "time": "", "title": "唐吉訶德最後補給", "description": "阿保、孜仁", "category": "shopping", "mapUrl": "", "notes": "" },
          { "id": "d4-5", "period": "夜間", "time": "", "title": "居酒屋", "description": "", "category": "food", "mapUrl": "", "notes": "" }
        ]
      },
      {
        "date": "2026-08-17", "dayOfWeek": "一", "dayNumber": 5,
        "label": "第五天", "subtitle": "回程", "hasRentalCar": false,
        "activities": [
          { "id": "d5-1", "period": "上午", "time": "10:10–10:40", "title": "老媽 & 阿保 & 孜仁回程 ✈", "description": "虎航 IT231", "category": "transport", "mapUrl": "", "notes": "" }
        ]
      }
    ]
  };

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbyyOxIV_zj1nLN97jCWl8uPY1ecYPDKkbHd3cUjrEH86cPhbphzFL_GzecPzGSSopu5/exec';

  const CloudSync = {
    pollInterval: null,
    syncTimeout: null,
    lastKnownHash: null,
    isSyncing: false,
    POLL_MS: 15000,
    DEBOUNCE_MS: 2000,

    init() {
      console.log('[Sync] Using Google Apps Script Backend');
    },

    url() {
      return GAS_URL;
    },

    setState(state) {
      const el = document.getElementById('syncIndicator');
      const label = document.getElementById('syncLabel');
      if (!el || !label) return;
      el.dataset.state = state;
      const labels = {
        saved: '已同步',
        syncing: '同步中...',
        unsaved: '未儲存',
        offline: '離線'
      };
      label.textContent = labels[state] || '';
    },

    async syncToCloud() {
      if (this.isSyncing) return;
      this.isSyncing = true;
      this.setState('syncing');

      try {
        appData._lastModified = Date.now();
        appData._modifiedBy = getDeviceId();

        const body = JSON.stringify(appData);
        const res = await fetch(this.url(), {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: body
        });

        if (!res.ok) {
          throw new Error(`POST failed: ${res.status}`);
        }

        this.lastKnownHash = body;
        this.setState('saved');
        localStorage.setItem(STORAGE_KEYS.data, body);
        console.log('[Sync] Pushed to cloud');
      } catch (err) {
        console.error('[Sync] Push failed:', err);
        this.setState('offline');
      } finally {
        this.isSyncing = false;
      }
    },

    async syncFromCloud(silent = false) {
      try {
        const fetchUrl = `${this.url()}?t=${Date.now()}`;
        const res = await fetch(fetchUrl);
        if (!res.ok) {
          throw new Error(`GET failed: ${res.status}`);
        }

        const data = await res.json();
        const hash = JSON.stringify(data);

        if (hash !== this.lastKnownHash) {
          const wasOurWrite = data._modifiedBy === getDeviceId() &&
            data._lastModified && (Date.now() - data._lastModified < this.POLL_MS + 2000);

          if (!wasOurWrite || !this.lastKnownHash) {
            appData = data;
            this.lastKnownHash = hash;
            localStorage.setItem(STORAGE_KEYS.data, hash);

            if (!silent) {
              renderAll();
              showToast('📡 行程已從雲端更新');
            }
            console.log('[Sync] Pulled remote update');
          } else {
            this.lastKnownHash = hash;
          }
        }

        this.setState('saved');
        return true;
      } catch (err) {
        console.error('[Sync] Pull failed:', err);
        if (!silent) this.setState('offline');
        return false;
      }
    },

    startPolling() {
      if (this.pollInterval) clearInterval(this.pollInterval);
      this.pollInterval = setInterval(() => {
        if (!document.hidden) {
          this.syncFromCloud(false);
        }
      }, this.POLL_MS);

      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
          this.syncFromCloud(false);
        }
      });
      console.log('[Sync] Polling started (every', this.POLL_MS / 1000, 's)');
    },

    scheduleSave() {
      this.setState('unsaved');
      if (this.syncTimeout) clearTimeout(this.syncTimeout);
      this.syncTimeout = setTimeout(() => {
        this.syncToCloud();
      }, this.DEBOUNCE_MS);
    }
  };

  function getDeviceId() {
    let id = localStorage.getItem('okinawa-device-id');
    if (!id) {
      id = 'dev-' + Math.random().toString(36).slice(2, 10);
      localStorage.setItem('okinawa-device-id', id);
    }
    return id;
  }

  async function initApp() {
    showLoading();
    initTheme();
    CloudSync.init();

    try {
      const cloudLoaded = await CloudSync.syncFromCloud(true);

      if (!appData) {
        const saved = localStorage.getItem(STORAGE_KEYS.data);
        if (saved) {
          try {
            appData = JSON.parse(saved);
          } catch (e) {
            appData = JSON.parse(JSON.stringify(DEFAULT_DATA));
          }
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
    } catch (err) {
      console.error('Init error:', err);
      showError('資料載入失敗，請重新整理頁面。');
    }
  }

  function showLoading() {
    const main = document.getElementById('scheduleContainer');
    if (main) main.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
        <div>載入行程中...</div>
      </div>`;
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
      `<div class="traveler-tag">
        ${SVGS.person}
        <span>${t.name}</span>
      </div>`
    ).join('');
  }

  function renderDayTabs() {
    const track = document.getElementById('dayTabsTrack');
    if (!track) return;

    track.innerHTML = appData.days.map((day, i) => {
      const date = new Date(day.date + 'T00:00:00');
      const m = (date.getMonth() + 1) + '月';
      const d = date.getDate();
      return `<div class="day-tab${i === activeDay ? ' active' : ''}" data-day="${i}">
        <span class="tab-title"><span class="hide-mobile">第 </span><span class="tab-num">${i + 1}</span><span class="hide-mobile"> 天</span></span>
        <span class="tab-date">${m}${d}日</span>
      </div>`;
    }).join('');
  }

  function renderDayViews() {
    const container = document.getElementById('scheduleContainer');
    if (!container) return;

    container.innerHTML = appData.days.map((day, dayIndex) => {
      const date = new Date(day.date + 'T00:00:00');
      const dateStr = date.toLocaleDateString('zh-TW', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });

      const badges = renderDayBadges(day);
      const timeline = renderTimeline(day.activities, dayIndex);

      return `<div class="day-view${dayIndex === activeDay ? ' active' : ''}" data-day-index="${dayIndex}">
        <div class="day-info">
          ${day.subtitle ? `<h2 class="day-info-title" style="font-size: 1.6rem; color: var(--accent);">${escapeHtml(day.subtitle)}</h2>` : ''}
          <div class="day-badges" style="margin-top: 0.5rem;">${badges}</div>
        </div>
        <div class="timeline">${timeline}</div>
      </div>`;
    }).join('');
  }

  function renderDayBadges(day) {
    let badges = '';
    if (day.hasRentalCar) {
      badges += `<span class="pill">${SVGS.car} 租車</span>`;
    }
    const hasFlight = day.activities.some(a =>
      a.category === 'transport' && a.description &&
      (a.description.includes('航') || a.description.toLowerCase().includes('flight'))
    );
    if (hasFlight) {
      badges += `<span class="pill">${SVGS.flight} 航班</span>`;
    }

    if (appData.trip.travelers) {
      appData.trip.travelers.forEach(t => {
        const isDeparted = day.date > t.departureDate.split('T')[0];
        if (isDeparted) {
          badges += `<span class="pill departed">${SVGS.person} ${t.name} (已回程)</span>`;
        }
      });
    }

    return badges;
  }

  function renderTimeline(activities, dayIndex) {
    if (!activities || activities.length === 0) {
      return `<div class="empty-state">今天還沒有安排活動，按下方 + 新增</div>`;
    }

    const grouped = {};
    activities.forEach(act => {
      const period = act.period || '其他';
      if (!grouped[period]) grouped[period] = [];
      grouped[period].push(act);
    });

    const orderedPeriods = PERIOD_ORDER.filter(p => grouped[p]);
    Object.keys(grouped).forEach(p => {
      if (!orderedPeriods.includes(p)) orderedPeriods.push(p);
    });

    let cardIndex = 0;

    return orderedPeriods.map(period => {
      const periodInfo = PERIODS.find(p => p.value === period);
      const svg = periodInfo ? periodInfo.svg : SVGS.latenight;

      const cards = grouped[period].map(act => {
        const html = renderActivityCard(act, dayIndex, cardIndex);
        cardIndex++;
        return html;
      }).join('');

      return `<div class="period-group">
        <div class="period-header">
          <span style="display:inline-flex;width:15px;height:15px;">${svg}</span>
          <span>${period}</span>
        </div>
        ${cards}
      </div>`;
    }).join('');
  }

  function renderActivityCard(activity, dayIndex, staggerIndex) {
    const cat = CATEGORIES[activity.category] || CATEGORIES.sightseeing;
    const delay = Math.min(staggerIndex * 0.06, 0.5);

    const mapHtml = activity.mapUrl
      ? `<div class="card-links">
          <a class="link-map" href="${escapeHtml(activity.mapUrl)}" target="_blank" rel="noopener noreferrer">
            ${SVGS.map} Google Maps
          </a>
        </div>`
      : '';

    const notesHtml = activity.notes
      ? `<div class="card-notes">${escapeHtml(activity.notes)}</div>`
      : '';

    return `<div class="activity-card" data-cat="${activity.category}" data-id="${activity.id}" data-day="${dayIndex}" style="animation-delay:${delay}s;">
      <div class="card-header">
        <div class="card-title-group">
          <div class="card-cat">
            <span class="card-cat-dot"></span>
            ${cat.label}
          </div>
          <div class="card-title">${escapeHtml(activity.title)}</div>
          ${activity.time ? `<div class="card-time">${activity.time}</div>` : ''}
        </div>
        <div class="card-actions-inline">
          <button class="btn-card-sm" data-action="edit" data-id="${activity.id}" data-day="${dayIndex}" title="編輯">
            ${SVGS.edit}
          </button>
          <button class="btn-card-sm btn-delete" data-action="delete" data-id="${activity.id}" data-day="${dayIndex}" title="刪除">
            ${SVGS.trash}
          </button>
        </div>
      </div>
      ${activity.description ? `<div class="card-desc">${escapeHtml(activity.description)}</div>` : ''}
      ${mapHtml}
      ${notesHtml}
    </div>`;
  }

  function switchDay(index) {
    if (!appData || index < -1 || index >= appData.days.length) return;
    activeDay = index;
    localStorage.setItem(STORAGE_KEYS.activeDay, index);

    document.querySelectorAll('.day-tab').forEach((tab, i) => {
      tab.classList.toggle('active', i === index);
    });
    document.querySelectorAll('.day-view').forEach((view, i) => {
      view.classList.toggle('active', i === index);
    });

    const hero = document.getElementById('heroSection');
    if (hero) {
      hero.style.display = index === -1 ? 'block' : 'none';
    }

    const activeTab = document.querySelector('.day-tab.active');
    if (activeTab) {
      activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
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
    if (!group) return;

    if (now >= startDate && now <= endDate) {
      const currentDay = Math.floor((now - startDate) / (1000 * 60 * 60 * 24)) + 1;
      group.innerHTML = `<div class="countdown-status">🌴 旅程進行中 — 第 ${currentDay} 天</div>`;
      return;
    }

    if (now > endDate) {
      group.innerHTML = `<div class="countdown-status">✨ 美好的旅程已結束</div>`;
      clearInterval(countdownInterval);
      return;
    }

    const diff = startDate - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    const ds = document.getElementById('countDays');
    const hs = document.getElementById('countHours');
    const ms = document.getElementById('countMins');
    const ss = document.getElementById('countSecs');

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

  function initTheme() {
    const saved = localStorage.getItem(STORAGE_KEYS.theme);
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    // Dark is CSS default — no explicit set needed
    updateThemeIcons();
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const isDarkNow = current !== 'light';
    const next = isDarkNow ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEYS.theme, next);
    updateThemeIcons();
  }

  function updateThemeIcons() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const lightIcon = document.querySelector('.theme-icon-light');
    const darkIcon = document.querySelector('.theme-icon-dark');
    if (lightIcon) lightIcon.style.display = isDark ? 'none' : 'block';
    if (darkIcon) darkIcon.style.display = isDark ? 'block' : 'none';
  }



  function openAddModal() {
    editingActivityId = null;
    editingDayIndex = activeDay;
    resetForm();
    const title = document.getElementById('modalTitle');
    if (title) title.textContent = `新增活動 — ${appData.days[activeDay].label}`;
    openModal('activityModal');
  }

  function openEditModal(activityId, dayIndex) {
    editingActivityId = activityId;
    editingDayIndex = dayIndex;
    const activity = appData.days[dayIndex].activities.find(a => a.id === activityId);
    if (!activity) return;

    document.getElementById('actPeriod').value = activity.period || '上午';
    document.getElementById('actTime').value = activity.time || '';
    document.getElementById('actTitle').value = activity.title || '';
    document.getElementById('actDesc').value = activity.description || '';
    document.getElementById('actCategory').value = activity.category || 'sightseeing';
    document.getElementById('actMapUrl').value = activity.mapUrl || '';
    document.getElementById('actNotes').value = activity.notes || '';

    const title = document.getElementById('modalTitle');
    if (title) title.textContent = '編輯活動';
    openModal('activityModal');
  }

  function saveActivity() {
    const titleInput = document.getElementById('actTitle');
    const title = titleInput.value.trim();
    if (!title) {
      titleInput.focus();
      titleInput.style.borderColor = 'var(--danger)';
      showToast('⚠️ 請填寫活動名稱');
      setTimeout(() => { titleInput.style.borderColor = ''; }, 2000);
      return;
    }

    const activityData = {
      period: document.getElementById('actPeriod').value,
      time: document.getElementById('actTime').value.trim(),
      title: title,
      description: document.getElementById('actDesc').value.trim(),
      category: document.getElementById('actCategory').value,
      mapUrl: document.getElementById('actMapUrl').value.trim(),
      notes: document.getElementById('actNotes').value.trim()
    };

    const day = appData.days[editingDayIndex];

    if (editingActivityId) {
      const idx = day.activities.findIndex(a => a.id === editingActivityId);
      if (idx !== -1) {
        activityData.id = editingActivityId;
        day.activities[idx] = activityData;
      }
    } else {
      activityData.id = `d${editingDayIndex + 1}-${Date.now()}`;
      day.activities.push(activityData);
    }

    saveData();
    closeAllModals();
    renderDayViews();
    switchDay(activeDay);
    showToast('✅ 已儲存');
  }

  function requestDelete(activityId, dayIndex) {
    pendingDeleteId = activityId;
    pendingDeleteDay = dayIndex;
    openModal('deleteModal');
  }

  function confirmDelete() {
    if (pendingDeleteId === null || pendingDeleteDay === null) return;

    const day = appData.days[pendingDeleteDay];
    day.activities = day.activities.filter(a => a.id !== pendingDeleteId);

    saveData();
    closeAllModals();
    renderDayViews();
    switchDay(activeDay);
    showToast('🗑 已刪除');

    pendingDeleteId = null;
    pendingDeleteDay = null;
  }

  function resetForm() {
    const form = document.getElementById('activityForm');
    if (form) form.reset();
  }

  function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
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
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('toast-out');
      setTimeout(() => toast.remove(), 350);
    }, 2500);
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

          if (scrollDelta > 8 && currentScroll > 100) {
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
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDragging = true;
    }, { passive: true });

    main.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = endX - startX;
      const diffY = endY - startY;

      if (Math.abs(diffX) > 60 && Math.abs(diffX) > Math.abs(diffY) * 1.8) {
        if (diffX < 0) switchDay(activeDay + 1);
        else switchDay(activeDay - 1);
      }
    }, { passive: true });
  }

  function setupEventListeners() {
    document.getElementById('btnTheme')?.addEventListener('click', toggleTheme);

    document.querySelector('.brand')?.addEventListener('click', () => {
      switchDay(-1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.getElementById('navHome')?.addEventListener('click', () => {
      switchDay(-1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.getElementById('btnFab')?.addEventListener('click', openAddModal);



    document.getElementById('dayTabsTrack')?.addEventListener('click', (e) => {
      const tab = e.target.closest('.day-tab');
      if (tab) switchDay(parseInt(tab.dataset.day, 10));
    });

    document.getElementById('scheduleContainer')?.addEventListener('click', (e) => {
      const editBtn = e.target.closest('[data-action="edit"]');
      const deleteBtn = e.target.closest('[data-action="delete"]');
      if (editBtn) {
        e.stopPropagation();
        openEditModal(editBtn.dataset.id, parseInt(editBtn.dataset.day, 10));
      } else if (deleteBtn) {
        e.stopPropagation();
        requestDelete(deleteBtn.dataset.id, parseInt(deleteBtn.dataset.day, 10));
      }
    });

    document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
      btn.addEventListener('click', closeAllModals);
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeAllModals();
      });
    });

    document.querySelector('.modal-save')?.addEventListener('click', saveActivity);

    document.getElementById('btnDeleteCancel')?.addEventListener('click', closeAllModals);
    document.getElementById('btnDeleteConfirm')?.addEventListener('click', confirmDelete);



    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllModals();
    });

    setupSwipeGestures();
    setupScrollHide();
    setupCardObserver();
  }

  /* ── IntersectionObserver for card scroll-reveal ── */
  function setupCardObserver() {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('card-hidden');
          entry.target.classList.add('card-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    });

    // Observe existing and future cards via MutationObserver
    const container = document.getElementById('scheduleContainer');
    if (!container) return;

    function observeCards(root) {
      root.querySelectorAll('.activity-card').forEach(card => {
        if (!card.classList.contains('card-visible')) {
          card.classList.add('card-hidden');
          observer.observe(card);
        }
      });
    }

    observeCards(container);

    const mutationObs = new MutationObserver(() => {
      observeCards(container);
    });
    mutationObs.observe(container, { childList: true, subtree: true });
  }

  function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe.toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  document.addEventListener('DOMContentLoaded', initApp);

})();
