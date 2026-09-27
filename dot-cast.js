'use strict';
// Dot, the narrator: the satellite dot from the Mix Space logo, drawn as a small round moon.
// Local space: origin at the body centre, y down. Each drawing is rebuilt from a pose.
// Traits kept from the logo: the round dot, the orbit swoosh behind it, the four-point sparkle.

const DC = {
  paper: '#f6f3ea', pencil: '#3b3833', lead: '#7a7468', blue: '#02aaf0', blueDeep: '#0679b8', navy: '#10233f',
  ink: '#1c2230', white: '#fdfcf8', blush: '#f29aa6', gold: '#f4b93b', chalkBg: '#15294d', chalk: '#e6efff',
};
const DT_FONT = '"LXGW WenKai","Comic Neue",cursive';
for (const [family, file, desc] of [['LXGW WenKai', 'LXGWWenKai-Medium.ttf', {weight: '100 900'}], ['Comic Neue', 'ComicNeue-Regular.ttf', {weight: '400'}], ['Comic Neue', 'ComicNeue-Bold.ttf', {weight: '700'}]]) {
  const face = new FontFace(family, `url('fonts/${file}')`, desc);
  _photoLoads.push(face.load().then(f => document.fonts.add(f)).catch(e => { window.__error = 'font failed to load: ' + file; throw e; }));
}

const DT_BASE = {r: 58, squash: 1, lean: 0, gx: 0, gy: 0, lid: 0, lidTilt: 0, eyeS: 1, pupil: 1, mood: 'open', spark: 0,
  mouth: 'smile', mouthOpen: 0, blush: .6, armL: .5, armR: -.5, reachL: 1, reachR: 1, hand: 'rest', trail: 0, trailA: 0, star: 1, starSpin: 0, keep: 0, body: null};
const DT_DISCRETE = new Set(['mood', 'mouth', 'hand', 'body']);
const dtPose = (o = {}) => ({...DT_BASE, ...o});
function dtBlend(a, b, u) { const o = {}; for (const k in a) o[k] = DT_DISCRETE.has(k) ? (u < 1 ? a[k] : b[k]) : (a[k] === null || b[k] === null ? b[k] : lerp(a[k], b[k] ?? a[k], u)); return o; }
function dtTrack(keys) {
  return t => {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) if (t < keys[i][0]) {
      const [t0, a] = keys[i - 1], [t1, b, e = easeIO] = keys[i];
      return dtBlend(a, b, e(clamp((t - t0) / (t1 - t0), 0, 1)));
    }
    return keys[keys.length - 1][1];
  };
}

