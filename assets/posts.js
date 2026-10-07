/* ==========================================================================
   文章清单 —— 唯一数据源
   新增一篇博客：在数组最前面加一条记录，并在 posts/ 下放同名 HTML 即可。
   字段说明：
     slug     文件名（不含 .html），决定链接地址
     title    标题
     date     YYYY-MM-DD，用于排序与归档分组
     tags     标签数组，首页筛选按钮由此自动生成
     excerpt  列表页摘要（一到两句）
     minutes  预计阅读分钟数
     featured 是否为置顶大卡片（最多建议 1 篇）
   ========================================================================== */
const POSTS = [
  {
    slug: "attention-notes",
    title: "从零读懂自注意力：一份手写推导笔记",
    date: "2026-03-18",
    tags: ["深度学习", "论文笔记"],
    excerpt:
      "把 Q、K、V 三个矩阵拆开揉碎，从「为什么需要除以 √d_k」讲到多头注意力的实际意义，附一份能跑通的最小实现。",
    minutes: 12,
    featured: true
  },
  {
    slug: "python-toolchain",
    title: "我的 Python 日常工具链（2026 版）",
    date: "2026-02-27",
    tags: ["Python", "工程实践"],
    excerpt:
      "uv 管环境、ruff 管风格、pytest 管正确性。一套能在十分钟内从空目录跑到 CI 的脚手架，以及我踩过的五个坑。",
    minutes: 9
  },
  {
    slug: "first-year-review",
    title: "大一上学期复盘：普通院校里，我把时间投给了什么",
    date: "2026-01-14",
    tags: ["随笔", "学习方法"],
    excerpt:
      "绩点、竞赛、英语、开源，四个方向的投入产出比到底如何？一份诚实的自我审计，包括让我最亏的两件事。",
    minutes: 8
  },
  {
    slug: "deploy-this-blog",
    title: "把这个博客免费部署到 GitHub Pages",
    date: "2025-12-30",
    tags: ["工程实践", "Web"],
    excerpt:
      "从零到一条可访问的公网链接：仓库初始化、Actions 自动发布、自定义域名与 HTTPS，全程零成本。",
    minutes: 6
  },
  {
    slug: "test",
    title: "测试文章",
    date: "1970-01-01",
    tags: ["工程实践", "Web"],
    excerpt:
      "测试",
    minutes: 1
  },
];
