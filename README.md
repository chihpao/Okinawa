# ☀ 8月沖繩輕旅（Okinawa Trip Planner）

沖繩五天四夜 *家族旅行行程共筆*

🔗 **https://chihpao.github.io/Okinawa/**

## 主要特色

### Zero-Backend 架構設計
- 純前端 Vanilla JS + CSS + HTML，靜態部署至 GitHub Pages
- 透過 [Google Apps Script](https://script.google.com/) REST API 實現雲端資料同步，無需自建伺服器或資料庫
- 智慧節流：2 秒 Debounce 寫入防止頻繁呼叫、15 秒間隔輪詢更新

### 高質感 Mobile-first 設計
- **深色優先**：精選配色系統——朱紅 `#C84B2F`、海藍 `#1F8C78`、琥珀 `#C9903D`
- 毛玻璃質感卡片 + 微動態效果
- 一鍵切換 深色 / 淺色 模式，含流暢的過場動畫
- 手勢滑動切換天數
- 響應式設計完美適配手機與桌面裝置

### 完整 CRUD 功能
- 支援新增活動、即時編輯 / 刪除操作
- Bottom Sheet Modal 表單 / 確認對話框設計
- 刪除需確認防止誤觸操作

## 主要檔案

| 檔案 | 說明 |
|------|------|
| `index.html` | 頁面結構，含導覽列與 Modal |
| `index.css` | 設計系統：CSS Variables、動畫、響應式 |
| `app.js` | 核心邏輯：CRUD、雲端同步、倒數計時 |
| `data.json` | 預設行程資料結構（僅備份） |

## 本地開發

**啟動伺服器**：
```bash
npx -y serve -l 3000 .
```

**部署**：推送 `main` 分支，GitHub Pages 自動部署。

## 技術棧

- Vanilla JavaScript (ES6+)
- CSS3 with CSS Custom Properties
- Google Fonts (Outfit, Playfair Display, Noto Sans TC)
- Google Apps Script API (自建 REST 後端)
- GitHub Pages (靜態部署)
