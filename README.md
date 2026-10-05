# 拾穗集 · 个人博客

一个**纯静态**的个人博客：原生 HTML + CSS + JavaScript，零依赖、零构建步骤。
双击 `index.html` 就能在浏览器里看，推到 GitHub Pages 就能上公网。

## 目录结构

```
blog/
├── index.html            首页：Hero、统计、搜索、标签筛选、文章卡片
├── archive.html          归档：按年份分组列出全部文章
├── about.html            关于：头像卡片、简介、时间线、技能、社交链接
├── posts/                文章正文（每篇一个独立 HTML 文件）
│   ├── attention-notes.html
│   ├── python-toolchain.html
│   ├── first-year-review.html
│   └── deploy-this-blog.html
└── assets/
    ├── style.css         全部样式（含亮/暗双主题变量）
    ├── posts.js          ★ 文章清单，唯一数据源
    ├── site-config.js    ★ 署名、简介、时间线、社交链接
    └── site.js           交互逻辑：主题、搜索、筛选、目录、进度条、复制
```

## 本地预览

直接双击 `index.html` 即可（`file://` 协议下所有功能都正常，因为没有使用 `fetch`）。

如果习惯用本地服务器：

```bash
cd blog
python -m http.server 8000     # 然后访问 http://localhost:8000
```

## 开始改成你自己的

### 1. 改署名（改一处，全站生效）

打开 `assets/site-config.js`：

```js
const SITE = {
  name: "拾穗集",              // 站点名
  author: "你的名字",          // ← 改成你的名字
  role: "人工智能专业 · 本科在读",
  bio: "……",                   // 关于页自我介绍
  email: "you@example.com",    // ← 改成你的邮箱
  links: [ /* GitHub / 邮箱 / RSS */ ],
  timeline: [ /* 关于页时间线 */ ],
  skills: [ /* 技能标签 */ ]
};
```

> 顶栏里的站点名与页脚署名在 HTML 中写死（避免 JS 未执行时闪烁），
> 若要改站名，请一并替换各页面 header 与 footer 里的「拾穗集」和 `<title>`。

### 2. 新增一篇文章

1. 复制 `posts/attention-notes.html` 作为模板，改名为 `posts/你的英文短名.html`；
2. 修改其中的 `<title>`、面包屑、`.post-title`、`.post-meta` 和正文；
3. 在 `assets/posts.js` 数组**最前面**加一条：

```js
{
  slug: "你的英文短名",          // 必须与文件名一致（不含 .html）
  title: "文章标题",
  date: "2026-04-01",           // YYYY-MM-DD，决定排序与归档分组
  tags: ["标签A", "标签B"],
  excerpt: "列表页显示的一两句摘要。",
  minutes: 8,
  featured: false               // 置顶大卡片，建议最多一篇
}
```

保存后刷新：首页列表、标签按钮、搜索结果、归档页、文章底部的上/下一篇导航都会自动更新。

### 3. 正文可用的排版元素

```html
<div class="code-block"><span class="lang">python</span><pre><code>print("hi")</code></pre></div>
```
- 代码块：外层 `.code-block` + `.lang` 语言标签，鼠标悬停会出现「复制」按钮（由 JS 注入）
- 提示框：`<div class="callout"><span class="ico">💡</span><p>正文</p></div>`
- 其余为普通标签：`h2`/`h3`（会自动生成右侧目录）、`ul`/`ol`、`table`、`blockquote`、`hr`

代码里的 `<` `>` `&` 记得转义成 `&lt;` `&gt;` `&amp;`。

### 4. 部署到 GitHub Pages

完整步骤见文章《把这个博客免费部署到 GitHub Pages》（`posts/deploy-this-blog.html`），简版：

```bash
cd blog
git init && git add . && git commit -m "init: 个人博客"
git branch -M main
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
```

然后在仓库 **Settings → Pages** 里选择 `main` 分支的 `/ (root)` 目录。
⚠️ 站点内所有链接都必须是**相对路径**，不要写以 `/` 开头的绝对路径。

## 已实现的功能

| 功能 | 说明 |
| --- | --- |
| 亮 / 暗双主题 | 默认跟随系统，可手动切换并记忆到 `localStorage`；首屏内联脚本防闪白 |
| 文章搜索 | 对标题、摘要、标签做实时包含匹配（120ms 防抖） |
| 标签筛选 | 标签按钮由 `posts.js` 自动汇总生成 |
| 自动目录 | 文章页从 `h2`/`h3` 生成，滚动时高亮当前章节 |
| 阅读进度条 | 页面顶部随滚动增长 |
| 代码复制 | 悬停代码块出现「复制」按钮，含旧浏览器的降级实现 |
| 上下篇导航 | 依据 `posts.js` 的日期顺序自动生成 |
| 归档分组 | 按年份自动归类 |
| 响应式 | 单栏 → 双栏自适应，移动端可用 |
| 无障碍 | 跳转正文链接、`aria-current`、`aria-pressed`、可见焦点环 |
| 打印样式 | 打印时自动隐藏导航、目录、进度条 |

## 浏览器要求

现代浏览器（Chrome / Edge / Firefox / Safari 近三年版本）。
用到了 `IntersectionObserver`、CSS 自定义属性与 `backdrop-filter`；不支持时页面仍可正常阅读，仅缺少部分增强效果。

## 说明

- 示例文章中的个人经历为演示内容，请替换为你自己的真实记录。
- `assets/` 下的路径引用遵循「首页用 `assets/…`、文章页用 `../assets/…`」的约定，
  新增页面时请留意 `body` 上的两个属性：`data-page`（home / archive / about / post）与 `data-root`（相对根路径）。
