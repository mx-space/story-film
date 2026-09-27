'use strict';
// Acts II-IV, 0:30-2:03. The planet stays put; moons, the lamp, the core swap and the ending come to it.

const END = 123;
const DOT_KEYS = [
  [30, 520, 560], [31, 560, 430], [32.2, 930, 880], [33.4, 960, 880], [34.4, 1300, 420], [35, 1330, 380],
  [48.6, 1330, 380], [50.4, 1230, 200], [71.4, 1230, 200], [73.2, 1330, 380],
  [85.6, 1330, 330], [86.4, 1010, 150], [92.6, 1010, 150], [93.4, 1330, 230], [98.4, 1330, 230], [99, 1330, 300], [102.6, 1330, 300], [103, 1330, 380],
  [107.2, 1330, 380], [109, 1340, 330], [112.8, 1340, 330],
];
const SIG = {text: '你的文字，你的星球。', x: 960, y: 175, size: 88, t0: 113.2, t1: 116.4};
function sigWidth() { ctx.save(); ctx.font = `600 ${SIG.size}px ${DT_FONT}`; const w = textWidth(ctx, SIG.text, SIG.size); ctx.restore(); return w; }
let _sigW = 0;
function dotPos2(t) {
  if (t < 112.8) return key(t, DOT_KEYS);
  _sigW = _sigW || sigWidth();
  const x0 = SIG.x - _sigW / 2, u = sm(SIG.t0, SIG.t1, t, lin), p = [x0 + u * _sigW, SIG.y - 90];
  return t < SIG.t0 ? [lerp(1340, x0, sm(112.8, SIG.t0, t)), lerp(330, p[1], sm(112.8, SIG.t0, t))] : p;
}
const dotAct2 = dtTrack([
  [30, dtPose({mood: 'happy', mouth: 'grin', armR: -1.2, reachR: 1.2, blush: 1})],
  [31, dtPose({eyeS: 1.14, pupil: .6, mouth: 'o', mouthOpen: .8, gy: .8})],
  [32.2, dtPose({squash: 1.12, armL: -1.1, armR: -1.1, mouth: 'o', mouthOpen: .6, gy: .8})],
  [32.6, dtPose({mood: 'dizzy', mouth: 'wobble', squash: .9, armL: -1.1, armR: -1.1})],
  [33.6, dtPose({mood: 'dizzy', mouth: 'wobble', squash: .92})],
  [34.4, dtPose({mood: 'happy', mouth: 'grin', armR: -1.2, blush: 1})],
  [35.2, dtPose({gx: -.6, gy: .5})],
  [37.6, dtPose({spark: 1, gx: -.5, gy: .8, mouth: 'grin'})],
  [42.2, dtPose({spark: 1, gx: -1, gy: .3, mouth: 'o', mouthOpen: .5, blush: 1})],
  [45, dtPose({mood: 'happy', mouth: 'grin', blush: 1})],
  [46.2, dtPose({gx: .6, gy: -.3})],
  [48.6, dtPose({gx: -1, gy: .2})],
  [50.4, dtPose({spark: 1, gx: -1, gy: .4, mouth: 'o', mouthOpen: .6})],
  [54.2, dtPose({gx: -1, gy: .5})],
  [57, dtPose({mood: 'happy', mouth: 'grin', blush: 1})],
  [59.2, dtPose({lid: .3, lidTilt: .5, gx: -.8, gy: .4})],
  [63.2, dtPose({eyeS: 1.08, gx: -.2, gy: .7, mouth: 'grin'})],
  [68.2, dtPose({lid: .35, lidTilt: -.5, mouth: 'flat', gx: -1, gy: .3})],
  [70.6, dtPose({mood: 'happy', mouth: 'grin', armL: 1.2, reachL: 1.3})],
  [72.4, dtPose({gx: .9, gy: .2})],
  [75.2, dtPose({spark: 1, gx: -.4, gy: .8, mouth: 'grin'})],
  [79.3, dtPose({eyeS: 1.14, pupil: .6, mouth: 'o', mouthOpen: .8, gx: -.6, gy: .5})],
  [81.4, dtPose({lid: .3, lidTilt: -.6, mouth: 'wobble', gx: -1, gy: .6})],
  [86.4, dtPose({mood: 'squeeze', mouth: 'flat', armL: -1.2, armR: -1.2, reachL: 1.3, reachR: 1.3, squash: .92})],
  [92.6, dtPose({mood: 'happy', mouth: 'grin', blush: 1})],
  [93.6, dtPose({gx: -.8, gy: .6, mouth: 'smile'})],
  [94.6, dtPose({lid: .38, lidTilt: .6, gx: -.9, gy: .6, mouth: 'flat', armL: .6, reachL: 1.4})],
  [96.3, dtPose({spark: 1, gx: -.8, gy: .6, mouth: 'grin', blush: 1})],
  [98.6, dtPose({armR: -1.2, reachR: 1.2, gx: -.6, gy: .4, mouth: 'grin'})],
  [102.6, dtPose({gy: -1, gx: .5, eyeS: 1.12, pupil: .7, mouth: 'o', mouthOpen: .8})],
  [105.8, dtPose({spark: 1, gy: -.6, mouth: 'grin', blush: 1})],
  [107.2, dtPose({gx: -.6, gy: .6})],
  [112.4, dtPose({mood: 'happy', mouth: 'grin', blush: 1})],
  [113.2, dtPose({gx: .8, gy: .6, mouth: 'grin', armR: .4, reachR: 1.3})],
  [116.6, dtPose({mood: 'happy', mouth: 'grin', blush: 1})],
]);
// Speed drives the tail and the facing, so fast moves read as orbit swooshes.
function motion(t) {
  const a = dotPos2(t - .06), b = dotPos2(t + .06), vx = (b[0] - a[0]) / .12, vy = (b[1] - a[1]) / .12, sp = Math.hypot(vx, vy);
  const flip = vx < -60 ? -1 : 1;
  return {flip, trail: clamp((sp - 120) / 900, 0, 1), trailA: Math.atan2(vy, Math.abs(vx)) + .29};
}

