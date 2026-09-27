'use strict';
// Act I, 0:00-0:30. Pencil draft (2020), the torn page, the ink rebuild (2021) up to the admin moon.
// Camera grammar: locked on the planet; the tear at 10.4 s is the film's only cut.

const QT2 = t => Math.floor(t * 12 + 1e-6) / 12;
const PX = 960, PY = 620, PR = 215;
const dayOf = date => DAYS.findIndex(d => d[0] >= date);
const totalOn = date => { const i = dayOf(date); return i < 0 ? DAYS[DAYS.length - 1][2] : DAYS[i][0] === date ? DAYS[i][2] : (i ? DAYS[i - 1][2] : 0); };
// Commits shown while the date runs from d0 to d1 over t0..t1: real daily totals, eased per day.
function runDates(t, t0, t1, d0, d1) {
  const i0 = dayOf(d0), i1 = dayOf(d1), u = clamp((t - t0) / (t1 - t0), 0, 1), f = lerp(i0, i1, u), i = Math.floor(f), row = DAYS[clamp(i, i0, i1)];
  const prev = i > 0 ? DAYS[i - 1][2] : 0, pop = u >= 1 ? 1 : easeOut(clamp((f - i) * 2.2, 0, 1));
  return {date: row[0], total: lerp(prev, row[2], pop), today: row[1]};
}

const A1 = {tear: 10.4, land: 12.6, ink: 12.8, light: 16.2, v3: 21, admin: 26, end: 30};
const A1_CARDS = [
  [.6, 'Mix Space', '个人写作的一颗星球'],
  [6.2, '后台 · Vue 2', 'admin-legacy：最早的管理后台'],
  [8.0, 'Kami', '第一个前端主题：多彩、可爱'],
  [A1.tear, '', ''],
  [A1.ink, '重写 · mx-space/core', '服务端从零开始'],
  [A1.light, '自托管', '一台服务器，就是你的星球'],
  [A1.v3, 'v3.0.0', '第一个正式版'],
  [A1.admin, '后台 · Vue 3 重写', 'mx-admin：写文章、回评论、改配置'],
];

