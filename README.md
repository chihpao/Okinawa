# ☀ 8月沖繩輕旅 (Okinawa Trip Planner)

這是一個專為家族沖繩旅行設計的**輕量級、無後端、即時協作**行程規劃網站。

## 🌟 專案特色

1. **極致輕量 (Zero-Backend)**
   - 純前端實作（Vanilla JS + CSS3 + HTML5）。
   - 部署於 GitHub Pages，無須維護任何伺服器。
2. **免登入即時協作 (Anonymous Cloud Sync)**
   - 透過 [JSONBlob](https://jsonblob.com/) 提供公開的 REST API 進行資料儲存。
   - 任何人只要擁有專屬網址，就能在瀏覽器上直接編輯行程。
   - **自動存檔**：編輯完成後，系統會在背景自動 (Debounced) 將最新版本同步至雲端，其他裝置重新整理即可看到最新行程。
3. **現代化 UI/UX (Modern Design System)**
   - **Ryukyu Ocean 配色**：以沖繩海洋的藍綠色系為主，搭配珊瑚橘作為強調色。
   - **Glassmorphism (毛玻璃)**：大量運用 `backdrop-filter` 創造懸浮膠囊導覽列與質感卡片。
   - **智慧互動**：
     - 手機版支援左右滑動切換天數。
     - 導覽列支援「下滑隱藏、上滑出現」，最大化閱讀空間。
     - 自動偵測系統深色模式，並支援手動一鍵切換 (☀️/🌙)。
     - 倒數計時器即時顯示距離出發日的時間。

## 📂 專案架構

- `index.html`: 主頁面結構，包含語意化標籤與 Modal 模板。
- `index.css`: 核心樣式表，包含 CSS Variables 設計系統、響應式斷點與動畫。
- `app.js`: 應用程式邏輯，包含資料綁定、CRUD 操作、雲端同步與事件監聽。
- `data.json`: 預設的行程資料結構 (備用)。

## 🚀 開發與部署

1. **本地測試**：
   ```bash
   npx http-server . -p 3000
   ```
2. **部署方式**：
   直接將程式碼推送到 GitHub `main` 分支，並於設定中啟用 **GitHub Pages** 即可。

---
*Built with ❤️ for a family trip to Okinawa, August 2026.*
