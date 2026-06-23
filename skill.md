# 技術技能 (Technical Skills)

本專案在不使用任何前端框架的條件下，實作了以下幾種網頁開發技術。

## 1. 雲端資料同步機制
- 使用 Google Apps Script REST API 作為後端儲存。
- Debounce 機制：編輯或新增資料時，等待 2 秒內無其他操作才發送同步請求。
- 自動輪詢機制：每 15 秒發送 GET 請求取得最新資料，並比對 hash 判斷是否需要更新 UI。
- 衝突處理：透過 `_modifiedBy` (device ID) 與 `_lastModified` (timestamp) 判斷是否為自己剛發送的更新。

## 2. CSS 設計系統
- Design Tokens 定義於 `:root` 的 CSS Variables，方便維護及主題切換。
- FAB 浮動按鈕：使用特異性較高的 class，並以 `transform: translateY()` 控制顯示隱藏，不影響版面流（flexbox flow）。

## 3. 行動端體驗最佳化
- Mobile-first 響應式設計：以行動裝置優先，再透過 `min-width` 設定大螢幕樣式。
- Touch 手勢：監聽 `touchstart` / `touchend` 判斷左右滑動以切換天數。
- Auto-hide 導覽列：利用 `requestAnimationFrame` 與 scroll delta 判斷捲動方向，並加上 `passive: true` 提升效能。
- Bottom Sheet Modal：在手機版將 Modal 改為由下方滑出，符合原生 App 體驗。
- Safe Area 支援：透過 `env(safe-area-inset-*)` 避免被 iPhone 瀏海與底部橫條遮擋。

## 4. 狀態驅動與效能優化
- State-Driven Rendering：所有的 CRUD 操作只修改 `appData` 物件，再統一呼叫 `renderAll()` 重繪 UI。
- 事件委派 (Event Delegation)：將按鈕點擊等事件綁定於 `scheduleContainer` 等父層元素，避免建立大量事件監聽器。
- IIFE 封裝：將所有程式碼封裝在立即執行函式中，避免污染全域變數。
