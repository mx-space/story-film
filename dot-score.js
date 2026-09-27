'use strict';
// An original score, synthesized with Web Audio on the film's own timeline.
// Cues are read from the film's constants (A1, MOON_LIST, SEAMS, SIG...), so a timing change moves the sound with it.
function dotScore(ac, t0, destination) {
  const master = ac.createGain(), makeup = ac.createGain(); master.gain.value = 1.5;
  makeup.gain.setValueAtTime(1.4, t0); makeup.gain.setValueAtTime(1.4, t0 + END - 1.5); makeup.gain.linearRampToValueAtTime(0, t0 + END);
  const comp = ac.createDynamicsCompressor(); comp.threshold.value = -24; comp.knee.value = 12; comp.ratio.value = 3.5; comp.attack.value = .006; comp.release.value = .22;
  master.connect(comp); comp.connect(makeup); makeup.connect(destination);
  const verb = ac.createConvolver(), ir = ac.createBuffer(2, Math.floor(ac.sampleRate * 2.4), ac.sampleRate), r = rng(29);
  for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < d.length; i++) d[i] = (r() * 2 - 1) * Math.exp(-i / ac.sampleRate * 3); }
  verb.buffer = ir; const wet = ac.createGain(); wet.gain.value = .24; verb.connect(wet); wet.connect(master);
  const out = (node, send = .3, pan = 0) => { const p = ac.createStereoPanner(); p.pan.value = pan; node.connect(p); p.connect(master); const s = ac.createGain(); s.gain.value = send; p.connect(s); s.connect(verb); };
  const hz = n => 440 * 2 ** ((n - 69) / 12), at = t => t0 + t;
  const env = (g, t, a, v, d) => { g.gain.setValueAtTime(0, at(t)); g.gain.linearRampToValueAtTime(v, at(t) + a); g.gain.exponentialRampToValueAtTime(.0001, at(t) + d); };
  function piano(n, t, d = 2.4, v = .14, pan = 0) {
    const g = ac.createGain(), f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 2600; g.connect(f); out(f, .55, pan);
    g.gain.setValueAtTime(0, at(t)); g.gain.linearRampToValueAtTime(v, at(t) + .006); g.gain.exponentialRampToValueAtTime(v * .25, at(t) + .3); g.gain.exponentialRampToValueAtTime(.0001, at(t) + d);
    for (const [k, a] of [[1, 1], [2.003, .28], [3.01, .09], [4.02, .04]]) { const o = ac.createOscillator(), m = ac.createGain(); o.frequency.value = hz(n) * k; m.gain.value = a; o.connect(m); m.connect(g); o.start(at(t)); o.stop(at(t) + d + .05); }
  }
  function bell(n, t, v = .06, pan = .3) {
    const g = ac.createGain(); out(g, .8, pan); env(g, t, .004, v, 2.6);
    for (const [k, a] of [[1, .7], [2.76, .2], [5.4, .08]]) { const o = ac.createOscillator(), m = ac.createGain(); o.frequency.value = hz(n) * k; m.gain.value = a; o.connect(m); m.connect(g); o.start(at(t)); o.stop(at(t) + 2.7); }
  }
  function pluck(n, t, v = .09, pan = 0) { const o = ac.createOscillator(), g = ac.createGain(), f = ac.createBiquadFilter(); o.type = 'triangle'; o.frequency.value = hz(n); f.type = 'lowpass'; f.frequency.setValueAtTime(3000, at(t)); f.frequency.exponentialRampToValueAtTime(400, at(t) + .5); env(g, t, .003, v, .9); o.connect(f); f.connect(g); out(g, .35, pan); o.start(at(t)); o.stop(at(t) + 1); }
  function glide(t, d, f0, f1, v = .05, type = 'sine') {
    const o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.setValueAtTime(f0, at(t)); o.frequency.exponentialRampToValueAtTime(f1, at(t) + d);
    g.gain.setValueAtTime(0, at(t)); g.gain.linearRampToValueAtTime(v, at(t) + .03); g.gain.setValueAtTime(v, at(t) + d * .7); g.gain.exponentialRampToValueAtTime(.0001, at(t) + d); o.connect(g); out(g, .25); o.start(at(t)); o.stop(at(t) + d + .02);
  }
  function tick(t, v = .08, f = 1500, pan = -.1) { const o = ac.createOscillator(), g = ac.createGain(); o.frequency.setValueAtTime(f, at(t)); o.frequency.exponentialRampToValueAtTime(f * .6, at(t) + .05); env(g, t, .002, v, .07); o.connect(g); out(g, .2, pan); o.start(at(t)); o.stop(at(t) + .08); }
  function noise(t, d, v, seed = 1, freq = 3000, q = .7, trem = 0) {
    const n = Math.ceil(ac.sampleRate * d), b = ac.createBuffer(1, n, ac.sampleRate), x = b.getChannelData(0), rr = rng(seed);
    for (let i = 0; i < n; i++) { const u = i / n, w = trem ? .55 + .45 * Math.sin(i / ac.sampleRate * TAU * trem) : 1; x[i] = (rr() * 2 - 1) * Math.sin(Math.PI * u) ** .6 * w; }
    const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(); s.buffer = b; f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q; g.gain.value = v; s.connect(f); f.connect(g); out(g, .15, -.2); s.start(at(t));
  }
  function thud(t, v = .25) { const o = ac.createOscillator(), g = ac.createGain(); o.frequency.setValueAtTime(95, at(t)); o.frequency.exponentialRampToValueAtTime(38, at(t) + .25); env(g, t, .004, v, .5); o.connect(g); out(g, .1); o.start(at(t)); o.stop(at(t) + .55); noise(t, .2, v * .4, 3, 400, 1); }
  function pad(notes, t, d, v = .015, bright = 1500) {
    notes.forEach((n, j) => { const g = ac.createGain(), f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(500, at(t)); f.frequency.linearRampToValueAtTime(bright, at(t) + d * .6); g.connect(f); out(f, .6, (j / Math.max(1, notes.length - 1) - .5) * .7);
      g.gain.setValueAtTime(0, at(t)); g.gain.linearRampToValueAtTime(v, at(t) + Math.min(2, d * .35)); g.gain.setValueAtTime(v, at(t) + d * .85); g.gain.exponentialRampToValueAtTime(.0001, at(t) + d + 1.4);
      for (const det of [-6, 5]) { const o = ac.createOscillator(); o.type = 'sawtooth'; o.frequency.value = hz(n); o.detune.value = det; o.connect(g); o.start(at(t)); o.stop(at(t) + d + 1.5); } });
  }
  // Harmony bed: D - Bm - G - A, one chord every 2.5 s, arpeggiated softly from the ink onward.
  const CH = [[50, 62, 66, 69], [47, 59, 62, 66], [43, 59, 62, 67], [45, 57, 61, 64]];
  for (let t = A1.ink, i = 0; t < 116.5; t += 2.5, i++) { const ch = CH[i % 4], quiet = t > 79 && t < 93 ? .5 : 1;
    piano(ch[0], t, 2.8, .07 * quiet, -.2); [1, 2, 3].forEach((k, j) => piano(ch[k] + (i % 8 >= 4 ? 12 : 0), t + .42 + j * .42, 1.8, .045 * quiet, (j - 1) * .3)); }
  // Act I: the pencil page, Dot, Kami, the tear, the ink, the first light, v3, the tow.
  noise(.3, 1.6, .02, 11, 4200, .8, 9); noise(1.5, 1.2, .018, 12, 3600, .8, 11); noise(2.6, 1.2, .02, 13, 3900, .8, 7);
  [[62, .4], [69, 1.4], [66, 2.4], [74, 3.4]].forEach(([n, t]) => piano(n, t, 2.6, .12));
  glide(3.6, .3, 400, 1100, .05); bell(86, 4.1, .05); tick(5.2, .05, 2400);
  [[81, 6.4], [86, 6.6]].forEach(([n, t]) => bell(n, t, .05)); piano(74, 6.5, 2, .09);
  [[66, 7.6], [71, 8.4], [69, 9.2], [62, 9.9]].forEach(([n, t]) => piano(n, t, 2.4, .1)); noise(7.4, 1.4, .016, 14, 4000, .8, 8);
  noise(A1.tear, 1.4, .09, 20, 1800, .4); noise(A1.tear + .1, .5, .05, 21, 5000, .8); thud(A1.land, .18);
  pad([50, 57, 62, 66], A1.ink, 4, .012);
  bell(93, A1.light, .07); bell(86, A1.light + .05, .05);
  const i0 = dayOf('2021-07-14'), i1 = dayOf('2021-09-10');
  for (let i = i0 + 1; i <= i1; i++) tick(A1.v3 + (i - i0) / (i1 - i0) * 3.5, .025 + Math.min(.05, DAYS[i][1] * .002), 1400 + (i - i0) * 8, .2);
  [62, 66, 69, 74].forEach((n, j) => piano(n, A1.v3 + 3.2 + j * .05, 2.6, .08)); bell(86, A1.v3 + 4.4, .06);
  glide(25, 1.2, 900, 300, .03, 'triangle'); noise(26.2, 1.8, .03, 25, 1200, .5, 3); pluck(74, 28.8, .1);
  // Act II: the revert, the brush of colour, moons arriving, the lamp and its work.
  glide(31, 1.2, 800, 200, .05, 'triangle'); thud(32.2, .16); [88, 91, 88, 91].forEach((n, i) => bell(n, 32.6 + i * .2, .025, i % 2 ? .4 : -.4)); glide(33.4, .9, 250, 900, .04); pluck(78, 34.4);
  noise(SEAMS.flat[0], 1.4, .05, 30, 900, .4); [62, 66, 69, 74, 78].forEach((n, i) => pluck(n, SEAMS.flat[0] + .2 + i * .1, .08, (i - 2) * .2));
  MOON_LIST.filter(m => m.t > 30).forEach((m, i) => { bell([86, 88, 90, 93][i % 4], m.t, .06, .3); pluck([74, 76, 78, 81][i % 4], m.t + .12, .08); });
  pad([62, 66, 69, 74], 49.6, 3, .014, 2200); bell(93, 50.2, .06); bell(98, 50.35, .04);
  [54.4, 55.8].forEach(t => { noise(t + 1.3, .35, .04, 40, 3000, .8); bell(90, t + 1.6, .04); });
  noise(59.8, 1, .03, 41, 4200, .8, 9); pluck(81, 61, .08);
  [0, 1, 2].forEach(i => pluck([74, 78, 81][i], 64.8 + i * .12, .08, (i - 1) * .4));
  [68.4, 69.2, 70.2].forEach(t => tick(t + .6, .05, 1800)); thud(70.5, .2); glide(71.1, .6, 700, 180, .04);
  [74, 74.2, 74.4].forEach(t => tick(t, .06, 1100));
  // Act III: the ink drop, the crane, the new core, the move home, the meteor shower.
  pad([38, 45, 50], SEAMS.chalk[0], 13, .02, 700); noise(SEAMS.chalk[0], 1.5, .05, 50, 500, .5);
  noise(86.4, 1, .04, 51, 2500, 2, 12); thud(87.4, .2); glide(87.4, 2, 300, 120, .03, 'triangle'); glide(90, 1.8, 120, 300, .03, 'triangle'); thud(91.8, .22);
  [50, 57, 62, 66, 69, 74].forEach((n, j) => piano(n, 92.6 + j * .04, 3, .08, (j - 2.5) * .15)); bell(93, 92.7, .07);
  glide(94.6, .5, 900, 300, .04, 'triangle'); tick(94.7, .08, 800); noise(95, 1.2, .03, 52, 4200, .8, 9); [74, 78, 81, 86].forEach((n, i) => pluck(n, 96.2 + i * .07, .08, (i - 1.5) * .2)); bell(90, 96.3, .06);
  Object.values(HOME_A).forEach((a, i) => tick(HOME_T + 1.4 + a * -.35, .06, 900 + i * 90));
  for (let k = 0; k < 93; k++) tick(METEOR_T + k / 93 * 3.6 + .55, .02 + .02 * hash(k, 3), 1800 + 1200 * hash(k, 4), hash(k, 5) - .5);
  // Act IV: the logo blue, the phone, the pull back, the signature, the closing card.
  [62, 66, 69, 74, 78, 81].forEach((n, i) => pluck(n, SEAMS.blue[0] + i * .08, .07, (i - 2.5) * .15));
  pad([50, 57, 62, 66, 69], 107, 6, .015, 2500);
  noise(SIG.t0, SIG.t1 - SIG.t0, .025, 60, 4000, .8, 10);
  [50, 57, 62, 66, 69, 74].forEach((n, j) => piano(n, 117.8 + j * .06, 4, .09, (j - 2.5) * .15)); pad([50, 57, 62, 66, 69], 117.8, 4, .016, 2600);
  bell(93, 118.8, .08); bell(98, 118.95, .05);
  [...'github.com/mx-space/core'].forEach((_, i, a) => tick(119.3 + i / a.length * 2, .035, 2200 + (i % 3) * 200, .2));
}