const CARDS2 = [
  [30, '后台 · mx-admin', '写文章、回评论、改配置'],
  [35.4, '主题可换', '同一个后端，前端随你挑'], [42.2, 'Shiro', '4.2k ★ · 截至 2026 年 9 月'], [46.2, '文档 · 第三版', '部署、配置、API 都在这里'],
  [49.4, 'AI', '接入你自己的模型'], [54.2, 'AI 摘要', '读者先看到重点'], [59.2, 'AI 写作助手 · 精读', '起标题、理思路'],
  [63.2, 'AI 翻译', '一篇文章，多种语言'], [68.2, 'AI 评论审核', '垃圾评论先拦下'], [72.4, 'Lexical 块编辑器', '段落、代码、图片，都是积木'],
  [75.6, 'Yohaku', '现在的前端：大片留白'], [79.4, 'v12 · 换芯', 'MongoDB → PostgreSQL'], [86.4, 'PostgreSQL + Snowflake ID', '附一键迁移工具 mongo-pg-cli'],
  [93.6, '后台 · 第三次重写', 'Vue 2 → Vue 3 → React 19'], [98.8, '一个仓库', '服务端、后台、SDK 住在一起'], [102.6, '最忙的一天', '93 次提交'], [107.2, 'v14 · 今天', 'AI 驱动的个人博客 CMS'],
];
const CAPS2 = [
  [[['我拖来后台，', 26.5, 27.2], ['写字的地方有了。', 27.3, 28.2]], [30.3, 30.6]],
  [[['v3.18.5 发出去，', 30.8, 31.6], ['又收了回来。', 31.8, 32.5]], [34.8, 35.1]],
  [[['同一颗星球，', 35.6, 36.3], ['可以换不同的脸。', 36.4, 37.3]], [41.6, 41.9]],
  [[['Shiro 来了，', 42.2, 42.9], ['像纸和雪一样干净。', 43, 44]], [45.6, 45.9]],
  [[['文档重写了三回，', 46.2, 47], ['这一版留下了。', 47.1, 47.9]], [48.8, 49.1]],
  [[['2024 年，', 49.6, 50.1], ['星球上多了一盏灯。', 50.2, 51.2]], [53.8, 54.1]],
  [[['它会读你的文章，', 54.4, 55.2], ['写好摘要。', 55.3, 55.9]], [58.8, 59.1]],
  [[['卡住的时候，', 59.4, 60], ['它也帮你起个头。', 60.1, 61]], [62.8, 63.1]],
  [[['还能替你', 63.4, 63.9], ['翻成别的语言。', 64, 64.8]], [67.8, 68.1]],
  [[['乱七八糟的评论，', 68.4, 69.2], ['它先替你挡着。', 69.3, 70]], [72, 72.3]],
  [[['写字的纸，', 72.6, 73.1], ['也换成了积木。', 73.2, 74]], [75.2, 75.5]],
  [[['最新的一张脸，', 75.8, 76.5], ['大部分是留白。', 76.6, 77.4]], [79, 79.3]],
  [[['5 月 5 日，', 80.8, 81.3], ['要把星球的芯整个换掉。', 81.4, 82.6]], [86, 86.3]],
  [[['旧的出来，新的进去。', 86.6, 87.6], ['数据跟着一起搬。', 88.6, 89.6]], [93, 93.3]],
  [[['后台又重写了一遍，', 93.8, 94.7], ['这次是 React。', 94.8, 95.5]], [98, 98.3]],
  [[['月亮们都搬回家，', 98.8, 99.6], ['住进同一个仓库。', 99.7, 100.6]], [102.2, 102.5]],
  [[['第二天，93 次提交，', 102.8, 103.8], ['最忙的一天。', 103.9, 104.6]], [106.8, 107.1]],
  [[['五年，', 107.6, 108], ['5,488 次提交。', 108.2, 109.2]], [112.6, 112.9]],
];
// [t0, t1, lines, screen anchor, world target]
const NOTES2 = [
  [31, 34.8, ['b2e0bf160', 'Revert "release: v3.18.5"'], [1250, 900], () => [PX + PR * .7, PY + PR * .8]],
  [37.8, 41.8, ['mx-space/mx-web-yun · 2022-04', 'api-client 并入 a281f45ab'], [1240, 930], () => moonState(MOON_LIST[1], 38.5).pos],
  [42.6, 45.8, ['Innei/Shiro · 2023-03-14'], [260, 860], () => moonState(MOON_LIST[2], 43.5).pos],
  [46.6, 48.8, ['docs → docs-v2 → docs', '2022 · 2023 · 2024-11'], [1240, 930], () => moonState(MOON_LIST[4], 47.5).pos],
  [50.6, 53.8, ['c989a2a7b  feat: ai module', '#1649 · 2024-04-26'], [1180, 930], null],
  [59.6, 62.8, ['f8909bd8c  writer · 2024-05', 'c385c5894  deep reading · 2025-05'], [1150, 930], null],
  [63.6, 67.8, ['19652ae5b  ai-translation', '2026-01-28'], [1180, 930], null],
  [68.6, 71.8, ['6101bc944  comment review', '2026-02-03'], [1180, 930], null],
  [72.8, 75.2, ['8fe250860  Lexical · 2026-02-08'], [1150, 930], null],
  [76, 79, ['Innei/Yohaku · 2026-03-16'], [260, 860], () => moonState(MOON_LIST[5], 77).pos],
  [81, 86, ['3dd35b0e6  #2659', '2026-05-05 · 当天 44 次'], [1240, 930], () => [PX, PY]],
  [94.2, 97.8, ['mx-space/admin-react · 2026-05-07', 'mx-admin v8.0.0 · 2026-05-22', '（mx-admin 一共发了 382 个版本）'], [1240, 900], () => [REBUILD_POS[0], REBUILD_POS[1] + 70]],
  [99.2, 102.2, ['76ca44454  #2740', 'admin 并入 · 2026-05-29'], [1240, 930], () => homePt('shiro')],
  [108, 112.4, ['77c2fbbe2  v14.0.0', '2026-08-15'], [1240, 930], () => [PX + PR * .6, PY + PR * .7]],
];
const w2s = (p, t) => { const [cx, cy, z] = camAt(t); return [(p[0] - cx) * z + W / 2, (p[1] - cy) * z + H / 2]; };