function dtGeom(p) {
  const r = p.r, sx = r / Math.sqrt(p.squash), sy = r * p.squash, rot = p.lean;
  const R = q => [q[0] * Math.cos(rot) - q[1] * Math.sin(rot), q[0] * Math.sin(rot) + q[1] * Math.cos(rot)];
  const B = (u, v) => R([u * sx, v * sy]);
  const body = Array.from({length: 40}, (_, i) => { const a = i / 40 * TAU; return B(Math.cos(a), Math.sin(a)); });
  const eye = side => ({c: B(side * .36 + p.gx * .05, -.12 + p.gy * .04), rx: r * .24 * p.eyeS, ry: r * .30 * p.eyeS, rot});
  const eyes = {l: eye(-1), r: eye(1)};
  const m = (u, v) => B(u + p.gx * .06, v + p.gy * .04);
  const mouths = {
    smile: [m(-.16, .34), m(0, .44 + p.mouthOpen * .1), m(.16, .34)],
    grin: [m(-.24, .30), m(-.1, .46), m(.1, .46), m(.24, .30)],
    o: Array.from({length: 13}, (_, i) => { const a = i / 12 * TAU; return m(Math.cos(a) * (.07 + p.mouthOpen * .05), .4 + Math.sin(a) * (.08 + p.mouthOpen * .08)); }),
    flat: [m(-.12, .40), m(.12, .40)],
    wobble: [m(-.2, .42), m(-.1, .37), m(0, .42), m(.1, .37), m(.2, .42)],
  };
  const mouth = mouths[p.mouth] || mouths.smile;
  const cheeks = [B(-.58, .24), B(.58, .24)];
  const craters = [[B(-.42, -.62), r * .09], [B(.62, -.46), r * .06], [B(-.7, -.2), r * .05]];
  const armAt = (side, ang, reach) => {
    const root = B(side * .9, .2), dir = side > 0 ? ang : Math.PI - ang, L = r * .42 * reach;
    const elbow = [root[0] + Math.cos(dir) * L * .55, root[1] + Math.sin(dir) * L * .55 - L * .08];
    const hand = [root[0] + Math.cos(dir) * L, root[1] + Math.sin(dir) * L];
    return {line: [root, elbow, hand], hand};
  };
  const arms = {l: armAt(-1, p.armL, p.reachL), r: armAt(1, p.armR, p.reachR)};
  const stalkBase = B(.3, -.95), tip = rv2d(stalkBase, [r * .22, -r * .42], rot);
  const stalk = [stalkBase, rv2d(stalkBase, [r * .18, -r * .2], rot), tip];
  let trail = null;
  if (p.trail > .01) {
    const n = 30, len = 3.2 * p.trail, path = u => rv2d([0, 0], [-r * (.55 + u * len), r * (.15 + .75 * u * u * len * .35)], p.trailA);
    const outer = [], inner = [];
    for (let i = 0; i <= n; i++) { const u = i / n, q = path(u), q2 = path(Math.min(1, u + .01)), dx = q2[0] - q[0], dy = q2[1] - q[1], l = Math.hypot(dx, dy) || 1, w = r * .3 * (1 - u) ** 1.3; outer.push([q[0] - dy / l * w, q[1] + dx / l * w]); inner.push([q[0] + dy / l * w, q[1] - dx / l * w]); }
    trail = {outer, inner};
  }
  return {p, r, sx, sy, body, eyes, mouth, cheeks, craters, arms, stalk, tip, trail,
    anchors: {top: B(0, -1), hand: arms.r.hand, handL: arms.l.hand, back: B(-1, 0), belly: B(0, 1)}};
}
function rv2d(o, d, a) { return [o[0] + d[0] * Math.cos(a) - d[1] * Math.sin(a), o[1] + d[0] * Math.sin(a) + d[1] * Math.cos(a)]; }

function dtPal(look, p) {
  if (look === 'chalk') return {fill: '#1f3968', line: DC.chalk, mat: 'pencil', sclera: DC.chalk, pupil: '#10213f', blush: '#7fb6ff', k: 1.9, star: '#bfe3ff'};
  if (look === 'flat') { const f = p.body ?? DC.blue; return {fill: f, line: shade(f, .62), mat: 'ink', sclera: DC.white, pupil: DC.navy, blush: DC.blush, k: 1.05, star: DC.gold, screen: true}; }
  if (look === 'ink') return {fill: DC.white, line: DC.ink, mat: 'ink', sclera: DC.white, pupil: DC.ink, blush: DC.blush, k: 1.05, star: DC.ink};
  return {fill: DC.paper, line: DC.pencil, mat: 'pencil', sclera: DC.paper, pupil: DC.pencil, blush: DC.blush, k: 1.6, star: DC.pencil};
}

