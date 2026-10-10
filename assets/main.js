/* FLAMINGO TECH · 动态清爽版 V2 — 交互脚本
   V2 新增：开场动画时间轴 / 逐字入场 / 半调点阵画布 / 英雄区视差 */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;

  /* ══ 1. 标题逐字拆分 ══ */
  function splitChars(el) {
    var i = 0;
    el.querySelectorAll("*").forEach(function () {});
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split("").forEach(function (c) {
            var s = document.createElement("span");
            s.className = "ch";
            s.style.setProperty("--i", i++);
            s.innerHTML = c === " " ? "&nbsp;" : c;
            frag.appendChild(s);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) { walk(n); }
      });
    };
    walk(el);
  }
  document.querySelectorAll("[data-split]").forEach(splitChars);

  /* 章节序号映射到 CSS 变量 --d（控制淡入顺序） */
  document.querySelectorAll("[data-d]").forEach(function (el) {
    el.style.setProperty("--d", el.dataset.d);
  });

  /* ══ 2. 开场动画时间轴 ══ */
  var pre = document.getElementById("preload");
  var preNum = document.getElementById("preNum");
  var preBar = document.getElementById("preBar");
  var preNote = document.getElementById("preNote");
  var notes = ["LOADING ASSETS", "BUILDING GRID", "CALIBRATING TYPE", "READY"];

  function startIntro() {
    if (reduce || !pre) { document.body.classList.add("intro"); if (pre) pre.classList.add("gone"); return; }
    var t0 = performance.now(), dur = 1500, lastNote = -1;
    (function tick(now) {
      var p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 2.2), v = Math.round(e * 100);
      preNum.textContent = v < 10 ? "0" + v : v;
      preBar.style.width = (e * 100) + "%";
      var ni = Math.min(notes.length - 1, Math.floor(e * notes.length));
      if (ni !== lastNote) { preNote.textContent = notes[ni]; lastNote = ni; }
      if (p < 1) requestAnimationFrame(tick);
      else setTimeout(reveal, 260);
    })(t0);

    function reveal() {
      pre.classList.add("done");
      document.body.classList.add("intro");
      setTimeout(function () { pre.classList.add("gone"); startType(); }, 1250);
    }
  }
  window.addEventListener("load", startIntro);
  setTimeout(function () { if (!document.body.classList.contains("intro")) { document.body.classList.add("intro"); if (pre) pre.classList.add("gone"); startType(); } }, 4200);

  /* ══ 3. 打字机（开场后再启动） ══ */
  var typed = false;
  function startType() {
    if (typed) return; typed = true;
    document.querySelectorAll(".typewriter").forEach(function (el) {
      var txt = el.dataset.text || el.textContent;
      el.textContent = ""; var i = 0;
      (function type() {
        if (i <= txt.length) { el.textContent = txt.slice(0, i++); setTimeout(type, 46); }
      })();
    });
  }

  /* ══ 4. HUD：进度条 / 时间码 / 章节号 ══ */
  var nav = document.querySelector(".nav");
  var bar = document.getElementById("hudBar");
  var timeEl = document.getElementById("hudTime");
  var secEl = document.getElementById("hudSec");
  var tStart = performance.now();
  function pad(n, l) { return String(n).padStart(l || 2, "0"); }
  (function frame(now) {
    var s = Math.floor((now - tStart) / 1000);
    if (timeEl) timeEl.textContent = "00:" + pad(Math.floor(s / 60)) + ":" + pad(s % 60);
    var doc = document.documentElement;
    var p = doc.scrollTop / Math.max(1, doc.scrollHeight - doc.clientHeight);
    if (bar) bar.style.width = (p * 100).toFixed(1) + "%";
    if (nav) nav.classList.toggle("scrolled", doc.scrollTop > 40);
    var cur = "01";
    document.querySelectorAll("[data-sec]").forEach(function (sn) {
      if (sn.getBoundingClientRect().top < window.innerHeight * 0.5) cur = sn.dataset.sec;
    });
    if (secEl && cur !== secEl.textContent) secEl.textContent = cur;
    requestAnimationFrame(frame);
  })(tStart);

  /* ══ 5. 半调点阵画布（呼吸波 + 指针涟漪） ══ */
  (function () {
    var cv = document.getElementById("dots");
    if (!cv || reduce) return;
    var ctx = cv.getContext("2d"), dpr = Math.min(2, window.devicePixelRatio || 1);
    var gap = 34, pts = [], W = 0, H = 0, mx = -999, my = -999, t = 0;

    function build() {
      var r = cv.parentElement.getBoundingClientRect();
      W = r.width; H = r.height;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = [];
      for (var y = gap / 2; y < H; y += gap)
        for (var x = gap / 2; x < W; x += gap)
          pts.push({ x: x, y: y, p: Math.random() * 6.28 });
    }
    build();
    window.addEventListener("resize", build);
    window.addEventListener("mousemove", function (e) {
      var r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top;
    });
    document.addEventListener("mouseleave", function () { mx = my = -999; });

    (function loop() {
      t += 0.016;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        var wave = Math.sin(t * 1.1 + p.x * 0.012 + p.y * 0.009) * 0.5 + 0.5;
        var d = Math.hypot(p.x - mx, p.y - my);
        var ripple = d < 160 ? (1 - d / 160) : 0;
        var rad = 1.1 + wave * 1.5 + ripple * 4.2;
        var a = 0.14 + wave * 0.16 + ripple * 0.55;
        if (ripple > 0.25) { ctx.fillStyle = "rgba(255,69,23," + a.toFixed(3) + ")"; }
        else if (wave > 0.78) { ctx.fillStyle = "rgba(150,187,0," + a.toFixed(3) + ")"; }
        else { ctx.fillStyle = "rgba(13,13,13," + a.toFixed(3) + ")"; }
        ctx.beginPath(); ctx.arc(p.x, p.y, rad, 0, 6.2832); ctx.fill();
      }
      requestAnimationFrame(loop);
    })();
  })();

  /* ══ 6. 英雄区视差（滚动时分层上移） ══ */
  (function () {
    if (reduce) return;
    var hero = document.querySelector(".hero"); if (!hero) return;
    var layers = [
      { el: hero.querySelector(".type-band.tb-a"), s: 0.16 },
      { el: hero.querySelector(".type-band.tb-b"), s: -0.12 },
      { el: hero.querySelector(".shapes"), s: 0.22 },
      { el: hero.querySelector(".mesh"), s: 0.08 },
      { el: hero.querySelector(".seal"), s: 0.3 }
    ].filter(function (l) { return l.el; });
    var ticking = false;
    function onScroll() {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < window.innerHeight * 1.3) {
          layers.forEach(function (l) { l.el.style.marginTop = (y * l.s).toFixed(1) + "px"; });
        }
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
  })();

  /* ══ 7. 滚动显现 ══ */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach(function (el, i) {
    el.style.transitionDelay = (i % 4) * 70 + "ms";
    io.observe(el);
  });

  /* ══ 7b. 章节标题逐字入场（英雄区由开场动画单独驱动） ══ */
  var ioSplit = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("on"); ioSplit.unobserve(e.target); }
    });
  }, { threshold: 0.25 });
  document.querySelectorAll("[data-split]").forEach(function (el) {
    if (!el.closest(".hero")) ioSplit.observe(el);
  });

  /* ══ 7c. 幽灵巨字的轻微视差 ══ */
  (function () {
    if (reduce) return;
    var ghosts = Array.prototype.slice.call(document.querySelectorAll(".ghost"));
    if (!ghosts.length) return;
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () {
        ghosts.forEach(function (g) {
          var r = g.parentElement.getBoundingClientRect();
          var p = (window.innerHeight / 2 - (r.top + r.height / 2)) / window.innerHeight;
          g.style.transform = "translateX(" + (p * 60).toFixed(1) + "px)";
        });
        ticking = false;
      });
    }, { passive: true });
  })();

  /* ══ 8. 数字计数 ══ */
  var cio = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target, to = +el.dataset.to, dur = 1500, s0 = performance.now();
      (function tick(now) {
        var p = Math.min(1, (now - s0) / dur);
        el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      })(s0);
      cio.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll(".count").forEach(function (el) { cio.observe(el); });

  /* ══ 9. 卡片轻倾斜 ══ */
  if (window.matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      card.addEventListener("mousemove", function (ev) {
        var r = card.getBoundingClientRect();
        var x = (ev.clientX - r.left) / r.width - 0.5, y = (ev.clientY - r.top) / r.height - 0.5;
        card.style.transform = "perspective(700px) rotateX(" + (-y * 5) + "deg) rotateY(" + (x * 5) + "deg) translateY(-4px)";
      });
      card.addEventListener("mouseleave", function () { card.style.transform = ""; });
    });
  }
})();
