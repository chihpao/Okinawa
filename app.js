/* ═══════════════════════════════════════════════════════
   OKINAWA RETREAT — App Logic
   Vanilla JS · ES6+ · Editorial UI
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── SVG Icons (Replacing Emojis) ───
  const SVGS = {
    sightseeing: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
    food: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',
    shopping: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
    transport: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 3-4 4-3-1-2 1 4 4 1-2-1-3 4-4 3 6l1.2-.7c.4-.2.7-.6.6-1.1z"/></svg>',
    hotel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 20v-6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6"/><path d="M2 20h20"/><path d="M6 12v-4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/></svg>',
    leisure: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
    morning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>',
    afternoon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="19.78" y1="10.22" x2="18.36" y2="11.64"/><line x1="2" y1="18" x2="22" y2="18"/></svg>',
    evening: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 18v-5l-4-4"/><path d="M22 18H2"/><path d="M17 14l-5-5-5 5"/></svg>',
    night: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    latenight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 0-14.14 14.14"/></svg>',
    person: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    car: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H9.3a2 2 0 0 0-1.6.8L5 11l-5.16.86a1 1 0 0 0-.84.99V16h3m10 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0ZM3 16a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z"/></svg>',
    flight: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 3-4 4-3-1-2 1 4 4 1-2-1-3 4-4 3 6l1.2-.7c.4-.2.7-.6.6-1.1z"/></svg>',
    map: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>',
    edit: '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>',
    trash: '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
    pin: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 0-14.14 14.14"/></svg>'
  };

  const CATEGORIES = {
    sightseeing: { svg: SVGS.sightseeing, label: '觀光景點' },
    food:        { svg: SVGS.food, label: '美食餐廳' },
    shopping:    { svg: SVGS.shopping, label: '購物逛街' },
    transport:   { svg: SVGS.transport, label: '交通移動' },
    hotel:       { svg: SVGS.hotel, label: '住宿休息' },
    leisure:     { svg: SVGS.leisure, label: '休閒體驗' }
  };

  const PERIODS = [
    { value: '上午', svg: SVGS.morning },
    { value: '下午', svg: SVGS.afternoon },
    { value: '傍晚', svg: SVGS.evening },
    { value: '晚上', svg: SVGS.night },
    { value: '夜間', svg: SVGS.latenight }
  ];

  const PERIOD_ORDER = ['上午', '下午', '傍晚', '晚上', '夜間'];

  // ─── State Management ───
  let appData = null;
  let activeDay = 0;
  let isEditMode = false;
  let editingActivityId = null;
  let editingDayIndex = null;
  let countdownInterval = null;

  const STORAGE_KEYS = {
    data: 'okinawa-data',
    theme: 'okinawa-theme-v2',
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
      "date": "2026-08-13",
      "dayOfWeek": "四",
      "dayNumber": 1,
      "label": "第一天",
      "subtitle": "抵達沖繩",
      "hasRentalCar": false,
      "activities": [
        { "id": "d1-1", "period": "傍晚", "time": "18:05–20:50", "title": "抵達沖繩", "description": "樂桃航空 MM930", "category": "transport", "mapUrl": "", "notes": "" },
        { "id": "d1-2", "period": "晚上", "time": "", "title": "抵達那霸機場", "description": "", "category": "transport", "mapUrl": "", "notes": "" },
        { "id": "d1-3", "period": "夜間", "time": "", "title": "國際通逛逛", "description": "居酒屋／餐廳吃宵夜（國際通屋台村）", "category": "food", "mapUrl": "https://maps.app.goo.gl/6u6qhNjxAkMXf7x57", "notes": "" }
      ]
    },
    {
      "date": "2026-08-14",
      "dayOfWeek": "五",
      "dayNumber": 2,
      "label": "第二天",
      "subtitle": "水族館 & 南部探索",
      "hasRentalCar": true,
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
      "date": "2026-08-15",
      "dayOfWeek": "六",
      "dayNumber": 3,
      "label": "第三天",
      "subtitle": "世界遺產 & 美國村",
      "hasRentalCar": true,
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
      "date": "2026-08-16",
      "dayOfWeek": "日",
      "dayNumber": 4,
      "label": "第四天",
      "subtitle": "購物 & 姊姊姊夫回程",
      "hasRentalCar": false,
      "activities": [
        { "id": "d4-1", "period": "上午", "time": "10:00–22:00", "title": "PARCO CITY", "description": "營業時間 10:00–22:00", "category": "shopping", "mapUrl": "https://maps.app.goo.gl/aEx75spVL1JSMWWk9", "notes": "" },
        { "id": "d4-2", "period": "下午", "time": "16:00", "title": "姊姊 & 姊夫前往機場", "description": "直接從 PARCO CITY 出發去機場", "category": "transport", "mapUrl": "", "notes": "" },
        { "id": "d4-3", "period": "下午", "time": "18:20–18:55", "title": "姊姊 & 姊夫回程 ✈", "description": "越捷航空 VZ569", "category": "transport", "mapUrl": "", "notes": "" },
        { "id": "d4-4", "period": "晚上", "time": "", "title": "唐吉訶德最後補給", "description": "阿保、孜仁", "category": "shopping", "mapUrl": "", "notes": "" },
        { "id": "d4-5", "period": "夜間", "time": "", "title": "居酒屋", "description": "", "category": "food", "mapUrl": "", "notes": "" }
      ]
    },
    {
      "date": "2026-08-17",
      "dayOfWeek": "一",
      "dayNumber": 5,
      "label": "第五天",
      "subtitle": "回程",
      "hasRentalCar": false,
      "activities": [
        { "id": "d5-1", "period": "上午", "time": "10:10–10:40", "title": "老媽 & 阿保 & 孜仁回程 ✈", "description": "虎航 IT231", "category": "transport", "mapUrl": "", "notes": "" }
      ]
    }
  ]
  };

  // ═══════════════════════════════════════════════
  // Initialization
  // ═══════════════════════════════════════════════
  async function initApp() {
    showLoading();
    initTheme();

    try {
      await CloudSync.syncFromCloud(false);
      
      if (!appData) {
        const savedData = localStorage.getItem(STORAGE_KEYS.data);
        if (savedData) {
          appData = JSON.parse(savedData);
        } else {
          appData = DEFAULT_DATA;
        }
      }

      window.appData = appData;

      const savedDay = localStorage.getItem(STORAGE_KEYS.activeDay);
      if (savedDay !== null) {
        activeDay = Math.min(parseInt(savedDay, 10), appData.days.length - 1);
      }

      renderAll();
      setupEventListeners();
      startCountdown();

    } catch (err) {
      console.error('Init error:', err);
      showError('資料載入失敗，請重新整理。');
    }
  }

  function showLoading() {
    const main = document.getElementById('scheduleContainer');
    if(main) main.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
        <div>載入行程中...</div>
      </div>`;
  }

  function showError(msg) {
    const main = document.getElementById('scheduleContainer');
    if(main) main.innerHTML = `
      <div class="empty-state">
        <p>${msg}</p>
      </div>`;
  }

  // ═══════════════════════════════════════════════
  // Render Engine
  // ═══════════════════════════════════════════════
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
      const date = new Date(day.date);
      const m = (date.getMonth() + 1) + '月';
      const d = date.getDate();
      return `<div class="day-tab${i === activeDay ? ' active' : ''}" data-day="${i}">
        <span class="tab-title">第 ${i+1} 天</span>
        <span class="tab-date">${m} ${d} 日</span>
      </div>`;
    }).join('');
  }

  function renderDayViews() {
    const container = document.getElementById('scheduleContainer');
    if (!container) return;

    container.innerHTML = appData.days.map((day, dayIndex) => {
      const date = new Date(day.date);
      const dateStr = date.toLocaleDateString('zh-TW', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

      const badges = renderDayBadges(day);
      const timeline = renderTimeline(day.activities, dayIndex);

      return `<div class="day-view${dayIndex === activeDay ? ' active' : ''}" data-day-index="${dayIndex}">
        <div class="day-info">
          <h2 class="day-info-title">${day.label}</h2>
          <div class="day-info-subtitle">${dateStr}</div>
          ${day.subtitle ? `<div class="day-info-subtitle" style="font-size:0.9rem; color: var(--text-primary); margin-top:-0.5rem; font-style:normal;">${day.subtitle}</div>` : ''}
          <div class="day-badges">
            ${badges}
          </div>
        </div>
        <div class="timeline">
          ${timeline}
        </div>
      </div>`;
    }).join('');
  }

  function renderDayBadges(day) {
    let badges = '';
    if (day.hasRentalCar) {
      badges += `<span class="pill">${SVGS.car} 租車</span>`;
    }
    const hasFlight = day.activities.some(a => a.category === 'transport' && a.description && (a.description.includes('航') || a.description.toLowerCase().includes('flight')));
    if (hasFlight) {
      badges += `<span class="pill">${SVGS.flight} 航班</span>`;
    }
    
    // Travelers presence
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
      return `<div class="empty-state">今天沒有安排活動。</div>`;
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

    return orderedPeriods.map(period => {
      const periodInfo = PERIODS.find(p => p.value === period);
      const svg = periodInfo ? periodInfo.svg : SVGS.pin;
      const label = period;

      const cards = grouped[period].map(act => renderActivityCard(act, dayIndex)).join('');

      return `<div class="period-group">
        <div class="period-header">
          <span style="display:inline-flex;width:16px;height:16px;">${svg}</span>
          <span>${label}</span>
        </div>
        ${cards}
      </div>`;
    }).join('');
  }

  function renderActivityCard(activity, dayIndex) {
    const cat = CATEGORIES[activity.category] || CATEGORIES.sightseeing;
    
    const mapHtml = activity.mapUrl
      ? `<div class="card-links">
          <a class="link-map" href="${escapeHtml(activity.mapUrl)}" target="_blank" rel="noopener noreferrer">
            ${SVGS.map} Google Maps
          </a>
        </div>`
      : '';

    const notesHtml = renderNotes(activity);

    return `<div class="activity-card" data-cat="${activity.category}" data-id="${activity.id}" data-day="${dayIndex}">
      <div class="card-header">
        <div class="card-title-group">
          <div class="card-cat">${cat.svg} ${cat.label}</div>
          <div class="card-title">${escapeHtml(activity.title)}</div>
        </div>
        ${activity.time ? `<div class="card-time">${activity.time}</div>` : ''}
      </div>
      
      ${activity.description ? `<div class="card-desc">${escapeHtml(activity.description)}</div>` : ''}
      ${mapHtml}
      ${notesHtml}
      
      <div class="card-actions">
        <button class="btn-card-action btn-card-edit" data-action="edit" data-id="${activity.id}" data-day="${dayIndex}">
          ${SVGS.edit} 編輯
        </button>
        <button class="btn-card-action btn-card-delete" style="color:var(--accent-color);" data-action="delete" data-id="${activity.id}" data-day="${dayIndex}">
          ${SVGS.trash} 刪除
        </button>
      </div>
    </div>`;
  }

  function renderNotes(activity) {
    if (!isEditMode && !activity.notes) return '';
    if (isEditMode) {
      return `<textarea class="card-notes-input" data-id="${activity.id}" placeholder="新增個人備註...">${escapeHtml(activity.notes || '')}</textarea>`;
    }
    return `<div class="card-notes">${escapeHtml(activity.notes)}</div>`;
  }

  // ═══════════════════════════════════════════════
  // Interactions
  // ═══════════════════════════════════════════════
  function switchDay(index) {
    if (index < 0 || index >= appData.days.length) return;
    activeDay = index;
    localStorage.setItem(STORAGE_KEYS.activeDay, index);

    document.querySelectorAll('.day-tab').forEach((tab, i) => {
      tab.classList.toggle('active', i === index);
    });
    document.querySelectorAll('.day-view').forEach((view, i) => {
      view.classList.toggle('active', i === index);
    });

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

    const group = document.querySelector('.countdown-group');
    if (!group) return;

    if (now >= startDate && now <= endDate) {
      const currentDay = Math.floor((now - startDate) / (1000 * 60 * 60 * 24)) + 1;
      group.innerHTML = `<div class="countdown-status">旅程進行中：第 ${currentDay} 天</div>`;
      return;
    }

    if (now > endDate) {
      group.innerHTML = `<div class="countdown-status">旅程已結束</div>`;
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

    if(ds) ds.textContent = days;
    if(hs) hs.textContent = String(hours).padStart(2, '0');
    if(ms) ms.textContent = String(mins).padStart(2, '0');
    if(ss) ss.textContent = String(secs).padStart(2, '0');
  }

  function initTheme() {
    const saved = localStorage.getItem(STORAGE_KEYS.theme);
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEYS.theme, next);
  }

  function toggleEditMode() {
    isEditMode = !isEditMode;
    document.body.classList.toggle('edit-mode', isEditMode);
    
    const navEdit = document.getElementById('navEdit');
    const navHome = document.getElementById('navHome');
    if (navEdit) navEdit.classList.toggle('active', isEditMode);
    if (navHome) navHome.classList.toggle('active', !isEditMode);

    renderDayViews();
    switchDay(activeDay);
    if (isEditMode) showToast('編輯模式已啟用');
  }

  // ═══════════════════════════════════════════════
  // Form / Modal
  // ═══════════════════════════════════════════════
  function openAddModal() {
    editingActivityId = null;
    editingDayIndex = activeDay;
    resetForm();
    document.querySelector('#activityModal .modal-title').textContent = '新增活動';
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

    document.querySelector('#activityModal .modal-title').textContent = '編輯活動';
    openModal('activityModal');
  }

  function saveActivity() {
    const title = document.getElementById('actTitle').value.trim();
    if (!title) return showToast('活動名稱為必填項目');

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

    saveToLocalStorage();
    closeAllModals();
    renderDayViews();
    switchDay(activeDay);
    showToast('儲存成功');
  }

  function deleteActivity(activityId, dayIndex) {
    if (!confirm('確定要刪除此活動嗎？')) return;
    const day = appData.days[dayIndex];
    day.activities = day.activities.filter(a => a.id !== activityId);
    saveToLocalStorage();
    renderDayViews();
    switchDay(activeDay);
    showToast('已刪除');
  }

  function resetForm() {
    document.getElementById('activityForm').reset();
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

  function saveNote(activityId, value) {
    for (const day of appData.days) {
      const act = day.activities.find(a => a.id === activityId);
      if (act) {
        act.notes = value;
        saveToLocalStorage();
        return;
      }
    }
  }

  // ═══════════════════════════════════════════════
  // Sync & Storage
  // ═══════════════════════════════════════════════
  let syncTimeout = null;

  function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEYS.data, JSON.stringify(appData));
    if (syncTimeout) clearTimeout(syncTimeout);
    syncTimeout = setTimeout(() => {
      CloudSync.syncToCloud();
    }, 2000);
  }

  const CloudSync = {
    blobId: '019e8dee-92d5-7f7a-9620-63c4f20e9404',
    url() { return `https://jsonblob.com/api/jsonBlob/${this.blobId}`; },
    async syncToCloud() {
      try {
        await fetch(this.url(), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(appData)
        });
        showToast('已同步至雲端 ✓');
      } catch (err) {
        console.error(err);
      }
    },
    async syncFromCloud(notify = true) {
      try {
        const res = await fetch(this.url(), { headers: { 'Accept': 'application/json' } });
        if (!res.ok) throw new Error('API Error');
        appData = await res.json();
        saveToLocalStorage();
        if (notify) {
          renderAll();
          showToast('資料已更新');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  function showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('toast-out');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  // ═══════════════════════════════════════════════
  // Events
  // ═══════════════════════════════════════════════
  function setupEventListeners() {
    document.querySelector('.btn-theme')?.addEventListener('click', toggleTheme);
    
    // Bottom Nav
    document.getElementById('navHome')?.addEventListener('click', () => { if(isEditMode) toggleEditMode(); });
    document.getElementById('navEdit')?.addEventListener('click', () => { if(!isEditMode) toggleEditMode(); });
    document.querySelector('.btn-add-fab')?.addEventListener('click', openAddModal);

    // Tabs
    document.getElementById('dayTabsTrack')?.addEventListener('click', (e) => {
      const tab = e.target.closest('.day-tab');
      if (tab) switchDay(parseInt(tab.dataset.day, 10));
    });

    // Delegate actions
    document.getElementById('scheduleContainer')?.addEventListener('click', (e) => {
      const editBtn = e.target.closest('[data-action="edit"]');
      const deleteBtn = e.target.closest('[data-action="delete"]');
      if (editBtn) openEditModal(editBtn.dataset.id, parseInt(editBtn.dataset.day, 10));
      else if (deleteBtn) deleteActivity(deleteBtn.dataset.id, parseInt(deleteBtn.dataset.day, 10));
    });

    // Notes auto-save
    document.getElementById('scheduleContainer')?.addEventListener('input', (e) => {
      if (e.target.matches('.card-notes-input')) {
        saveNote(e.target.dataset.id, e.target.value);
      }
    });

    // Modals
    document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
      btn.addEventListener('click', closeAllModals);
    });
    document.querySelector('.modal-save')?.addEventListener('click', saveActivity);
    
    // Swipe
    setupSwipeGestures();
  }

  function setupSwipeGestures() {
    const main = document.getElementById('scheduleContainer');
    if (!main) return;
    let startX = 0, startY = 0, isDragging = false;
    main.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX; startY = e.touches[0].clientY; isDragging = true;
    }, { passive: true });
    main.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      const endX = e.changedTouches[0].clientX, endY = e.changedTouches[0].clientY;
      const diffX = endX - startX, diffY = endY - startY;
      if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
        if (diffX < 0) switchDay(activeDay + 1);
        else switchDay(activeDay - 1);
      }
    }, { passive: true });
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

  // Run
  document.addEventListener('DOMContentLoaded', initApp);

})();
