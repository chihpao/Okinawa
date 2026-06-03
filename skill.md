# 🛠️ 核心技術與技巧 (Technical Skills)

本專案在實作過程中運用了許多現代 Web 開發技巧，特別是在不依賴傳統後端資料庫的前提下，實現複雜的互動與資料同步。

## 1. Zero-Backend 資料同步架構
為滿足「有連結即可編輯，免設定帳號密碼」的極致懶人需求，我們放棄了 GitHub Token 認證：
- **JSONBlob 整合**：利用第三方的免費 REST API (`jsonblob.com`) 作為資料儲存中心。
- **Auto-Sync (自動同步)**：取代傳統的「手動儲存按鈕」，我們在 `app.js` 的 `saveToLocalStorage()` 中實作了 **Debounce (防抖) 機制**。當使用者觸發修改時，會先更新 LocalStorage，並啟動一個 2 秒的 Timer。如果兩秒內沒有新的修改，就會將資料以 `PUT` 請求推送到雲端。這能有效避免頻繁打 API 造成伺服器負擔或被封鎖。

## 2. 現代化 UI 與 CSS 技巧
- **Design Tokens (CSS 變數)**：將顏色、間距、動畫時間抽離成 `:root` 變數。實作深色模式時，只需在 `[data-theme="dark"]` 中覆寫變數即可，完全不需更動 HTML 或複雜的 JS 邏輯。
- **懸浮膠囊導覽列 (Floating Pill Navbar)**：
  - 使用 `position: fixed` 搭配 `transform: translateX(-50%)` 達成完美置中。
  - 結合 `backdrop-filter: blur(20px)` 達成現代感的毛玻璃效果。
- **智慧隱藏 (Auto-hide on scroll)**：
  - 在 `window` 上綁定 `scroll` 事件，透過紀錄 `lastScrollY` 來判斷滑動方向。
  - 為了效能，事件監聽器標記為 `{ passive: true }`。
  - 透過 CSS `transform: translate(-50%, calc(-100% - 2rem))` 搭配 `transition`，實現滑順的隱藏與出現動畫。

## 3. 結構化資料處理
- 將非結構化的 Word 檔案，透過字串解析轉換為高度結構化的 JSON。
- 資料層 (`appData`) 與渲染層 (`renderAll`) 分離。任何 CRUD 操作只需修改資料層，然後呼叫重新渲染函式，類似 React 的 State Driven 設計模式。