const dotAct1 = dtTrack([
  [0, dtPose({r: 0.001})],
  [3.5, dtPose({r: .001})],
  [4.1, dtPose({squash: 1.15, mouth: 'o', mouthOpen: .4}), easeOutBack],
  [4.5, dtPose({gx: -.6, gy: .4})],
  [5.2, dtPose({mood: 'blink', gx: -.6, gy: .4})],
  [5.35, dtPose({gx: -.2, mouth: 'grin', blush: 1})],
  [6.6, dtPose({gx: -.9, gy: .5, mouth: 'smile'})],
  [8.2, dtPose({gx: .9, gy: .2, spark: 1, mouth: 'grin'})],
  [9.6, dtPose({gx: .9, gy: .2, mood: 'happy', mouth: 'grin', blush: 1})],
  [10.6, dtPose({eyeS: 1.14, pupil: .6, mouth: 'o', mouthOpen: .8, gy: -.8})],
  [11.1, dtPose({squash: .82, armL: 1.2, armR: 1.4, mouth: 'o', mouthOpen: .8})],
  [11.4, dtPose({squash: 1.16, armL: -1.1, armR: -1.1, mouth: 'o', trail: .6, trailA: -.9})],
  [12.6, dtPose({squash: .84, armL: 1, armR: 1, mood: 'squeeze', mouth: 'flat'})],
  [13.0, dtPose({gx: -.5, gy: .6})],
  [16.0, dtPose({gx: -.8, gy: .7, spark: 1})],
  [16.5, dtPose({armL: .5, reachL: 1.5, gx: -.8, gy: .7, mouth: 'grin', spark: 1})],
  [21.0, dtPose({armL: .5, reachL: 1.5, gx: -.8, gy: .7, mouth: 'o', mouthOpen: .6, eyeS: 1.1})],
  [24.4, dtPose({mood: 'happy', mouth: 'grin', blush: 1, armL: -1.1, armR: -1.1})],
  [25.0, dtPose({squash: 1.1, trail: .8, trailA: .3, lean: -.3, gx: -1, mouth: 'o'})],
  [26.2, dtPose({lean: .2, armL: .35, reachL: 1.4, armR: -.5, lid: .2, mouth: 'flat', trail: .6})],
  [28.6, dtPose({lean: .2, armL: .35, reachL: 1.4, armR: -.5, lid: .2, mouth: 'flat', trail: .6})],
  [29.6, dtPose({mood: 'happy', mouth: 'grin', armR: -1.2, reachR: 1.2, blush: 1})],
]);
// Where Dot is (continuous time): perched top right, the hop across the tear, the tow along the ring.
const ADMIN_PARK = () => ringPos(PX, PY, PR, Math.PI);
function dotPlace(t) {
  const home = [1300, 380], b = [1340, 400];
  if (t < A1.tear + .7) return home;
  if (t < A1.land) { const u = (t - (A1.tear + .7)) / (A1.land - A1.tear - .7); return [lerp(home[0], b[0], u), lerp(home[1], b[1], u) - 140 * 4 * u * (1 - u)]; }
  if (t < 25) return b;
  if (t < 26.2) { const u = easeIn(clamp((t - 25) / 1.2, 0, 1)); return [lerp(b[0], -160, u), lerp(b[1], 300, u) - 260 * Math.sin(Math.PI * u)]; }
  const u = easeOut(clamp((t - 26.2) / 2.6, 0, 1)); return [lerp(-160, 520, u), lerp(500, 560, u)];
}
function adminPlace(t) {
  const park = ADMIN_PARK(), u = clamp((t - 26.2) / 2.8, 0, 1), e = u < .75 ? u / .75 * .8 : .8 + easeOutBack((u - .75) / .25) * .2;
  return [lerp(-420, park[0], e), lerp(560, park[1], e)];
}
function pencilPage(c, t, al = 1) {
  graphPaper(c, al);
  const pr = sm(.3, 3.6, t, easeInOutSine);
  drawPlanet(c, PX, PY, PR, 'pencil', {p: pr, rings: 1, ringP: sm(2.4, 3.8, t)});
  marginNote(c, 'pencil', ['mx-space/server-legacy', '"NestJS & TypeScript 最高！"'], [1290, 900], [PX + PR * .72, PY + PR * .62], sm(2.6, 3.8, t, lin), {al: 1 - sm(6.2, 6.6, t, lin)});
  const ap = sm(6.3, 7.2, t);
  if (ap > 0) { const th = key(t, [[6.3, 2.35], [10.4, 2.6]]), q = ringPos(PX, PY, PR, th);
    c.save(); c.globalAlpha *= ap; drawMoon(c, 'admin2', dtPose({r: 36, gx: .6, mouth: 'smile'}), {x: q[0], y: q[1], look: 'pencil'}); c.restore();
    marginNote(c, 'pencil', ['mx-space/admin-legacy', 'Vue 2 · 2020 年 4 月 6 日'], [300, 800], [q[0] - 20, q[1] + 44], sm(6.8, 8, t, lin)); }
  const kp = sm(8, 9, t);
  if (kp > 0) { const th = key(t, [[8, 0.25], [10.4, .6]]), q = ringPos(PX, PY, PR, th);
    c.save(); c.globalAlpha *= kp; drawMoon(c, 'kami', dtPose({r: 38, mood: 'happy', mouth: 'grin', gx: -.4}), {x: q[0], y: q[1], look: 'pencil'}); c.restore();
    marginNote(c, 'pencil', ['mx-space/kami', '2020 年 4 月 13 日'], [1380, 880], [q[0] + 20, q[1] + 46], sm(8.6, 9.8, t, lin)); }
}
// The tear: the whole pencil sheet peels from the top right corner and lifts away up-left.
function tornSheet(c, t) {
  const u = sm(A1.tear, A1.tear + 1.8, t, easeIn); if (u >= 1) return;
  c.save(); resetT(c);
  const rot = -.5 * u, dx = -900 * u, dy = -700 * u * u;
  c.translate(W / 2 + dx, H / 2 + dy); c.rotate(rot); c.translate(-W / 2, -H / 2);
  const tear = [[0, 0], [W, 0], [W, H]]; for (let y = H; y >= 0; y -= 24) tear.push([lerp(40, 0, y / H) + 10 * noise1(y / 30, 4), y]);
  c.save(); c.shadowColor = 'rgba(0,0,0,.22)'; c.shadowBlur = 40 * S; c.shadowOffsetY = 18 * S; c.fillStyle = DC.paper; c.fill(polyPath(tear)); c.restore();
  c.save(); c.clip(polyPath(tear)); pencilPage(c, Math.min(t, A1.tear)); c.restore();
  c.strokeStyle = alpha(DC.pencil, .35); c.lineWidth = 2; c.strokeRect(0, 0, W, H);
  c.restore();
}