function dtStrokes(G, look, layer) {
  const P = dtPal(look, G.p), s = [], add = (id, points, width, opacity = 1, extra = {}) => s.push({id, points, width, opacity, ...extra}), k = P.k, p = G.p;
  const PR = [[0, .2], [.15, .9], [.5, 1], [.85, .8], [1, .2]];
  if (layer === 'back') {
    if (G.trail) add('trail', [...G.trail.outer, ...G.trail.inner.slice().reverse()], 1.4 * k, .9, {close: true});
    for (const side of ['l', 'r']) add('arm/' + side, G.arms[side].line, 3.4 * k, 1, {corner: 1.2, pressure: [[0, 1], [1, .7]]});
  } else if (layer === 'body') {
    add('body', G.body, 2.3 * k, 1, {close: true, pressure: PR});
    add('stalk', G.stalk, 1.7 * k, 1);
    G.craters.forEach(([c, rr], i) => add('crater/' + i, Array.from({length: 10}, (_, j) => { const a = j / 9 * Math.PI * 1.4 + .6; return [c[0] + Math.cos(a) * rr, c[1] + Math.sin(a) * rr * .8]; }), 1.1 * k, .6));
  } else {
    for (const side of ['l', 'r']) {
      const e = G.eyes[side], mood = p.mood, L = (x, y) => [e.c[0] + x * e.rx, e.c[1] + y * e.ry];
      if (mood === 'blink') add('eye/' + side, [L(-1, 0), L(-.5, .24), L(0, .3), L(.5, .24), L(1, 0)], 2 * k, 1);
      else if (mood === 'happy') add('eye/' + side, [L(-1, .35), L(-.5, -.1), L(0, -.24), L(.5, -.1), L(1, .35)], 2.2 * k, 1);
      else if (mood === 'sleep') add('eye/' + side, [L(-1, .05), L(0, .18), L(1, .05)], 2 * k, 1);
      else if (mood === 'squeeze') add('eye/' + side, side === 'l' ? [L(-.8, -.55), L(.55, 0), L(-.8, .55)] : [L(.8, -.55), L(-.55, 0), L(.8, .55)], 2.1 * k, 1, {corner: .5});
      else {
        add('eye/' + side, Array.from({length: 17}, (_, i) => L(Math.cos(i / 16 * TAU), Math.sin(i / 16 * TAU))), 1.8 * k, 1, {pressure: [[0, .7], [.5, 1], [1, .7]]});
        if (p.lid > .02) { const y = -1 + p.lid * 2, t = p.lidTilt * (side === 'l' ? 1 : -1); add('lid/' + side, [L(-1.08, y - t * .45), L(0, y - .08), L(1.08, y + t * .45)], 1.8 * k, 1); }
        if (mood === 'dizzy') { const pts = []; for (let i = 0; i <= 26; i++) { const a = i / 26 * TAU * 2.2, rr = .12 + i / 26 * .66; pts.push(L(Math.cos(a) * rr, Math.sin(a) * rr)); } add('spiral/' + side, pts, 1.3 * k, 1); }
      }
    }
    add('mouth', G.mouth, 1.9 * k, 1, {close: p.mouth === 'o'});
  }
  return {strokes: s};
}

const DT_CELS = new Map();
function dtCel(G, look, layer, key) {
  const id = key + '|' + look + '|' + layer;
  if (DT_CELS.has(id)) return DT_CELS.get(id);
  const cel = compileCel(dtStrokes(G, look, layer), {id: 'dot/' + look + '/' + layer});
  DT_CELS.set(id, cel); if (DT_CELS.size > 400) DT_CELS.delete(DT_CELS.keys().next().value);
  return cel;
}

function sparkle(g, x, y, s, color, rot = 0) {
  g.save(); g.translate(x, y); g.rotate(rot); g.fillStyle = color; g.beginPath();
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU - Math.PI / 2, rr = i % 2 ? s * .22 : s; const px = Math.cos(a) * rr, py = Math.sin(a) * rr; i ? g.lineTo(px, py) : g.moveTo(px, py); }
  g.closePath(); g.fill(); g.restore();
}

function dtFillEyes(g, G, look) {
  const p = G.p, P = dtPal(look, p);
  if (['blink', 'happy', 'squeeze', 'sleep'].includes(p.mood)) return;
  for (const side of ['l', 'r']) {
    const e = G.eyes[side];
    g.save(); g.translate(e.c[0], e.c[1]); g.rotate(e.rot);
    const sc = new Path2D(); sc.ellipse(0, 0, e.rx, e.ry, 0, 0, TAU);
    g.fillStyle = P.sclera; g.fill(sc); g.clip(sc);
    if (p.mood !== 'dizzy') {
      const rp = Math.min(e.rx, e.ry) * .7 * p.pupil, px = p.gx * e.rx * .4, py = p.gy * e.ry * .34;
      g.fillStyle = P.pupil; g.beginPath(); g.arc(px, py, rp, 0, TAU); g.fill();
      g.fillStyle = look === 'chalk' ? '#ffffff' : P.sclera;
      if (p.spark > .05) sparkle(g, px - rp * .25, py - rp * .3, rp * (.55 + .35 * p.spark), g.fillStyle);
      else { g.beginPath(); g.arc(px - rp * .34, py - rp * .4, rp * .36, 0, TAU); g.fill(); }
      g.beginPath(); g.arc(px + rp * .34, py + rp * .34, rp * .15, 0, TAU); g.fill();
    }
    if (p.lid > .02) {
      const y = (-1 + p.lid * 2) * e.ry, t = p.lidTilt * (side === 'l' ? 1 : -1) * e.ry * .45;
      g.fillStyle = P.fill; g.beginPath(); g.moveTo(-e.rx * 1.2, y - t); g.lineTo(e.rx * 1.2, y + t); g.lineTo(e.rx * 1.2, -e.ry * 1.3); g.lineTo(-e.rx * 1.2, -e.ry * 1.3); g.closePath(); g.fill();
    }
    g.restore();
  }
}