function drawWorld(c, t, look) {
  paperFor(c, look);
  const [cx, cy, z] = camAt(t); cam(c, cx, cy, z);
  const pl = planetLook(look), ml = look === 'blue' ? 'flat' : look, cal = calendar(t), {rings, ringP} = ringsAt(t);
  const moons = MOON_LIST.filter(m => t >= m.t).map(m => ({m, s: moonState(m, t)}));
  const moonPose = (m, s) => dtPose({r: s.r, mood: Math.floor(QT2(t) * .8 + hash(m.id.length, 3) * 5) % 5 === 0 && (QT2(t) * .8) % 1 < .12 ? 'blink' : m.id === 'kami' || m.id === 'yohaku' ? 'happy' : 'open', mouth: 'smile', gx: -Math.cos(s.th) * .6, gy: .3});
  const drawM = ({m, s}) => {
    const rebuilt = m.id === 'admin' && t >= 96.2, gone = m.id === 'admin' ? sm(94.9, 95.3, t, lin) * (1 - sm(96, 96.4, t, lin)) : 0;
    c.save(); c.globalAlpha *= s.al * (1 - gone); drawMoon(c, m.id, moonPose(m, s), {x: s.pos[0], y: s.pos[1], scale: s.scale * (rebuilt ? 1 + .25 * Math.sin(Math.PI * sm(96.2, 96.8, t)) : 1), look: ml, acc: rebuilt ? 'atom' : undefined}); c.restore();
    if (gone > 0) { c.save(); c.globalAlpha *= gone; const rr = s.r * s.scale; c.strokeStyle = DC.chalk; c.setLineDash([6, 6]); c.lineWidth = 1.6; c.beginPath(); c.arc(s.pos[0], s.pos[1], rr, 0, TAU); c.stroke(); c.setLineDash([]); construction(c, s.pos[0], s.pos[1], rr * .9, 17, alpha(DC.chalk, .6)); c.restore(); }
    if (m.id === 'admin' && t > 94.6 && t < 96.4) { const u = sm(94.6, 96.4, t, easeIn); c.save(); c.globalAlpha *= 1 - u; c.translate(s.pos[0] + 60 * u, s.pos[1] + 260 * u * u); c.rotate(u * 4); drawAccessory(c, 'gear', s.r * s.scale, DC.chalk); c.restore(); }
  };
  moons.filter(x => x.s.back).forEach(drawM);
  const drop = sm(31, 32.2, t, easeIn) * (1 - sm(33.4, 34.4, t, easeOutBack));
  const cut = sm(80.6, 82, t) * (1 - sm(92.6, 93.4, t)), lightsAl = 1 - .78 * sm(87.4, 88, t) + .78 * sm(91.8, 92.6, t);
  drawPlanet(c, PX, PY, PR, pl, {rings, ringP, commits: cal.total, newest: 4, ringOff: drop > 0 ? [0, 250 * drop, .22 * drop] : null, cut, core: '', coreColor: '#0b1730', lightsAl});
  if (cut > 0) {
    if (t < 87.4) drawCore(c, PX, PY, PR * .42, 'MongoDB');
    else if (t < 89.4) { const y = lerp(PY, -260, sm(87.4, 89.4, t, easeIn)); drawCore(c, PX, y, PR * .42, 'MongoDB'); drawHook(c, PX, y - PR * .42 - 14); }
    else if (t < 91.8) { const y = lerp(-260, PY, sm(90, 91.8, t, easeOut)); if (t >= 90) { drawCore(c, PX, y, PR * .42, 'PostgreSQL'); drawHook(c, PX, y - PR * .42 - 14); } }
    else drawCore(c, PX, PY, PR * .42, 'PostgreSQL');
    if (t >= 86.4 && t < 87.4) drawHook(c, PX, lerp(-300, PY - PR * .42 - 14, sm(86.4, 87.4, t, easeOut)));
    if (t >= 91.8 && t < 92.8) drawHook(c, PX, lerp(PY - PR * .42 - 14, -300, sm(91.8, 92.8, t, easeIn)));
  }
  moons.filter(x => !x.s.back).forEach(drawM);
  drawLamp(c, look, sm(49.6, 50.6, t) * (1 - sm(79.2, 80, t)));
  aiProps(c, t, look);
  if (t >= METEOR_T && t < METEOR_T + 4.2) { const base = totalOn('2026-05-29'); for (let k = 0; k < 93; k++) { const tk = METEOR_T + k / 93 * 3.6, [u, v] = lightAt(base + k), to = [PX + u * PR, PY + v * PR]; drawMeteor(c, [to[0] + 380, to[1] - 560], to, (t - tk) / .55); } }
  if (t >= SIG.t0 - .1) writeOn(c, SIG.text, SIG.x, SIG.y, {size: SIG.size, col: DC.blueDeep, p: sm(SIG.t0, SIG.t1, t, lin), align: 'center', rot: -.02});
  const mo = motion(t), pose = dotAct2(QT2(t)), d = dotPos2(t);
  drawDot(c, {...pose, keep: 1, trail: Math.max(pose.trail, mo.trail), trailA: mo.trailA}, {x: d[0], y: d[1], look: dotLook(look), flip: mo.flip});
}
function aiProps(c, t, look) {
  if (t < 54 || t > 76) return;
  for (let k = 0; k < 2; k++) { const u = sm(54.4 + k * 1.4, 57.4 + k * 1.4, t, lin); if (u <= 0 || u >= 1 && t > 58.8) continue;
    const x = lerp(680, 1240, u), y = LAMP[1] - 10 + 30 * Math.sin(u * Math.PI) - k * 6; drawSheet(c, x, y, {rot: -.1 + u * .2, band: sm(.5, .62, u, lin), al: 1 - sm(58.4, 58.8, t, lin)}); }
  if (t >= 59.2 && t < 63) { const al = sm(59.2, 59.5, t, lin) * (1 - sm(62.6, 63, t, lin)); drawSheet(c, 830, 330, {al, rot: -.06});
    c.save(); c.globalAlpha *= al; handLine(c, partial([[808, 290], [830, 286], [852, 291]], sm(59.8, 60.8, t, lin)), {w: 2.2, col: DC.blueDeep, pencil: false}); c.restore();
    const cp = sm(61, 61.6, t, easeOutBack); if (cp > 0) { c.save(); c.globalAlpha *= al; c.translate(1090, 330); c.scale(cp, cp); c.fillStyle = '#fffaf0'; c.beginPath(); c.roundRect(-70, -52, 140, 104, 10); c.fill(); c.strokeStyle = DC.ink; c.lineWidth = 1.8; c.stroke();
      writeOn(c, '精读', -54, -20, {size: 24, col: DC.ink, rot: 0}); for (let i = 0; i < 3; i++) { c.fillStyle = DC.gold; c.beginPath(); c.arc(-50, 4 + i * 16, 3, 0, TAU); c.fill(); c.fillStyle = alpha(DC.ink, .4); c.fillRect(-40, 1 + i * 16, 80 - i * 18, 5); } c.restore(); } }
  if (t >= 63.2 && t < 68) { const al = 1 - sm(67.6, 68, t, lin), u = sm(64.8, 66, t, easeOutBack);
    drawSheet(c, 840, 330, {al: al * sm(63.2, 63.5, t, lin)});
    [['中', -1], ['EN', 0], ['日', 1]].forEach(([tag, i]) => drawSheet(c, lerp(840, 1070, u), 340 + i * 105 * u, {tag, al: al * sm(64.8, 65, t, lin), rot: i * .08 * u})); }
  if (t >= 68.2 && t < 72) { const al = 1 - sm(71.6, 72, t, lin), msgs = [['写得真好！', 68.4], ['¥¥ 点我领奖 ¥¥', 69.2, 1], ['第三段有个错字', 70.2]];
    msgs.forEach(([m, t0, spam], i) => { const u = sm(t0, t0 + 1.2, t, easeOut); if (u <= 0) return;
      const st = spam ? sm(t0 + 1.3, t0 + 1.6, t, lin) : 0, fall = spam ? sm(t0 + 1.9, t0 + 2.6, t, easeIn) : 0;
      drawBubble(c, lerp(520, spam ? 760 : 1140, u), 290 + i * 80 + fall * 400, m, {spam, stamp: st, al: al * (1 - fall), rot: fall * .6}); }); }
  const bk = sm(72.6, 73.4, t) * (1 - sm(75.4, 76, t, lin)); if (bk > 0) drawBlocks(c, 1560, 400, bk, t);
}

