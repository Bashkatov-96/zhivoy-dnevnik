/* Живой дневник изнутри — поведение презентации.
   Внешний файл, а не inline: CSP сервера (bot/web/server.py) пускает
   только script-src 'self'. */
(() => {
  "use strict";

  // Ссылка на бота с меткой tour — бот запомнит, что человек пришёл из презентации.
  const BOT_URL = "https://t.me/livebooks_bot?start=tour";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const smooth = reduce ? "auto" : "smooth";

  if (!BOT_URL.includes("BOT_USERNAME")) {
    $$("[data-bot]").forEach((a) => {
      a.href = BOT_URL;
      a.target = "_blank";
      a.rel = "noopener";
    });
  }

  /* ── Луна: фаза дорастает от новолуния (жест grow) ── */
  function moonPath(k) {
    k = Math.max(0, Math.min(1, k));
    const rx = (40 * Math.abs(1 - 2 * k)).toFixed(2);
    return `M44 4A40 40 0 0 1 44 84A${rx} 40 0 0 ${k > 0.5 ? 1 : 0} 44 4Z`;
  }
  $$(".moon-lit").forEach((p) => {
    const k = Number(p.dataset.k);
    if (reduce) { p.setAttribute("d", moonPath(k)); return; }
    const t0 = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / 900);
      p.setAttribute("d", moonPath(k * (1 - Math.pow(1 - t, 3))));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  /* ── Страница переодевается в цвет раздела ── */
  const root = document.documentElement;
  const pills = $$(".pill");
  const pillbar = $(".pills");
  const themeMeta = $('meta[name="theme-color"]');
  const colorIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const s = en.target;
      root.style.setProperty("--bg", s.dataset.bg);
      root.style.setProperty("--accent", s.dataset.accent);
      if (themeMeta) themeMeta.content = s.dataset.bg;
      pills.forEach((p) => {
        const on = p.getAttribute("href") === "#" + s.id;
        p.classList.toggle("on", on);
        if (on && pillbar) {
          const left = p.offsetLeft - pillbar.offsetLeft - pillbar.clientWidth / 2 + p.clientWidth / 2;
          pillbar.scrollTo({ left, behavior: smooth });
        }
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("[data-bg]").forEach((s) => colorIO.observe(s));

  document.addEventListener("click", (e) => {
    const j = e.target.closest("[data-jump]");
    if (!j) return;
    e.preventDefault();
    const t = $(j.dataset.jump);
    if (t) t.scrollIntoView({ behavior: smooth, block: "start" });
  });

  /* ── Общие элементы экранов ── */
  document.addEventListener("click", (e) => {
    const pick = e.target.closest("[data-pickgroup] [data-pick]");
    if (pick) {
      $$("[data-pick]", pick.closest("[data-pickgroup]")).forEach((b) => b.classList.toggle("sel", b === pick));
    }
    const chip = e.target.closest("[data-multi] .m-chip");
    if (chip) chip.classList.toggle("sel");
  });

  // Обложка: одна неделя — три взгляда
  const LENS = {
    emo: { h: [52, 70, 34, 52, 88, 70, 52], word: "ровно", mood: "#5B8DEF" },
    rec: { h: [40, 20, 60, 8, 40, 80, 20], word: "13 записей", mood: "#F0A93C" },
    sleep: { h: [62, 74, 42, 82, 56, 90, 72], word: "впритык", mood: "#A66BFF" },
  };
  $$("[data-lens]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".m-card");
      const data = LENS[btn.dataset.lens];
      $$("[data-lens]", card).forEach((b) => b.classList.toggle("sel", b === btn));
      $$("[data-bars] i", card).forEach((bar, i) => bar.style.setProperty("--h", data.h[i] + "%"));
      card.style.setProperty("--mood", data.mood);
      $("[data-lens-word]", card).textContent = data.word;
    });
  });

  // Эмоция: капля смешивает цвета выбранного, размер — сила
  const emoSec = $("#emo");
  if (emoSec) {
    const scr = $(".scr", emoSec);
    const chips = $$("[data-emo-chips] .m-chip", emoSec);
    let picked = chips.filter((c) => c.classList.contains("sel"));
    const rgb = (h) => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
    const mix = (list) => {
      if (!list.length) return "#C9D3E3";
      const sum = [0, 0, 0];
      list.forEach((c) => rgb(c.dataset.hex).forEach((v, i) => { sum[i] += v; }));
      return "#" + sum.map((v) => Math.round(v / list.length).toString(16).padStart(2, "0")).join("");
    };
    const paint = () => {
      chips.forEach((c) => c.classList.toggle("sel", picked.includes(c)));
      scr.style.setProperty("--drop", mix(picked));
      $("[data-emo-title]", emoSec).textContent = picked.length ? picked.map((c) => c.textContent).join(" · ") : "Без названия";
    };
    chips.forEach((c) => c.addEventListener("click", () => {
      if (picked.includes(c)) picked = picked.filter((x) => x !== c);
      else { picked.push(c); if (picked.length > 3) picked.shift(); }
      paint();
    }));
    $$("[data-volume] [data-pick]", emoSec).forEach((b) => b.addEventListener("click", () => {
      scr.style.setProperty("--drop-scale", String(0.75 + Number(b.dataset.v) * 0.1));
    }));
    scr.style.setProperty("--drop-scale", "1.05");
    paint();
  }

  /* ── Сценарии разделов ── */
  const HOOKS = {
    emo(ctx) {
      if (ctx.state !== 5) return;
      const w = $("[data-fall]", ctx.sec);
      w.classList.remove("fall");
      void w.offsetWidth;
      w.classList.add("fall");
    },
    thought(ctx) {
      if (ctx.state !== 1) return;
      const el = $("[data-seal-tick]", ctx.sec);
      const lines = ["Читаю запись…", "Ищу, с чем перекликается…", "Подбираю заголовок…"];
      let i = 0;
      el.textContent = lines[0];
      ctx.every(950, () => { i = Math.min(i + 1, lines.length - 1); el.textContent = lines[i]; });
      ctx.later(3000, ctx.next);
    },
    dreams(ctx) {
      if (ctx.state === 1) ctx.later(2400, ctx.next);
    },
    ach(ctx) {
      const pop = $("[data-pop]", ctx.sec);
      if (ctx.step === 0) { pop.classList.remove("on"); return; }
      const badge = ctx.extra || $(ctx.step === 1 ? ".badge.earned" : ".badge.locked", ctx.sec);
      const scr = $(".scr", ctx.sec);
      const sr = scr.getBoundingClientRect();
      const br = badge.getBoundingClientRect();
      const card = $(".pop-card", pop);
      card.style.setProperty("--ox", ((br.left + br.width / 2 - sr.left) / sr.width) * 100 + "%");
      card.style.setProperty("--oy", ((br.top + br.height / 2 - sr.top) / sr.height) * 100 + "%");
      const kind = ["earned", "progress", "locked"].find((k) => badge.classList.contains(k));
      card.classList.remove("earned", "progress", "locked");
      card.classList.add(kind);
      card.style.setProperty("--p", badge.style.getPropertyValue("--p") || "0%");
      $("[data-pop-title]", pop).textContent = badge.dataset.title;
      $("[data-pop-sub]", pop).textContent = badge.dataset.sub;
      pop.classList.remove("on");
      void pop.offsetWidth;
      pop.classList.add("on");
    },
  };

  const toSec = (t) => { const [m, s] = String(t || "0:00").split(":").map(Number); return m * 60 + s; };

  function initDemo(sec) {
    const scr = $(".scr", sec);
    const holder = $(".sec-phone", sec);
    const states = $$(":scope > .st", scr);
    const steps = $$("[data-steps] button", sec);
    if (!steps.length) return;

    // Плеер для узкого экрана: стрелки, точки и расшифровка шага
    const player = document.createElement("div");
    player.className = "player";
    player.innerHTML = '<button type="button" aria-label="Предыдущий шаг">‹</button><div class="pl-dots"></div><button type="button" aria-label="Следующий шаг">›</button>';
    const [prevBtn, nextBtn] = $$("button", player);
    const dots = $(".pl-dots", player);
    steps.forEach(() => dots.appendChild(document.createElement("i")));
    const cap = document.createElement("p");
    cap.className = "pl-cap";
    cap.setAttribute("aria-live", "polite");
    const hint = document.createElement("p");
    hint.className = "phone-hint";
    hint.textContent = "Экран живой — нажимай";
    holder.append(player, cap, hint);

    let cur = 0;
    let timers = [];
    let video = null;
    const clearTimers = () => { timers.forEach((t) => { clearTimeout(t); clearInterval(t); }); timers = []; };
    const videoOn = () => scr.classList.contains("has-video");

    function show(i, opts = {}) {
      i = Math.max(0, Math.min(steps.length - 1, i));
      cur = i;
      const b = steps[i];
      const state = b.dataset.state != null ? Number(b.dataset.state) : Math.min(i, states.length - 1);
      states.forEach((el, k) => el.classList.toggle("on", k === state));
      steps.forEach((el, k) => {
        el.classList.toggle("on", k === i);
        if (k === i) el.setAttribute("aria-current", "step"); else el.removeAttribute("aria-current");
      });
      $$("i", dots).forEach((d, k) => d.classList.toggle("on", k === i));
      prevBtn.disabled = i === 0;
      nextBtn.disabled = i === steps.length - 1;
      cap.innerHTML = `<span class="tc">${b.dataset.t}</span> ` + $(".st-text", b).innerHTML;

      $$(".hl", scr).forEach((el) => el.classList.remove("hl"));
      if (b.dataset.hl) { const el = $(`[data-hl-id="${b.dataset.hl}"]`, scr); if (el) el.classList.add("hl"); }

      clearTimers();
      if (video && videoOn()) {
        if (opts.seek !== false) { video.currentTime = toSec(b.dataset.t); video.play().catch(() => {}); }
        return;
      }
      const hook = HOOKS[sec.id];
      if (hook && opts.init !== true) {
        hook({
          sec, state, step: i, extra: opts.extra,
          next: () => show(cur + 1),
          later: (ms, fn) => timers.push(setTimeout(fn, ms)),
          every: (ms, fn) => timers.push(setInterval(fn, ms)),
        });
      }
    }

    steps.forEach((b, i) => b.addEventListener("click", () => show(i)));
    prevBtn.addEventListener("click", () => show(cur - 1));
    nextBtn.addEventListener("click", () => show(cur + 1));

    scr.addEventListener("click", (e) => {
      if (videoOn()) return;
      const badge = e.target.closest("[data-badge]");
      if (badge) { show(badge.classList.contains("earned") ? 1 : 2, { extra: badge }); return; }
      const opt = e.target.closest("[data-opt]");
      if (opt) {
        const r = opt.getBoundingClientRect();
        opt.style.setProperty("--rx", e.clientX - r.left + "px");
        opt.style.setProperty("--ry", e.clientY - r.top + "px");
        opt.classList.remove("ripple");
        void opt.offsetWidth;
        opt.classList.add("ripple");
        setTimeout(() => { opt.classList.remove("ripple"); show(cur + 1); }, 560);
        return;
      }
      if (e.target.closest("[data-next]")) { show(cur + 1); return; }
      const to = e.target.closest("[data-step]");
      if (to) { show(Number(to.dataset.step)); return; }
      if (e.target === $("[data-pop]", scr)) show(0);
    });

    // Видео: если файл есть — встаёт поверх макета, шаги перематывают его
    const src = holder.dataset.video;
    if (src) {
      const v = document.createElement("video");
      v.className = "vid";
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.setAttribute("playsinline", "");
      v.preload = "metadata";
      v.addEventListener("loadeddata", () => {
        video = v;
        scr.classList.add("has-video");
        const mode = document.createElement("button");
        mode.type = "button";
        mode.className = "mode";
        mode.textContent = "Показать живой макет";
        mode.addEventListener("click", () => {
          const on = !videoOn();
          scr.classList.toggle("has-video", on);
          mode.textContent = on ? "Показать живой макет" : "Показать видео";
          if (on) show(cur); else { v.pause(); show(cur); }
        });
        hint.replaceWith(mode);
        videoIO.observe(holder);
      }, { once: true });
      v.addEventListener("error", () => v.remove(), { once: true });
      v.addEventListener("timeupdate", () => {
        if (!videoOn()) return;
        let idx = 0;
        steps.forEach((b, k) => { if (toSec(b.dataset.t) <= v.currentTime + 0.05) idx = k; });
        if (idx !== cur) show(idx, { seek: false });
      });
      v.src = src;
      scr.appendChild(v);
    }

    show(0, { init: true, seek: false });
  }

  const videoIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      const v = $(".vid", en.target);
      if (!v || !$(".scr", en.target).classList.contains("has-video")) return;
      if (en.isIntersecting) v.play().catch(() => {}); else v.pause();
    });
  }, { threshold: 0.4 });

  $$("[data-demo]").forEach(initDemo);

  /* ── Финал: звёзды ── */
  const canvas = $("[data-stars]");
  if (canvas) {
    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      const ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);
      let seed = 7;
      const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
      const count = Math.round((w * h) / 5200);
      for (let i = 0; i < count; i++) {
        const r = rnd() < 0.08 ? 1.6 : 0.5 + rnd() * 0.8;
        ctx.globalAlpha = 0.25 + rnd() * 0.65;
        ctx.fillStyle = rnd() < 0.15 ? "#f7d9a0" : "#ffffff";
        ctx.beginPath();
        ctx.arc(rnd() * w, rnd() * h * 0.8, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    draw();
    let rt;
    window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(draw, 150); });
  }
})();