function inkPage(c, t) {
  paper(c, DC.paper, null, 92);
  const pr = sm(A1.ink, A1.ink + 2.6, t, easeInOutSine);
  const commits = t < A1.light ? 0 : t < A1.v3 ? 1 : runDates(t, A1.v3, A1.v3 + 3.5, '2021-07-14', '2021-09-10').total;
  const rings = t < A1.v3 + 3 ? 0 : 1;
  drawPlanet(c, PX, PY, PR, 'ink', {p: pr, rings, ringP: sm(A1.v3 + 3, A1.v3 + 4.4, t), commits, newest: t < A1.v3 ? 1 : 3});
  if (t >= A1.light && t < A1.light + 1.2) { const [u, v] = lightAt(0); glow(c, PX + u * PR, PY + v * PR, 60 * (1 - sm(A1.light, A1.light + 1.2, t)), '#ffd77a', 1); }
  const kp = sm(A1.ink + 2.2, A1.ink + 3, t);
  if (kp > 0) { const th = .75 + (t - A1.ink) * .02, q = ringPos(PX, PY, PR, th); c.save(); c.globalAlpha *= kp; drawMoon(c, 'kami', dtPose({r: 38, mood: 'happy', mouth: 'grin', gx: .3}), {x: q[0], y: q[1], look: 'ink'}); c.restore(); }
  marginNote(c, 'ink', ['9285a1bea  init'], [1330, 930], [PX + PR * .6, PY + PR * .75], sm(A1.ink + .4, A1.ink + 1.4, t, lin), {al: 1 - sm(A1.light - .3, A1.light, t, lin)});
  marginNote(c, 'ink', ['docker compose 一键部署'], [260, 860], [PX - PR * .8, PY + PR * .4], sm(A1.light + 1.6, A1.light + 2.6, t, lin), {al: 1 - sm(A1.v3 - .3, A1.v3, t, lin)});
  marginNote(c, 'ink', ['08a69acf6  release: v3.0.0'], [1260, 930], [PX + PR * .9, PY + PR * .5], sm(A1.v3 + 3.6, A1.v3 + 4.6, t, lin), {al: 1 - sm(A1.admin - .3, A1.admin, t, lin)});
  if (t >= A1.admin + .2) {
    const q = adminPlace(t), d = dotPlace(t), G = dtGeom(dotAct1(QT2(t))), h = dtWorld(G.anchors.handL, {x: d[0], y: d[1]}), slack = sm(28.6, 29.4, t);
    handLine(c, [h, [(h[0] + q[0]) / 2, (h[1] + q[1]) / 2 + 20 + 50 * slack], [q[0] + 26, q[1] - 26]], {w: 1.4, col: DC.ink, pencil: false, al: 1 - sm(29.4, 29.8, t, lin)});
    drawMoon(c, 'admin', dtPose({r: 40, gx: .7, mouth: 'smile', trail: .5 * (1 - sm(28.4, 29, t))}), {x: q[0], y: q[1], look: 'ink'});
    marginNote(c, 'ink', ['mx-space/mx-admin', 'Vue 3 · 2021 年 3 月建库'], [600, 940], [q[0] + 6, q[1] + 50], sm(A1.admin + 2.4, A1.admin + 3.4, t, lin));
  }
}

function act1(c, t) {
  if (t < A1.tear) pencilPage(c, t); else { inkPage(c, t); tornSheet(c, t); }
  const pose = dotAct1(QT2(t)), d = dotPlace(t), look = t < A1.land ? 'pencil' : 'ink';
  if (pose.r > 1) drawDot(c, {...pose, keep: 1}, {x: d[0], y: d[1], look});
  const look2 = t < A1.tear ? 'pencil' : 'ink';
  featureCard(c, look2, t, A1_CARDS);
  caption(c, 'pencil', [['这颗星球叫 Mix Space。', 1, 2.4], ['我叫 Dot，住在它旁边。', 4.4, 5.6]], t, [5.8, 6.1]);
  caption(c, 'pencil', [['先有了一个后台，Vue 2 写的。', 6.4, 7.6], ['然后是第一张脸：Kami。', 8.1, 9.2]], t, [10, 10.3]);
  caption(c, 'ink', [['一年后，主人撕了草稿，', 10.6, 11.6], ['从头再画。', 11.8, 12.4]], t, [15.6, 16]);
  caption(c, 'ink', [['每提交一次，', 16.4, 17.1], ['这里就亮一盏灯。', 17.2, 18.1]], t, [20.6, 21]);
  caption(c, 'ink', [['第一个正式版，', 24.4, 25], ['那天一口气 37 次。', 25.1, 26]], t, [26, 26.3]);
  caption(c, 'ink', [['后台用 Vue 3 重写了一遍，', 26.5, 27.6], ['我把它拖了回来。', 27.7, 28.5]], t, [31, 31.3]);
  if (t < A1.tear) dateDial(c, 'pencil', t < 6.2 ? '2020-03-24' : t < 8 ? '2020-04-06' : '2020-04-13', t < 6.2 ? 'server-legacy 建库' : t < 8 ? 'admin-legacy 建库' : 'Kami 建库');
  else if (t >= A1.ink) {
    const r = t < A1.v3 ? {date: '2021-07-14', total: t < A1.light ? 0 : 1} : runDates(t, A1.v3, A1.v3 + 3.5, '2021-07-14', '2021-09-10');
    dateDial(c, 'ink', r.date, r.total ? `累计 ${Math.round(r.total)} 次提交` : '第一行代码', {al: sm(A1.ink, A1.ink + .5, t)});
  }
}
