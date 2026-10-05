/* ==========================================================================
   拾穗集 · 站点交互脚本
   依赖：posts.js、site-config.js（均需在本文件之前加载）
   页面约定：<body data-page="home|archive|about|post" data-root="相对根路径">
   ========================================================================== */
(function () {
  "use strict";

  var body = document.body;
  var PAGE = body.dataset.page || "";
  var ROOT = body.dataset.root || "";          // 首页/归档页为 ""，posts/ 下为 "../"
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };

  /* ---------- 工具 ---------- */
  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function postUrl(slug) { return ROOT + "posts/" + slug + ".html"; }

  function sortedPosts() {
    return POSTS.slice().sort(function (a, b) {
      if (!!b.featured !== !!a.featured) return b.featured ? 1 : -1;
      return a.date < b.date ? 1 : -1;
    });
  }

  function formatDate(iso) {
    var p = iso.split("-");
    if (p.length !== 3) return iso;
    return p[0] + " 年 " + Number(p[1]) + " 月 " + Number(p[2]) + " 日";
  }

  function shortDate(iso) {
    var p = iso.split("-");
    return p.length === 3 ? p[1] + "-" + p[2] : iso;
  }

  function debounce(fn, wait) {
    var t;
    return function () {
      var args = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, args); }, wait);
    };
  }

  /* ---------- 1. 主题 ---------- */
  function initTheme() {
    var btn = $("#themeToggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (e) {}
      btn.setAttribute("aria-label", next === "dark" ? "切换到浅色主题" : "切换到深色主题");
    });
  }

  /* ---------- 2. 全站署名 / 年份 ---------- */
  function initSiteMeta() {
    $$("[data-site-author]").forEach(function (el) { el.textContent = SITE.author; });
    $$("[data-site-name]").forEach(function (el) { el.textContent = SITE.name; });
    $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
    $$("[data-site-email]").forEach(function (el) {
      el.textContent = SITE.email;
      el.setAttribute("href", "mailto:" + SITE.email);
    });
    if (document.title.indexOf("{author}") > -1) {
      document.title = document.title.replace("{author}", SITE.author);
    }
  }

  /* ---------- 3. 首页：统计 / 卡片 / 标签 / 搜索 ---------- */
  function initHome() {
    var listEl = $("#postList");
    if (!listEl) return;

    // 3.1 hero 统计数字
    var statsEl = $("#heroStats");
    if (statsEl) {
      statsEl.innerHTML = SITE.stats.map(function (s) {
        return '<span><strong>' + esc(s.value) + '</strong> ' + esc(s.label) + "</span>";
      }).join("");
    }

    // 3.2 标签筛选按钮
    var tags = [];
    POSTS.forEach(function (p) {
      p.tags.forEach(function (t) { if (tags.indexOf(t) === -1) tags.push(t); });
    });
    var filterEl = $("#tagFilters");
    var activeTag = "";
    if (filterEl) {
      filterEl.innerHTML =
        '<button class="tag-btn" type="button" data-tag="" aria-pressed="true">全部</button>' +
        tags.map(function (t) {
          return '<button class="tag-btn" type="button" data-tag="' + esc(t) +
                 '" aria-pressed="false">' + esc(t) + "</button>";
        }).join("");
      filterEl.addEventListener("click", function (e) {
        var btn = e.target.closest(".tag-btn");
        if (!btn) return;
        activeTag = btn.dataset.tag;
        $$(".tag-btn", filterEl).forEach(function (b) {
          b.setAttribute("aria-pressed", String(b.dataset.tag === activeTag));
        });
        render();
      });
    }

    // 3.3 搜索框
    var input = $("#searchInput");
    var keyword = "";
    if (input) {
      input.addEventListener("input", debounce(function () {
        keyword = input.value.trim().toLowerCase();
        render();
      }, 120));
    }

    // 3.4 渲染列表
    function render() {
      var items = sortedPosts().filter(function (p) {
        if (activeTag && p.tags.indexOf(activeTag) === -1) return false;
        if (!keyword) return true;
        var hay = (p.title + " " + p.excerpt + " " + p.tags.join(" ")).toLowerCase();
        return hay.indexOf(keyword) > -1;
      });

      if (!items.length) {
        listEl.className = "";
        listEl.innerHTML =
          '<div class="empty-state">没有匹配的文章。换个关键词，或点上面的「全部」。</div>';
        return;
      }

      listEl.className = "card-grid";
      listEl.innerHTML = items.map(function (p) {
        return [
          '<article class="card' + (p.featured && !keyword && !activeTag ? " is-featured" : "") + '">',
          '  <div class="card-meta">',
          "    <time datetime=\"" + esc(p.date) + "\">" + esc(formatDate(p.date)) + "</time>",
          '    <span class="sep">·</span><span>' + esc(p.minutes) + " 分钟</span>",
          p.featured && !keyword && !activeTag ? '<span class="card-badge">置顶</span>' : "",
          "  </div>",
          '  <h3 class="card-title"><a href="' + esc(postUrl(p.slug)) + '">' + esc(p.title) + "</a></h3>",
          '  <p class="card-excerpt">' + esc(p.excerpt) + "</p>",
          '  <div class="card-foot">',
          '    <ul class="tag-list">' + p.tags.map(function (t) {
                 return "<li>" + esc(t) + "</li>";
               }).join("") + "</ul>",
          "    <span>阅读 →</span>",
          "  </div>",
          "</article>"
        ].join("\n");
      }).join("\n");
    }

    render();
  }

  /* ---------- 4. 归档页 ---------- */
  function initArchive() {
    var root = $("#archiveRoot");
    if (!root) return;

    var years = {};
    POSTS.forEach(function (p) {
      var y = p.date.slice(0, 4);
      (years[y] = years[y] || []).push(p);
    });

    var keys = Object.keys(years).sort(function (a, b) { return b - a; });
    root.innerHTML = keys.map(function (y) {
      var rows = years[y]
        .sort(function (a, b) { return a.date < b.date ? 1 : -1; })
        .map(function (p) {
          return [
            "<li>",
            '  <span class="date">' + esc(shortDate(p.date)) + "</span>",
            '  <span class="ttl"><a href="' + esc(postUrl(p.slug)) + '">' + esc(p.title) + "</a></span>",
            '  <span class="tags">' + esc(p.tags.join(" / ")) + "</span>",
            "</li>"
          ].join("\n");
        }).join("\n");

      return [
        '<section class="year-group">',
        '  <h2 class="year-label">' + esc(y) + "</h2>",
        '  <ul class="archive-list">' + rows + "</ul>",
        "</section>"
      ].join("\n");
    }).join("\n");

    var countEl = $("#archiveCount");
    if (countEl) {
      countEl.textContent = "共 " + POSTS.length + " 篇，跨 " + keys.length + " 个年份。";
    }
  }

  /* ---------- 5. 关于页 ---------- */
  function initAbout() {
    var nameEl = $("#profileName");
    if (!nameEl) return;
    nameEl.textContent = SITE.author;
    var roleEl = $("#profileRole"); if (roleEl) roleEl.textContent = SITE.role;
    var bioEl = $("#profileBio"); if (bioEl) bioEl.textContent = SITE.bio;
    var avEl = $("#profileAvatar"); if (avEl) avEl.textContent = SITE.avatarText || SITE.author.slice(0, 1);

    var linksEl = $("#profileLinks");
    if (linksEl) {
      linksEl.innerHTML = SITE.links.map(function (l) {
        return '<a href="' + esc(l.href) + '"' +
               (/^https?:/.test(l.href) ? ' target="_blank" rel="noopener"' : "") +
               ">" + esc(l.label) + "</a>";
      }).join("");
    }

    var tlEl = $("#profileTimeline");
    if (tlEl) {
      tlEl.innerHTML = SITE.timeline.map(function (t) {
        return "<li><div class=\"when\">" + esc(t.when) + "</div>" +
               "<div class=\"what\">" + t.what + "</div></li>";   // what 允许少量内联标签
      }).join("");
    }

    var skEl = $("#profileSkills");
    if (skEl) {
      skEl.innerHTML = SITE.skills.map(function (s) {
        return "<li>" + esc(s) + "</li>";
      }).join("");
    }
  }

  /* ---------- 6. 文章页：目录 / 进度 / 复制 / 上下篇 ---------- */
  function initPost() {
    var prose = $(".prose");
    if (!prose) return;

    // 6.1 slug 与上下篇
    var slug = (location.pathname.split("/").pop() || "").replace(/\.html$/, "");
    var ordered = POSTS.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    var idx = -1;
    ordered.forEach(function (p, i) { if (p.slug === slug) idx = i; });
    var navEl = $("#postNav");
    if (navEl && idx > -1) {
      var prev = ordered[idx + 1];   // 更早的一篇
      var next = ordered[idx - 1];   // 更新的一篇
      navEl.innerHTML =
        (prev ? '<a class="prev" href="' + esc(postUrl(prev.slug)) + '">' +
                '<span class="dir">← 上一篇</span><span class="ttl">' + esc(prev.title) + "</span></a>"
              : "<span></span>") +
        (next ? '<a class="next" href="' + esc(postUrl(next.slug)) + '">' +
                '<span class="dir">下一篇 →</span><span class="ttl">' + esc(next.title) + "</span></a>"
              : "<span></span>");
    }

    // 6.2 目录
    var heads = $$("h2, h3", prose);
    var tocEl = $("#toc");
    if (tocEl && heads.length) {
      var used = {};
      heads.forEach(function (h, i) {
        var id = h.id || h.textContent.trim().toLowerCase()
          .replace(/[^\w\u4e00-\u9fa5]+/g, "-").replace(/^-|-$/g, "") || ("sec-" + i);
        if (used[id]) id = id + "-" + i;
        used[id] = true;
        h.id = id;
      });
      tocEl.innerHTML = '<h2>目录</h2><ol>' + heads.map(function (h) {
        return '<li class="lvl-' + h.tagName.slice(1) + '"><a href="#' + esc(h.id) + '">' +
               esc(h.textContent.trim()) + "</a></li>";
      }).join("") + "</ol>";

      // 滚动高亮
      var links = {};
      $$("a", tocEl).forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
      if ("IntersectionObserver" in window) {
        var obs = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (!en.isIntersecting) return;
            $$("a", tocEl).forEach(function (a) { a.classList.remove("active"); });
            var a = links[en.target.id];
            if (a) a.classList.add("active");
          });
        }, { rootMargin: "-72px 0px -70% 0px", threshold: 0 });
        heads.forEach(function (h) { obs.observe(h); });
      }
    } else if (tocEl) {
      tocEl.remove();
    }

    // 6.3 代码复制
    $$(".code-block").forEach(function (block) {
      var pre = $("pre", block);
      if (!pre) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "code-copy";
      btn.textContent = "复制";
      btn.addEventListener("click", function () {
        var text = pre.innerText;
        var done = function () {
          btn.textContent = "已复制";
          setTimeout(function () { btn.textContent = "复制"; }, 1600);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, function () { fallback(text, done); });
        } else {
          fallback(text, done);
        }
      });
      block.appendChild(btn);
    });

    function fallback(text, done) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:absolute;left:-9999px;top:0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); done(); } catch (e) { /* 忽略：file:// 下可能被拒 */ }
      document.body.removeChild(ta);
    }
  }

  /* ---------- 7. 阅读进度 / 回到顶部 ---------- */
  function initScrollUI() {
    var bar = $("#readingProgress");
    var top = $("#toTop");
    if (!bar && !top) return;

    function onScroll() {
      var y = window.scrollY || document.documentElement.scrollTop;
      var h = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.width = (h > 0 ? Math.min(100, (y / h) * 100) : 0) + "%";
      if (top) top.classList.toggle("show", y > 480);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    if (top) {
      top.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
    onScroll();
  }

  /* ---------- 启动 ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initSiteMeta();
    initScrollUI();
    if (PAGE === "home") initHome();
    if (PAGE === "archive") initArchive();
    if (PAGE === "about") initAbout();
    if (PAGE === "post") initPost();
  });
})();