function dtRender(g, p, look, key) {
  const G = dtGeom(p), P = dtPal(look, p), r = G.r, box = [-r * 1.6, -r * 1.9, r * 3.2, r * 3.4];
  if (G.trail) { const tp = polyPath([...G.trail.outer, ...G.trail.inner.slice().reverse()]); g.fillStyle = look === 'flat' ? DC.blue : look === 'chalk' ? alpha(DC.chalk, .5) : alpha(P.line, look === 'ink' ? .85 : .35); g.fill(tp); }
  drawCel(g, dtCel(G, look, 'back', key), {material: P.mat, color: P.line});
  for (const side of ['l', 'r']) { const h = G.arms[side].hand; g.fillStyle = P.fill; g.beginPath(); g.arc(h[0], h[1], r * .12, 0, TAU); g.fill(); g.strokeStyle = P.line; g.lineWidth = 1.6 * P.k; g.stroke(); }
  const sil = curvePath(G.body, true, 2);
  if (P.screen) screenFill(g, sil, box, {color: P.fill, paper: DC.white, seed: 5, wear: .02});
  else { g.fillStyle = P.fill; g.fill(sil); }
  if (look === 'pencil') formHatch(g, sil, box, {color: DC.lead, spacing: 5.5, length: 12, width: .7, opacity: .32, seed: 31, tone: (x, y) => clamp((y + x * .5) / (r * 2.2) + .18, 0, .6), direction: () => 1.05});
  else if (look === 'ink') formHatch(g, sil, box, {color: DC.ink, spacing: 5, length: 11, width: .8, opacity: .5, seed: 33, tone: (x, y) => clamp((y + x * .6) / (r * 1.6) - .05, 0, .7), direction: () => 1.1});
  else if (look === 'flat') { g.save(); g.clip(sil); g.fillStyle = alpha(DC.white, .28); g.beginPath(); g.ellipse(-r * .35, -r * .45, r * .42, r * .26, -.5, 0, TAU); g.fill(); g.restore(); }
  else if (look === 'chalk') formHatch(g, sil, box, {color: DC.chalk, spacing: 7, length: 12, width: .7, opacity: .25, seed: 35, tone: (x, y) => clamp(.4 - (y + x) / (r * 3), 0, .5), direction: () => -.6});
  for (const [c, rr] of G.craters) { g.fillStyle = look === 'flat' ? alpha(shade(P.fill, .3), .5) : alpha(P.line, .12); g.beginPath(); g.ellipse(c[0], c[1], rr, rr * .8, 0, 0, TAU); g.fill(); }
  if (p.blush > .02) for (const c of G.cheeks) { g.fillStyle = alpha(P.blush, .55 * p.blush); g.beginPath(); g.ellipse(c[0], c[1], r * .13, r * .08, 0, 0, TAU); g.fill(); }
  drawCel(g, dtCel(G, look, 'body', key), {material: P.mat, color: P.line});
  if (p.star > .02) {
    if (p.keep > .5 && look !== 'pencil') { g.save(); g.translate(G.tip[0], G.tip[1]); g.rotate(p.starSpin); const s = r * .24 * p.star, pts = Array.from({length: 8}, (_, i) => { const a = i / 8 * TAU - Math.PI / 2, rr = i % 2 ? s * .26 : s; return [Math.cos(a) * rr, Math.sin(a) * rr]; });
      const sp = polyPath(pts); g.fillStyle = DC.paper; g.fill(sp); formHatch(g, sp, [-s, -s, s * 2, s * 2], {color: DC.lead, spacing: 3, length: 7, width: .6, opacity: .55, tone: () => .6, direction: () => 1.1, seed: 3});
      g.strokeStyle = DC.pencil; g.lineWidth = 1.3; g.globalAlpha = .85; wob(g, pts, .6, 9, true, {smooth: false}); g.restore(); }
    else sparkle(g, G.tip[0], G.tip[1], r * .2 * p.star, P.star, p.starSpin);
  }
  dtFillEyes(g, G, look);
  drawCel(g, dtCel(G, look, 'face', key), {material: P.mat, color: P.line});
  return G;
}

