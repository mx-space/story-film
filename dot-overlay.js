'use strict';
// Screen-space lettering: captions (Dot), the feature card (the product), the date dial, margin notes.

const lin = x => x;
const charAdvance = (c, ch, size) => ch === ' ' ? Math.max(c.measureText(ch).width, size * .34) : c.measureText(ch).width;
const textWidth = (c, text, size) => [...text].reduce((w, ch) => w + charAdvance(c, ch, size), 0);
// The handwriting face has a hairline space, so spaces get a minimum advance; alignment is resolved here, never inherited.
function writeOn(c, text, x, y, {size = 48, col = DC.pencil, p = 1, align = 'left', al = 1, rot = -.01, weight = 600} = {}) {
  if (p <= 0 || al <= 0) return;
  const chars = [...text], n = chars.length * clamp(p, 0, 1), full = Math.floor(n), frac = n - full;
  c.save(); c.font = `${weight} ${size}px ${DT_FONT}`; c.textBaseline = 'alphabetic'; c.textAlign = 'left';
  const w = textWidth(c, text, size), x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
  c.translate(x0, y); c.rotate(rot);
  let xx = 0; const base = c.globalAlpha;
  for (let i = 0; i < chars.length && i <= full; i++) {
    const a = base * al * (i < full ? 1 : frac); if (a <= 0) break;
    c.fillStyle = col; c.globalAlpha = a * .9; c.fillText(chars[i], xx, 0);
    c.globalAlpha = a * .2; c.fillText(chars[i], xx + .7, .5);
    xx += charAdvance(c, chars[i], size);
  }
  c.restore();
}
function partial(pts, u) {
  if (u >= 1) return pts; if (u <= 0) return pts.slice(0, 1);
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const d = L[L.length - 1] * u, out = [pts[0]];
  for (let i = 1; i < pts.length; i++) { if (L[i] <= d) out.push(pts[i]); else { const k = (d - L[i - 1]) / (L[i] - L[i - 1]); out.push([lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)]); break; } }
  return out;
}
function handLine(c, pts, {w = 1.6, col = DC.pencil, al = 1, seed = 1, close = false, pencil = true} = {}) {
  if (pts.length < 2 || al <= 0) return;
  c.save(); c.strokeStyle = col; c.lineCap = 'round'; c.lineJoin = 'round';
  if (pencil) for (let k = 0; k < 2; k++) { c.globalAlpha = al * (k ? .3 : .8); c.lineWidth = w * (k ? .55 : 1); wob(c, pts, .9 + k * .9, seed + k * 13, close, {pressure: .55}); }
  else { c.globalAlpha *= al; c.lineWidth = w * 1.4; wob(c, pts, .5, seed, close, {pressure: .85}); }
  c.restore();
}
function arrowTo(c, from, to, {col, seed = 1, p = 1, bend = .22, al = 1, pencil = true} = {}) {
  if (p <= 0 || al <= 0) return;
  const mid = [(from[0] + to[0]) / 2 + (to[1] - from[1]) * bend, (from[1] + to[1]) / 2 - (to[0] - from[0]) * bend], pts = [];
  for (let i = 0; i <= 14; i++) { const k = i / 14; pts.push([(1 - k) ** 2 * from[0] + 2 * (1 - k) * k * mid[0] + k * k * to[0], (1 - k) ** 2 * from[1] + 2 * (1 - k) * k * mid[1] + k * k * to[1]]); }
  handLine(c, partial(pts, p), {w: 1.5, col, seed, al, pencil});
  if (p >= 1) { const a = Math.atan2(to[1] - pts[12][1], to[0] - pts[12][0]), h = 14;
    handLine(c, [[to[0] - Math.cos(a - .5) * h, to[1] - Math.sin(a - .5) * h], to, [to[0] - Math.cos(a + .5) * h, to[1] - Math.sin(a + .5) * h]], {w: 1.5, col, seed: seed + 1, al, pencil}); }
}

const LOOK_INK = {pencil: DC.pencil, ink: DC.ink, flat: DC.ink, chalk: DC.chalk, blue: DC.ink};
const LOOK_LEAD = {pencil: DC.lead, ink: '#4a5060', flat: '#3d4a5c', chalk: '#b9c9ea', blue: '#3d4a5c'};

