/* ==========================================================================
   站点配置 —— 改这里就能改全站署名与链接
   ========================================================================== */
const SITE = {
  name: "拾穗集",
  tagline: "GLEANINGS",
  author: "Geng2085",                    // ← 改成你自己的名字
  role: "人工智能专业 · 本科在读",
  bio: "记录机器学习、编程与自我训练过程中的所得。不求写出多漂亮的文字，只求每一篇都对半年后的自己有用。",
  email: "genggge666@gmail.com",              // ← 改成你的邮箱
  avatarText: "拾",
  // 首页 hero 上的统计数字
  stats: [
    { label: "文章", value: POSTS.length },
    { label: "标签", value: new Set(POSTS.flatMap((p) => p.tags)).size },
    {
      label: "最近更新",
      value: POSTS.slice().sort((a, b) => (a.date < b.date ? 1 : -1))[0].date
    }
  ],
  // 关于页 & 页脚的社交链接，不需要的删掉即可
  links: [
    { label: "GitHub", href: "https://github.com/Gengge666" },
    { label: "邮箱", href: "mailto:genggge666@gmail.com" },
    { label: "RSS", href: "#" }
  ],
  // 关于页时间线
  timeline: [
    {
      when: "2026 — 现在",
      what: "<strong>持续写这个博客</strong>，把课程之外自学的内容整理成能讲清楚的文章。"
    },
    {
      when: "2026 秋",
      what: "<strong>进入大学</strong>，选择人工智能专业；第一次完整读完一篇深度学习论文的公式推导。"
    },
    {
      when: "2025 夏",
      what: "<strong>自学 Python</strong>，从写爬虫和自动化脚本开始，第一次体会到「让机器替我干活」的快感。"
    },
    {
      when: "更早",
      what: "在信息学的门口张望过，也被数学折磨过——这些构成了现在的起点。"
    }
  ],
  skills: [
    "Python", "PyTorch", "NumPy", "线性代数", "概率论",
    "Git", "Linux", "SQL", "HTML/CSS", "Markdown"
  ]
};
