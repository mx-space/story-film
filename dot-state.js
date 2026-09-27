'use strict';
// Shared state for 0:30 onward: the calendar, commits, version rings, moons, camera and look.
// Everything is a pure function of t, so any frame can be drawn on its own.

// [t, date, fraction of that day's commits already in]. Dates without commits resolve to the next active day.
const DATE_KEYS = [
  [30, '2021-09-10', .999], [34, '2022-02-23', .999], [37.5, '2022-04-14', .999], [42, '2023-03-14', .999], [46, '2023-07-09', .999],
  [50, '2024-04-26', .999], [55, '2024-05-04', .999], [60, '2025-05-06', .999], [64, '2026-01-28', .999], [69, '2026-02-03', .999],
  [73, '2026-02-08', .999], [76.5, '2026-03-16', .999], [80, '2026-05-05', .999], [92, '2026-05-05', .999], [94.6, '2026-05-07', .999],
  [97, '2026-05-22', .999], [99, '2026-05-29', .999], [102.6, '2026-05-29', .999], [106.4, '2026-05-30', .999], [108.5, '2026-08-15', .999], [112, '2026-09-27', .999],
];
const dayF = t => { const K = DATE_KEYS.map(([tt, d, f]) => [tt, dayOf(d) + f]); return key(t, K, lin); };
function calendar(t) {
  const f = dayF(t), i = clamp(Math.floor(f), 0, DAYS.length - 1), prev = i ? DAYS[i - 1][2] : 0;
  return {date: DAYS[i][0], total: lerp(prev, DAYS[i][2], clamp(f - i, 0, 1)), f};
}
const MAJORS = ['2021-09-10', '2023-05-02', '2024-02-16', '2024-06-22', '2024-09-02', '2025-02-08', '2026-01-22', '2026-02-09', '2026-03-22', '2026-05-05', '2026-05-22', '2026-08-15'];
const MAJOR_T = MAJORS.map(d => { const target = dayOf(d); for (let t = 30; t <= 112; t += .05) if (dayF(t) >= target) return t; return 30; });
function ringsAt(t) { let n = 0; MAJOR_T.forEach(tm => { if (t >= tm) n++; }); n = Math.max(1, n); return {rings: n, ringP: n > 1 ? sm(MAJOR_T[n - 1], MAJOR_T[n - 1] + 1, t) : 1}; }

// Moons drift along one wide orbit; the back half passes behind the planet.
const MOON_ORBIT = {rx: 430, ry: 150, tilt: -.16, w: .045};
// Six evenly spaced slots, so moons that arrive later never land on each other.
const SLOT = TAU / 6, MOON_LIST = [
  {id: 'kami', t: 30, th: .45}, {id: 'yun', t: 37.5, th: .45 + SLOT}, {id: 'shiro', t: 42, th: .45 + SLOT * 2, r: 44},
  {id: 'admin', t: 30, th: .45 + SLOT * 3}, {id: 'docs', t: 46, th: .45 + SLOT * 4}, {id: 'yohaku', t: 76.5, th: .45 + SLOT * 5},
];
const orbitPt = th => rv2d([PX, PY], [Math.cos(th) * MOON_ORBIT.rx, Math.sin(th) * MOON_ORBIT.ry], MOON_ORBIT.tilt);
// Monorepo: moons land on the planet's upper rim as houses.
const HOME_A = {kami: -2.55, admin: -2.2, yun: -1.85, shiro: -1.45, docs: -1.1, yohaku: -.75};
const homePt = id => [PX + Math.cos(HOME_A[id]) * (PR + 18), PY + Math.sin(HOME_A[id]) * (PR + 18)];
const HOME_T = 98.4, REBUILD = [93.4, 98.4], REBUILD_POS = [1060, 290], METEOR_T = 102.6;
function moonState(m, t) {
  const th = m.th + (t - 30) * MOON_ORBIT.w, o = orbitPt(th), r = m.r ?? 36;
  let pos = o, back = Math.sin(th) < 0, scale = 1, al = 1;
  if (m.t > 30) { const k = sm(m.t, m.t + 1.2, t, easeOutBack); scale = k; al = sm(m.t, m.t + .3, t, lin); }
  if (m.t === 30 && t < 31.5) { const from = m.id === 'kami' ? ringPos(PX, PY, PR, .75 + (30 - A1.ink) * .02) : ADMIN_PARK(), u = sm(30, 31.5, t); pos = [lerp(from[0], o[0], u), lerp(from[1], o[1], u)]; back = u > .5 && back; }
  if (m.id === 'admin' && t > REBUILD[0] && t < REBUILD[1] + 1) { const k = sm(REBUILD[0], REBUILD[0] + 1, t) * (1 - sm(REBUILD[1] - 1, REBUILD[1], t)); pos = [lerp(pos[0], REBUILD_POS[0], k), lerp(pos[1], REBUILD_POS[1], k)]; back = back && k < .1; scale *= lerp(1, 2, k); }
  const hk = sm(HOME_T + HOME_A[m.id] * -.35, HOME_T + 1.4 + HOME_A[m.id] * -.35, t);
  if (hk > 0) { const h = homePt(m.id); pos = [lerp(pos[0], h[0], hk), lerp(pos[1], h[1], hk) - 90 * Math.sin(Math.PI * hk)]; scale *= lerp(1, .62, hk); back = back && hk < .3; }
  return {pos, back, r, scale, al, th, home: hk};
}

// Camera: locked with a push in for the AI beats and a pull back at the end.
const CAM_KEYS = [[30, 960, 540, 1], [48.6, 960, 540, 1], [50.4, 960, 470, 1.32], [71.4, 960, 470, 1.32], [73.2, 960, 540, 1], [106.5, 960, 540, 1], [111.5, 960, 600, .8], [116.5, 960, 600, .8]];
const camAt = t => key(t, CAM_KEYS);

// Looks by act, with their seams: flat at Yun, blueprint at v12, logo blue at the iOS app.
const SEAMS = {flat: [35.2, 36.8], chalk: [79.2, 80.6], blue: [106.8, 108.2]};
function lookAt(t) { return t < SEAMS.flat[0] ? 'ink' : t < SEAMS.chalk[0] ? 'flat' : t < SEAMS.blue[0] ? 'chalk' : 'blue'; }
function paperFor(c, look) {
  if (look === 'chalk') { resetT(c); c.fillStyle = DC.chalkBg; c.fillRect(0, 0, W, H); c.save(); c.strokeStyle = 'rgba(160,190,255,.09)'; c.lineWidth = 1; c.beginPath(); for (let x = 0; x <= W; x += 48) { c.moveTo(x, 0); c.lineTo(x, H); } for (let y = 0; y <= H; y += 48) { c.moveTo(0, y); c.lineTo(W, y); } c.stroke(); c.restore(); grain(c, rectPath(0, 0, W, H), [0, 0, W, H], 500, '#ffffff', .12, 6, 1.4); }
  else if (look === 'blue') paper(c, '#fbfbf8', null, 95);
  else paper(c, DC.paper, null, look === 'flat' ? 93 : 92);
}
const planetLook = look => look === 'blue' ? 'flat' : look;
const dotLook = look => look === 'blue' ? 'flat' : look;
