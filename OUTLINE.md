# Mix Space — a little planet that became a home

`2:03 · 16:9 · zh 先行，en 后补 · 4K60 MP4 · X / Bilibili（封面帧）+ README`

Step 1 已准 · Step 2 角色已准 · Step 3 全片大纲（待审）

## Logline

A pencil-drawn planet sketched in March 2020 is rebuilt from nothing in July
2021, gathers its moons (themes, dashboards, docs, apps) one by one, has its
core pulled out and replaced in May 2026, and lands as one bright world where
anyone can host their own writing — with an AI that reads, summarizes and
translates it.

## Form: Growth (a planet in orbit), with a Building beat at the turning point

Why: the name is *Space* and the logo already is a planet — the "M X" with an
orbit ring, a satellite dot and a sparkle. The history is accumulation, not a
trip: one server that collects frontends, an admin rewritten three times, docs and SDKs
around it, and in 2026 pulls them all onto one surface (the monorepo).

- Camera locked on the planet, slow pull-back as it grows. Push in for a
  feature close-up, then back out. Time reads from a date ring on the orbit,
  never from panning.
- One cut in the whole film is allowed: 2020 legacy → 2021 `init` (the sketch
  is torn off the pad and a clean page begins).

## Protagonist and voice

**Dot** — the satellite dot from the logo, a small round moon with eyes and a
trailing orbit line. It circles the planet, carries each new piece in, and
speaks the captions in first person ("I've gone round this planet 5,488
times."). The top-right card is the product speaking.

## Arc

| | What happens | Rests on |
|---|---|---|
| Setup | A pencil planet: `server-legacy`, "NestJS & TypeScript 最高！", and Kami, a colourful cute moon. Dot is sketched in. Then the page is torn: a clean rebuild. | `mx-space/server-legacy` 2020-03-24 · `kami` 2020-04-13 · `9285a1bea init` 2021-07-14 |
| Development | The planet fills in and moons arrive: v3.0.0 (37 commits that day), the Vue 3 admin, Yun, Shiro, docs v1→v3, api-client; the AI module lights a lamp on the surface. | `v3.0.0` 2021-09-10 · Shiro 2023-03-14 · AI module `c989a2a7b` #1649 2024-04-26 · Lexical `8fe250860` 2026-02-08 |
| Turning point | The core is lifted out and a new one lowered in: MongoDB → PostgreSQL with Snowflake IDs. Then every moon is pulled down onto one surface — the admin moves in, and the busiest day in history hits: 93 commits. | v12 `3dd35b0e6` #2659 2026-05-05 (44 commits) · admin into monorepo `76ca44454` #2740 2026-05-29 · 2026-05-30 (93 commits) |
| Resolution | v14. Pull back: one planet, every commit a light on it. The viewer's own space. | `v14.0.0` 2026-08-15 · today: 5,488 commits |

## What the viewer should remember

1. **It's yours to host** — a headless CMS for a personal blog, one server, your own planet. (opening + ending)
2. **Pick a face** — the same core wears different frontends: Kami, Yun, Shiro, Yohaku.
3. **AI that reads your writing** — summaries, translation, moderation, writing help. **Most screen time.**
4. **Rebuilt, not abandoned** — five years, 14 major versions, a full database swap without losing a post.
5. **Everything under one roof** — core, admin, SDKs in one workspace.

## Data (git fact → on screen)

| Fact (source) | Shows as |
|---|---|
| 5,488 commits in `mx-space/core`, 2021-07-14 → 2026-09-27 (`timeline.json`) | one light per commit on the planet's surface, real daily counts |
| 1,098 active days | the date ring ticks one notch per active day |
| 14 major tags `v3.0.0` … `v14.0.0` | a new orbit ring per major |
| org repos (`gh repo list mx-space`): kami, mx-admin, yun, docs ×3, api-client, … | moons; archived ones fade to pencil and drift off |
| 6 reverts (e.g. `b2e0bf160` Revert "release: v3.18.5", 2022-02-23) | a moon falls out of orbit and is caught |
| busiest day 2026-05-30: 93 commits | a meteor shower of lights |

Left out: renovate/dependency commits as separate beats (they still count as
lights), per-author counts (38 names, but aliases overlap).

## Look

Pencil on graph paper for 2020 → clean ink for the 2021 rebuild → flat
Kami-pastel colours for the theme era → blueprint for the core swap → the
logo's sky-blue (#1aa9f0) on white for the ending, Shiro-like "paper and
snow".

---

# 全片

## 声音与字幕

- 字幕（左上）= Dot 第一人称，短句，对新人说话。
- 卡片（右上）= 产品在说话：大字功能名 / 小字对你的用处 / 最小一行日期 + 累计提交数。
- 无旁白；配乐合成。

## 幕与材质

| 幕 | 时间 | 材质 | 换材质的提交 | 理由（一句话能说出口） |
|---|---|---|---|---|
| I 草稿 | 0:00–0:10 | 铅笔 · 方格纸 | `server-legacy` 2020-03-24 | 最早的版本只是草稿 |
| I 重写 | 0:10–0:35 | 墨线 | `9285a1bea init` 2021-07-14（全片唯一一次切：撕页） | 从头写，线条定下来 |
| II 换脸 | 0:35–1:19 | 平涂 · 丝网 | Yun 2022-04-14 | 第二个主题证明"脸可以换"，平涂色区分各卫星 |
| III 换芯 | 1:19–1:47 | 蓝图 | v12 `3dd35b0e6` #2659 2026-05-05 | 把星球剖开，看结构 |
| IV 今天 | 1:47–2:03 | logo 蓝 `#02aaf0` 配白纸 | v14.0.0 2026-08-15 | 回到品牌本色，留白（Yohaku） |

## 贯穿道具

| 道具 | 作用 | 规则 |
|---|---|---|
| 星球表面的灯 | 一次提交一盏灯 | 按 `timeline.json` 真实日计数点亮；片尾 5,488 盏 |
| 光环 | 一个大版本一道环 | v3 → v14 共 12 道，细线 |
| 日期盘（左下） | 现在是哪天 | 随活跃日跳动；2020 段显示 legacy 库日期 |
| 边注 | 证据 | 手写 hash / PR 号，钉在画面边缘，下一条来前淡出 |
| 卡片（右上） | 产品说话 | 保持到下一个功能 |
| 信物：铅笔星 | 0:14 埋，1:57 收 | 撕页时 Dot 从旧草稿上抢下那颗铅笔画的四角星，戴在头顶全片不换材质；片尾变成 logo 上那颗星 |

## 节拍

| # | 时间 | 画面 | 卡片 | Dot 字幕 | 依据 |
|---|---|---|---|---|---|
| 1 | 0:00–0:06 | 铅笔在方格纸上画出一颗星球，再画出 Dot，眨眼 | Mix Space · 个人写作的一颗星球 | 我叫 Dot。这颗星球叫 Mix Space。 | `mx-space/server-legacy` 2020-03-24 |
| 2 | 0:06–0:10 | 先画上 Vue 2 后台卫星，再画上粉色蛋糕卫星 Kami | 后台 · Vue 2 → Kami · 第一个前端主题 | 先有了一个后台，Vue 2 写的。然后是第一张脸：Kami。 | `mx-space/admin-legacy` 2020-04-06；`mx-space/kami` 2020-04-13 |
| 3 | 0:10–0:16 | 草稿被整页撕下；Dot 抢下纸上的四角星戴好；新的一页 | — | 一年后，主人撕了草稿，从头再画。 | `9285a1bea` init 2021-07-14 |
| 4 | 0:16–0:21 | 墨线重画星球；表面亮起第 1 盏灯 | 自托管 · 一台服务器就是你的星球 | 每提交一次，这里就亮一盏灯。 | 同上；`mx-space/docker` 2021-10-02 |
| 5 | 0:21–0:26 | 一天亮起 37 盏；第一道光环合拢 | v3.0.0 · 第一个正式版 | 第一个正式版，那天一口气 37 次。 | `08a69acf6` v3.0.0 2021-09-10，累计 103 |
| 6 | 0:26–0:30 | Dot 拖来绿色齿轮卫星 mx-admin（后台第二次重写） | 后台 · Vue 3 重写 | 后台用 Vue 3 重写了一遍，我把它拖了回来。 | `mx-space/mx-admin` 2021-03-22（Vue 3，共 382 个 release） |
| 7 | 0:30–0:35 | 一道光环滑落，Dot 扑过去接住，晕 | — | v3.18.5 发出去，又收了回来。 | `b2e0bf160` Revert "release: v3.18.5" 2022-02-23 |
| 8 | 0:35–0:40 | 平涂色从一侧刷过（换材质）；云朵卫星 Yun 入轨 | 主题可换 · 前端随你挑 | 同一颗星球，可以换不同的脸。 | `mx-space/mx-web-yun` 2022-04-14；api-client 并入 `a281f45ab` 2022-12-20 |
| 9 | 0:40–0:45 | 纸白雪花卫星 Shiro 入轨，最大的一颗 | Shiro · 4.2k ★ | Shiro 来了，像纸和雪一样干净。 | `Innei/Shiro` 2023-03-14；星数取 2026-09 |
| 10 | 0:45–0:49 | 书本卫星换了三次封面 | 文档 · 第三版 | 文档重写了三回，这一版留下了。 | docs-archived 2022 → docs-v2 2023 → `mx-space/docs` 2024-11-02 |
| 11 | 0:49–0:54 | **主戏开始**：星球表面亮起一盏金色大灯 | AI · 接入你自己的模型 | 2024 年，星球上多了一盏灯。 | `c989a2a7b` ai module #1649 2024-04-26 |
| 12 | 0:54–0:59 | 一页文章穿过灯光，出来时顶上多了一行摘要 | AI 摘要 · 读者先看到重点 | 它会读你的文章，写好摘要。 | 同上（ai-summary） |
| 13 | 0:59–1:03 | 灯光照着笔尖，帮忙拟标题；再照出一张"精读"卡 | AI 写作助手 · 精读 | 卡住的时候，它也帮你起个头。 | `f8909bd8c` writer 2024-05-04；`c385c5894` deep reading 2025-05-06 |
| 14 | 1:03–1:08 | 一页文章分成中 / EN / 日三页，飞向三颗小卫星 | AI 翻译 · 一篇文章，多种语言 | 还能替你翻成别的语言。 | `19652ae5b` ai-translation 2026-01-28 |
| 15 | 1:08–1:12 | 一条垃圾评论被盖上"拦下"章 | AI 评论审核 | 乱七八糟的评论，它先替你挡着。 | `6101bc944` comment review 2026-02-03 |
| 16 | 1:12–1:15 | 纸页变成一块块积木，可拖动 | Lexical 块编辑器 | 写字的纸，也换成了积木。 | `8fe250860` Lexical 2026-02-08 |
| 17 | 1:15–1:19 | 留白卫星 Yohaku 入轨，只有一个红点 | Yohaku · 现在这张脸 | 最新的一张脸，大部分是留白。 | `Innei/Yohaku` 2026-03-16 |
| 18 | 1:19–1:26 | **转折**：墨滴化开，全画面变蓝图；星球被剖开，露出 MongoDB 芯 | v12 · 换芯 | 5 月 5 日，要把星球的芯整个换掉。 | `3dd35b0e6` #2659 2026-05-05，当天 44 次 |
| 19 | 1:26–1:33 | Dot 和吊钩把旧芯吊出，PostgreSQL 芯放入；灯闪了一下，全部重新亮起 | PostgreSQL + Snowflake ID · 附迁移工具 | 旧的出来，新的进去。灯一盏都没灭。 | 同上；`packages/mongo-pg-cli` |
| 20a | 1:33–1:38 | 后台卫星放大到画面中央；齿轮掉落，只剩构造线；重组后头顶换成 React 原子 | 后台 · 第三次重写 · Vue 2 → Vue 3 → React 19 | 后台又重写了一遍，这次是 React。 | `mx-space/admin-react` 2026-05-07；mx-admin v8.0.0 2026-05-22 |
| 20 | 1:38–1:42 | 卫星们被一根根绳子拉回地面，落成星球上的房子 | 一个仓库 · 服务端、后台、SDK 同住 | 月亮们都搬回家，住进同一个仓库。 | `76ca44454` admin 并入 #2740 2026-05-29 |
| 21 | 1:42–1:47 | 流星雨：一天落下 93 盏灯 | 最忙的一天 · 93 次提交 | 第二天，93 次提交，最忙的一天。 | 2026-05-30，累计 4,871 |
| 23 | 1:47–1:53 | 回到白纸蓝色；拉远：整颗星球，12 道光环，5,488 盏灯 | v14 · 今天 | 五年，5,488 次提交。 | `77c2fbbe2` v14.0.0 2026-08-15；今天 2026-09-27 |
| 24 | 1:53–1:57 | Dot 用彗尾在夜空写字 | — | 你的文字，你的星球。 | connective |
| 25 | 1:57–2:03 | 收尾卡：Dot 飞到 logo 那颗卫星的位置，头顶的铅笔星变成 logo 上的星；手绘搜索框打出 `github.com/mx-space/core` | Mix Space · AI 驱动的个人博客 CMS | — | 封面帧 |

## 结尾（回收开头）

- 开头：铅笔画的星球 + 从草稿上抢来的铅笔星。
- 结尾：同一颗星球的完整版，铅笔星变成 logo 的星。五年，同一颗星。

## 待核对的说法

- **Shiro 4.2k ★**：取 2026-09-27 的数；卡片上注"截至 2026 年 9 月"，或者改为不写星数。
- **"灯一盏都没灭"**：只表示迁移工具把数据一起带过去，不承诺零丢失。要稳妥可改成"数据跟着一起搬"。
- **AI 需要自带模型**：provider 由站长配置（OpenAI 兼容 / OpenRouter / Vertex）。卡片写"接入你自己的模型"，不暗示内置免费 AI。
- **mx-admin 建于 2021-03，早于 core 的 init**：节拍 6 放在 v3 之后，表示"后台接入"，不是"后台诞生"。
- **不写贡献者人数**：38 个作者名里有别名重复。

## 暂不放进片子的（君可推翻）

- Passkey 登录（2023-12）、Serverless 函数（2022-03）、Better Auth、Webhook SDK、Telemetry、Raycast / Obsidian 插件、ProcessReporterMac：都是真的，但两分钟装不下，也不是新人第一眼要知道的。
- 6 个 revert 里只用了 v3.18.5 这一个：它最好懂（"发了又收回"）。

## 修订（Step 6 审片）

- 删 Space iOS 一拍（作者说 iOS 没做好）。
- 后台成为贯穿线：Vue 2（铅笔，2020）→ Vue 3（墨线，2021）→ React 19（蓝图，2026-05），每重写一次换一种材质；05-29 并入 monorepo。