// Captions: [[text, t0, t1, size?], ...] written on between t0..t1, faded out over fade.
function caption(c, look, lines, t, fade) {
  resetT(c); const al = 1 - sm(fade[0], fade[1], t, lin); if (al <= 0) return; let y = 140;
  for (const [text, t0, t1, size = 50] of lines) { writeOn(c, text, 110, y, {size, col: LOOK_INK[look], p: sm(t0, t1, t, lin), al}); y += size * 1.45; }
}
// Card: the product speaking, top right. CARDS = [[t0, title, sub], ...]; each holds until the next.
function featureCard(c, look, t, cards, hideAt = Infinity) {
  if (t < cards[0][0]) return;
  const hide = 1 - sm(hideAt, hideAt + .5, t, lin); if (hide <= 0) return;
  let k = 0; for (let i = 0; i < cards.length; i++) if (cards[i][0] <= t) k = i;
  const [t0, title, sub] = cards[k], prev = k > 0 ? cards[k - 1] : null, gone = sm(t0, t0 + .15, t, lin), p = sm(t0 + .1, t0 + .6, t, lin);
  const col = LOOK_INK[look];
  resetT(c); c.save(); c.globalAlpha = hide;
  if (prev && gone < 1) { writeOn(c, prev[1], W - 110, 124, {size: 56, col, al: 1 - gone, align: 'right'}); writeOn(c, prev[2], W - 110, 172, {size: 30, col, al: 1 - gone, align: 'right'}); }
  writeOn(c, title, W - 110, 124, {size: [...title].length > 12 ? 46 : 56, col, p, align: 'right'});
  writeOn(c, sub, W - 110, 172, {size: 30, col: LOOK_LEAD[look], p: sm(t0 + .35, t0 + .9, t, lin), align: 'right'});
  c.globalAlpha = hide * sm(t0 + .5, t0 + .9, t, lin); c.strokeStyle = DC.gold; c.lineWidth = 2; c.beginPath(); c.moveTo(W - 420, 196); c.lineTo(W - 108, 198); c.stroke(); c.restore();
}
// Date dial, bottom left: the date and the running commit count.
function dateDial(c, look, date, count, {al = 1, flip = 1} = {}) {
  resetT(c); if (al <= 0) return; const col = LOOK_INK[look], lead = LOOK_LEAD[look];
  c.save(); c.globalAlpha *= al * .82; c.fillStyle = look === 'chalk' ? DC.chalkBg : DC.paper; c.beginPath(); c.roundRect(84, H - 196, 470, 140, 20); c.fill(); c.restore();
  c.save(); c.globalAlpha *= al;
  const cx = 150, cy = H - 128, r = 46; c.strokeStyle = col; c.lineWidth = 1.6; c.globalAlpha *= .8;
  wob(c, ellPts(cx, cy, r, r, 0, 40), 1.2, 5, true);
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; c.beginPath(); c.moveTo(cx + Math.cos(a) * r * .8, cy + Math.sin(a) * r * .8); c.lineTo(cx + Math.cos(a) * r * .92, cy + Math.sin(a) * r * .92); c.stroke(); }
  const [y, m] = date.split('-').map(Number), a = (m - 1) / 12 * TAU - Math.PI / 2;
  c.lineWidth = 2.6; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(a) * r * .66, cy + Math.sin(a) * r * .66); c.stroke();
  c.fillStyle = DC.gold; c.beginPath(); c.arc(cx, cy, 4, 0, TAU); c.fill(); c.restore();
  c.save(); c.globalAlpha *= al * flip;
  const [yy, mm, dd] = date.split('-');
  writeOn(c, `${yy} 年 ${+mm} 月 ${+dd} 日`, 220, H - 136, {size: 36, col, rot: 0});
  if (count) writeOn(c, count, 220, H - 92, {size: 26, col: lead, rot: 0});
  c.restore();
}
// Margin note: handwritten proof pinned near what it proves, with an arrow.
function marginNote(c, look, lines, at, target, p, {al = 1} = {}) {
  if (p <= 0 || al <= 0) return;
  const col = LOOK_LEAD[look], pencil = look === 'pencil' || look === 'chalk';
  lines.forEach((t, i) => writeOn(c, t, at[0], at[1] + i * 34, {size: 28, col, p: clamp(p * (1 + .35 * (lines.length - 1)) - i * .35, 0, 1), al, weight: 500}));
  if (target) arrowTo(c, [at[0] - 12, at[1] - 10], target, {col, seed: (at[0] | 0) + 3, p: clamp(p * 1.5 - .4, 0, 1), al, pencil});
}
