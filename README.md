# ☀ 8月沖繩輕旅（Okinawa Trip Planner）

沖繩五天四夜 *家族旅行行程共筆*

🔗 **https://chihpao.github.io/Okinawa/**

## 主要特色

### Vue 3 現代化架構
- 採用 Vue 3 (Composition API) + Vite 建置，提供極速的開發與載入體驗。
- 透過 Pinia 進行狀態管理，將 UI 狀態與商業邏輯完美解耦。
- 零後端架構：透過 Google Apps Script REST API 實現雲端資料同步，無需自建伺服器。
- 智慧節流：防抖 (Debounce) 寫入防止頻繁呼叫、定時輪詢更新。

### 高質感 Mobile-first 設計
- **深色優先**：精選配色系統——朱紅 `#C84B2F`、海藍 `#1F8C78`、琥珀 `#C9903D`
- 毛玻璃質感卡片 + GSAP / Lenis 平滑滾動與微動態效果。
- 響應式設計完美適配手機與桌面裝置，專為手機優化操作手感。

### 完整 CRUD 功能
- 支援新增活動、即時編輯 / 刪除操作。
- 支援跨日行程搬移。
- Bottom Sheet Modal 表單 / 確認對話框設計。

## 本地開發

**啟動開發伺服器**：
```bash
npm install
npm run dev
```

**建置生產版本**：
```bash
npm run build
```

## 技術棧
- Vue 3 + Vite + Pinia
- CSS3 (Vanilla CSS, CSS Variables)
- GSAP + Lenis (平滑動畫)
- Google Apps Script API (REST Backend)
- GitHub Pages (靜態部署)
