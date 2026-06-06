# ☀ 8月沖繩輕旅 (Okinawa Trip Planner)

專為家族沖繩旅行設計的**輕量級、無後端、即時協作**行程規劃網站。

🔗 **https://chihpao.github.io/Okinawa/**

## 專案特色

### Zero-Backend 即時協作
- 純前端（Vanilla JS + CSS + HTML），部署於 GitHub Pages。
- 透過 [ExtendsClass](https://jsonblob.com/) REST API 儲存共用資料，所有訪客共享同一份行程。
- 編輯後 2 秒自動 Debounce 同步至雲端，其他裝置每 15 秒輪詢更新。

### 現代化 Mobile-first 設計
- **琉球紅型配色**：以沖繩傳統紅型織布為靈感，朱紅 `#C84B2F`、翠綠 `#1F8C78`、琥珀金 `#C9903D`。
- 深色模式自動偵測 + 手動切換。
- 導覽列下滑隱藏 / 上滑出現，最大化閱讀空間。
- 左右滑動切換天數。
- 倒數計時器即時顯示距離出發的時間。

### 直覺 CRUD 操作
- 卡片上直接提供編輯 / 刪除按鈕。
- Bottom Sheet Modal 新增 / 編輯活動。
- 刪除前有確認對話框，防止誤刪。

## 專案架構

| 檔案 | 說明 |
|------|------|
| `index.html` | 頁面結構，語意化標籤與 Modal |
| `index.css` | 設計系統，CSS Variables、響應式斷點、動畫 |
| `app.js` | 應用邏輯，CRUD、雲端同步、事件監聽 |
| `data.json` | 預設行程資料結構（備用） |

## 開發與部署

**本地測試**：
```bash
npx -y serve -l 3000 .
```

**部署**：推送到 `main` 分支，GitHub Pages 自動部署。

## 技術棧

- Vanilla JavaScript (ES6+)
- CSS3 with CSS Custom Properties
- Google Fonts (Outfit, Playfair Display, Noto Sans TC)
- ExtendsClass API (免認證 REST 儲存)
- GitHub Pages (靜態託管)
