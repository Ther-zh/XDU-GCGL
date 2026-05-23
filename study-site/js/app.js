(function () {
  "use strict";

  const contentEl = document.getElementById("content");
  const navEl = document.getElementById("nav");
  const searchEl = document.getElementById("search");
  const sidebar = document.getElementById("sidebar");
  const menuToggle = document.getElementById("menu-toggle");
  const themeBtn = document.getElementById("btn-toggle-theme");

  let chapters = [];
  let currentId = null;

  marked.setOptions({
    gfm: true,
    breaks: true,
  });

  function mermaidTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "default";
  }

  mermaid.initialize({ startOnLoad: false, theme: mermaidTheme() });

  function loadTheme() {
    if (localStorage.getItem("gongcheng-theme") === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }

  function toggleTheme() {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    if (isDark) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("gongcheng-theme", "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("gongcheng-theme", "dark");
    }
    mermaid.initialize({ startOnLoad: false, theme: mermaidTheme() });
    if (currentId) showChapter(currentId);
  }

  function preprocessMarkdown(md) {
    return md.replace(/```mermaid\n([\s\S]*?)```/g, (_, code) => {
      return '<div class="mermaid">' + code.trim() + "</div>";
    });
  }

  function buildToc(html) {
    const wrap = document.createElement("div");
    wrap.innerHTML = html;
    const headings = wrap.querySelectorAll("h2");
    if (headings.length < 2) return html;

    const links = [];
    headings.forEach((h, i) => {
      const id = "sec-" + i;
      h.id = id;
      links.push('<a href="#' + id + '">' + h.textContent + "</a>");
    });
    return '<nav class="toc-bar">' + links.join("") + "</nav>" + wrap.innerHTML;
  }

  async function renderMarkdown(md) {
    const html = buildToc(marked.parse(preprocessMarkdown(md)));
    contentEl.innerHTML = html;

    const blocks = contentEl.querySelectorAll(".mermaid");
    if (blocks.length) {
      await mermaid.run({ nodes: blocks });
    }

    contentEl.querySelectorAll("h2").forEach((h) => {
      if (/考点|公式|例题|案例|小结/.test(h.textContent)) {
        h.style.borderBottomColor = "var(--star)";
      }
    });
  }

  function renderNav(filter) {
    const q = (filter || "").trim().toLowerCase();
    navEl.innerHTML = "";

    chapters.forEach((ch) => {
      const text = (ch.title + ch.markdown).toLowerCase();
      const match = !q || text.includes(q);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "nav-item" + (ch.id === currentId ? " active" : "") + (match ? "" : " hidden");

      const tagHtml = ch.tags && ch.tags.includes("计算")
        ? '<span class="tag-calc">计算</span>'
        : "";
      btn.innerHTML =
        "<span>" +
        ch.title +
        tagHtml +
        "</span>" +
        '<span class="meta">' +
        ch.importance +
        (ch.duration ? " · " + ch.duration : "") +
        "</span>";

      btn.addEventListener("click", () => {
        showChapter(ch.id);
        sidebar.classList.remove("open");
        location.hash = ch.id;
      });
      navEl.appendChild(btn);
    });
  }

  function showChapter(id) {
    const ch = chapters.find((c) => c.id === id);
    if (!ch) return;
    currentId = id;
    renderNav(searchEl.value);
    renderMarkdown(ch.markdown);
    document.title = ch.title + " · 工程概论";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function loadChapters() {
    if (window.GONGCHENG_CHAPTERS && window.GONGCHENG_CHAPTERS.length) {
      return window.GONGCHENG_CHAPTERS;
    }
    const res = await fetch("data/chapters.json");
    if (!res.ok) throw new Error("HTTP " + res.status);
    return res.json();
  }

  async function init() {
    loadTheme();
    try {
      chapters = await loadChapters();
    } catch (e) {
      contentEl.innerHTML =
        '<p class="error">无法加载笔记。请先在本目录运行 <code>python build.py</code> 生成 <code>data/chapters.js</code>，然后双击 <code>index.html</code> 打开。</p>';
      return;
    }

    renderNav();

    const hash = location.hash.replace("#", "");
    const start = chapters.some((c) => c.id === hash) ? hash : chapters[0].id;
    showChapter(start);

    searchEl.addEventListener("input", () => renderNav(searchEl.value));
    menuToggle.addEventListener("click", () => sidebar.classList.toggle("open"));
    themeBtn.addEventListener("click", toggleTheme);

    window.addEventListener("hashchange", () => {
      const id = location.hash.replace("#", "");
      if (chapters.some((c) => c.id === id)) showChapter(id);
    });

    contentEl.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href").slice(1);
      if (id && chapters.some((c) => c.id === id)) {
        e.preventDefault();
        showChapter(id);
        location.hash = id;
      }
    });
  }

  init();
})();
