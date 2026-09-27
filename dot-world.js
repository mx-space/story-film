'use strict';
// The planet: Mix Space itself. A round world with the logo's tilted orbit ring.
// Lights on the surface are commits; the ring count follows major versions.

const PL = {
  pencil: {fill: DC.paper, line: DC.pencil, land: '#e6e0d2', ring: DC.pencil, mat: 'pencil', core: '#d8d1c2'},
  ink: {fill: '#fdfcf8', line: DC.ink, land: '#e9eef3', ring: DC.ink, mat: 'ink', core: '#cfd6de'},
  flat: {fill: '#bfe8fb', line: '#0b4f73', land: '#7fd0f3', ring: DC.blue, mat: 'ink', core: '#fff1c9'},
  chalk: {fill: '#1f3968', line: DC.chalk, land: '#2a4a82', ring: '#9cc9ff', mat: 'pencil', core: '#27457c'},
};

const PLANET_CELS = new Map();
function planetCel(R, look, part, pts, extra = {}) {
  const id = look + '|' + R + '|' + part;
  if (PLANET_CELS.has(id)) return PLANET_CELS.get(id);
  const P = PL[look], cel = compileCel({strokes: [{id: part, points: pts, width: (look === 'pencil' || look === 'chalk' ? 3.4 : 2.6), close: !!extra.close, pressure: [[0, .4], [.5, 1], [1, .4]], color: extra.color}]}, {id: 'planet/' + look + '/' + part});
  PLANET_CELS.set(id, cel); return cel;
}
function ringPts(R, tilt, from, to, n = 60) { return Array.from({length: n}, (_, i) => { const a = from + (to - from) * i / (n - 1); return rv2d([0, 0], [Math.cos(a) * R * 1.55, Math.sin(a) * R * .32], tilt); }); }
function landPts(R) {
  return [
    [[-.62, -.38], [-.45, -.62], [-.28, -.4], [-.12, -.64], [.05, -.36], [-.05, -.08], [-.35, -.02], [-.6, -.12]],
    [[.22, .1], [.48, -.05], [.66, .12], [.58, .42], [.34, .5], [.18, .34]],
    [[-.5, .38], [-.3, .3], [-.18, .5], [-.36, .62], [-.54, .54]],
  ].map(l => l.map(([u, v]) => [u * R, v * R]));
}
// o.lights: [[u, v, k]] in -1..1 disc coords; o.cut: 0..1 opens a wedge to show the core; o.core: label in the core
function drawPlanet(c, x, y, R, look = 'flat', o = {}) {
  const P = PL[look], tilt = o.tilt ?? -.28, rings = o.rings ?? 1, pr = o.p ?? 1, ringP = o.ringP ?? 1;
  if (pr <= 0) return;
  c.save(); c.translate(x, y);
  if (pr < 1) { const wedge = new Path2D(); wedge.moveTo(0, 0); wedge.arc(0, 0, R * 3, -Math.PI / 2, -Math.PI / 2 + pr * TAU); wedge.closePath(); c.clip(wedge); }
  const ringClip = k => { if (o.ringOff && k === 0) { const [dx, dy, rr] = o.ringOff; c.translate(dx, dy); c.rotate(rr); } if (k !== rings - 1 || ringP >= 1) return; const w = new Path2D(); w.moveTo(0, 0); w.arc(0, 0, R * 3, Math.PI * .9, Math.PI * .9 + ringP * TAU); w.closePath(); c.clip(w); };
  for (let k = 0; k < rings; k++) { const rr = R * (1 + k * .09); c.save(); ringClip(k); c.globalAlpha *= k ? .55 : 1; drawCel(c, planetCel(rr, look, 'ringback' + k, ringPts(rr, tilt, Math.PI, TAU)), {material: P.mat, color: P.ring}); c.restore(); }
  const disc = circPath(0, 0, R);
  if (look === 'flat') screenFill(c, disc, [-R, -R, R * 2, R * 2], {color: P.fill, paper: DC.white, seed: 3, wear: .015}); else { c.fillStyle = P.fill; c.fill(disc); }
  c.save(); c.clip(disc);
  landPts(R).forEach((l, i) => { const lp = curvePath(l, true, 2); c.fillStyle = P.land; c.fill(lp); });
  if (look === 'pencil') formHatch(c, disc, [-R, -R, R * 2, R * 2], {color: DC.lead, spacing: 7, length: 16, width: .8, opacity: .35, seed: 41, tone: (px, py) => clamp((px + py) / (R * 2.4) + .2, 0, .6), direction: () => 1.1});
  else if (look === 'ink') formHatch(c, disc, [-R, -R, R * 2, R * 2], {color: DC.ink, spacing: 6, length: 14, width: .9, opacity: .5, seed: 43, tone: (px, py) => clamp((px + py) / (R * 1.8), 0, .75), direction: () => 1.1});
  else if (look === 'flat') { c.fillStyle = alpha(DC.navy, .12); c.beginPath(); c.arc(R * .35, R * .35, R * 1.05, 0, TAU); c.fill(); c.fillStyle = alpha('#ffffff', .35); c.beginPath(); c.ellipse(-R * .4, -R * .5, R * .35, R * .18, -.6, 0, TAU); c.fill(); }
  else if (look === 'chalk') { c.strokeStyle = alpha(DC.chalk, .25); c.lineWidth = 1; for (let k = -4; k <= 4; k++) { c.beginPath(); c.ellipse(0, 0, R, Math.abs(k) * R / 4.5 + .1, 0, 0, TAU); c.stroke(); c.beginPath(); c.ellipse(0, 0, Math.abs(k) * R / 4.5 + .1, R, 0, 0, TAU); c.stroke(); } }
  if (o.lights) for (const [u, v, k = 1] of o.lights) { const px = u * R, py = v * R; c.fillStyle = alpha(look === 'chalk' ? '#bfe3ff' : DC.gold, .9 * k); c.beginPath(); c.arc(px, py, 2.6, 0, TAU); c.fill(); }
  if (o.commits) { c.save(); c.globalAlpha *= o.lightsAl ?? 1; drawLights(c, R, o.commits, look, o.newest); c.restore(); }
  if (o.cut > 0) {
    const a0 = -.9 * o.cut, a1 = .5 * o.cut, wedge = new Path2D(); wedge.moveTo(0, 0); wedge.arc(0, 0, R + 2, a0, a1); wedge.closePath();
    c.fillStyle = look === 'chalk' ? '#10213f' : '#2b2233'; c.fill(wedge);
    const cr = R * .42; c.fillStyle = o.coreColor || P.core; c.beginPath(); c.arc(0, 0, cr, 0, TAU); c.fill(); c.strokeStyle = P.line; c.lineWidth = 2; c.stroke();
    if (o.core) { c.font = `600 ${Math.round(R * .13)}px ${DT_FONT}`; c.fillStyle = look === 'chalk' ? DC.chalk : DC.ink; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(o.core, 0, 0); }
  }
  c.restore();
  drawCel(c, planetCel(R, look, 'rim', Array.from({length: 48}, (_, i) => { const a = i / 48 * TAU; return [Math.cos(a) * R, Math.sin(a) * R]; }), {close: true}), {material: P.mat, color: P.line});
  for (let k = 0; k < rings; k++) { const rr = R * (1 + k * .09); c.save(); ringClip(k); c.globalAlpha *= k ? .55 : 1; drawCel(c, planetCel(rr, look, 'ringfront' + k, ringPts(rr, tilt, 0, Math.PI)), {material: P.mat, color: P.ring}); c.restore(); }
  c.restore();
}