// Seams: flat is brushed across from the left, blueprint spreads like an ink drop, the logo blue opens from the planet.
function seamClip(c, kind, u, t) {
  resetT(c); const p = new Path2D();
  if (kind === 'flat') { const x = lerp(-120, W + 160, easeInOutSine(u)); p.moveTo(-10, -10); for (let y = -10; y <= H + 10; y += 30) p.lineTo(x + 40 * noise1(y / 90, 7) + 18 * Math.sin(y / 23), y); p.lineTo(-10, H + 10); p.closePath(); }
  else { const [sx, sy] = w2s([PX, PY], t), R = lerp(0, 1500, easeIn(u)); for (let i = 0; i <= 64; i++) { const a = i / 64 * TAU, r = R * (1 + .08 * noise1(i * .5, kind === 'chalk' ? 3 : 9)); i ? p.lineTo(sx + Math.cos(a) * r, sy + Math.sin(a) * r) : p.moveTo(sx + Math.cos(a) * r, sy + Math.sin(a) * r); } p.closePath(); }
  c.clip(p);
}
function act2(c, t) {
  const look = lookAt(t);
  const seam = Object.entries(SEAMS).find(([, [a, b]]) => t >= a && t < b);
  if (seam) { const [kind, [a, b]] = seam, prev = kind === 'flat' ? 'ink' : kind === 'chalk' ? 'flat' : 'chalk';
    drawWorld(c, t, prev); c.save(); seamClip(c, kind, (t - a) / (b - a), t); drawWorld(c, t, kind); c.restore(); }
  else drawWorld(c, t, look);
  const ol = look === 'blue' ? 'flat' : look;
  resetT(c);
  if (t < 113) { const cal = calendar(t); dateDial(c, ol, cal.date, `累计 ${Math.round(cal.total).toLocaleString('en-US')} 次提交`); }
  featureCard(c, ol, t, CARDS2, 112.6);
  for (const [lines, fade] of CAPS2) if (t >= lines[0][1] - .1 && t < fade[1]) caption(c, ol, lines, t, fade);
  for (const [t0, t1, lines, at, target] of NOTES2) if (t >= t0 && t < t1 + .4) marginNote(c, ol, lines, at, target && w2s(target(), t), sm(t0, t0 + 1, t, lin), {al: 1 - sm(t1, t1 + .4, t, lin)});
  if (t >= 117) closing(c, t);
}
function closing(c, t) {
  resetT(c); c.save(); c.globalAlpha = sm(117, 117.8, t, lin); paper(c, '#fbfbf8', null, 97); c.restore();
  if (t < 117.6) return;
  const k = sm(117.6, 118.4, t);
  c.save(); c.globalAlpha = k; drawPlanet(c, 960, 250, 74, 'flat', {rings: 3}); c.restore();
  writeOn(c, 'Mix Space', 960, 520, {size: 150, col: DC.ink, p: sm(117.8, 118.6, t, lin), align: 'center', rot: 0});
  writeOn(c, 'AI 驱动的个人博客 CMS', 960, 598, {size: 42, col: '#4a5060', p: sm(118.4, 119.2, t, lin), align: 'center', rot: 0});
  const blink = t > 121 && t < 121.15, gold = sm(118.8, 119.2, t, lin);
  const pose = dtPose({mood: blink ? 'blink' : 'happy', mouth: 'grin', blush: 1, keep: gold < .5 ? 1 : 0, star: 1 + .5 * Math.sin(Math.PI * gold), starSpin: gold * Math.PI / 2});
  const G = drawDot(c, pose, {x: 1395, y: 430, look: 'flat', alpha: sm(118.2, 118.6, t, lin)});
  if (gold > 0 && gold < 1) { const tip = dtWorld(G.tip, {x: 1395, y: 430}), k2 = Math.sin(Math.PI * gold); c.save(); c.strokeStyle = alpha(DC.gold, k2); c.lineWidth = 3; c.lineCap = 'round'; for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; c.beginPath(); c.moveTo(tip[0] + Math.cos(a) * 20, tip[1] + Math.sin(a) * 20); c.lineTo(tip[0] + Math.cos(a) * (20 + 40 * gold), tip[1] + Math.sin(a) * (20 + 40 * gold)); c.stroke(); } c.restore(); }
  if (t >= 119) searchBox(c, 960, 730, 'github.com/mx-space/core', sm(119.3, 121.3, t, lin), t);
}