const DT_SPRITES = new Map();
function dtKey(p) { return Object.keys(p).sort().map(k => typeof p[k] === 'number' ? k + ':' + p[k].toFixed(3) : k + ':' + p[k]).join(','); }
function dtSprite(p, look) {
  const key = dtKey(p), id = look + '|' + S + '|' + key;
  if (DT_SPRITES.has(id)) { const v = DT_SPRITES.get(id); DT_SPRITES.delete(id); DT_SPRITES.set(id, v); return v; }
  const r = p.r, box = [-r * 4, -r * 2.2, r * 6.2, r * 4.6], dpi = 2 * S, cv = document.createElement('canvas');
  cv.width = Math.ceil(box[2] * dpi); cv.height = Math.ceil(box[3] * dpi);
  const g = cv.getContext('2d'); g.setTransform(dpi, 0, 0, dpi, -box[0] * dpi, -box[1] * dpi);
  const G = dtRender(g, p, look, key), v = {cv, box, G};
  DT_SPRITES.set(id, v); if (DT_SPRITES.size > 48) DT_SPRITES.delete(DT_SPRITES.keys().next().value);
  return v;
}
function drawDot(c, p, {x = 0, y = 0, scale = 1, rot = 0, flip = 1, look = 'pencil', alpha: al = 1} = {}) {
  const s = dtSprite(p, look);
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(scale * flip, scale); c.globalAlpha *= al;
  c.drawImage(s.cv, s.box[0], s.box[1], s.box[2], s.box[3]); c.restore();
  return s.G;
}
function dtWorld(q, {x = 0, y = 0, scale = 1, rot = 0, flip = 1} = {}) { return rv2d([x, y], [q[0] * scale * flip, q[1] * scale], rot); }

