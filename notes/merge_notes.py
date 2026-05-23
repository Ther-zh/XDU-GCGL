#!/usr/bin/env python3
"""Merge chapter notes into 工程概论完整笔记.md. Run from repo root or notes/."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NOTES_DIR = ROOT / "notes"
OUT = ROOT / "工程概论完整笔记.md"

CHAPTERS = [
    "01-绪论与工程认识.md",
    "03-系统分析.md",
    "04-工程与伦理.md",
    "05-工程与法律法规.md",
    "06-标准化与可持续发展.md",
    "08-工程经济决策基础.md",
    "09-工程经济决策方法.md",
    "11-工程项目管理概述.md",
    "12-项目启动与范围管理.md",
]

HEADER = """# 工程概论 完整笔记

> 由 `notes/` 分章笔记自动合并 | 维护：只改分章文件后运行 `python notes/merge_notes.py`  
> 课程总纲：[课程整体要求.md](./课程整体要求.md)

**图例**：★★★ 必考深掌握 | ★★☆ 理解会应用 | ★☆☆ 了解识记

---

## 目录

- [一、课程整体要求（摘要）](#一课程整体要求摘要)
- [二、第0–1章 绪论与工程认识](#第01章-绪论与工程认识)
- [三、第3章 系统分析](#第3章-系统分析)
- [四、第4章 工程与伦理](#第4章-工程与伦理)
- [五、第5章 工程与法律法规](#第5章-工程与法律法规)
- [六、第6–7章 标准化与可持续发展](#第67章-工程与标准化可持续发展)
- [七、第8章 工程经济决策基础](#第8章-工程项目经济决策基础)
- [八、第9–10章 工程经济决策方法](#第910章-工程项目经济决策方法)
- [九、第11章 项目管理概述](#第11章-项目管理概述)
- [十、第12章 项目启动和范围管理](#第12章-项目启动和范围管理)
- [附录：全课程自测总表](#附录全课程自测总表)

---

## 一、课程整体要求（摘要）

| 项目 | 权重 | 说明 |
|------|------|------|
| 平时 | 20% | 课堂互动、作业、测验 |
| 项目报告 | 20% | 方案+非技术因素+经济+管理文档+答辩 |
| 期末 | 60% | 基础约60% + 综合约40% |

**复习优先级**：① 第8–10章经济（必算） ② 伦理/管理/法律/可持续 ③ 绪论七阶段+系统思维 ④ 平时作业

详见 [课程整体要求.md](./课程整体要求.md)。

---

"""

FOOTER = """
---

## 附录：全课程自测总表

### 概念与框架
- [ ] 复杂工程问题三条 + 全周期七阶段表
- [ ] 丁谓修宫系统优化逻辑
- [ ] 四伦理立场 + 挑战者号四维
- [ ] 法律效力层级 + 进网许可 + 青蒿素启示
- [ ] GB vs GB/T + LCA 四步

### 计算与评价
- [ ] 现金流量图 + 六系数选型
- [ ] 完全/变动成本法利润表
- [ ] PBT 插值 + NPV 折现 + 判据
- [ ] 例5-1 解题流程

### 项目管理
- [ ] 铁三角调节 + 五大过程组
- [ ] 章程字段 + WBS 100% 规则 + 范围蔓延对策

---

*分章修订见 `notes/` 目录；合并命令：`python notes/merge_notes.py`*
"""


def demote_headings(text: str) -> str:
    lines = []
    for line in text.splitlines():
        if line.startswith("# ") and not line.startswith("## "):
            lines.append("## " + line[2:])
        else:
            lines.append(line)
    return "\n".join(lines)


def main():
    parts = [HEADER]
    for name in CHAPTERS:
        path = NOTES_DIR / name
        if not path.exists():
            raise FileNotFoundError(path)
        body = path.read_text(encoding="utf-8")
        body = demote_headings(body)
        body = body.replace("../课程整体要求.md", "./课程整体要求.md")
        body = body.replace("./08-工程经济决策基础.md", "#第8章-工程项目经济决策基础")
        parts.append(body)
        parts.append("\n---\n\n")
    parts.append(FOOTER)
    OUT.write_text("".join(parts), encoding="utf-8")
    print(f"Wrote {OUT} ({len(parts)} sections)")


if __name__ == "__main__":
    main()
