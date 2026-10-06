import React, { useState, useEffect, useMemo, useRef } from 'react'

const Style = ({ lightMode, fontSizeScale }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Cinzel:wght@500;700;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Pinyon+Script&family=JetBrains+Mono:wght@300;400;700&display=swap');

    :root { 
      --mx: 0; 
      --my: 0; 
      --font-scale: ${fontSizeScale || 1};
    }
    
    body { font-size: calc(1rem * var(--font-scale)); }

    html, body { scrollbar-width: none; -ms-overflow-style: none; }
    html::-webkit-scrollbar, body::-webkit-scrollbar { display: none; width: 0; height: 0; }
    * { scrollbar-width: none; -ms-overflow-style: none; }
    *::-webkit-scrollbar { display: none; width: 0; height: 0; }

    button, a, select, input[type="checkbox"], input[type="radio"], label[for], .cursor-pointer-forced {
      cursor: pointer !important;
    }

    .font-editorial-display { font-family: 'Cinzel Decorative', serif; }
    .font-editorial-title { font-family: 'Cinzel', serif; }
    .font-editorial-body { font-family: 'Cormorant Garamond', serif; }
    .font-editorial-script { font-family: 'Pinyon Script', cursive; }
    .font-editorial-mono { font-family: 'JetBrains Mono', monospace; }

    .global-grain-overlay {
      position: fixed; inset: 0; pointer-events: none; z-index: 999; opacity: 0.12;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    }

    .theme-dark {
      background-color: #0f0d0b;
      background-image: radial-gradient(circle at 20% 20%, rgba(40,32,24,.8) 0%, transparent 60%),
                        radial-gradient(circle at 80% 80%, rgba(20,16,12,.95) 0%, transparent 70%);
      color: #e5dec9;
    }
    .theme-dark .paper-card-inner { background: #dcd0ba; color: #1c140e; }
    .theme-dark .dark-panel { background: #1a1714; color: #e5dec9; }

    .theme-light {
      background-color: #f4ecdf;
      background-image: radial-gradient(circle at 20% 20%, rgba(220,205,180,.8) 0%, transparent 60%),
                        radial-gradient(circle at 80% 80%, rgba(200,185,160,.95) 0%, transparent 70%);
      color: #2b2118;
    }
    .theme-light .paper-card-inner { background: #faf4eb; color: #1c140e; border-color: #b5a289; }
    .theme-light .dark-panel { background: #efe4d0; color: #2b2118; border: 1px solid #c7b59b; }

    .dark-panel {
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,.07),
        inset 0 -2px 0 rgba(0,0,0,.5),
        inset 2px 0 0 rgba(255,255,255,.025),
        inset -2px 0 0 rgba(0,0,0,.3);
    }
    .theme-light .dark-panel {
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,.9),
        inset 0 -2px 0 rgba(120,95,60,.28),
        inset 2px 0 0 rgba(255,255,255,.5),
        inset -2px 0 0 rgba(120,95,60,.14);
    }

    .bg-crosshatch {
      background-image: repeating-linear-gradient(45deg, rgba(30,22,15,.05) 0, rgba(30,22,15,.05) 1px, transparent 0, transparent 6px),
                        repeating-linear-gradient(-45deg, rgba(30,22,15,.05) 0, rgba(30,22,15,.05) 1px, transparent 0, transparent 6px);
    }
    .bg-blueprint {
      background-image: linear-gradient(rgba(142,191,149,.12) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(142,191,149,.12) 1px, transparent 1px);
      background-size: 24px 24px;
      background-color: #0d1611;
      color: #e5dec9;
    }
    .theme-light .bg-blueprint {
      background-image: linear-gradient(rgba(30,70,40,.08) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(30,70,40,.08) 1px, transparent 1px);
      background-color: #e3ede6;
      color: #1c2b20;
    }
    .theme-dark .dark-panel.bg-blueprint {
      background-color: #0d1611;
      background-image: linear-gradient(rgba(142,191,149,.16) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(142,191,149,.16) 1px, transparent 1px),
                        radial-gradient(circle at 15% 10%, rgba(142,191,149,.10) 0%, transparent 55%);
      background-size: 24px 24px, 24px 24px, 100% 100%;
      color: #e5dec9;
    }
    .theme-light .dark-panel.bg-blueprint {
      background-color: #e3ede6;
      background-image: linear-gradient(rgba(30,70,40,.10) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(30,70,40,.10) 1px, transparent 1px),
                        radial-gradient(circle at 15% 10%, rgba(30,70,40,.06) 0%, transparent 55%);
      background-size: 24px 24px, 24px 24px, 100% 100%;
      color: #1c2b20;
    }

    .bg-ledger {
      background-image: repeating-linear-gradient(0deg, transparent 0, transparent 35px, rgba(122,34,20,.10) 35px, rgba(122,34,20,.10) 36px);
    }

    /* ================= 3D PAPER SYSTEM ================= */
    .paper-wrap {
      position: relative;
      rotate: var(--rot, 0deg);
      translate: calc(var(--mx) * var(--d, 0) * 1px) calc(var(--my) * var(--d, 0) * 1px);
      transform: perspective(1600px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
      transform-style: preserve-3d;
      filter: drop-shadow(0 26px 22px rgba(0,0,0,.5)) drop-shadow(0 6px 6px rgba(0,0,0,.35)) drop-shadow(0 1px 0 rgba(255,255,255,.04));
      transition:
        rotate .45s cubic-bezier(.3,1.5,.5,1),
        scale .45s cubic-bezier(.3,1.5,.5,1),
        translate .2s linear,
        transform .55s cubic-bezier(.25,1.2,.4,1),
        filter .35s ease;
      will-change: transform, filter;
    }
    .paper-wrap:hover {
      rotate: 0deg;
      scale: 1.02;
      filter: drop-shadow(0 34px 30px rgba(0,0,0,.55)) drop-shadow(0 10px 10px rgba(0,0,0,.4)) drop-shadow(0 1px 0 rgba(255,255,255,.06));
    }
    .paper-wrap.no-hover:hover { rotate: var(--rot, 0deg); scale: 1; }

    .paper-body {
      filter: url(#smooth-rough-edge);
      box-shadow:
        inset 0 0 35px rgba(100,75,45,.15),
        inset 0 1px 0 rgba(255,255,255,.55),
        inset 0 -2px 0 rgba(90,65,40,.18),
        inset 2px 0 0 rgba(255,255,255,.22),
        inset -2px 0 0 rgba(90,65,40,.12);
      transform-style: preserve-3d;
    }

    .paper-glare {
      position: absolute; inset: 0; pointer-events: none; z-index: 30;
      background: radial-gradient(circle at var(--gx, 50%) var(--gy, 50%),
        rgba(255,248,225,.42) 0%,
        rgba(255,244,210,.14) 22%,
        rgba(255,240,200,.03) 42%,
        transparent 62%);
      mix-blend-mode: soft-light;
      opacity: 0;
      transition: opacity .35s ease;
    }
    .paper-wrap:hover .paper-glare { opacity: 1; }

    .paper-shade {
      position: absolute; inset: 0; pointer-events: none; z-index: 29;
      background: linear-gradient(215deg, transparent 55%, rgba(0,0,0,.18) 100%);
      mix-blend-mode: multiply;
      opacity: 0;
      transition: opacity .35s ease;
    }
    .paper-wrap:hover .paper-shade { opacity: 1; }

    .shape-torn-deckle {
      clip-path: polygon(1% 1%,12% 0%,25% 2%,40% 0%,60% 1%,78% 0%,91% 2%,99% 0%,100% 15%,98% 30%,100% 50%,99% 70%,100% 88%,97% 98%,90% 100%,72% 98%,55% 100%,38% 98%,20% 100%,8% 97%,1% 99%,0% 85%,2% 65%,0% 45%,1% 25%,0% 10%);
    }
    .shape-ring-card {
      clip-path: polygon(5% 0%,95% 1%,100% 10%,98% 90%,92% 99%,50% 96%,10% 100%,2% 88%,0% 12%);
    }

    .shape-premium {
      clip-path: polygon(0% 0.4%, 0.3% 0%, 99.7% 0.2%, 100% 0.5%, 99.9% 99.5%, 99.6% 100%, 0.3% 99.8%, 0% 99.5%);
    }
    .shape-premium-soft {
      clip-path: polygon(0% 0.2%, 0.15% 0%, 99.85% 0.15%, 100% 0.3%, 99.95% 99.7%, 99.8% 100%, 0.15% 99.85%, 0% 99.7%);
    }

    .tape {
      position: absolute; top: -14px; left: 50%; width: 110px; height: 30px; z-index: 5;
      margin-left: -55px; rotate: var(--tr, -3deg);
      background: rgba(214,196,150,.65); backdrop-filter: blur(1px);
      box-shadow: 0 2px 3px rgba(0,0,0,.25);
      clip-path: polygon(0 0,4% 20%,0 40%,4% 60%,0 80%,3% 100%,100% 100%,96% 80%,100% 60%,96% 40%,100% 20%,97% 0);
    }
    .seal {
      position: absolute; top: -26px; right: -14px; width: 84px; height: 84px; z-index: 20; rotate: 12deg;
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      background: radial-gradient(circle at 35% 30%, #b33a26, #7a2214 55%, #4a1209);
      border: 2px solid #9e3322; color: #f5ebd6;
      box-shadow: 0 10px 14px rgba(0,0,0,.5), inset 0 0 14px rgba(0,0,0,.4);
      animation: seal-breathe 6s ease-in-out infinite;
    }
    .seal.stamped { animation: seal-thump .7s cubic-bezier(.3,1.6,.5,1); }
    .ember {
      position: absolute; top: 16px; right: 20px; width: 10px; height: 10px; border-radius: 50%; z-index: 5;
      background: #e06d53; box-shadow: 0 0 12px 4px rgba(224,109,83,.6); animation: ember 2.4s ease-in-out infinite;
    }
    .stamp {
      position: absolute; z-index: 10; right: 14px; bottom: 74px; rotate: -14deg; pointer-events: none;
      border: 3px double #3d4e41; color: #3d4e41; padding: 2px 12px; opacity: .9;
      font-family: 'Cinzel', serif; font-weight: 900; letter-spacing: .25em; font-size: 20px;
      animation: stamp-in .5s cubic-bezier(.2,1.8,.4,1) both;
    }
    .grow-line { height: 2px; background: currentColor; transform-origin: left; animation: grow 2.2s .6s cubic-bezier(.2,.8,.2,1) both; }

    .fg-layer { position: fixed; inset: 0; pointer-events: none; z-index: 50; overflow: hidden; }
    .fg-vignette { position: absolute; inset: 0; background: radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,.45) 100%); }
    .fg-beam {
      position: absolute; top: -30%; left: 15%; width: 60%; height: 180%; rotate: 28deg; mix-blend-mode: screen;
      background: linear-gradient(90deg, transparent, rgba(255,225,140,.045), rgba(255,240,190,.07), transparent);
      filter: blur(40px); animation: beam 12s ease-in-out infinite;
    }
    .fg-beam-2 {
      position: absolute; top: -20%; right: 10%; width: 50%; height: 160%; rotate: -22deg; mix-blend-mode: screen;
      background: linear-gradient(90deg, transparent, rgba(255,215,120,.035), transparent);
      filter: blur(50px); animation: beam 16s ease-in-out infinite reverse;
    }
    .fg-parallax { position: absolute; translate: calc(var(--mx) * var(--fd) * 1px) calc(var(--my) * var(--fd) * 1px); transition: translate .3s linear; }
    .fg-sway { transform-origin: var(--o); animation: sway var(--sd, 9s) ease-in-out infinite; }
    .dust { position: absolute; bottom: -20px; border-radius: 50%; background: rgba(255,235,170,.65); animation: dust-rise linear infinite; }
    .celestial-wheel {
      position: fixed; top: 50%; left: 50%; width: 900px; height: 900px; margin-top: -450px; margin-left: -450px;
      border-radius: 50%; border: 4px dashed rgba(142,191,149,0.38); pointer-events: none; z-index: 1;
      animation: wheel-spin 120s linear infinite; opacity: 0.45;
    }

    @keyframes watercolor-drift { 0%,100% { transform: translate(0,0) scale(1); opacity:.22 } 50% { transform: translate(20px,-15px) scale(1.06); opacity:.32 } }
    @keyframes wheel-spin { to { transform: rotate(360deg) } }
    @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
    @keyframes sway { 0%,100% { transform: rotate(-2.5deg) } 50% { transform: rotate(3deg) } }
    @keyframes dust-rise {
      0% { transform: translate(0,0); opacity: 0 } 10% { opacity: 1 } 50% { transform: translate(40px,-55vh) }
      90% { opacity: .8 } 100% { transform: translate(-30px,-115vh); opacity: 0 }
    }
    @keyframes beam { 0%,100% { opacity: .22; translate: -4% 0 } 50% { opacity: .42; translate: 6% 0 } }
    @keyframes ember { 0%,100% { opacity: .5; scale: .8 } 40% { opacity: 1; scale: 1.15 } 60% { opacity: .7; scale: .95 } }
    @keyframes seal-breathe { 0%,100% { scale: 1 } 50% { scale: 1.06 } }
    @keyframes seal-thump { 0% { scale: 1.9; opacity: .2 } 55% { scale: .85 } 100% { scale: 1; opacity: 1 } }
    @keyframes stamp-in { 0% { scale: 2.6; opacity: 0 } 100% { scale: 1; opacity: .85 } }
    @keyframes grow { from { transform: scaleX(0) } to { transform: scaleX(1) } }
    @keyframes bar-grow { from { transform: scaleY(0) } to { transform: scaleY(1) } }

    @keyframes rise {
      from { opacity: 0; transform: perspective(1200px) translateY(44px) rotateX(-7deg); filter: blur(4px); }
      to   { opacity: 1; transform: perspective(1200px) translateY(0) rotateX(0deg); filter: blur(0); }
    }

    .animate-watercolor-1 { animation: watercolor-drift 20s ease-in-out infinite; }
    .animate-watercolor-2 { animation: watercolor-drift 26s ease-in-out infinite reverse; }
    .px-bg { translate: calc(var(--mx) * -14px) calc(var(--my) * -14px); transition: translate .4s linear; }
    .rise { animation: rise .9s cubic-bezier(.2,.8,.2,1) both; animation-delay: var(--dl, 0s); }
    .bar-anim { transform-origin: bottom; animation: bar-grow .9s cubic-bezier(.2,.8,.2,1) both; }

    .tab-btn {
      position: relative;
      clip-path: polygon(1% 3%, 8% 0%, 18% 3%, 30% 1%, 42% 4%, 55% 0%, 68% 3%, 80% 1%, 92% 4%, 99% 2%, 100% 15%, 98% 30%, 100% 50%, 99% 70%, 100% 88%, 98% 98%, 88% 100%, 75% 97%, 60% 100%, 45% 98%, 30% 100%, 15% 97%, 5% 100%, 0% 88%, 2% 70%, 0% 50%, 1% 30%, 0% 15%);
      padding: 13px 24px;
      font-family: 'Cinzel', serif;
      font-weight: 700;
      font-size: 11px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #7d6c56;
      background: rgba(18, 15, 13, 0.88);
      border: none;
      cursor: pointer;
      isolation: isolate;
      filter:
        drop-shadow(0 4px 0 rgba(0,0,0,.55))
        drop-shadow(0 8px 12px rgba(0,0,0,.42))
        drop-shadow(0 1px 0 rgba(255,255,255,.05));
      transition: filter .25s ease, transform .3s cubic-bezier(.3,1.2,.5,1), color .3s, background .3s;
    }
    .theme-light .tab-btn {
      color: #7a6852;
      background: rgba(200, 188, 168, 0.7);
      filter:
        drop-shadow(0 4px 0 rgba(140,115,80,.55))
        drop-shadow(0 8px 12px rgba(90,70,45,.28));
    }
    .tab-btn::after {
      content: '';
      position: absolute;
      inset: 0;
      clip-path: inherit;
      background: linear-gradient(135deg, transparent 0%, rgba(142,191,149,0.08) 50%, transparent 100%);
      opacity: 0;
      transition: opacity .3s ease;
      pointer-events: none;
    }
    .tab-btn:hover {
      color: #e5dec9;
      background: linear-gradient(135deg, #2a2419 0%, #3d4e41 50%, #2a2419 100%);
      transform: translateY(-3px) scale(1.02);
      filter:
        drop-shadow(0 7px 0 rgba(0,0,0,.55))
        drop-shadow(0 14px 20px rgba(0,0,0,.5));
    }
    .theme-light .tab-btn:hover {
      color: #1c140e;
      background: linear-gradient(135deg, #d5c4a8 0%, #e3ede6 50%, #d5c4a8 100%);
      filter:
        drop-shadow(0 7px 0 rgba(140,115,80,.55))
        drop-shadow(0 14px 20px rgba(90,70,45,.3));
    }
    .tab-btn:hover::after { opacity: 1; }
    .tab-btn.active {
      color: #f5ebd6;
      background: linear-gradient(135deg, #2f3d32 0%, #5c7a5e 50%, #2f3d32 100%);
      transform: translateY(-4px) scale(1.05);
      text-shadow: 0 1px 0 rgba(0,0,0,.5), 0 0 10px rgba(142, 191, 149, 0.6);
      animation: tab-glow 3s ease-in-out infinite;
    }
    .tab-btn.active::after {
      opacity: 1;
      background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.14) 50%, transparent 100%);
    }
    .tab-btn:active {
      transform: translateY(2px) scale(.99);
      filter: drop-shadow(0 1px 0 rgba(0,0,0,.55)) drop-shadow(0 3px 6px rgba(0,0,0,.4));
    }

    @keyframes tab-glow {
      0%,100% {
        filter:
          drop-shadow(0 6px 0 rgba(0,0,0,.55))
          drop-shadow(0 12px 16px rgba(0,0,0,.5))
          drop-shadow(0 0 10px rgba(142,191,149,.35));
      }
      50% {
        filter:
          drop-shadow(0 6px 0 rgba(0,0,0,.55))
          drop-shadow(0 14px 20px rgba(0,0,0,.5))
          drop-shadow(0 0 22px rgba(142,191,149,.7));
      }
    }

    .btn-3d {
      position: relative;
      transition: transform .14s cubic-bezier(.3,1.4,.5,1), filter .2s ease;
      filter:
        drop-shadow(0 5px 0 rgba(0,0,0,.55))
        drop-shadow(0 10px 14px rgba(0,0,0,.42))
        drop-shadow(0 0 0 rgba(142,191,149,0));
      will-change: transform, filter;
    }
    .btn-3d:hover {
      transform: translateY(-2px);
      filter:
        drop-shadow(0 7px 0 rgba(0,0,0,.55))
        drop-shadow(0 15px 22px rgba(0,0,0,.5))
        drop-shadow(0 0 14px rgba(142,191,149,.28));
    }
    .btn-3d:active {
      transform: translateY(4px);
      filter:
        drop-shadow(0 1px 0 rgba(0,0,0,.55))
        drop-shadow(0 3px 6px rgba(0,0,0,.35));
    }

    .input-ink {
      background: transparent; border: none; border-bottom: 2px dashed #7a6a58; color: inherit; transition: all .3s ease;
      text-shadow: 0 1px 0 rgba(255,255,255,.06);
    }
    .input-ink:focus { outline: none; border-bottom-style: solid; border-bottom-color: #7a2214; background: rgba(122,34,20,.05); padding-left: 8px; }

    .emboss-text {
      text-shadow: 0 1px 0 rgba(255,255,255,.06), 0 -1px 1px rgba(0,0,0,.5);
    }
    .theme-light .emboss-text {
      text-shadow: 0 1px 0 rgba(255,255,255,.85), 0 -1px 1px rgba(120,95,60,.28);
    }

    .frame-3d-inset {
      box-shadow:
        inset 0 0 60px rgba(0,0,0,.7),
        inset 0 2px 0 rgba(255,255,255,.08),
        inset 0 -3px 0 rgba(0,0,0,.6),
        inset 3px 0 0 rgba(0,0,0,.4),
        inset -3px 0 0 rgba(0,0,0,.4);
    }

    .debtor-scroll::-webkit-scrollbar { width: 4px; display: block; }
    .debtor-scroll::-webkit-scrollbar-thumb { background: rgba(122,34,20,.35); border-radius: 4px; }

    /* ================= 3D HERO IMAGE (CALENDAR) ================= */
    .hero-3d-scene {
      perspective: 1400px;
      perspective-origin: 50% 50%;
    }
    .hero-3d-card {
      transform-style: preserve-3d;
      transform:
        rotateX(var(--hx, 0deg))
        rotateY(var(--hy, 0deg))
        translateZ(0);
      transition: transform .35s cubic-bezier(.25,1,.4,1), box-shadow .35s ease;
      will-change: transform;
      box-shadow:
        0 40px 60px -20px rgba(0,0,0,.65),
        0 20px 40px -10px rgba(0,0,0,.5),
        0 8px 16px rgba(0,0,0,.4),
        0 0 0 1px rgba(142,191,149,.15);
    }
    .hero-3d-card:hover {
      box-shadow:
        0 60px 90px -20px rgba(0,0,0,.75),
        0 30px 55px -10px rgba(0,0,0,.6),
        0 12px 24px rgba(0,0,0,.5),
        0 0 0 1px rgba(142,191,149,.35),
        0 0 40px rgba(142,191,149,.18);
    }
    .hero-3d-card img {
      transform: translateZ(30px) scale(1.03);
      transition: transform .4s cubic-bezier(.25,1,.4,1);
    }
    .hero-3d-card:hover img {
      transform: translateZ(60px) scale(1.06);
    }
    /* floating hint badge */
    .hero-hint {
      position: absolute; bottom: 14px; left: 14px; z-index: 30;
      display: inline-flex; align-items: center; gap: 8px;
      padding: 8px 14px; border-radius: 999px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px; letter-spacing: .2em; text-transform: uppercase;
      color: #f5ebd6;
      background: linear-gradient(135deg, rgba(26,23,20,.85), rgba(15,13,11,.95));
      border: 1px solid rgba(142,191,149,.5);
      box-shadow: 0 8px 20px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.08);
      animation: hint-pulse 3s ease-in-out infinite;
      pointer-events: none;
    }
    .hero-hint::before {
      content: '⤢';
      font-size: 14px; color: #8ebf95;
    }
    @keyframes hint-pulse {
      0%,100% { transform: translateY(0); opacity: .85; }
      50% { transform: translateY(-3px); opacity: 1; }
    }

    /* ================= LIGHTBOX ================= */
    .lightbox-backdrop {
      position: fixed; inset: 0; z-index: 500;
      display: flex; align-items: center; justify-content: center;
      padding: 24px;
      background: radial-gradient(ellipse at center, rgba(15,13,11,.85) 0%, rgba(5,4,3,.96) 100%);
      backdrop-filter: blur(14px) saturate(1.1);
      animation: lb-fade .35s ease both;
    }
    @keyframes lb-fade { from { opacity: 0 } to { opacity: 1 } }

    .lightbox-stage {
      perspective: 1800px;
      width: min(94vw, 1400px);
      height: min(88vh, 900px);
      display: flex; align-items: center; justify-content: center;
      animation: lb-pop .55s cubic-bezier(.2,1.3,.4,1) both;
    }
    @keyframes lb-pop {
      from { transform: scale(.72) rotateX(12deg); opacity: 0; filter: blur(6px); }
      to   { transform: scale(1) rotateX(0); opacity: 1; filter: blur(0); }
    }
    .lightbox-card {
      position: relative;
      width: 100%; height: 100%;
      transform-style: preserve-3d;
      transform: rotateX(var(--hx, 0deg)) rotateY(var(--hy, 0deg));
      transition: transform .35s cubic-bezier(.25,1,.4,1), box-shadow .35s ease;
      border-radius: 6px;
      overflow: hidden;
      border: 2px solid rgba(142,191,149,.35);
      box-shadow:
        0 0 0 1px rgba(0,0,0,.5),
        0 40px 90px -10px rgba(0,0,0,.85),
        0 20px 50px -10px rgba(0,0,0,.7),
        0 0 90px rgba(142,191,149,.18);
    }
    .lightbox-card img {
      width: 100%; height: 100%;
      object-fit: contain;
      background: #0f0d0b;
      transform: translateZ(40px);
    }
    .lightbox-close {
      position: absolute; top: 20px; right: 20px; z-index: 20;
      width: 48px; height: 48px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #b33a26, #7a2214);
      color: #f5ebd6; font-family: 'Cinzel', serif; font-weight: 900; font-size: 20px;
      border: 2px solid rgba(245,235,214,.4);
      box-shadow: 0 10px 24px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.25);
      cursor: pointer;
      transition: transform .2s ease, filter .2s ease;
    }
    .lightbox-close:hover { transform: scale(1.1) rotate(90deg); filter: brightness(1.15); }
    .lightbox-label {
      position: absolute; left: 24px; bottom: 20px; z-index: 20;
      padding: 10px 18px; border-radius: 4px;
      font-family: 'Cinzel', serif; font-size: 12px; letter-spacing: .3em;
      text-transform: uppercase; color: #f5ebd6;
      background: linear-gradient(135deg, rgba(26,23,20,.9), rgba(15,13,11,.95));
      border: 1px solid rgba(142,191,149,.4);
      box-shadow: 0 8px 20px rgba(0,0,0,.6);
    }
    .lightbox-label span {
      font-family: 'Pinyon Script', cursive;
      font-size: 20px; letter-spacing: 0; color: #8ebf95;
      margin-right: 8px; text-transform: none;
    }
  `}</style>
)

const IMAGE_PACKS = [
  {
    id: 'nature_1',
    name: '🌲 Nature Pack 1',
    description: 'Florestas & Lagos (12 Meses)',
    images: [
      'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/1271605/pexels-photo-1271605.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/158063/pexels-photo-158063.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/33041/pexels-photo-33041.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/34950/pexels-photo-34950.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/35537/pexels-photo-35537.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/15286/pexels-photo-15286.jpeg?auto=compress&cs=tinysrgb&w=1600'
    ]
  },
  {
    id: 'nature_2',
    name: '🏞️ Nature Pack 2',
    description: 'Montanhas & Rios (12 Meses)',
    images: [
      'https://images.pexels.com/photos/147411/pexels-photo-147411.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/167132/pexels-photo-167132.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/1146700/pexels-photo-1146700.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/158251/pexels-photo-158251.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/40784/pexels-photo-40784.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/56866/pexels-photo-56866.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/147411/pexels-photo-147411.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/167698/pexels-photo-167698.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/167701/pexels-photo-167701.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/167704/pexels-photo-167704.jpeg?auto=compress&cs=tinysrgb&w=1600'
    ]
  }
]

const playSound = (type = 'click', isMuted = false) => {
  if (isMuted) return
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()

    if (type === 'click') {
      const osc = ctx.createOscillator(); const gain = ctx.createGain()
      osc.type = 'sine'; osc.frequency.setValueAtTime(520, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.04)
      gain.gain.setValueAtTime(0.12, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04)
      osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 0.05)
    } else if (type === 'paper') {
      const bufferSize = ctx.sampleRate * 0.08
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1
      const noise = ctx.createBufferSource(); noise.buffer = buffer
      const filter = ctx.createBiquadFilter(); filter.type = 'bandpass'
      filter.frequency.setValueAtTime(1200, ctx.currentTime); filter.Q.setValueAtTime(1.5, ctx.currentTime)
      const gain = ctx.createGain(); gain.gain.setValueAtTime(0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
      noise.connect(filter); filter.connect(gain); gain.connect(ctx.destination); noise.start()
    } else if (type === 'stamp') {
      const osc = ctx.createOscillator(); const gain = ctx.createGain()
      osc.type = 'triangle'; osc.frequency.setValueAtTime(160, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15)
      gain.gain.setValueAtTime(0.3, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
      osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 0.16)
    } else if (type === 'chime') {
      const freqs = [523.25, 659.25, 783.99]
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator(); const gain = ctx.createGain()
        osc.type = 'sine'; osc.frequency.setValueAtTime(f, ctx.currentTime + idx * 0.04)
        gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.04)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35 + idx * 0.04)
        osc.connect(gain); gain.connect(ctx.destination)
        osc.start(ctx.currentTime + idx * 0.04); osc.stop(ctx.currentTime + 0.4 + idx * 0.04)
      })
    } else if (type === 'whoosh') {
      const bufferSize = ctx.sampleRate * 0.5
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
      const noise = ctx.createBufferSource(); noise.buffer = buffer
      const filter = ctx.createBiquadFilter(); filter.type = 'lowpass'
      filter.frequency.setValueAtTime(300, ctx.currentTime)
      filter.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.25)
      filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.5)
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.001, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.15)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
      noise.connect(filter); filter.connect(gain); gain.connect(ctx.destination); noise.start()
    }
  } catch (e) {}
}

const Paper = ({ rot = 0, depth = 0, className = '', body = '', front, style, children, stack = 0, tilt = true }) => {
  const wrapRef = useRef(null)

  const handleMove = (e) => {
    if (!tilt) return
    const el = wrapRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--rx', `${(-py * 8).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${(px * 10).toFixed(2)}deg`)
    el.style.setProperty('--gx', `${((px + 0.5) * 100).toFixed(1)}%`)
    el.style.setProperty('--gy', `${((py + 0.5) * 100).toFixed(1)}%`)
  }
  const handleLeave = () => {
    const el = wrapRef.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  return (
    <div
      ref={wrapRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`paper-wrap ${className}`}
      style={{ '--rot': `${rot}deg`, '--d': depth, ...style }}
    >
      {stack > 0 && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {stack >= 3 && (
            <div className="absolute inset-0" style={{
              transform: 'translate(20px, 22px) rotate(2.4deg)',
              background: 'linear-gradient(135deg, #7a6748 0%, #a89878 100%)',
              borderRadius: '3px',
              boxShadow: '0 18px 34px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.15)'
            }} />
          )}
          {stack >= 2 && (
            <div className="absolute inset-0" style={{
              transform: 'translate(-10px, 14px) rotate(-1.6deg)',
              background: 'linear-gradient(135deg, #a89878 0%, #b8a888 100%)',
              borderRadius: '3px',
              boxShadow: '0 14px 24px rgba(0,0,0,.42), inset 0 1px 0 rgba(255,255,255,.18)'
            }} />
          )}
          <div className="absolute inset-0" style={{
            transform: 'translate(7px, 9px) rotate(0.6deg)',
            background: 'linear-gradient(135deg, #c1b394 0%, #c9bca0 100%)',
            borderRadius: '3px',
            boxShadow: '0 9px 18px rgba(0,0,0,.32), inset 0 1px 0 rgba(255,255,255,.22)'
          }} />
        </div>
      )}
      {front}
      <div className={`paper-body relative z-10 ${body}`}>
        {children}
        <div className="paper-shade" aria-hidden="true" />
        <div className="paper-glare" aria-hidden="true" />
      </div>
    </div>
  )
}

const SectionHeader = ({ n, title }) => (
  <div className="flex items-center gap-4 rise cursor-pointer-forced">
    <span className="font-editorial-script text-4xl text-[#8ebf95]" style={{ textShadow: '0 2px 0 rgba(0,0,0,.35), 0 0 18px rgba(142,191,149,.35)' }}>{n}</span>
    <h2 className="font-editorial-title text-sm tracking-[0.4em] text-[#8ebf95] uppercase emboss-text">{title}</h2>
    <div className="h-px flex-1 bg-gradient-to-r from-[#8ebf95]/40 to-transparent" />
  </div>
)

const Field = ({ label, className = '', children }) => (
  <div className={className}>
    <label className="block font-editorial-title text-xs font-bold uppercase tracking-wider text-[#524436] dark:text-[#c4b5a2] mb-1">{label}</label>
    {children}
  </div>
)

const INK = 'w-full py-2 font-bold text-lg input-ink cursor-pointer-forced'

function useCountUp(target, ms = 1000) {
  const [v, setV] = useState(0)
  const from = useRef(0)
  useEffect(() => {
    const start = performance.now(), a = from.current
    let raf
    const tick = (t) => {
      const p = Math.min((t - start) / ms, 1)
      const val = a + (target - a) * (1 - Math.pow(1 - p, 3))
      setV(val); from.current = val
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, ms])
  return v
}

const LEAVES = [[60,250,-50,1.2],[110,190,-30,1.3],[170,130,-70,1.1],[220,80,-20,1.2],[150,200,10,1],[90,120,-95,1.1],[240,150,-10,0.9],[30,80,-40,1.4]]
const Branch = ({ flip }) => (
  <svg viewBox="0 0 320 320" className="w-full h-full" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
    <path d="M10,310 C90,230 160,150 260,40" stroke="#0a0807" strokeWidth="6" fill="none" />
    {LEAVES.map(([x, y, r, s], i) => (
      <g key={i} transform={`translate(${x},${y}) rotate(${r}) scale(${s})`}>
        <path d="M0,0 C20,-34 70,-34 96,0 C70,34 20,34 0,0Z" fill="#0a0807" />
      </g>
    ))}
  </svg>
)

const Foreground = () => {
  const dust = useMemo(
    () => Array.from({ length: 24 }, () => ({
      l: Math.random() * 100, s: 2 + Math.random() * 6, d: 14 + Math.random() * 16,
      dl: -Math.random() * 30, b: Math.random() > 0.5 ? 3 : 0.5,
    })), [])
  return (
    <div className="fg-layer">
      <div className="celestial-wheel flex items-center justify-center">
        <div className="w-[700px] h-[700px] rounded-full border-[3px] border-dashed border-[#8ebf95]/35 flex items-center justify-center">
          <div className="w-[500px] h-[500px] rounded-full border-2 border-[#8ebf95]/25" />
        </div>
      </div>
      <div className="fg-beam" />
      <div className="fg-beam-2" />
      {dust.map((p, i) => (
        <span key={i} className="dust" style={{ left: `${p.l}%`, width: p.s, height: p.s, filter: `blur(${p.b}px)`, animationDuration: `${p.d}s`, animationDelay: `${p.dl}s` }} />
      ))}
      <div className="fg-parallax" style={{ '--fd': 45, left: -90, bottom: -80, width: 440, height: 440 }}>
        <div className="fg-sway w-full h-full" style={{ '--o': '10% 95%', filter: 'blur(4px)', opacity: 0.9 }}><Branch /></div>
      </div>
      <div className="fg-parallax" style={{ '--fd': 30, right: -110, top: -90, width: 380, height: 380, rotate: '180deg' }}>
        <div className="fg-sway w-full h-full" style={{ '--o': '10% 95%', '--sd': '11s', filter: 'blur(6px)', opacity: 0.8 }}><Branch flip /></div>
      </div>
      <div className="fg-vignette" />
    </div>
  )
}

/* ---------- Reusable 3D tilt handlers ---------- */
const makeTiltHandlers = (ref, maxX = 10, maxY = 14) => ({
  onMouseMove: (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--hx', `${(-py * maxX).toFixed(2)}deg`)
    el.style.setProperty('--hy', `${(px * maxY).toFixed(2)}deg`)
  },
  onMouseLeave: () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--hx', '0deg')
    el.style.setProperty('--hy', '0deg')
  }
})

export default function App() {
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem('rental_properties_v5')
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Chalé Serra Azul', address: 'Florianópolis, SC', defaultDaily: 350, amenities: 'Lareira, Vista para Serra, Varanda', specs: '4 por 5 metros, 2 andares' },
      { id: '2', name: 'Chalé Pinheiro Bravo', address: 'Florianópolis, SC', defaultDaily: 320, amenities: 'Deck privativo, Fogão a lenha, Banheira', specs: '4 por 5 metros, 2 andares' }
    ]
  })

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('rental_bookings_v5')
    return saved ? JSON.parse(saved) : [
      { id: '103', propertyId: '1', guestName: 'Ana Paula', guestDoc: 'CPF 111.222.333-44', guestPhone: '+55 (48) 98888-1111', checkIn: '2026-03-05', checkOut: '2026-03-10', totalAmount: 1500, depositAmount: 300, depositPaid: true, balancePaid: true },
      { id: '104', propertyId: '2', guestName: 'Carlos Eduardo', guestDoc: 'RG 2.345.678-9', guestPhone: '+55 (48) 97777-2222', checkIn: '2026-04-15', checkOut: '2026-04-20', totalAmount: 1800, depositAmount: 400, depositPaid: true, balancePaid: false },
      { id: '105', propertyId: '1', guestName: 'Fernanda Lima', guestDoc: 'CPF 222.333.444-55', guestPhone: '+55 (48) 96666-3333', checkIn: '2026-04-22', checkOut: '2026-04-25', totalAmount: 900, depositAmount: 200, depositPaid: false, balancePaid: false },
      { id: '106', propertyId: '2', guestName: 'Roberto Alves', guestDoc: 'RG 3.456.789-0', guestPhone: '+55 (48) 95555-4444', checkIn: '2026-05-01', checkOut: '2026-05-07', totalAmount: 2200, depositAmount: 600, depositPaid: true, balancePaid: true },
      { id: '107', propertyId: '1', guestName: 'Juliana Castro', guestDoc: 'CPF 333.444.555-66', guestPhone: '+55 (48) 94444-5555', checkIn: '2026-05-18', checkOut: '2026-05-22', totalAmount: 1400, depositAmount: 300, depositPaid: true, balancePaid: false },
      { id: '101', propertyId: '1', guestName: 'Gabriel Siqueira', guestDoc: 'RG 4.123.890-SP', guestPhone: '+55 (48) 99881-2233', checkIn: '2026-06-10', checkOut: '2026-06-15', totalAmount: 1750, depositAmount: 500, depositPaid: true, balancePaid: false },
      { id: '102', propertyId: '2', guestName: 'Mariana Costa', guestDoc: 'CPF 321.456.789-00', guestPhone: '+55 (48) 99112-4455', checkIn: '2026-06-12', checkOut: '2026-06-18', totalAmount: 1920, depositAmount: 600, depositPaid: true, balancePaid: true },
      { id: '108', propertyId: '1', guestName: 'Marcos Paulo', guestDoc: 'RG 5.678.901-2', guestPhone: '+55 (48) 93333-6666', checkIn: '2026-07-10', checkOut: '2026-07-15', totalAmount: 1750, depositAmount: 500, depositPaid: false, balancePaid: false },
      { id: '109', propertyId: '2', guestName: 'Beatriz Souza', guestDoc: 'CPF 444.555.666-77', guestPhone: '+55 (48) 92222-7777', checkIn: '2026-07-20', checkOut: '2026-07-25', totalAmount: 1600, depositAmount: 400, depositPaid: true, balancePaid: true },
      { id: '110', propertyId: '2', guestName: 'Thiago Martins', guestDoc: 'RG 6.789.012-3', guestPhone: '+55 (48) 91111-8888', checkIn: '2026-08-05', checkOut: '2026-08-12', totalAmount: 2100, depositAmount: 500, depositPaid: true, balancePaid: false },
      { id: '111', propertyId: '1', guestName: 'Ricardo Souza', guestDoc: 'RG 7.890.123-4', guestPhone: '+55 (48) 98877-6655', checkIn: '2026-10-08', checkOut: '2026-10-12', totalAmount: 1500, depositAmount: 400, depositPaid: true, balancePaid: false },
      { id: '112', propertyId: '2', guestName: 'Patrícia Nogueira', guestDoc: 'CPF 555.666.777-88', guestPhone: '+55 (48) 97766-5544', checkIn: '2026-10-15', checkOut: '2026-10-20', totalAmount: 1900, depositAmount: 500, depositPaid: false, balancePaid: false },
      { id: '113', propertyId: '1', guestName: 'Eduardo Ramos', guestDoc: 'RG 8.901.234-5', guestPhone: '+55 (48) 96655-4433', checkIn: '2026-10-22', checkOut: '2026-10-25', totalAmount: 1050, depositAmount: 300, depositPaid: true, balancePaid: true }
    ]
  })

  const [activeTab, setActiveTab] = useState('dashboard')

  const [lightMode, setLightMode] = useState(() => localStorage.getItem('rental_lightmode') === 'true')
  const [soundMuted, setSoundMuted] = useState(() => localStorage.getItem('rental_sound_muted') === 'true')
  const [fontSizeScale, setFontSizeScale] = useState(() => parseFloat(localStorage.getItem('rental_fontscale') || '1'))
  const [ownerName, setOwnerName] = useState(() => localStorage.getItem('rental_owner') || 'Sr. Carlos Siqueira')
  const [selectedPackId, setSelectedPackId] = useState(() => localStorage.getItem('rental_pack_id') || 'nature_1')
  const [layoutMode, setLayoutMode] = useState(() => localStorage.getItem('rental_layout_mode') || 'compact')

  const [editingBooking, setEditingBooking] = useState(null)
  const [editingProperty, setEditingProperty] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)
  const [conflictWarning, setConflictWarning] = useState(null)

  const [newPropName, setNewPropName] = useState('')
  const [newPropAddress, setNewPropAddress] = useState('')
  const [newPropDaily, setNewPropDaily] = useState('')
  const [newPropAmenities, setNewPropAmenities] = useState('')
  const [newPropSpecs, setNewPropSpecs] = useState('4 por 5 metros, 2 andares')

  const [selectedProp, setSelectedProp] = useState(properties[0]?.id || '')
  const [guestName, setGuestName] = useState('')
  const [guestDoc, setGuestDoc] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [totalAmount, setTotalAmount] = useState('')
  const [depositAmount, setDepositAmount] = useState('')
  const [stamped, setStamped] = useState(false)

  const [filterQuery, setFilterQuery] = useState('')
  const [filterProp, setFilterProp] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  // Calendar lightbox
  const [expandedImage, setExpandedImage] = useState(null)

  useEffect(() => { localStorage.setItem('rental_properties_v5', JSON.stringify(properties)) }, [properties])
  useEffect(() => { localStorage.setItem('rental_bookings_v5', JSON.stringify(bookings)) }, [bookings])
  useEffect(() => { localStorage.setItem('rental_lightmode', lightMode) }, [lightMode])
  useEffect(() => { localStorage.setItem('rental_sound_muted', soundMuted) }, [soundMuted])
  useEffect(() => { localStorage.setItem('rental_fontscale', fontSizeScale) }, [fontSizeScale])
  useEffect(() => { localStorage.setItem('rental_owner', ownerName) }, [ownerName])
  useEffect(() => { localStorage.setItem('rental_pack_id', selectedPackId) }, [selectedPackId])
  useEffect(() => { localStorage.setItem('rental_layout_mode', layoutMode) }, [layoutMode])

  useEffect(() => {
    const move = (e) => {
      const s = document.documentElement.style
      s.setProperty('--mx', (e.clientX / window.innerWidth - 0.5) * 2)
      s.setProperty('--my', (e.clientY / window.innerHeight - 0.5) * 2)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  // Esc closes the lightbox
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setExpandedImage(null) }
    if (expandedImage) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [expandedImage])

  const triggerSound = (type) => playSound(type, soundMuted)

  const showToast = (msg) => {
    setToastMessage(msg)
    triggerSound('chime')
    setTimeout(() => setToastMessage(null), 3500)
  }

  const checkDateConflict = (propId, startStr, endStr, excludeId = null) => {
    if (!startStr || !endStr) return false
    const start = new Date(startStr)
    const end = new Date(endStr)
    for (let b of bookings) {
      if (b.propertyId === propId && b.id !== excludeId) {
        const bStart = new Date(b.checkIn)
        const bEnd = new Date(b.checkOut)
        if (start < bEnd && end > bStart) return b.guestName
      }
    }
    return false
  }

  const handleAddProperty = (e) => {
    e.preventDefault()
    if (!newPropName.trim()) return
    const p = {
      id: Date.now().toString(),
      name: newPropName,
      address: newPropAddress || 'Florianópolis, SC',
      defaultDaily: parseFloat(newPropDaily) || 300,
      amenities: newPropAmenities || 'Conforto padrão',
      specs: newPropSpecs || '4 por 5 metros, 2 andares'
    }
    setProperties([...properties, p])
    if (!selectedProp) setSelectedProp(p.id)
    setNewPropName(''); setNewPropAddress(''); setNewPropDaily(''); setNewPropAmenities('')
    showToast(`Unidade "${p.name}" catalogada com sucesso!`)
  }

  const handleUpdateProperty = (e) => {
    e.preventDefault()
    if (!editingProperty) return
    setProperties(properties.map(p => p.id === editingProperty.id ? editingProperty : p))
    setEditingProperty(null)
    showToast('Unidade atualizada!')
  }

  const deleteProperty = (id) => {
    triggerSound('click')
    if (window.confirm('Deseja realmente remover esta unidade do registro?')) {
      setProperties(properties.filter(p => p.id !== id))
      showToast('Unidade removida.')
    }
  }

  const handleAddBooking = (e) => {
    e.preventDefault()
    if (!selectedProp || !guestName || !totalAmount) return

    const conflict = checkDateConflict(selectedProp, checkIn, checkOut)
    if (conflict) {
      setConflictWarning(`Atenção: Conflito de data! O chalé já está reservado por "${conflict}" neste período.`)
      triggerSound('stamp')
      return
    }
    setConflictWarning(null)

    const newB = {
      id: Date.now().toString(),
      propertyId: selectedProp,
      guestName,
      guestDoc: guestDoc || 'RG Não Informado',
      guestPhone: guestPhone || 'Telefone N/D',
      checkIn, checkOut,
      totalAmount: parseFloat(totalAmount),
      depositAmount: parseFloat(depositAmount) || 0,
      depositPaid: false, balancePaid: false,
    }

    setBookings([newB, ...bookings])
    setGuestName(''); setGuestDoc(''); setGuestPhone(''); setCheckIn(''); setCheckOut(''); setTotalAmount(''); setDepositAmount('')
    setStamped(true); triggerSound('stamp')
    setTimeout(() => setStamped(false), 750)
    showToast('Nova ficha de hospedagem registrada no livro histórico!')
  }

  const handleUpdateBooking = (e) => {
    e.preventDefault()
    if (!editingBooking) return
    setBookings(bookings.map(b => b.id === editingBooking.id ? editingBooking : b))
    setEditingBooking(null)
    showToast('Ficha de hóspede atualizada com sucesso.')
  }

  const toggleBookingStatus = (id, key) => {
    triggerSound('click')
    setBookings(bookings.map((b) => (b.id === id ? { ...b, [key]: !b[key] } : b)))
  }

  const deleteBooking = (id) => {
    triggerSound('click')
    setBookings(bookings.filter((b) => b.id !== id))
    showToast('Ficha anulada do diário.')
  }

  const exportBackup = () => {
    triggerSound('paper')
    const data = { properties, bookings, ownerName, exportDate: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `RentalManager_Backup_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    showToast('Backup exportado com sucesso!')
  }

  const importBackup = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)
        if (data.properties && data.bookings) {
          setProperties(data.properties); setBookings(data.bookings)
          if (data.ownerName) setOwnerName(data.ownerName)
          showToast('Dados restaurados com sucesso a partir do arquivo!')
        } else { window.alert('Arquivo de backup inválido.') }
      } catch (err) { window.alert('Erro ao ler o arquivo JSON.') }
    }
    reader.readAsText(file)
  }

  const totalRevenue = bookings.reduce((s, b) => s + (b.depositPaid ? b.depositAmount : 0) + (b.balancePaid ? b.totalAmount - b.depositAmount : 0), 0)
  const pendingRevenue = bookings.reduce((s, b) => s + (b.depositPaid ? 0 : b.depositAmount) + (b.balancePaid ? 0 : b.totalAmount - b.depositAmount), 0)

  const shownRevenue = useCountUp(totalRevenue)
  const shownPending = useCountUp(pendingRevenue)
  const formatBRL = (v) => v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const TILTS = [-1.6, 1.1, -0.6, 1.8]

  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth())
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear())

  const activePack = useMemo(
    () => IMAGE_PACKS.find((p) => p.id === selectedPackId) || IMAGE_PACKS[0],
    [selectedPackId]
  )
  const currentCalendarImage = activePack.images[Math.abs(calendarMonth) % activePack.images.length]

  const monthlyRevenue = useMemo(() => {
    const map = {}
    bookings.forEach(b => {
      if (!b.checkIn) return
      const key = b.checkIn.slice(0, 7)
      map[key] = (map[key] || 0) + (b.totalAmount || 0)
    })
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0])).slice(-6)
  }, [bookings])
  const maxMonthly = Math.max(...monthlyRevenue.map(([, v]) => v), 1)

  const paidCount = bookings.filter(b => b.depositPaid && b.balancePaid).length
  const partialCount = bookings.filter(b => (b.depositPaid || b.balancePaid) && !(b.depositPaid && b.balancePaid)).length
  const unpaidCount = bookings.length - paidCount - partialCount
  const totalB = bookings.length || 1

  const currentMonthKey = useMemo(() => {
    if (monthlyRevenue.length === 0) {
      const now = new Date()
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    }
    return monthlyRevenue[monthlyRevenue.length - 1][0]
  }, [monthlyRevenue])

  const currentMonthLabel = useMemo(() => {
    const [y, m] = currentMonthKey.split('-')
    const label = new Date(parseInt(y), parseInt(m) - 1).toLocaleString('pt-BR', { month: 'long', year: 'numeric' })
    return label.charAt(0).toUpperCase() + label.slice(1)
  }, [currentMonthKey])

  const currentMonthBookings = useMemo(
    () => bookings.filter(b => b.checkIn && b.checkIn.startsWith(currentMonthKey)),
    [bookings, currentMonthKey]
  )

  const monthPaidCount = currentMonthBookings.filter(b => b.depositPaid && b.balancePaid).length
  const monthPartialCount = currentMonthBookings.filter(b => (b.depositPaid || b.balancePaid) && !(b.depositPaid && b.balancePaid)).length
  const monthUnpaidCount = currentMonthBookings.length - monthPaidCount - monthPartialCount
  const monthTotalB = currentMonthBookings.length || 1

  const monthDebtors = useMemo(
    () => currentMonthBookings
      .filter(b => !(b.depositPaid && b.balancePaid))
      .map(b => {
        const pago = (b.depositPaid ? b.depositAmount : 0) + (b.balancePaid ? b.totalAmount - b.depositAmount : 0)
        const owed = b.totalAmount - pago
        return { ...b, pago, owed }
      })
      .sort((a, b) => b.owed - a.owed),
    [currentMonthBookings]
  )

  const monthCollected = currentMonthBookings.reduce((s, b) => s + (b.depositPaid ? b.depositAmount : 0) + (b.balancePaid ? b.totalAmount - b.depositAmount : 0), 0)
  const monthPending = currentMonthBookings.reduce((s, b) => s + (b.depositPaid ? 0 : b.depositAmount) + (b.balancePaid ? 0 : b.totalAmount - b.depositAmount), 0)

  const avgTicket = bookings.length ? (totalRevenue + pendingRevenue) / bookings.length : 0
  const initialsOf = (name) => (name || '?').split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase()

  const TABS = [
    { id: 'dashboard', label: '✦ Visão Geral' },
    { id: 'properties', label: '📐 Unidades & Blueprint' },
    { id: 'bookings', label: '📖 Termo de Hospedagem' },
    { id: 'finance', label: '💰 Balanço' },
    { id: 'calendar', label: '📅 Calendário' },
    { id: 'settings', label: '⚙️ Ajustes' },
  ]

  const isWide = layoutMode === 'wide'

  // Refs for the 3D tilt elements
  const heroTiltRef = useRef(null)
  const lightboxTiltRef = useRef(null)
  const heroHandlers = makeTiltHandlers(heroTiltRef, 9, 12)
  const lightboxHandlers = makeTiltHandlers(lightboxTiltRef, 6, 9)

  return (
    <div className={`min-h-screen w-full ${lightMode ? 'theme-light' : 'theme-dark'} ${isWide ? 'p-2 md:p-4' : 'p-4 md:p-10'} font-editorial-body relative overflow-x-hidden transition-colors duration-500`}>
      <Style lightMode={lightMode} fontSizeScale={fontSizeScale} />
      <div className="global-grain-overlay" />
      <Foreground />

      {toastMessage && (
        <div className="fixed top-6 right-6 z-[600] bg-[#3d4e41] text-[#f5ebd6] px-6 py-3 rounded font-editorial-title text-sm tracking-widest border border-[#8ebf95] rise"
          style={{ boxShadow: '0 16px 30px rgba(0,0,0,.5), 0 4px 0 rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.12)' }}>
          ✦ {toastMessage}
        </div>
      )}

      <svg className="hidden">
        <defs>
          <filter id="smooth-rough-edge" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div className="px-bg fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-12 left-12 w-[700px] h-[700px] rounded-full animate-watercolor-1 opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(142,191,149,.3) 0%, rgba(90,60,30,.2) 55%, transparent 80%)' }} />
        <div className="absolute bottom-12 right-12 w-[800px] h-[800px] rounded-full animate-watercolor-2 opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(50,70,45,.35) 0%, rgba(130,100,60,.15) 60%, transparent 85%)' }} />
      </div>

      <div className={`${isWide ? '' : 'max-w-7xl'} mx-auto space-y-12 relative z-10`}>

        <header className="pt-4 pb-6 flex flex-col md:flex-row items-baseline justify-between gap-6 border-b border-[#3a3026]/30 rise">
          <div>
            <div className="flex items-center gap-4">
              <span className="font-editorial-script text-5xl text-[#8ebf95] -rotate-6 block" style={{ textShadow: '0 3px 0 rgba(0,0,0,.4), 0 0 22px rgba(142,191,149,.35)' }}>Diário de</span>
              <span className="font-editorial-mono text-xs tracking-widest text-[#7a6a58] uppercase">/ Versão Ultra Aprimorada</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-editorial-display tracking-tight mt-1 leading-none emboss-text">RentalManager</h1>
            <p className="font-editorial-script text-2xl text-[#8ebf95] mt-1" style={{ textShadow: '0 1px 0 rgba(0,0,0,.35)' }}>Gestão de Chalés 4x5m para {ownerName}</p>
          </div>
          <div className="flex flex-col items-end gap-2 text-right">
            <div className="flex items-center gap-3 mb-1">
              <span className="font-editorial-mono text-[10px] tracking-[0.3em] text-[#8ebf95] uppercase border-b border-[#3a3026] pb-1">REGISTRO OFICIAL</span>
            </div>
            <span className="font-editorial-title text-lg font-bold emboss-text">Florianópolis, SC</span>
            <span className="font-editorial-mono text-xs text-[#8c7a65]">{properties.length} UNIDADES • {bookings.length} FICHAS</span>
          </div>
        </header>

        <nav className="flex flex-wrap gap-3 pb-3 border-b border-[#8ebf95]/20">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); triggerSound('paper') }}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span className="relative z-10 flex items-center gap-2">
                {tab.label}
                {activeTab === tab.id && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8ebf95] inline-block"
                    style={{ boxShadow: '0 0 8px 2px rgba(142,191,149,.8)' }} />
                )}
              </span>
            </button>
          ))}
        </nav>

        {/* ==================== TAB 1: DASHBOARD ==================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-12 rise">
            <SectionHeader n="I." title="Visão Geral — Diário de Chalés" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Paper rot={-1.2} depth={8}>
                <div className="dark-panel p-8 shape-torn-deckle border-l-4 border-[#8ebf95] text-[#8ebf95]">
                  <span className="font-editorial-script text-3xl block mb-1" style={{ textShadow: '0 2px 0 rgba(0,0,0,.4)' }}>Rendimento</span>
                  <span className="font-editorial-mono text-[10px] tracking-widest opacity-80 uppercase block">✦ RECEITA CONFIRMADA</span>
                  <p className="text-4xl md:text-5xl font-editorial-title font-bold mt-2 emboss-text">R$ {formatBRL(shownRevenue)}</p>
                  <div className="grow-line mt-3 opacity-60" />
                </div>
              </Paper>

              <Paper rot={0.9} depth={16} front={<span className="ember" />}>
                <div className="dark-panel p-8 shape-torn-deckle border-l-4 border-[#e06d53] text-[#e06d53]">
                  <span className="font-editorial-script text-3xl block mb-1" style={{ textShadow: '0 2px 0 rgba(0,0,0,.4)' }}>Aguardando</span>
                  <span className="font-editorial-mono text-[10px] tracking-widest opacity-80 uppercase block">✦ SALDO A RECOLHER</span>
                  <p className="text-4xl md:text-5xl font-editorial-title font-bold mt-2 emboss-text">R$ {formatBRL(shownPending)}</p>
                </div>
              </Paper>

              <Paper rot={-0.5} depth={4} front={<span className="tape" />}>
                <div className="dark-panel p-8 pt-10 shape-torn-deckle border-l-4 border-[#8ebf95]">
                  <span className="font-editorial-script text-3xl text-[#8ebf95] block mb-1" style={{ textShadow: '0 2px 0 rgba(0,0,0,.4)' }}>Histórico</span>
                  <span className="font-editorial-mono text-[10px] tracking-widest opacity-80 uppercase block">✦ HÓSPEDES REGISTRADOS</span>
                  <p className="text-4xl md:text-5xl font-editorial-title font-bold mt-2 emboss-text">
                    {bookings.length} <span className="text-xl font-editorial-script text-[#8ebf95]">fichas</span>
                  </p>
                </div>
              </Paper>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Paper rot={0.5} depth={6}>
                <div className="paper-card-inner bg-crosshatch p-8 shape-torn-deckle border-t-4 border-[#8ebf95]">
                  <h3 className="font-editorial-title text-xl font-bold uppercase mb-4 emboss-text">🏠 Chalés Cadastrados (4x5m, 2 Andares)</h3>
                  <div className="space-y-4">
                    {properties.map(p => {
                      const count = bookings.filter(b => b.propertyId === p.id).length
                      return (
                        <div key={p.id} className="flex justify-between items-center border-b border-[#8c7d6b]/40 pb-2">
                          <div>
                            <span className="font-editorial-title font-bold block">{p.name}</span>
                            <span className="font-editorial-mono text-xs text-[#7a6a58]">{p.address} • {p.specs}</span>
                          </div>
                          <span className="font-editorial-mono text-xs bg-[#3d4e41] text-[#f5ebd6] px-2.5 py-1 rounded"
                            style={{ boxShadow: '0 3px 0 rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.15)' }}>
                            {count} estadias
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </Paper>

              <Paper rot={-0.8} depth={6}>
                <div className="paper-card-inner bg-crosshatch p-8 shape-torn-deckle border-t-4 border-[#e06d53]">
                  <h3 className="font-editorial-title text-xl font-bold uppercase mb-4 emboss-text">⚡ Atalhos do Sistema</h3>
                  <p className="font-editorial-body text-lg mb-6">
                    Acesse o Termo de Hospedagem para registrar novos hóspedes ou o Calendário para visualizar a agenda.
                  </p>
                  <div className="flex gap-4">
                    <button onClick={() => { setActiveTab('bookings'); triggerSound('paper') }} className="btn-3d px-4 py-2 bg-[#3d4e41] text-[#f5ebd6] font-editorial-title text-xs uppercase font-bold shape-torn-deckle cursor-pointer-forced">
                      + Novo Termo
                    </button>
                    <button onClick={() => { setActiveTab('calendar'); triggerSound('paper') }} className="btn-3d px-4 py-2 border border-[#3d4e41] font-editorial-title text-xs uppercase font-bold shape-torn-deckle cursor-pointer-forced">
                      Ver Calendário 90s
                    </button>
                  </div>
                </div>
              </Paper>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: PROPERTIES ==================== */}
        {activeTab === 'properties' && (
          <div className="space-y-12 rise">
            <SectionHeader n="II." title="Unidades & Blueprint (Arquitetura & Especificações de Chalés)" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <Paper rot={-1} depth={8} className="lg:col-span-5" front={<span className="tape" />}>
                <div className="dark-panel bg-blueprint p-8 pt-10 shape-torn-deckle border border-[#8ebf95]/60 shadow-2xl">
                  <div className="border-b border-[#8ebf95]/40 pb-4 mb-6">
                    <span className="font-editorial-script text-3xl text-[#8ebf95] block" style={{ textShadow: '0 2px 0 rgba(0,0,0,.4)' }}>Drafting Room</span>
                    <h3 className="font-editorial-title text-xl font-bold uppercase text-[#e5dec9] emboss-text">
                      {editingProperty ? 'Editar Chalé Blueprint' : 'Novo Chalé (4x5m / 2 Andares)'}
                    </h3>
                  </div>

                  <form onSubmit={editingProperty ? handleUpdateProperty : handleAddProperty} className="space-y-6">
                    <Field label="Nome da Unidade">
                      <input type="text" placeholder="Ex: Chalé Serra Azul"
                        value={editingProperty ? editingProperty.name : newPropName}
                        onChange={(e) => editingProperty ? setEditingProperty({...editingProperty, name: e.target.value}) : setNewPropName(e.target.value)}
                        className={INK} required />
                    </Field>
                    <Field label="Localização">
                      <input type="text" placeholder="Florianópolis, SC"
                        value={editingProperty ? editingProperty.address : newPropAddress}
                        onChange={(e) => editingProperty ? setEditingProperty({...editingProperty, address: e.target.value}) : setNewPropAddress(e.target.value)}
                        className={INK} />
                    </Field>
                    <Field label="Especificações Técnicas (Ex: 4x5m, 2 andares)">
                      <input type="text" placeholder="4 por 5 metros, 2 andares"
                        value={editingProperty ? editingProperty.specs : newPropSpecs}
                        onChange={(e) => editingProperty ? setEditingProperty({...editingProperty, specs: e.target.value}) : setNewPropSpecs(e.target.value)}
                        className={INK} />
                    </Field>
                    <Field label="Valor Diária (R$)">
                      <input type="number" placeholder="350.00"
                        value={editingProperty ? editingProperty.defaultDaily : newPropDaily}
                        onChange={(e) => editingProperty ? setEditingProperty({...editingProperty, defaultDaily: parseFloat(e.target.value)}) : setNewPropDaily(e.target.value)}
                        className={INK} />
                    </Field>
                    <Field label="Comodidades">
                      <input type="text" placeholder="Lareira, Deck, Wi-Fi..."
                        value={editingProperty ? editingProperty.amenities : newPropAmenities}
                        onChange={(e) => editingProperty ? setEditingProperty({...editingProperty, amenities: e.target.value}) : setNewPropAmenities(e.target.value)}
                        className={INK} />
                    </Field>

                    <div className="flex gap-4 pt-2">
                      <button type="submit" className="btn-3d flex-1 py-4 bg-[#8ebf95] text-[#0d1611] font-editorial-title text-xs font-bold uppercase tracking-widest hover:bg-[#a3d4a9] transition-all shape-torn-deckle cursor-pointer-forced">
                        {editingProperty ? 'Salvar Chalé' : '+ Desenhar Blueprint'}
                      </button>
                      {editingProperty && (
                        <button type="button" onClick={() => setEditingProperty(null)} className="btn-3d px-4 py-4 bg-[#7a2214] text-[#f5ebd6] font-editorial-title text-xs uppercase font-bold shape-torn-deckle cursor-pointer-forced">
                          Cancelar
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </Paper>

              <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
                {properties.map((p, idx) => {
                  const propBookings = bookings.filter((b) => b.propertyId === p.id)
                  const propRevenue = propBookings.reduce((sum, b) => sum + (b.depositPaid ? b.depositAmount : 0) + (b.balancePaid ? b.totalAmount - b.depositAmount : 0), 0)
                  return (
                    <Paper key={p.id} rot={TILTS[idx % 4]} depth={6} front={<span className="tape" style={{ width: 70, marginLeft: -35 }} />}>
                      <div className="dark-panel bg-blueprint p-8 shape-torn-deckle flex flex-col justify-between h-full border-2 border-[#8ebf95]/70 shadow-xl">
                        <div>
                          <div className="flex justify-between items-start border-b border-[#8ebf95]/50 pb-4 mb-4">
                            <div>
                              <span className="font-editorial-script text-2xl text-[#8ebf95]">Blueprint Arch. 0{idx + 1}</span>
                              <h3 className="font-editorial-title text-xl font-bold uppercase tracking-wide text-[#e5dec9] emboss-text">{p.name}</h3>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => { setEditingProperty(p); triggerSound('click') }} className="font-editorial-mono text-[10px] text-[#8ebf95] font-bold uppercase hover:underline cursor-pointer-forced">Editar</button>
                              <button onClick={() => deleteProperty(p.id)} className="font-editorial-mono text-[10px] text-[#e06d53] font-bold uppercase hover:underline cursor-pointer-forced">Excluir</button>
                            </div>
                          </div>

                          <p className="font-editorial-mono text-xs mb-3 uppercase tracking-wider text-[#e5dec9]/90">📍 {p.address}</p>

                          <div className="p-4 bg-[#0d1611]/80 border border-[#8ebf95]/60 mb-4 rounded font-editorial-mono text-xs text-[#8ebf95] space-y-1"
                            style={{ boxShadow: 'inset 0 2px 8px rgba(0,0,0,.5), inset 0 -1px 0 rgba(255,255,255,.05)' }}>
                            <div className="font-bold border-b border-[#8ebf95]/30 pb-1 mb-1">📐 ESPECIFICAÇÕES TÉCNICAS</div>
                            <div>• Dimensão Base: 4 x 5 metros</div>
                            <div>• Estrutura: 2 Andares</div>
                            <div>• Detalhes: {p.specs || 'Padrão Chalé Alpino'}</div>
                          </div>

                          <p className="font-editorial-mono text-xs mb-2 text-[#e5dec9]/90">✨ {p.amenities}</p>
                          <p className="font-editorial-mono text-xs mb-6 font-bold text-[#8ebf95]">💵 Valor Diária: R$ {formatBRL(p.defaultDaily || 300)}</p>
                        </div>

                        <div className="space-y-2 border-t border-[#8ebf95]/50 pt-4 font-editorial-body text-base">
                          <div className="flex justify-between text-[#e5dec9]">
                            <span className="font-editorial-title text-xs font-bold uppercase">Estadias Registradas:</span>
                            <span className="font-editorial-mono font-bold">{propBookings.length} fichas</span>
                          </div>
                          <div className="flex justify-between text-[#e5dec9]">
                            <span className="font-editorial-title text-xs font-bold uppercase">Receita Gerada:</span>
                            <span className="font-editorial-title font-bold text-[#8ebf95]">R$ {formatBRL(propRevenue)}</span>
                          </div>
                        </div>
                      </div>
                    </Paper>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: BOOKINGS ==================== */}
        {activeTab === 'bookings' && (
          <div className="space-y-12 rise">
            <SectionHeader n="III." title="Termo de Hospedagem & Registro Histórico de Hóspedes" />

            <Paper rot={0.5} depth={-4} stack={3} front={<div className={`seal ${stamped ? 'stamped' : ''}`}><span className="font-editorial-script text-3xl">Selo</span></div>}>
              <div className="paper-card-inner bg-ledger p-8 md:p-14 shape-premium shadow-2xl border-2 border-[#b5a289]">
                <div className="border-b-2 border-[#7a2214] pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                  <div>
                    <span className="font-editorial-script text-4xl text-[#7a2214] block" style={{ textShadow: '0 2px 0 rgba(255,255,255,.5), 0 -1px 0 rgba(0,0,0,.15)' }}>
                      {editingBooking ? 'Editando Registro Folio' : 'Hotel Registry Folio'}
                    </span>
                    <h3 className="font-editorial-title text-2xl md:text-3xl font-bold uppercase tracking-wider text-[#1c140e] emboss-text">
                      {editingBooking ? `Ficha Histórica #${editingBooking.id}` : 'Termo Oficial de Hospedagem & Condições'}
                    </h3>
                  </div>
                  <div className="text-right font-editorial-mono text-xs text-[#7a6a58]">
                    REGISTRO Nº {bookings.length + 101}<br/>
                    FLORIANÓPOLIS, SANTA CATARINA
                  </div>
                </div>

                {conflictWarning && (
                  <div className="mb-6 p-4 bg-[#7a2214]/20 border-l-4 border-[#7a2214] text-[#7a2214] font-editorial-title text-xs font-bold uppercase"
                    style={{ boxShadow: 'inset 0 2px 8px rgba(122,34,20,.15)' }}>
                    ⚠️ {conflictWarning}
                  </div>
                )}

                <form onSubmit={editingBooking ? handleUpdateBooking : handleAddBooking} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Field label="Chalé / Unidade Reservada (4x5m)">
                      <select value={editingBooking ? editingBooking.propertyId : selectedProp}
                        onChange={(e) => editingBooking ? setEditingBooking({...editingBooking, propertyId: e.target.value}) : setSelectedProp(e.target.value)}
                        className={`${INK} cursor-pointer-forced`}>
                        {properties.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.specs})</option>)}
                      </select>
                    </Field>
                    <Field label="Nome Completo do Hóspede Principal">
                      <input type="text" placeholder="Ex: Gabriel M. Siqueira"
                        value={editingBooking ? editingBooking.guestName : guestName}
                        onChange={(e) => editingBooking ? setEditingBooking({...editingBooking, guestName: e.target.value}) : setGuestName(e.target.value)}
                        className={INK} required />
                    </Field>
                    <Field label="Documento / Passaporte (RG / CPF)">
                      <input type="text" placeholder="RG 12.345.678-9 / CPF 000.000.000-00"
                        value={editingBooking ? editingBooking.guestDoc : guestDoc}
                        onChange={(e) => editingBooking ? setEditingBooking({...editingBooking, guestDoc: e.target.value}) : setGuestDoc(e.target.value)}
                        className={INK} required />
                    </Field>
                    <Field label="Telefone de Contato">
                      <input type="text" placeholder="+55 (48) 99999-9999"
                        value={editingBooking ? editingBooking.guestPhone : guestPhone}
                        onChange={(e) => editingBooking ? setEditingBooking({...editingBooking, guestPhone: e.target.value}) : setGuestPhone(e.target.value)}
                        className={INK} />
                    </Field>
                    <Field label="Data de Check-In (Entrada)">
                      <input type="date" value={editingBooking ? editingBooking.checkIn : checkIn}
                        onChange={(e) => editingBooking ? setEditingBooking({...editingBooking, checkIn: e.target.value}) : setCheckIn(e.target.value)}
                        className={INK} required />
                    </Field>
                    <Field label="Data de Check-Out (Saída)">
                      <input type="date" value={editingBooking ? editingBooking.checkOut : checkOut}
                        onChange={(e) => editingBooking ? setEditingBooking({...editingBooking, checkOut: e.target.value}) : setCheckOut(e.target.value)}
                        className={INK} required />
                    </Field>
                    <Field label="Valor Acordado Total (R$)">
                      <input type="number" step="0.01" placeholder="0.00"
                        value={editingBooking ? editingBooking.totalAmount : totalAmount}
                        onChange={(e) => editingBooking ? setEditingBooking({...editingBooking, totalAmount: parseFloat(e.target.value)}) : setTotalAmount(e.target.value)}
                        className={INK} required />
                    </Field>
                    <Field label="Sinal / Depósito Inicial (R$)">
                      <input type="number" step="0.01" placeholder="0.00"
                        value={editingBooking ? editingBooking.depositAmount : depositAmount}
                        onChange={(e) => editingBooking ? setEditingBooking({...editingBooking, depositAmount: parseFloat(e.target.value)}) : setDepositAmount(e.target.value)}
                        className={INK} />
                    </Field>
                  </div>

                  <div className="p-4 bg-[#cfc3ab]/40 border border-[#b5a289] text-xs font-editorial-mono text-[#2b2118] space-y-1 rounded"
                    style={{ boxShadow: 'inset 0 2px 6px rgba(120,95,60,.15), inset 0 -1px 0 rgba(255,255,255,.4)' }}>
                    <div className="font-bold uppercase tracking-wider">✦ CLÁUSULAS E TERMOS DE HOSPEDAGEM:</div>
                    <p>1. O hóspede declara estar ciente das regras de preservação do chalé (4x5m, 2 andares). 2. Proibido fumar no interior da madeira. 3. O saldo restante deverá ser quitado na entrada.</p>
                  </div>

                  <div className="pt-4 flex gap-4">
                    <button type="submit" className="btn-3d flex-1 py-4 bg-[#3d4e41] hover:bg-[#4f6454] text-[#f5ebd6] font-editorial-title font-bold text-xs uppercase tracking-[0.2em] transition-colors shape-premium cursor-pointer-forced">
                      {editingBooking ? '✦ Salvar Alterações no Folio' : '✦ Assinar e Carimbar Termo de Hospedagem'}
                    </button>
                    {editingBooking && (
                      <button type="button" onClick={() => setEditingBooking(null)} className="btn-3d px-6 py-4 bg-[#7a2214] text-[#f5ebd6] font-editorial-title text-xs uppercase font-bold shape-premium cursor-pointer-forced">
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </Paper>

            <div className="dark-panel p-6 shape-torn-deckle flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="w-full md:w-1/3">
                <label className="block font-editorial-title text-[10px] uppercase font-bold mb-1">Buscar por Hóspede</label>
                <input type="text" placeholder="Nome do hóspede..." value={filterQuery} onChange={(e) => setFilterQuery(e.target.value)}
                  className="w-full p-2 bg-transparent border-b border-[#8c7d6b] font-editorial-mono text-sm focus:outline-none cursor-pointer-forced" />
              </div>
              <div className="w-full md:w-1/3">
                <label className="block font-editorial-title text-[10px] uppercase font-bold mb-1">Filtrar por Chalé</label>
                <select value={filterProp} onChange={(e) => setFilterProp(e.target.value)}
                  className="w-full p-2 bg-transparent border-b border-[#8c7d6b] font-editorial-mono text-sm cursor-pointer-forced">
                  <option value="all">Todas as Unidades</option>
                  {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="w-full md:w-1/3">
                <label className="block font-editorial-title text-[10px] uppercase font-bold mb-1">Filtrar por Pagamento</label>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full p-2 bg-transparent border-b border-[#8c7d6b] font-editorial-mono text-sm cursor-pointer-forced">
                  <option value="all">Todos os Status</option>
                  <option value="pending">Pendentes</option>
                  <option value="settled">Quitados (100%)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {bookings
                .filter(b => {
                  const matchQuery = b.guestName.toLowerCase().includes(filterQuery.toLowerCase())
                  const matchProp = filterProp === 'all' || b.propertyId === filterProp
                  const settled = b.depositPaid && b.balancePaid
                  const matchStatus = filterStatus === 'all' || (filterStatus === 'settled' ? settled : !settled)
                  return matchQuery && matchProp && matchStatus
                })
                .map((b, i) => {
                  const prop = properties.find((p) => p.id === b.propertyId)
                  const settled = b.depositPaid && b.balancePaid
                  const payBtn = (on) =>
                    `p-2.5 text-center uppercase tracking-wider font-bold transition-all border text-xs cursor-pointer-forced ${on
                      ? 'bg-[#3d4e41] text-[#f5ebd6] border-[#3d4e41]'
                      : 'bg-transparent text-[#7a2214] border-[#7a2214] hover:bg-[#7a2214]/10'}`
                  return (
                    <Paper key={b.id} rot={TILTS[i % 4]} depth={(i % 3) * 5 + 2}
                      style={{ '--dl': `${Math.min(i, 8) * 0.08}s`, '--tr': `${TILTS[(i + 1) % 4] * 3}deg` }}
                      front={<>
                        <span className="tape" style={{ width: 80, marginLeft: -40 }} />
                        {settled && <span className="stamp">QUITADO</span>}
                      </>}>
                      <div className="paper-card-inner bg-crosshatch p-8 pt-9 shape-torn-deckle flex flex-col justify-between h-full">
                        <div>
                          <div className="border-b border-[#8c7d6b] pb-4 mb-4 flex justify-between items-start">
                            <div>
                              <span className="font-editorial-mono text-[9px] font-bold uppercase tracking-widest bg-[#3d4e41] text-[#f5ebd6] px-2 py-0.5 inline-block mb-2"
                                style={{ boxShadow: '0 2px 0 rgba(0,0,0,.35)' }}>
                                {prop?.name || 'Chalé'}
                              </span>
                              <h4 className="text-2xl font-editorial-title font-bold leading-tight emboss-text">{b.guestName}</h4>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => { setEditingBooking(b); triggerSound('click') }} className="font-editorial-mono text-[10px] text-[#3d4e41] font-bold uppercase hover:underline cursor-pointer-forced">Editar</button>
                              <button onClick={() => deleteBooking(b.id)} className="font-editorial-mono text-[10px] text-[#7a2214] font-bold uppercase hover:underline cursor-pointer-forced">Anular</button>
                            </div>
                          </div>

                          <div className="text-sm space-y-1 mb-4 font-editorial-mono">
                            <p className="opacity-90">🆔 {b.guestDoc || 'RG N/D'}</p>
                            <p className="opacity-90">📞 {b.guestPhone || 'Tel N/D'}</p>
                          </div>

                          <div className="text-base space-y-1 mb-6 border-t border-[#8c7d6b]/40 pt-3">
                            <p className="flex justify-between"><span className="font-editorial-title text-xs font-bold">ENTRADA</span><span>{b.checkIn || '—'}</span></p>
                            <p className="flex justify-between"><span className="font-editorial-title text-xs font-bold">SAÍDA</span><span>{b.checkOut || '—'}</span></p>
                          </div>

                          <div className="p-3 border-y border-[#8c7d6b] mb-6 space-y-1 bg-[#cfc3ab]/30"
                            style={{ boxShadow: 'inset 0 2px 6px rgba(120,95,60,.12)' }}>
                            <div className="flex justify-between items-baseline">
                              <span className="font-editorial-title text-[10px] font-bold uppercase">VALOR TOTAL</span>
                              <span className="font-editorial-title font-bold text-xl">R$ {formatBRL(b.totalAmount)}</span>
                            </div>
                            <div className="flex justify-between items-baseline text-xs font-editorial-mono opacity-80">
                              <span>Sinal / Depósito:</span>
                              <span>R$ {formatBRL(b.depositAmount)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 font-editorial-mono text-[10px]">
                          <button onClick={() => toggleBookingStatus(b.id, 'depositPaid')} className={payBtn(b.depositPaid)}>
                            Sinal: {b.depositPaid ? '✓ Pago' : '✗ Pendente'}
                          </button>
                          <button onClick={() => toggleBookingStatus(b.id, 'balancePaid')} className={payBtn(b.balancePaid)}>
                            Saldo: {b.balancePaid ? '✓ Pago' : '✗ Pendente'}
                          </button>
                        </div>
                      </div>
                    </Paper>
                  )
                })}
            </div>
          </div>
        )}

        {/* ==================== TAB 4: FINANCE ==================== */}
        {activeTab === 'finance' && (
          <div className="space-y-12 rise">
            <SectionHeader n="IV." title="Relatórios Financeiros" />

            <div className="dark-panel p-4 border-2 border-[#8ebf95]/50 rounded font-editorial-mono text-xs overflow-hidden flex items-center justify-between shadow-lg bg-[#0d1611]">
              <span className="text-[#8ebf95] uppercase tracking-widest font-bold">📈 WALL STREET VINTAGE TICKER ✦ 1990s LEDGER</span>
              <span className="text-[#e5dec9]">FATURAMENTO: R$ {formatBRL(totalRevenue)} • PENDENTE: R$ {formatBRL(pendingRevenue)} • CONTRATOS: {bookings.length}</span>
              <span className="text-[#8ebf95]">MERCADO IMOBILIÁRIO: BULLISH ✦</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Paper rot={-1} depth={6}>
                <div className="dark-panel p-6 shape-torn-deckle border-t-4 border-[#8ebf95]">
                  <span className="font-editorial-script text-2xl text-[#8ebf95] block mb-1">Recebido</span>
                  <span className="font-editorial-mono text-[10px] tracking-widest opacity-80 uppercase block">✦ CAIXA LÍQUIDO</span>
                  <p className="text-2xl md:text-3xl font-editorial-title font-bold mt-2 text-[#8ebf95] emboss-text">R$ {formatBRL(totalRevenue)}</p>
                </div>
              </Paper>
              <Paper rot={0.5} depth={6}>
                <div className="dark-panel p-6 shape-torn-deckle border-t-4 border-[#e06d53]">
                  <span className="font-editorial-script text-2xl text-[#e06d53] block mb-1">A Receber</span>
                  <span className="font-editorial-mono text-[10px] tracking-widest opacity-80 uppercase block">✦ SALDOS PENDENTES</span>
                  <p className="text-2xl md:text-3xl font-editorial-title font-bold mt-2 text-[#e06d53] emboss-text">R$ {formatBRL(pendingRevenue)}</p>
                </div>
              </Paper>
              <Paper rot={1} depth={6}>
                <div className="dark-panel p-6 shape-torn-deckle border-t-4 border-[#e5dec9]">
                  <span className="font-editorial-script text-2xl text-[#e5dec9] block mb-1">Projeção</span>
                  <span className="font-editorial-mono text-[10px] tracking-widest opacity-80 uppercase block">✦ TOTAL CONTRATADO</span>
                  <p className="text-2xl md:text-3xl font-editorial-title font-bold mt-2 emboss-text">R$ {formatBRL(totalRevenue + pendingRevenue)}</p>
                </div>
              </Paper>
              <Paper rot={-0.7} depth={6} front={<span className="tape" style={{ width: 70, marginLeft: -35 }} />}>
                <div className="dark-panel p-6 pt-9 shape-torn-deckle border-t-4 border-[#8ebf95]">
                  <span className="font-editorial-script text-2xl text-[#8ebf95] block mb-1">Ticket Médio</span>
                  <span className="font-editorial-mono text-[10px] tracking-widest opacity-80 uppercase block">✦ POR CONTRATO</span>
                  <p className="text-2xl md:text-3xl font-editorial-title font-bold mt-2 emboss-text">R$ {formatBRL(avgTicket)}</p>
                </div>
              </Paper>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <Paper rot={-0.6} depth={7} className="lg:col-span-7" front={<span className="tape" />}>
                <div className="paper-card-inner bg-crosshatch p-8 shape-torn-deckle border-t-4 border-[#3d4e41] h-full flex flex-col">
                  <div className="flex justify-between items-baseline mb-6">
                    <h3 className="font-editorial-title text-xl font-bold uppercase emboss-text">📈 Receita Mensal</h3>
                    <span className="font-editorial-mono text-[10px] uppercase opacity-70">Últimos {monthlyRevenue.length || 0} meses</span>
                  </div>

                  <div className="h-56 flex items-end gap-3 border-b-2 border-l-2 border-[#7a6a58]/60 pl-3 pr-2">
                    {monthlyRevenue.length === 0 && (
                      <span className="font-editorial-script text-2xl opacity-60 self-center mx-auto">Sem dados ainda...</span>
                    )}
                    {monthlyRevenue.map(([key, val], i) => {
                      const pct = Math.max((val / maxMonthly) * 100, 4)
                      return (
                        <div key={key} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                          <span className="font-editorial-mono text-[9px] font-bold text-[#3d4e41] mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            R$ {Math.round(val)}
                          </span>
                          <div
                            className="w-full bg-gradient-to-t from-[#3d4e41] via-[#5c7a5e] to-[#8ebf95] rounded-t shadow-md bar-anim opacity-30 group-hover:opacity-100 transition-opacity duration-300"
                            style={{ height: `${pct}%`, animationDelay: `${i * 0.08}s`, boxShadow: '0 6px 12px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.35)' }}
                          />
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex gap-3 mt-2 pl-3 pr-2">
                    {monthlyRevenue.map(([key]) => {
                      const [y, m] = key.split('-')
                      const label = new Date(parseInt(y), parseInt(m) - 1).toLocaleString('pt-BR', { month: 'short' })
                      return (
                        <span key={key} className="flex-1 text-center font-editorial-title text-[10px] font-bold uppercase text-[#524436]">
                          {label}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </Paper>

              <Paper rot={0.7} depth={7} className="lg:col-span-5" front={<span className="tape" />}>
                <div className="paper-card-inner bg-crosshatch p-8 shape-torn-deckle border-t-4 border-[#7a2214] h-full flex flex-col">
                  <div className="flex justify-between items-baseline mb-4 flex-wrap gap-2">
                    <h3 className="font-editorial-title text-xl font-bold uppercase emboss-text">🥧 Status de Pagamento</h3>
                    <span className="font-editorial-mono text-[10px] uppercase opacity-70 px-2 py-0.5 bg-[#7a2214]/10 rounded border border-[#7a2214]/30 text-[#7a2214]">
                      ✦ {currentMonthLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-5">
                    <svg viewBox="0 0 42 42" className="w-32 h-32 -rotate-90 shrink-0" style={{ filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.25))' }}>
                      <circle cx="21" cy="21" r="15.915" fill="none" stroke="#7a6a58" strokeWidth="5" opacity="0.22" />
                      <circle cx="21" cy="21" r="15.915" fill="none" stroke="#8ebf95" strokeWidth="5"
                        strokeDasharray={`${(monthPaidCount / monthTotalB) * 100} ${100 - (monthPaidCount / monthTotalB) * 100}`}
                        strokeDashoffset="0" />
                      <circle cx="21" cy="21" r="15.915" fill="none" stroke="#e5a53c" strokeWidth="5"
                        strokeDasharray={`${(monthPartialCount / monthTotalB) * 100} ${100 - (monthPartialCount / monthTotalB) * 100}`}
                        strokeDashoffset={-(monthPaidCount / monthTotalB) * 100} />
                      <circle cx="21" cy="21" r="15.915" fill="none" stroke="#7a2214" strokeWidth="5"
                        strokeDasharray={`${(monthUnpaidCount / monthTotalB) * 100} ${100 - (monthUnpaidCount / monthTotalB) * 100}`}
                        strokeDashoffset={-((monthPaidCount + monthPartialCount) / monthTotalB) * 100} />
                    </svg>
                    <div className="space-y-2 font-editorial-title text-xs flex-1">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm bg-[#8ebf95] shrink-0" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,.4), 0 1px 2px rgba(0,0,0,.25)' }} />
                        <span className="font-bold uppercase">Quitados</span>
                        <span className="font-editorial-mono ml-auto">{monthPaidCount}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm bg-[#e5a53c] shrink-0" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,.4), 0 1px 2px rgba(0,0,0,.25)' }} />
                        <span className="font-bold uppercase">Parciais</span>
                        <span className="font-editorial-mono ml-auto">{monthPartialCount}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm bg-[#7a2214] shrink-0" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,.2), 0 1px 2px rgba(0,0,0,.25)' }} />
                        <span className="font-bold uppercase">Pendentes</span>
                        <span className="font-editorial-mono ml-auto">{monthUnpaidCount}</span>
                      </div>
                      <div className="pt-2 border-t border-[#7a6a58]/30 flex items-center gap-2">
                        <span className="font-editorial-title text-[10px] font-bold uppercase opacity-70">Total do Mês</span>
                        <span className="font-editorial-mono ml-auto font-bold">{currentMonthBookings.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4 text-center">
                    <div className="p-2 bg-[#8ebf95]/15 border border-[#8ebf95]/40 rounded"
                      style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,.4), 0 2px 4px rgba(0,0,0,.08)' }}>
                      <div className="font-editorial-mono text-[9px] uppercase opacity-70">Recebido no mês</div>
                      <div className="font-editorial-title font-bold text-sm text-[#3d4e41]">R$ {formatBRL(monthCollected)}</div>
                    </div>
                    <div className="p-2 bg-[#e06d53]/15 border border-[#e06d53]/40 rounded"
                      style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,.4), 0 2px 4px rgba(0,0,0,.08)' }}>
                      <div className="font-editorial-mono text-[9px] uppercase opacity-70">Em aberto</div>
                      <div className="font-editorial-title font-bold text-sm text-[#7a2214]">R$ {formatBRL(monthPending)}</div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t-2 border-dashed border-[#7a6a58]/40">
                    <h4 className="font-editorial-title text-xs font-bold uppercase mb-3 text-[#7a2214] flex items-center gap-2">
                      ⚠️ Falta Pagar neste Mês
                    </h4>
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1 debtor-scroll">
                      {monthDebtors.length === 0 ? (
                        <div className="text-center py-3">
                          <span className="font-editorial-script text-xl opacity-70 block">Todos quitados ✦</span>
                          <span className="font-editorial-mono text-[9px] opacity-50 uppercase">Nenhum saldo em aberto</span>
                        </div>
                      ) : (
                        monthDebtors.map(b => (
                          <div
                            key={b.id}
                            className="p-2 rounded border transition-all hover:scale-[1.02] hover:-translate-y-0.5"
                            style={{
                              background: 'linear-gradient(135deg, rgba(207,195,171,.35) 0%, rgba(207,195,171,.15) 100%)',
                              borderColor: 'rgba(181, 162, 137, 0.5)',
                              boxShadow: '0 3px 6px rgba(0,0,0,.12), inset 0 1px 0 rgba(255,255,255,.5)'
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-9 h-9 rounded-full flex items-center justify-center font-editorial-title font-bold text-[11px] shrink-0"
                                style={{
                                  background: b.depositPaid
                                    ? 'linear-gradient(135deg, #e5a53c, #c98a2a)'
                                    : 'linear-gradient(135deg, #b33a26, #7a2214)',
                                  color: '#f5ebd6',
                                  border: '2px solid rgba(245,235,214,.4)',
                                  boxShadow: '0 4px 8px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.3)'
                                }}
                              >
                                {initialsOf(b.guestName)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-editorial-title font-bold text-[11px] truncate leading-tight text-[#1c140e]">
                                  {b.guestName}
                                </div>
                                <div className="font-editorial-mono text-[9px] opacity-70 uppercase tracking-wider">
                                  {b.depositPaid ? '✦ Pagou parcial' : '✦ Sem pagamento'}
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <div className="font-editorial-mono text-[8px] opacity-60 uppercase">Falta</div>
                                <div className="font-editorial-title font-bold text-sm text-[#7a2214] tabular-nums leading-none">
                                  R$ {formatBRL(b.owed)}
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-1 mt-2 pt-2 border-t border-[#b5a289]/40 font-editorial-mono text-[9px]">
                              <div className="text-center">
                                <div className="opacity-60 uppercase">Total</div>
                                <div className="font-bold text-[#1c140e]">R$ {formatBRL(b.totalAmount)}</div>
                              </div>
                              <div className="text-center border-x border-[#b5a289]/30">
                                <div className="opacity-60 uppercase">Pago</div>
                                <div className="font-bold text-[#3d4e41]">R$ {formatBRL(b.pago)}</div>
                              </div>
                              <div className="text-center">
                                <div className="opacity-60 uppercase">Falta</div>
                                <div className="font-bold text-[#7a2214]">R$ {formatBRL(b.owed)}</div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </Paper>
            </div>

            <Paper rot={0.4} depth={6} front={<span className="tape" />}>
              <div className="paper-card-inner bg-ledger p-8 shape-torn-deckle border-t-4 border-[#7a2214]">
                <h3 className="font-editorial-title text-xl font-bold uppercase mb-4 emboss-text">📑 Ledger Backup & Restore</h3>
                <p className="font-editorial-body text-base mb-6">
                  Exporte ou restaure todos os registros financeiros e fichas de hóspedes em arquivo JSON seguro.
                </p>
                <div className="flex flex-col md:flex-row gap-4">
                  <button onClick={exportBackup} className="btn-3d flex-1 py-4 bg-[#3d4e41] text-[#f5ebd6] font-editorial-title text-xs font-bold uppercase tracking-widest shape-torn-deckle cursor-pointer-forced">
                    ⬇ Baixar Backup Completo (JSON)
                  </button>
                  <label className="btn-3d flex-1 py-4 bg-[#7a2214] text-[#f5ebd6] font-editorial-title text-xs font-bold uppercase tracking-widest text-center cursor-pointer shape-torn-deckle">
                    ⬆ Restaurar de Arquivo JSON
                    <input type="file" accept=".json" onChange={importBackup} className="hidden" />
                  </label>
                </div>
              </div>
            </Paper>
          </div>
        )}

        {/* ==================== TAB 5: CALENDAR ==================== */}
        {activeTab === 'calendar' && (
          <div className="space-y-12 rise">
            <SectionHeader n="V." title="Calendário & Agenda — Packs Temáticos" />

            {/* Pack picker */}
            <div className="dark-panel p-5 shape-torn-deckle flex flex-col md:flex-row items-center justify-between gap-4 border border-[#8ebf95]/40 shadow-lg">
              <div>
                <span className="font-editorial-title text-sm uppercase font-bold text-[#8ebf95] block emboss-text">
                  🎨 Pacote de Imagens Ativo:
                </span>
                <span className="font-editorial-mono text-xs text-[#8c7a65]">{activePack.description}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {IMAGE_PACKS.map((pack) => (
                  <button key={pack.id}
                    onClick={() => { setSelectedPackId(pack.id); triggerSound('click') }}
                    className={`btn-3d px-4 py-2 font-editorial-title text-xs uppercase font-bold shape-torn-deckle transition-all cursor-pointer-forced ${
                      selectedPackId === pack.id
                        ? 'bg-[#8ebf95] text-[#0d1611]'
                        : 'bg-[#1c140e] text-[#e5dec9] hover:bg-[#3d4e41] border border-[#3d4e41]'
                    }`}>
                    {pack.name}
                  </button>
                ))}
              </div>
            </div>

            {/* ===== HERO: IMAGEM COMO PROTAGONISTA, com tilt 3D + click-to-expand ===== */}
            <div className="hero-3d-scene">
              <div
                ref={heroTiltRef}
                {...heroHandlers}
                onClick={() => { setExpandedImage(currentCalendarImage); triggerSound('whoosh') }}
                className="hero-3d-card relative w-full rounded-md overflow-hidden border-2 border-[#3d4e41] cursor-pointer group"
                style={{ minHeight: 'clamp(460px, 72vh, 760px)' }}
                title="Clique para expandir"
              >
                {/* imagem com profundidade */}
                <img
                  src={currentCalendarImage}
                  alt={activePack.name}
                  className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                  style={{
                    filter: 'sepia(.06) contrast(1.05) saturate(1.1)',
                  }}
                />
                {/* scrims para legibilidade */}
                <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#1c140e]/85 via-[#1c140e]/25 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#1c140e]/95 via-[#1c140e]/40 to-transparent pointer-events-none" />
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at 50% 55%, transparent 42%, rgba(0,0,0,.4) 100%)' }} />
                {/* moldura 3D interna */}
                <div className="absolute inset-0 pointer-events-none frame-3d-inset" />

                {/* cantos vintage */}
                <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-[#8ebf95]/70 pointer-events-none z-20" />
                <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-[#8ebf95]/70 pointer-events-none z-20" />
                <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-[#8ebf95]/70 pointer-events-none z-20" />
                <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-[#8ebf95]/70 pointer-events-none z-20" />

                {/* topo: título do pack + navegação de mês */}
                <div className="relative z-30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 md:p-7">
                  <div>
                    <span className="font-editorial-script text-3xl md:text-5xl text-[#f5ebd6] block leading-none"
                      style={{ textShadow: '0 3px 12px rgba(0,0,0,.8)' }}>
                      {activePack.name}
                    </span>
                    <span className="font-editorial-mono text-[10px] tracking-[0.5em] text-[#8ebf95] uppercase mt-1 block"
                      style={{ textShadow: '0 1px 4px rgba(0,0,0,.9)' }}>
                      ✦ EST. 1990 ✦ FLORIANÓPOLIS ✦
                    </span>
                  </div>
                  <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        triggerSound('paper')
                        if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(calendarYear - 1) }
                        else setCalendarMonth(calendarMonth - 1)
                      }}
                      className="btn-3d px-4 py-2 bg-[#3d4e41]/95 text-[#f5ebd6] font-editorial-title text-[10px] uppercase font-bold tracking-widest shape-premium cursor-pointer-forced hover:bg-[#4f6454] transition-colors">
                      ← Mês Anterior
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        triggerSound('paper')
                        if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(calendarYear + 1) }
                        else setCalendarMonth(calendarMonth + 1)
                      }}
                      className="btn-3d px-4 py-2 bg-[#3d4e41]/95 text-[#f5ebd6] font-editorial-title text-[10px] uppercase font-bold tracking-widest shape-premium cursor-pointer-forced hover:bg-[#4f6454] transition-colors">
                      Próximo Mês →
                    </button>
                  </div>
                </div>

                {/* base: legenda do mês + grid flutuante em vidro fosco */}
                <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col md:flex-row items-end justify-between gap-5 p-5 md:p-7">
                  <div className="hidden md:block">
                    <h3 className="font-editorial-display text-2xl md:text-4xl text-[#f5ebd6] tracking-wide uppercase"
                      style={{ textShadow: '0 3px 14px rgba(0,0,0,.9)' }}>
                      {new Date(calendarYear, calendarMonth).toLocaleString('pt-BR', { month: 'long' })} {calendarYear}
                    </h3>
                    <span className="font-editorial-mono text-[9px] text-[#8ebf95] tracking-[0.3em] uppercase"
                      style={{ textShadow: '0 1px 4px rgba(0,0,0,.9)' }}>
                      Mês {((calendarMonth % 12) + 1)} de 12 • Agenda de Chalés
                    </span>
                  </div>

                  <div className="w-full md:w-[340px] lg:w-[380px] shrink-0 rounded-md p-4"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      background: 'linear-gradient(135deg, rgba(26,23,20,.9) 0%, rgba(15,13,11,.94) 100%)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(142,191,149,.4)',
                      boxShadow: '0 20px 40px rgba(0,0,0,.6), 0 6px 0 rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.1)'
                    }}>
                    <div className="md:hidden text-center mb-2">
                      <h3 className="font-editorial-display text-lg text-[#f5ebd6] uppercase">
                        {new Date(calendarYear, calendarMonth).toLocaleString('pt-BR', { month: 'long' })} {calendarYear}
                      </h3>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center font-editorial-title text-[10px] font-bold text-[#8ebf95] mb-1.5">
                      {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => <div key={i}>{d}</div>)}
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center font-editorial-mono text-[10px]">
                      {(() => {
                        const firstDay = new Date(calendarYear, calendarMonth, 1).getDay()
                        const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate()
                        const cells = []
                        for (let i = 0; i < firstDay; i++) cells.push(<div key={`e-${i}`} className="p-1.5 opacity-10">—</div>)
                        for (let d = 1; d <= daysInMonth; d++) {
                          const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
                          const dayBookings = bookings.filter(b => b.checkIn && b.checkOut && dateStr >= b.checkIn && dateStr <= b.checkOut)
                          const hasBooking = dayBookings.length > 0
                          cells.push(
                            <div key={d} onClick={() => triggerSound('click')}
                              title={hasBooking ? `Reservado: ${dayBookings.map(b => b.guestName).join(', ')}` : ''}
                              className={`py-1.5 rounded flex flex-col items-center justify-center transition-all cursor-pointer-forced ${
                                hasBooking
                                  ? 'bg-[#7a2214] text-[#f5ebd6] font-bold scale-105'
                                  : 'text-[#e5dec9] hover:bg-[#3d4e41]/60'
                              }`}
                              style={{
                                boxShadow: hasBooking
                                  ? '0 3px 6px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.18)'
                                  : 'inset 0 1px 0 rgba(255,255,255,.05)'
                              }}>
                              <span className="leading-none">{d}</span>
                              {hasBooking && <span className="w-1 h-1 rounded-full bg-[#8ebf95] mt-0.5"
                                style={{ boxShadow: '0 0 5px 1px rgba(142,191,149,.75)' }} />}
                            </div>
                          )
                        }
                        return cells
                      })()}
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#3d4e41] text-[9px] font-editorial-mono flex items-center justify-between text-[#8c7a65]">
                      <span>✦ Vermelho = Reservado</span>
                      <span>✦ Livre</span>
                    </div>
                  </div>
                </div>

                {/* dica flutuante */}
                <div className="hero-hint">
                  Clique para expandir
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 6: SETTINGS ==================== */}
        {activeTab === 'settings' && (
          <div className="space-y-12 rise">
            <SectionHeader n="VI." title="Ajustes do Sistema & Personalização" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Paper rot={-0.6} depth={6} front={<span className="tape" />}>
                <div className="paper-card-inner bg-crosshatch p-8 shape-torn-deckle border-t-4 border-[#3d4e41]">
                  <h3 className="font-editorial-title text-xl font-bold uppercase mb-6 emboss-text">🎨 Aparência & Sons</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-[#8c7d6b]/40 pb-4">
                      <div>
                        <span className="font-editorial-title font-bold block">Modo Claro / Escuro</span>
                        <span className="font-editorial-mono text-xs text-[#7a6a58]">Alterne entre o pergaminho claro e o crepúsculo escuro.</span>
                      </div>
                      <button onClick={() => { setLightMode(!lightMode); triggerSound('click') }}
                        className="btn-3d px-4 py-2 bg-[#3d4e41] text-[#f5ebd6] font-editorial-title text-xs uppercase font-bold shape-torn-deckle cursor-pointer-forced">
                        {lightMode ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between border-b border-[#8c7d6b]/40 pb-4">
                      <div>
                        <span className="font-editorial-title font-bold block">Largura do Layout</span>
                        <span className="font-editorial-mono text-xs text-[#7a6a58]">Compacto (mobile) ou Tela Cheia (wide).</span>
                      </div>
                      <button onClick={() => { setLayoutMode(layoutMode === 'compact' ? 'wide' : 'compact'); triggerSound('click') }}
                        className="btn-3d px-4 py-2 bg-[#3d4e41] text-[#f5ebd6] font-editorial-title text-xs uppercase font-bold shape-torn-deckle cursor-pointer-forced">
                        {isWide ? '📱 Modo Compacto' : '🖥️ Modo Tela Cheia'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between border-b border-[#8c7d6b]/40 pb-4">
                      <div>
                        <span className="font-editorial-title font-bold block">Efeitos Sonoros Synthesized</span>
                        <span className="font-editorial-mono text-xs text-[#7a6a58]">Sons vintage suaves acionados em botões e carimbos.</span>
                      </div>
                      <button onClick={() => { setSoundMuted(!soundMuted); if (soundMuted) playSound('chime', false) }}
                        className="btn-3d px-4 py-2 bg-[#3d4e41] text-[#f5ebd6] font-editorial-title text-xs uppercase font-bold shape-torn-deckle cursor-pointer-forced">
                        {soundMuted ? '🔇 Sons: Desligados' : '🔔 Sons: Ativados'}
                      </button>
                    </div>

                    <div className="space-y-2">
                      <label className="font-editorial-title font-bold block text-sm">Escala de Fonte ({fontSizeScale.toFixed(2)}x)</label>
                      <input type="range" min="0.85" max="1.3" step="0.05" value={fontSizeScale}
                        onChange={(e) => setFontSizeScale(parseFloat(e.target.value))}
                        className="w-full cursor-pointer-forced accent-[#3d4e41]" />
                    </div>
                  </div>
                </div>
              </Paper>

              <Paper rot={0.6} depth={6} front={<span className="tape" />}>
                <div className="paper-card-inner bg-crosshatch p-8 shape-torn-deckle border-t-4 border-[#7a2214]">
                  <h3 className="font-editorial-title text-xl font-bold uppercase mb-6 emboss-text">⚙️ Identidade & Pacote de Imagens</h3>
                  <div className="space-y-6">
                    <Field label="Nome do Proprietário / Administrador">
                      <input type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} className={INK} />
                    </Field>
                    <Field label="Pacote de Imagens Padrão do Calendário">
                      <select value={selectedPackId} onChange={(e) => setSelectedPackId(e.target.value)} className={`${INK} cursor-pointer-forced`}>
                        {IMAGE_PACKS.map((pack) => (
                          <option key={pack.id} value={pack.id}>{pack.name}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                </div>
              </Paper>
            </div>
          </div>
        )}
      </div>

      {/* ==================== LIGHTBOX ==================== */}
      {expandedImage && (
        <div className="lightbox-backdrop" onClick={() => { setExpandedImage(null); triggerSound('paper') }}>
          <div className="lightbox-stage" onClick={(e) => e.stopPropagation()}>
            <div
              ref={lightboxTiltRef}
              {...lightboxHandlers}
              className="lightbox-card"
            >
              <img src={expandedImage} alt="Imagem expandida" />
              <button
                onClick={(e) => { e.stopPropagation(); setExpandedImage(null); triggerSound('click') }}
                className="lightbox-close"
                title="Fechar (Esc)"
              >×</button>
              <div className="lightbox-label">
                <span>{activePack.name}</span>
                {new Date(calendarYear, calendarMonth).toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}