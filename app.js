/* ═══════════════════════════════════════════════════════
   ☀ 沖繩輕旅 — 應用程式邏輯
   Vanilla JS · ES6+ · 行程管理 & 編輯
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── 類別系統 ───
  const CATEGORIES = {
    sightseeing: { icon: '🏯', label: '觀光景點' },
    food:        { icon: '🍽️', label: '美食餐廳' },
    shopping:    { icon: '🛍️', label: '購物逛街' },
    transport:   { icon: '✈️', label: '交通移動' },
    hotel:       { icon: '🏨', label: '住宿休息' },
    leisure:     { icon: '🌅', label: '休閒體驗' }
  };

  const PERIODS = [
    { value: '上午', icon: '☀️' },
    { value: '下午', icon: '🌤️' },
    { value: '傍晚', icon: '🌇' },
    { value: '晚上', icon: '🌙' },
    { value: '夜間', icon: '🌃' }
  ];

  const PERIOD_ORDER = ['上午', '下午', '傍晚', '晚上', '夜間'];

  // ─── 狀態管理 ───
  let appData = null;
  let activeDay = 0;
  let isEditMode = false;
  let editingActivityId = null;
  let editingDayIndex = null;
  let countdownInterval = null;

  // ─── 本地儲存鍵 ───
  const STORAGE_KEYS = {
    data: 'okinawa-data',
    theme: 'okinawa-theme',
    activeDay: 'okinawa-active-day',
    githubToken: 'okinawa-github-token',
    githubOwner: 'okinawa-github-owner',
    githubRepo: 'okinawa-github-repo'
  };

  // ═══════════════════════════════════════════════
  // 初始化
  // ═══════════════════════════════════════════════
  async function initApp() {
    showLoading();
    initTheme();

    try {
      // 優先從 localStorage 載入（使用者修改過的版本）
      const savedData = localStorage.getItem(STORAGE_KEYS.data);
      if (savedData) {
        appData = JSON.parse(savedData);
      } else {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('無法載入行程資料');
        appData = await response.json();
      }

      window.appData = appData; // 除錯用

      // 恢復上次瀏覽的天數
      const savedDay = localStorage.getItem(STORAGE_KEYS.activeDay);
      if (savedDay !== null) {
        activeDay = Math.min(parseInt(savedDay, 10), appData.days.length - 1);
      }

      renderAll();
      setupEventListeners();
      startCountdown();
      updateSyncButton();

    } catch (err) {
      console.error('初始化失敗:', err);
      showError('載入行程資料時發生錯誤，請重新整理頁面。');
    }
  }

  // ─── 顯示載入中 ───
  function showLoading() {
    const main = document.querySelector('.main-content');
    main.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
        <div class="loading-text">正在載入行程...</div>
      </div>`;
  }

  // ─── 顯示錯誤 ───
  function showError(msg) {
    const main = document.querySelector('.main-content');
    main.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">😵</div>
        <div class="empty-state-text">${msg}</div>
      </div>`;
  }

  // ═══════════════════════════════════════════════
  // 渲染引擎
  // ═══════════════════════════════════════════════
  function renderAll() {
    renderHeroTravelers();
    renderDayTabs();
    renderDayViews();
    switchDay(activeDay);
  }

  // ─── 旅伴徽章 ───
  function renderHeroTravelers() {
    const container = document.querySelector('.hero-travelers');
    if (!container || !appData.trip.travelers) return;

    container.innerHTML = appData.trip.travelers.map(t =>
      `<div class="traveler-badge">
        <span class="traveler-emoji">${t.emoji}</span>
        <span>${t.name}</span>
      </div>`
    ).join('');
  }

  // ─── 日程 Tab ───
  function renderDayTabs() {
    const track = document.querySelector('.day-tabs-track');
    if (!track) return;

    track.innerHTML = appData.days.map((day, i) => {
      const date = new Date(day.date);
      const monthDay = `${date.getMonth() + 1}/${date.getDate()}`;
      return `<button class="day-tab${i === activeDay ? ' active' : ''}" data-day="${i}">
        <span class="tab-day">${day.label}</span>
        <span class="tab-date">${monthDay}(${day.dayOfWeek})</span>
      </button>`;
    }).join('');
  }

  // ─── 日程視圖 ───
  function renderDayViews() {
    const main = document.querySelector('.main-content');
    if (!main) return;

    main.innerHTML = appData.days.map((day, dayIndex) => {
      const date = new Date(day.date);
      const dateStr = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}(${day.dayOfWeek})`;

      // 判斷旅伴在場狀態
      const travelerBadges = renderTravelerPresence(day.date);
      const badges = renderDayBadges(day);

      // 按時段分組活動
      const timeline = renderTimeline(day.activities, dayIndex);

      return `<div class="day-view${dayIndex === activeDay ? ' active' : ''}" data-day-index="${dayIndex}">
        <div class="day-header">
          <div class="day-header-top">
            <div class="day-label">${day.label}</div>
            <div class="day-date">${dateStr}</div>
          </div>
          <div class="day-subtitle">${day.subtitle}</div>
          <div class="day-badges">
            ${badges}
            ${travelerBadges}
          </div>
        </div>
        <div class="timeline">
          ${timeline}
        </div>
      </div>`;
    }).join('');
  }

  // ─── 旅伴在場狀態 ───
  function renderTravelerPresence(dayDate) {
    if (!appData.trip.travelers) return '';

    return appData.trip.travelers.map(t => {
      const isPresent = dayDate < t.departureDate;
      const isDepartDay = dayDate === t.departureDate.split('T')[0];
      const cls = isPresent || isDepartDay ? 'traveler-present' : 'traveler-departed';
      const label = isDepartDay ? `${t.emoji} ${t.name} ✈️` : `${t.emoji} ${t.name}`;
      return `<span class="badge ${cls}">${label}</span>`;
    }).join('');
  }

  // ─── 日程徽章 ───
  function renderDayBadges(day) {
    let badges = '';
    if (day.hasRentalCar) {
      badges += '<span class="badge badge-car">🚗 租車</span>';
    }
    const hasFlight = day.activities.some(a => a.category === 'transport' && a.description && a.description.includes('航'));
    if (hasFlight) {
      badges += '<span class="badge badge-flight">✈️ 搭機</span>';
    }
    return badges;
  }

  // ─── 時間軸 ───
  function renderTimeline(activities, dayIndex) {
    if (!activities || activities.length === 0) {
      return `<div class="empty-state">
        <div class="empty-state-icon">📋</div>
        <div class="empty-state-text">尚未安排活動</div>
      </div>`;
    }

    // 按時段分組
    const grouped = {};
    activities.forEach(act => {
      const period = act.period || '其他';
      if (!grouped[period]) grouped[period] = [];
      grouped[period].push(act);
    });

    // 按固定順序排列時段
    const orderedPeriods = PERIOD_ORDER.filter(p => grouped[p]);
    // 加入不在預設順序中的時段
    Object.keys(grouped).forEach(p => {
      if (!orderedPeriods.includes(p)) orderedPeriods.push(p);
    });

    let cardIndex = 0;

    return orderedPeriods.map(period => {
      const periodInfo = PERIODS.find(p => p.value === period);
      const icon = periodInfo ? periodInfo.icon : '📌';

      const cards = grouped[period].map(act => {
        const html = renderActivityCard(act, dayIndex, cardIndex);
        cardIndex++;
        return html;
      }).join('');

      return `<div class="period-group">
        <div class="period-label">
          <span class="period-dot"></span>
          <span class="period-icon">${icon}</span>
          <span>${period}</span>
        </div>
        ${cards}
      </div>`;
    }).join('');
  }

  // ─── 活動卡片 ───
  function renderActivityCard(activity, dayIndex, index) {
    const cat = CATEGORIES[activity.category] || CATEGORIES.sightseeing;
    const timeHtml = activity.time
      ? `<span class="card-time">${activity.time}</span>`
      : '';

    const descHtml = activity.description
      ? `<div class="card-description">${escapeHtml(activity.description)}</div>`
      : '';

    const mapHtml = activity.mapUrl
      ? `<div class="card-links">
          <a class="map-link" href="${escapeHtml(activity.mapUrl)}" target="_blank" rel="noopener noreferrer">
            <span class="map-link-icon">📍</span>
            <span>Google Maps</span>
          </a>
        </div>`
      : '';

    const notesHtml = renderNotes(activity);

    return `<div class="activity-card" data-category="${activity.category}" data-id="${activity.id}" data-day="${dayIndex}" style="--i: ${index}">
      <div class="card-header">
        <div class="card-header-left">
          <span class="card-category-icon">${cat.icon}</span>
          <span class="card-title">${escapeHtml(activity.title)}</span>
          ${timeHtml}
        </div>
        <div class="card-actions">
          <button class="btn-edit-action btn-card-edit" data-action="edit" data-id="${activity.id}" data-day="${dayIndex}" title="編輯">✏️</button>
          <button class="btn-edit-action btn-card-delete" data-action="delete" data-id="${activity.id}" data-day="${dayIndex}" title="刪除">🗑️</button>
        </div>
      </div>
      <div class="card-body">
        ${descHtml}
        ${mapHtml}
        ${notesHtml}
      </div>
    </div>`;
  }

  // ─── 備註區域 ───
  function renderNotes(activity) {
    if (!isEditMode && !activity.notes) return '';

    if (isEditMode) {
      return `<div class="card-notes">
        <div class="card-notes-label">📝 備註</div>
        <textarea class="card-notes-input" data-id="${activity.id}" placeholder="新增備註...">${escapeHtml(activity.notes || '')}</textarea>
      </div>`;
    }

    return `<div class="card-notes">
      <div class="card-notes-label">📝 備註</div>
      <div class="card-notes-text">${escapeHtml(activity.notes)}</div>
    </div>`;
  }

  // ═══════════════════════════════════════════════
  // 天數切換
  // ═══════════════════════════════════════════════
  function switchDay(index) {
    if (index < 0 || index >= appData.days.length) return;
    activeDay = index;
    localStorage.setItem(STORAGE_KEYS.activeDay, index);

    // 更新 Tab 狀態
    document.querySelectorAll('.day-tab').forEach((tab, i) => {
      tab.classList.toggle('active', i === index);
    });

    // 切換可見的 Day View
    document.querySelectorAll('.day-view').forEach((view, i) => {
      view.classList.toggle('active', i === index);
    });

    // 在手機上捲動 tab 到可見範圍
    const activeTab = document.querySelector('.day-tab.active');
    if (activeTab) {
      activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }

  // ═══════════════════════════════════════════════
  // 倒數計時器
  // ═══════════════════════════════════════════════
  function startCountdown() {
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
  }

  function updateCountdown() {
    const startDate = new Date(appData.trip.startDate + 'T00:00:00');
    const endDate = new Date(appData.trip.endDate + 'T23:59:59');
    const now = new Date();

    const countDays = document.getElementById('countDays');
    const countHours = document.getElementById('countHours');
    const countMins = document.getElementById('countMins');
    const countSecs = document.getElementById('countSecs');
    const countdown = document.querySelector('.countdown');

    if (!countdown) return;

    if (now >= startDate && now <= endDate) {
      // 旅途進行中
      const currentDay = Math.floor((now - startDate) / (1000 * 60 * 60 * 24)) + 1;
      countdown.innerHTML = `<div class="countdown-status">🏖️ 旅途進行中！第 ${currentDay} 天</div>`;
      return;
    }

    if (now > endDate) {
      // 旅途已結束
      countdown.innerHTML = `<div class="countdown-status">旅途已結束 🎉 美好的回憶</div>`;
      clearInterval(countdownInterval);
      return;
    }

    // 計算剩餘時間
    const diff = startDate - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    if (countDays) countDays.textContent = days;
    if (countHours) countHours.textContent = String(hours).padStart(2, '0');
    if (countMins) countMins.textContent = String(mins).padStart(2, '0');
    if (countSecs) countSecs.textContent = String(secs).padStart(2, '0');
  }

  // ═══════════════════════════════════════════════
  // 深色模式
  // ═══════════════════════════════════════════════
  function initTheme() {
    const saved = localStorage.getItem(STORAGE_KEYS.theme);
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    updateThemeIcon();
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEYS.theme, next);
    updateThemeIcon();
  }

  function updateThemeIcon() {
    const btn = document.querySelector('.btn-theme span');
    if (!btn) return;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    btn.textContent = isDark ? '☀️' : '🌙';
  }

  // ═══════════════════════════════════════════════
  // 編輯模式
  // ═══════════════════════════════════════════════
  function toggleEditMode() {
    isEditMode = !isEditMode;
    document.body.classList.toggle('edit-mode', isEditMode);

    const btn = document.querySelector('.btn-edit');
    if (btn) {
      btn.classList.toggle('active', isEditMode);
      btn.querySelector('span').textContent = isEditMode ? '✓' : '✏️';
    }

    // 重新渲染以顯示/隱藏編輯控制元件
    renderDayViews();
    switchDay(activeDay);

    if (isEditMode) {
      showToast('已進入編輯模式');
    }
  }

  // ═══════════════════════════════════════════════
  // 活動 CRUD
  // ═══════════════════════════════════════════════

  // ─── 開啟新增活動 Modal ───
  function openAddModal() {
    editingActivityId = null;
    editingDayIndex = activeDay;
    resetForm();
    document.querySelector('#activityModal .modal-title').textContent = '新增活動';
    openModal('activityModal');
  }

  // ─── 開啟編輯活動 Modal ───
  function openEditModal(activityId, dayIndex) {
    editingActivityId = activityId;
    editingDayIndex = dayIndex;
    const day = appData.days[dayIndex];
    const activity = day.activities.find(a => a.id === activityId);
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

  // ─── 儲存活動 ───
  function saveActivity() {
    const title = document.getElementById('actTitle').value.trim();
    if (!title) {
      showToast('請輸入活動名稱');
      return;
    }

    const periodValue = document.getElementById('actPeriod').value;
    const periodInfo = PERIODS.find(p => p.value === periodValue);

    const activityData = {
      period: periodValue,
      periodIcon: periodInfo ? periodInfo.icon : '📌',
      time: document.getElementById('actTime').value.trim(),
      title: title,
      description: document.getElementById('actDesc').value.trim(),
      category: document.getElementById('actCategory').value,
      mapUrl: document.getElementById('actMapUrl').value.trim(),
      notes: document.getElementById('actNotes').value.trim()
    };

    const day = appData.days[editingDayIndex];

    if (editingActivityId) {
      // 編輯現有活動
      const idx = day.activities.findIndex(a => a.id === editingActivityId);
      if (idx !== -1) {
        activityData.id = editingActivityId;
        day.activities[idx] = activityData;
      }
    } else {
      // 新增活動
      activityData.id = `d${editingDayIndex + 1}-${Date.now()}`;
      day.activities.push(activityData);
    }

    saveToLocalStorage();
    closeAllModals();
    renderDayViews();
    switchDay(activeDay);
    showToast('已儲存 ✓');
  }

  // ─── 刪除活動 ───
  function deleteActivity(activityId, dayIndex) {
    if (!confirm('確定要刪除此活動嗎？')) return;

    const day = appData.days[dayIndex];
    day.activities = day.activities.filter(a => a.id !== activityId);

    saveToLocalStorage();
    renderDayViews();
    switchDay(activeDay);
    showToast('已刪除');
  }

  // ─── 重置表單 ───
  function resetForm() {
    document.getElementById('actPeriod').value = '上午';
    document.getElementById('actTime').value = '';
    document.getElementById('actTitle').value = '';
    document.getElementById('actDesc').value = '';
    document.getElementById('actCategory').value = 'sightseeing';
    document.getElementById('actMapUrl').value = '';
    document.getElementById('actNotes').value = '';
  }

  // ─── 儲存備註（即時） ───
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
  // Modal 控制
  // ═══════════════════════════════════════════════
  function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => {
      m.classList.remove('active');
    });
    document.body.style.overflow = '';
  }

  // ═══════════════════════════════════════════════
  // 本地儲存
  // ═══════════════════════════════════════════════
  function saveToLocalStorage() {
    try {
      localStorage.setItem(STORAGE_KEYS.data, JSON.stringify(appData));
    } catch (err) {
      console.error('儲存失敗:', err);
      showToast('儲存失敗，請檢查儲存空間');
    }
  }

  // ═══════════════════════════════════════════════
  // Toast 通知
  // ═══════════════════════════════════════════════
  function showToast(message) {
    const container = document.querySelector('.toast-container');
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
  // GitHub API 同步
  // ═══════════════════════════════════════════════
  const GitHubSync = {
    getToken() {
      return localStorage.getItem(STORAGE_KEYS.githubToken) || '';
    },
    setToken(token) {
      localStorage.setItem(STORAGE_KEYS.githubToken, token);
    },
    getOwner() {
      return localStorage.getItem(STORAGE_KEYS.githubOwner) || '';
    },
    getRepo() {
      return localStorage.getItem(STORAGE_KEYS.githubRepo) || 'Okinawa';
    },
    hasConfig() {
      return !!(this.getToken() && this.getOwner());
    },

    async fetchFile(path) {
      const token = this.getToken();
      const owner = this.getOwner();
      const repo = this.getRepo();

      const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );
      if (!res.ok) throw new Error(`GitHub API 錯誤: ${res.status}`);
      return res.json();
    },

    async saveFile(path, content, sha, message) {
      const token = this.getToken();
      const owner = this.getOwner();
      const repo = this.getRepo();

      const body = {
        message: message || '更新行程資料',
        content: btoa(unescape(encodeURIComponent(content))),
      };
      if (sha) body.sha = sha;

      const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `GitHub API 錯誤: ${res.status}`);
      }
      return res.json();
    },

    async syncToGitHub() {
      if (!this.hasConfig()) {
        openModal('tokenModal');
        return;
      }
      try {
        showToast('正在同步至 GitHub...');
        // 先取得現有檔案的 SHA
        let sha = null;
        try {
          const existing = await this.fetchFile('data.json');
          sha = existing.sha;
        } catch (e) {
          // 檔案可能不存在，第一次推送
        }

        const content = JSON.stringify(appData, null, 2);
        await this.saveFile('data.json', content, sha, '更新行程 via 沖繩輕旅 App');
        showToast('同步成功 ✓');
      } catch (err) {
        console.error('同步失敗:', err);
        showToast('同步失敗: ' + err.message);
      }
    },

    async syncFromGitHub() {
      if (!this.hasConfig()) {
        openModal('tokenModal');
        return;
      }
      try {
        showToast('正在從 GitHub 載入...');
        const file = await this.fetchFile('data.json');
        const content = decodeURIComponent(escape(atob(file.content)));
        appData = JSON.parse(content);
        window.appData = appData;
        saveToLocalStorage();
        renderAll();
        showToast('已載入最新版本 ✓');
      } catch (err) {
        console.error('載入失敗:', err);
        showToast('載入失敗: ' + err.message);
      }
    }
  };

  function updateSyncButton() {
    const btn = document.querySelector('.btn-sync');
    if (btn) {
      btn.classList.toggle('active', GitHubSync.hasConfig());
    }
  }

  function saveTokenConfig() {
    const token = document.getElementById('githubToken').value.trim();
    const owner = document.getElementById('githubOwner').value.trim();
    const repo = document.getElementById('githubRepo').value.trim() || 'Okinawa';

    if (!token || !owner) {
      showToast('請填入 Token 和 GitHub 帳號');
      return;
    }

    localStorage.setItem(STORAGE_KEYS.githubToken, token);
    localStorage.setItem(STORAGE_KEYS.githubOwner, owner);
    localStorage.setItem(STORAGE_KEYS.githubRepo, repo);

    updateSyncButton();
    closeAllModals();
    showToast('GitHub 設定已儲存 ✓');
  }

  // ═══════════════════════════════════════════════
  // 觸控手勢（手機左右滑動切換天數）
  // ═══════════════════════════════════════════════
  function setupSwipeGestures() {
    const main = document.querySelector('.main-content');
    if (!main) return;

    let startX = 0;
    let startY = 0;
    let isDragging = false;

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

      // 確保是水平滑動（非垂直捲動）
      if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
        if (diffX < 0) {
          // 左滑 → 下一天
          switchDay(activeDay + 1);
        } else {
          // 右滑 → 上一天
          switchDay(activeDay - 1);
        }
      }
    }, { passive: true });
  }

  // ═══════════════════════════════════════════════
  // 鍵盤快捷鍵
  // ═══════════════════════════════════════════════
  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // 如果正在輸入框內，不攔截
      if (e.target.matches('input, textarea, select')) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          switchDay(activeDay - 1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          switchDay(activeDay + 1);
          break;
        case 'e':
        case 'E':
          e.preventDefault();
          toggleEditMode();
          break;
        case 'Escape':
          closeAllModals();
          break;
      }
    });
  }

  // ═══════════════════════════════════════════════
  // 事件監聽
  // ═══════════════════════════════════════════════
  function setupEventListeners() {
    // 主題切換
    document.querySelector('.btn-theme')?.addEventListener('click', toggleTheme);

    // 編輯模式切換
    document.querySelector('.btn-edit')?.addEventListener('click', toggleEditMode);

    // 同步按鈕
    document.querySelector('.btn-sync')?.addEventListener('click', () => {
      if (GitHubSync.hasConfig()) {
        GitHubSync.syncToGitHub();
      } else {
        // 顯示已儲存的設定
        const ownerInput = document.getElementById('githubOwner');
        const repoInput = document.getElementById('githubRepo');
        if (ownerInput) ownerInput.value = GitHubSync.getOwner();
        if (repoInput) repoInput.value = GitHubSync.getRepo();
        openModal('tokenModal');
      }
    });

    // Day tabs — 使用事件代理
    document.querySelector('.day-tabs-track')?.addEventListener('click', (e) => {
      const tab = e.target.closest('.day-tab');
      if (tab) {
        const index = parseInt(tab.dataset.day, 10);
        switchDay(index);
      }
    });

    // FAB
    document.querySelector('.fab')?.addEventListener('click', openAddModal);

    // 活動卡片操作 — 事件代理
    document.querySelector('.main-content')?.addEventListener('click', (e) => {
      const editBtn = e.target.closest('[data-action="edit"]');
      const deleteBtn = e.target.closest('[data-action="delete"]');

      if (editBtn) {
        openEditModal(editBtn.dataset.id, parseInt(editBtn.dataset.day, 10));
      } else if (deleteBtn) {
        deleteActivity(deleteBtn.dataset.id, parseInt(deleteBtn.dataset.day, 10));
      }
    });

    // 備註即時儲存 — 事件代理
    document.querySelector('.main-content')?.addEventListener('input', (e) => {
      if (e.target.matches('.card-notes-input')) {
        const id = e.target.dataset.id;
        saveNote(id, e.target.value);
      }
    });

    // Modal 關閉
    document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
      btn.addEventListener('click', closeAllModals);
    });

    // Modal overlay 點擊關閉
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeAllModals();
      });
    });

    // 儲存活動
    document.querySelector('.modal-save')?.addEventListener('click', saveActivity);

    // 儲存 Token
    document.querySelector('.token-save')?.addEventListener('click', saveTokenConfig);

    // 觸控手勢
    setupSwipeGestures();

    // 鍵盤快捷鍵
    setupKeyboardShortcuts();
  }

  // ═══════════════════════════════════════════════
  // 工具函式
  // ═══════════════════════════════════════════════
  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ═══════════════════════════════════════════════
  // 啟動！
  // ═══════════════════════════════════════════════
  document.addEventListener('DOMContentLoaded', initApp);

})();
