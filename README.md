# XDU 工程概论 · 课程笔记与学习站

西安电子科技大学《工程概论》课程笔记、静态学习网站与 GitHub Pages 自动部署。

## 在线学习

推送至 GitHub 并开启 Pages 后访问：

**https://ther-zh.github.io/XDU-GCGL/**

（以仓库 Settings → Pages 显示为准）

## 本地

```bash
cd study-site
python build.py
# 双击 index.html
```

## 目录

| 路径 | 说明 |
|------|------|
| `notes/` | 分章 Markdown 笔记 |
| `study-site/` | 静态网站 |
| `课程整体要求.md` | 考核与复习优先级 |
| `工程概论完整笔记.md` | 合并版（`notes/merge_notes.py`） |

## Pages 设置

仓库 **Settings → Pages → Source** 选择 **GitHub Actions**。
