# Dynamic Corporate Site Template

[English](README.md) | [简体中文](README.zh-CN.md)

> A single-page corporate site template in the Monochrome Acid style — pure HTML, CSS and JavaScript, with a complete motion system.

> **Note.** This repository contains company-specific content — brand copy, logos and asset paths. The layout, effects and code are what is worth taking. Replace the content before publishing.


## What this is

This is not a template that adds a fade-in on scroll and calls it dynamic. The motion here is layered and disciplined, which is a harder thing to build than it sounds.

The whole site runs on three colours. Not three plus accents — three. Every section, every hover state, every transition resolves within that constraint, which is why it reads as a coherent design rather than a collection of effects.

## Why we open-sourced it

We built this for our own site and kept the style system after the content moved on.

The content is ours; the design system is not. What is reusable here is the palette discipline, the motion layering and the way the sections are composed. Someone replacing the copy and the logo gets a working site out of it.

## What's in it

- **Three-colour system.** Off-white canvas, near-black, and an acid green accent. Fixed, not a starting point to add to.
- **A full opening sequence.** Preloader counter, multi-column curtain reveal, per-character title entrance, and a graded fade for subtitle and buttons — instead of the page simply appearing.
- **Layered background.** Flowing light haze, a perspective grid floor, oversized outlined marquee text, a halftone dot canvas with breathing waves and pointer ripples, a conic-gradient halo, a glossy sphere, a dashed orbit and a rotating starburst.
- **Scroll-linked parallax.** Five background layers displace at different rates.
- **Section treatment.** Oversized outlined ghost headings with scroll parallax, character-by-character headings, and data blocks rendered as large acid-green numerals.
- **A HUD layer.** A viewing-frame overlay, timecode and section markers in a monospace face, plus a fixed film-grain layer over the whole site.
- **Version archive.** `VERSIONS.md` records what changed in each iteration, so the design decisions are traceable.

## Requirements

Any static file server. No build step, no framework, no dependencies.

## Getting started

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

Replace the copy, logos and links, and it is your site.

## Structure

```
├── VERSIONS.md
├── assets/
│   ├── favicon.ico
│   ├── logo-black.png
│   ├── logo-white.png
│   ├── main.js
│   ├── partners/
│   │   ├── aippt.png
│   │   ├── alibaba-cloud.png
│   │   ├── ant-group.png
│   │   ├── coze.png
│   │   ├── deepseek.png
│   │   ├── feishu.png
│   │   ├── huawei-cloud.png
│   │   ├── minimax.png
│   │   ├── qianwen-office.png
│   │   ├── qiniu.png
│   │   ├── tencent-cloud.png
│   │   ├── tencent.png
│   │   ├── volcengine.png
│   │   ├── workbuddy.png
│   │   ├── xiaohongshu.png
│   │   └── yingdao-rpa.png
│   └── style.css
├── index.html
├── reference-video-analysis/
│   ├── frames/
│   │   ├── k01.jpg
│   │   ├── k02.jpg
│   │   ├── k03.jpg
│   │   ├── k04.jpg
│   │   ├── k05.jpg
│   │   ├── k06.jpg
│   │   ├── k07.jpg
│   │   ├── k08.jpg
│   │   ├── k09.jpg
│   │   ├── k10.jpg
│   │   ├── k11.jpg
│   │   ├── k12.jpg
│   │   ├── k13.jpg
│   │   ├── k14.jpg
│   │   ├── k15.jpg
│   │   ├── k16.jpg
│   │   ├── k17.jpg
│   │   └── k18.jpg
│   └── index.html
└── 动态效果功能清单_V3.docx
```

## Notes and limits

1. **Motion-heavy by design.** Different machines render the layered background at different frame rates. Test on the hardware that matters.
2. **Reduced motion is worth handling.** The animation set is intense enough that respecting the system preference is a real consideration, not a formality.
3. **The grain and blur layers cost GPU time.** They are what makes it feel right and they are also the first things to thin out if performance drops.
4. **Content is company-specific.** Replace it; the value in this repository is the structure.

## License

MIT