// One light per commit, scattered evenly over the disc so density follows the running total.
const lightAt = i => { if (i === 0) return [.3, -.28]; const u = hash(i, 11), a = hash(i, 12) * TAU, r = Math.sqrt(u) * .93; return [Math.cos(a) * r, Math.sin(a) * r]; };
function drawLights(c, R, n, look, newest = 0) {
  const col = look === 'chalk' ? '#bfe3ff' : look === 'pencil' ? DC.lead : DC.gold, size = n < 2 ? 9 : clamp(2.8 - n / 2600, 1.2, 2.8);
  c.fillStyle = col; c.beginPath();
  const whole = Math.floor(n);
  for (let i = 0; i < whole; i++) { const [u, v] = lightAt(i); c.moveTo(u * R + size, v * R); c.arc(u * R, v * R, size, 0, TAU); }
  c.fill();
  if (whole === 1) { const [u, v] = lightAt(0); c.save(); c.strokeStyle = DC.gold; c.lineWidth = 2.4; c.lineCap = 'round'; for (let k = 0; k < 8; k++) { const a = k / 8 * TAU + .2; c.beginPath(); c.moveTo(u * R + Math.cos(a) * 14, v * R + Math.sin(a) * 14); c.lineTo(u * R + Math.cos(a) * 24, v * R + Math.sin(a) * 24); c.stroke(); } c.restore(); }
  for (let i = Math.max(0, whole - newest); i < whole; i++) { const [u, v] = lightAt(i); glow(c, u * R, v * R, n < 2 ? 46 : 16, '#ffd77a', n < 2 ? 1 : .7); }
}
// A point on ring k at angle th (front half has sin(th) > 0).
function ringPos(x, y, R, th, k = 0, tilt = -.28) { const rr = R * (1 + k * .09); return rv2d([x, y], [Math.cos(th) * rr * 1.55, Math.sin(th) * rr * .32], tilt); }
function graphPaper(c, al = 1) {
  paper(c, DC.paper, null, 91); if (al <= 0) return;
  c.save(); c.globalAlpha = al; c.strokeStyle = 'rgba(90,140,200,.16)'; c.lineWidth = 1;
  c.beginPath(); for (let x = 0; x <= W; x += 40) { c.moveTo(x, 0); c.lineTo(x, H); } for (let y = 0; y <= H; y += 40) { c.moveTo(0, y); c.lineTo(W, y); } c.stroke();
  c.strokeStyle = 'rgba(200,90,90,.25)'; c.beginPath(); c.moveTo(80, 0); c.lineTo(80, H); c.stroke(); c.restore();
}
