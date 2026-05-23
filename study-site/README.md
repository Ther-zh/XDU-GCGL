# 工程概论 · 静态学习站

## 本地使用（双击）

```bash
python build.py
```

双击 `index.html` 即可（需联网加载 CDN 脚本）。

---

## 部署到 GitHub Pages

仓库根目录已配置工作流：[`.github/workflows/deploy-gongcheng-study-site.yml`](../../../.github/workflows/deploy-gongcheng-study-site.yml)（相对于「课程笔记」仓库根）。

### 一次性设置

1. 将本仓库推送到 GitHub（需包含 `大二/工程概论/study-site/`、`notes/`、`课程整体要求.md`）。
2. 打开 GitHub 仓库 **Settings → Pages**。
3. **Build and deployment → Source** 选择 **GitHub Actions**（不要选 Deploy from branch）。
4. 推送代码到 `main`（或 `master`），或在 Actions 里手动 **Run workflow**。

### 访问地址

| 仓库类型 | 网址格式 |
|----------|----------|
| 普通仓库 `username/repo` | `https://username.github.io/repo/` |
| 用户/组织站 `username.github.io` | `https://username.github.io/` |

当前远程示例：`Ther-zh/-` → 约为 **https://ther-zh.github.io/-/**（以仓库 Settings → Pages 显示为准）。

### 更新网站

1. 修改 `../notes/*.md` 或 `../课程整体要求.md`
2. `git push` 到 main  
3. Actions 会自动运行 `build.py` 并发布；约 1–2 分钟后刷新 Pages 链接

### 工作流做了什么

- 运行 `python 大二/工程概论/study-site/build.py` 生成最新 `data/chapters.js`
- 将 **整个 `study-site` 目录** 作为站点根目录发布（`index.html` 在站点根路径）

### 故障排查

| 现象 | 处理 |
|------|------|
| Pages 404 | 确认 Settings 里 Source 为 GitHub Actions；查看 Actions 是否绿 |
| 内容旧 | 确认已 push 笔记；看最后一次 workflow 是否成功 |
| 流程图不显示 | 需联网访问 CDN（jsdelivr）；国内网络可稍后重试 |

## 目录

| 文件 | 作用 |
|------|------|
| `build.py` | 从 `../notes/` 生成 `data/chapters.js` |
| `data/chapters.js` | 内嵌章节（CI 与本地 build 都会生成） |
| `index.html` | 入口 |
