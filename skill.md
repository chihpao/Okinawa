# 技術技能 (Technical Skills)

本專案經過架構重構，現採用 Vue 3 + Vite 的現代前端技術棧。

## 1. 雲端資料同步機制 (Pinia + Composable)
- 使用 Google Apps Script REST API 作為後端儲存。
- `useCloudSync.js` 負責封裝同步邏輯，並與 `tripStore` 結合。
- Debounce 機制：編輯或新增資料時，等待短暫時間內無其他操作才發送同步請求。
- 自動輪詢機制：定時發送 GET 請求取得最新資料，並比對 hash 判斷是否需要更新 UI。

## 2. 元件化與狀態管理
- **Vue SFC**：將原本龐大的單一檔案拆分為高內聚低耦合的 Vue 單文件元件 (SFC)。
- **Pinia**：`trip.js` 負責行程資料的增刪改查與排序；`ui.js` 負責全局視圖狀態 (View Mode, Active Day, Nav 顯示隱藏)。

## 3. 行動端體驗最佳化
- **Mobile-first**：以行動裝置優先，再透過 `min-width` 設定大螢幕樣式。
- **膠捲排版**：精準使用 `flex: 1 1 0` 與 `gap` 計算，確保手機與電腦皆完美平分 5 個相機膠捲不跑版。
- **Auto-hide 導覽列**：精準判斷 `scroll delta`，往下捲動隱藏、往上捲動顯示，提升可視範圍。
- **Native Events**：使用 Vue `@click.stop` 完全避免舊版 Vanilla JS `innerHTML` 造成的事件遺失 bug。

## 4. 動畫與視覺
- GSAP + Lenis：提供視差滾動與平滑的頁面捲動體驗。
- CSS 變數：Design Tokens 統一定義於 `variables.css`，方便維護及主題擴充。
