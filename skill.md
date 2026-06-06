# 🛠️ 核心技術與技巧 (Technical Skills)

本專案在不依賴後端伺服器的前提下，實現即時協作行程編輯。

## 1. 固定 Blob 雲端同步架構
- 使用 JSONBlob REST API (`jsonblob.com`) 儲存共用資料。
- 程式碼中寫死單一 Blob ID，所有訪客共用同一份行程——打開網址即可協作，無需分享特殊連結。
- Debounce 機制：編輯觸發後等待 2 秒，若無新修改才執行 PUT 推送。
- 輪詢機制：每 15 秒 GET 拉取遠端資料，比對 hash 後決定是否更新 UI。
- 衝突偵測：透過 `_modifiedBy` (device ID) 和 `_lastModified` (timestamp) 區分自己與他人的寫入。

## 2. CSS 設計系統
- Design Tokens 全部抽離為 `:root` CSS Variables，深色模式只需覆寫 `[data-theme="dark"]` 變數。
- 琉球紅型配色系統：6 種分類色（觀光/美食/購物/交通/住宿/休閒）對應卡片左邊色條。
- FAB 按鈕定位：使用 `.nav-item.btn-add-fab` 雙 class 提高 specificity，搭配 `transform: translateY()` 上浮，不破壞 flexbox flow。

## 3. 行動裝置優化
- Mobile-first 響應式設計，所有尺寸以 `min-width` 斷點向上擴展。
- Touch 手勢：左右滑動切換天數（`touchstart` / `touchend` 計算位移量）。
- Auto-hide 導覽列：`requestAnimationFrame` + scroll delta 判斷方向，`passive: true` 優化效能。
- Bottom Sheet Modal：手機端 Modal 從底部滑入，桌面端居中顯示。
- Safe Area 支援：`env(safe-area-inset-*)` 處理 iPhone 瀏海和底部指示條。

## 4. 前端架構模式
- State-Driven Rendering：所有 CRUD 操作只修改 `appData` 物件，再呼叫 `renderAll()` 重繪 UI。
- 事件委派 (Event Delegation)：卡片的編輯/刪除按鈕統一透過 `scheduleContainer` 的 click 事件處理，避免大量個別綁定。
- IIFE 封裝：整個應用包在立即執行函式中，避免全域命名空間污染。