// Moons: the org's other repos, same round drawing with a body colour and one accessory that says who they are.
const MOONS = {
  kami: {name: 'Kami', since: '2020', body: '#ffb4c8', acc: 'cake'},
  admin2: {name: 'admin-legacy', since: '2020', body: '#a8d8b9', acc: 'gear'},
  admin: {name: 'mx-admin', since: '2021', body: '#8fd3a8', acc: 'gear'},
  yun: {name: 'Yun', since: '2022', body: '#b9d8ff', acc: 'cloud'},
  shiro: {name: 'Shiro', since: '2023', body: '#f4f1ea', acc: 'snow'},
  docs: {name: 'docs', since: '2022', body: '#ffd98a', acc: 'book'},
  yohaku: {name: 'Yohaku', since: '2026', body: '#fbfaf6', acc: 'accent'},
  ios: {name: 'mx-admin (React)', since: '2026', body: '#8fd3a8', acc: 'atom'},
};
function drawAccessory(g, acc, r, line) {
  g.save(); g.strokeStyle = line; g.lineWidth = 2; g.lineJoin = 'round';
  if (acc === 'cake') { g.translate(r * .1, -r * 1.02); g.fillStyle = '#fff4e0'; g.beginPath(); g.moveTo(-r * .38, 0); g.lineTo(r * .38, 0); g.lineTo(r * .3, -r * .34); g.lineTo(-r * .3, -r * .34); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = '#ff7aa2'; g.beginPath(); g.moveTo(-r * .32, -r * .34); g.quadraticCurveTo(0, -r * .5, r * .32, -r * .34); g.closePath(); g.fill(); g.stroke(); g.fillStyle = '#e8364f'; g.beginPath(); g.arc(0, -r * .5, r * .1, 0, TAU); g.fill(); g.stroke(); }
  else if (acc === 'gear') { g.translate(r * .55, -r * .85); g.fillStyle = '#5a6b7a'; g.beginPath(); for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, rr = i % 2 ? r * .22 : r * .3; i ? g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : g.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); } g.closePath(); g.fill(); g.stroke(); g.fillStyle = '#fff'; g.beginPath(); g.arc(0, 0, r * .09, 0, TAU); g.fill(); }
  else if (acc === 'cloud') { g.translate(0, -r * 1.05); g.fillStyle = '#fff'; g.beginPath(); g.arc(-r * .28, 0, r * .2, Math.PI * .5, Math.PI * 1.5); g.arc(-r * .02, -r * .12, r * .26, Math.PI, 0); g.arc(r * .28, 0, r * .2, -Math.PI * .5, Math.PI * .5); g.closePath(); g.fill(); g.stroke(); }
  else if (acc === 'snow') { g.translate(r * .5, -r * .9); g.strokeStyle = '#7fa3c4'; g.lineWidth = 2.4; for (let i = 0; i < 3; i++) { const a = i / 3 * Math.PI; g.beginPath(); g.moveTo(Math.cos(a) * r * .26, Math.sin(a) * r * .26); g.lineTo(-Math.cos(a) * r * .26, -Math.sin(a) * r * .26); g.stroke(); } }
  else if (acc === 'book') { g.translate(r * .05, -r * 1.0); g.fillStyle = '#fff'; g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(-r * .2, -r * .1, -r * .42, -r * .04); g.lineTo(-r * .42, -r * .32); g.quadraticCurveTo(-r * .2, -r * .38, 0, -r * .28); g.quadraticCurveTo(r * .2, -r * .38, r * .42, -r * .32); g.lineTo(r * .42, -r * .04); g.quadraticCurveTo(r * .2, -r * .1, 0, 0); g.closePath(); g.fill(); g.stroke(); g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -r * .28); g.stroke(); }
  else if (acc === 'atom') { g.translate(r * .5, -r * .92); g.strokeStyle = '#1aa3c9'; g.lineWidth = 2.2; for (let i = 0; i < 3; i++) { g.save(); g.rotate(i * Math.PI / 3); g.beginPath(); g.ellipse(0, 0, r * .36, r * .13, 0, 0, TAU); g.stroke(); g.restore(); } g.fillStyle = '#1aa3c9'; g.beginPath(); g.arc(0, 0, r * .07, 0, TAU); g.fill(); }
  else if (acc === 'accent') { g.translate(r * .62, -r * .62); g.fillStyle = '#c0392b'; g.beginPath(); g.arc(0, 0, r * .11, 0, TAU); g.fill(); }
  else if (acc === 'phone') { g.translate(r * .95, r * .05); g.rotate(.25); g.fillStyle = '#2b2d3a'; g.beginPath(); g.roundRect(-r * .17, -r * .3, r * .34, r * .6, r * .07); g.fill(); g.stroke(); g.fillStyle = DC.blue; g.fillRect(-r * .12, -r * .23, r * .24, r * .44); }
  g.restore();
}
function drawMoon(c, id, p, o = {}) {
  const m = MOONS[id], look = o.look || 'flat', pose = {...p, body: m.body, star: 0, trail: p.trail ?? 0};
  const G = drawDot(c, pose, {...o, look});
  const P = dtPal(look, pose);
  c.save(); c.translate(o.x || 0, o.y || 0); c.rotate(o.rot || 0); c.scale((o.scale || 1) * (o.flip || 1), o.scale || 1); c.globalAlpha *= o.alpha ?? 1;
  drawAccessory(c, o.acc || m.acc, pose.r, P.line); c.restore();
  if (o.tag) nameTag(c, m.name, (o.x || 0), (o.y || 0) + pose.r * (o.scale || 1) + 28, look === 'pencil' ? DC.pencil : DC.ink);
  return G;
}
function nameTag(c, text, x, y, color = DC.ink, size = 22) {
  c.save(); c.font = `600 ${size}px ${DT_FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle';
  const w = c.measureText(text).width + 20; c.fillStyle = alpha('#ffffff', .85); c.beginPath(); c.roundRect(x - w / 2, y - size * .7, w, size * 1.4, 6); c.fill();
  c.strokeStyle = color; c.lineWidth = 1.4; c.stroke(); c.fillStyle = color; c.fillText(text, x, y + 1); c.restore();
}
