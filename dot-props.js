'use strict';
// Props for acts II-IV: the AI lamp, pages, comments, blocks, the crane, meteors, the closing card.

const LAMP = [960, 318];
function drawLamp(c, look, k) {
  if (k <= 0) return;
  const [x, y] = LAMP, base = [x, PY - PR + 4], ink = look === 'chalk' ? DC.chalk : DC.ink;
  c.save(); c.globalAlpha *= clamp(k * 1.5, 0, 1);
  handLine(c, [base, [x + 4, (base[1] + y) / 2], [x, y + 26]], {w: 2.4, col: ink, pencil: false});
  glow(c, x, y, 140 * k, '#ffd77a', .55);
  c.fillStyle = '#ffd35a'; c.beginPath(); c.arc(x, y, 24 * easeOutBack(clamp(k, 0, 1)), 0, TAU); c.fill();
  c.strokeStyle = ink; c.lineWidth = 2; c.stroke();
  c.fillStyle = '#fff6d0'; c.beginPath(); c.arc(x - 8, y - 8, 6, 0, TAU); c.fill();
  c.restore();
}
// A page of writing: squiggle lines, optional summary band on top and a language tag.
function drawSheet(c, x, y, {rot = 0, s = 1, band = 0, tag = '', al = 1, look = 'flat'} = {}) {
  if (al <= 0) return;
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.globalAlpha *= al;
  const w = 64, h = 84, ink = look === 'chalk' ? DC.chalk : DC.ink;
  c.fillStyle = look === 'chalk' ? '#23417a' : '#ffffff'; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, 4); c.fill(); c.strokeStyle = ink; c.lineWidth = 1.8; c.stroke();
  squiggleText(c, -w / 2 + 9, -h / 2 + (band > 0 ? 34 : 18), w - 18, band > 0 ? 4 : 5, {color: alpha(ink, .6), seed: 7, lineH: 11, amp: 2.4, width: 1.1});
  if (band > 0) { c.fillStyle = alpha(DC.gold, .85 * band); c.fillRect(-w / 2 + 6, -h / 2 + 7, (w - 12) * band, 16); writeOn(c, '摘要', -w / 2 + 10, -h / 2 + 21, {size: 13, col: DC.ink, p: band, rot: 0}); }
  if (tag) { c.fillStyle = DC.blue; c.beginPath(); c.arc(w / 2 - 4, -h / 2 + 4, 15, 0, TAU); c.fill(); writeOn(c, tag, w / 2 - 4, -h / 2 + 10, {size: tag.length > 1 ? 13 : 17, col: '#fff', align: 'center', rot: 0}); }
  c.restore();
}
function drawBubble(c, x, y, text, {spam = 0, stamp = 0, al = 1, rot = 0} = {}) {
  if (al <= 0) return;
  c.save(); c.translate(x, y); c.rotate(rot); c.globalAlpha *= al; c.font = `600 20px ${DT_FONT}`;
  const w = textWidth(c, text, 20) + 30, h = 42;
  c.fillStyle = spam ? '#ffe3e0' : '#ffffff'; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, 12); c.moveTo(-w / 2 + 16, h / 2); c.lineTo(-w / 2 + 10, h / 2 + 12); c.lineTo(-w / 2 + 28, h / 2); c.fill();
  c.strokeStyle = DC.ink; c.lineWidth = 1.6; c.stroke();
  writeOn(c, text, 0, 7, {size: 20, col: DC.ink, align: 'center', rot: 0});
  if (stamp > 0) { c.save(); c.rotate(-.18); const k = easeOutBack(clamp(stamp, 0, 1)), sc = lerp(2.2, 1, k); c.scale(sc, sc); c.globalAlpha *= clamp(stamp * 2, 0, 1);
    c.strokeStyle = '#d23c3c'; c.lineWidth = 3; c.beginPath(); c.roundRect(-44, -22, 88, 44, 6); c.stroke(); writeOn(c, '拦下', 0, 10, {size: 28, col: '#d23c3c', align: 'center', rot: 0}); c.restore(); }
  c.restore();
}
// Lexical: the page turns into blocks that can be moved around.
function drawBlocks(c, x, y, k, t) {
  if (k <= 0) return;
  const rows = [['段落', '#ffffff'], ['</> 代码', '#e8f3ff'], ['图片', '#fff3d6']], order = t > 74 ? [1, 0, 2] : [0, 1, 2];
  rows.forEach(([label, col], i) => {
    const slot = order.indexOf(i), yy = y + lerp(i, slot, sm(74, 74.6, t, easeOutBack)) * 52 - 52, xx = x + (1 - k) * (i - 1) * 30;
    c.save(); c.globalAlpha *= clamp(k * 1.4 - i * .2, 0, 1); c.fillStyle = col; c.beginPath(); c.roundRect(xx - 80, yy - 20, 160, 42, 8); c.fill(); c.strokeStyle = DC.ink; c.lineWidth = 1.6; c.stroke();
    c.fillStyle = alpha(DC.ink, .35); for (let d = 0; d < 3; d++) { c.beginPath(); c.arc(xx - 66, yy - 8 + d * 8, 2, 0, TAU); c.fill(); }
    writeOn(c, label, xx - 50, yy + 8, {size: 20, col: DC.ink, rot: 0}); c.restore();
  });
}
function drawCore(c, x, y, r, label, look = 'chalk') {
  c.save(); c.fillStyle = label === 'PostgreSQL' ? '#2f6db0' : '#4b8a3e'; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
  c.strokeStyle = DC.chalk; c.lineWidth = 2.4; c.stroke();
  c.strokeStyle = alpha('#ffffff', .25); c.lineWidth = 1; for (let k = 1; k < 4; k++) { c.beginPath(); c.arc(x, y, r * k / 4, 0, TAU); c.stroke(); }
  writeOn(c, label, x, y + r * .12, {size: Math.round(r * .3), col: '#ffffff', align: 'center', rot: 0}); c.restore();
}
function drawHook(c, x, y) {
  c.save(); c.strokeStyle = DC.chalk; c.lineWidth = 2; c.beginPath(); c.moveTo(x, -400); c.lineTo(x, y - 18); c.stroke();
  c.lineWidth = 4; c.beginPath(); c.arc(x, y, 14, -Math.PI * .5, Math.PI * .9); c.stroke(); c.restore();
}
function drawMeteor(c, from, to, u) {
  if (u <= 0 || u >= 1) return;
  const e = easeIn(u), x = lerp(from[0], to[0], e), y = lerp(from[1], to[1], e), dx = to[0] - from[0], dy = to[1] - from[1], l = Math.hypot(dx, dy);
  c.save(); c.strokeStyle = alpha('#bfe3ff', .8); c.lineWidth = 2.2; c.lineCap = 'round'; c.beginPath(); c.moveTo(x - dx / l * 70, y - dy / l * 70); c.lineTo(x, y); c.stroke();
  c.fillStyle = '#ffffff'; c.beginPath(); c.arc(x, y, 3.2, 0, TAU); c.fill(); c.restore();
}
function searchBox(c, x, y, text, p, t) {
  const w = 640, h = 72; c.save();
  c.fillStyle = '#ffffff'; c.beginPath(); c.roundRect(x - w / 2, y - h / 2, w, h, 36); c.fill(); c.strokeStyle = DC.ink; c.lineWidth = 2.2; c.stroke();
  c.lineWidth = 2.6; c.beginPath(); c.arc(x - w / 2 + 44, y - 4, 13, 0, TAU); c.stroke(); c.beginPath(); c.moveTo(x - w / 2 + 53, y + 5); c.lineTo(x - w / 2 + 64, y + 16); c.stroke();
  const n = Math.floor([...text].length * p), shown = [...text].slice(0, n).join('');
  writeOn(c, shown, x - w / 2 + 84, y + 11, {size: 32, col: DC.ink, rot: 0});
  c.font = `600 32px ${DT_FONT}`; const cw = textWidth(c, shown, 32);
  if (Math.floor(t * 2) % 2 === 0) { c.fillStyle = DC.ink; c.fillRect(x - w / 2 + 88 + cw, y - 16, 3, 34); }
  c.restore();
}
