const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const puppeteer = require('puppeteer-core');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'assets/videos/exhibition/home_reel_capture_frames');
const OUTPUT = path.join(ROOT, 'assets/videos/exhibition/12cut-home-film-reel-capture-9x16.mp4');
const CONTACT = path.join(ROOT, 'assets/videos/exhibition/12cut-home-film-reel-capture-contact-sheet.jpg');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const FPS = 24;
const DURATION = 48;
const URL = 'https://12cut.net/?capture=home-reel#examples';

fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForImages(page) {
  await page.waitForFunction(() => {
    const images = Array.from(document.querySelectorAll('.film-reel img'));
    return images.length >= 13 && images.every((img) => img.complete && img.naturalWidth > 0);
  }, { timeout: 30000 });
}

async function preparePage(page) {
  await page.evaluate(() => {
    const originalReel = document.querySelector('.film-reel');
    if (originalReel) {
      const clonedReel = originalReel.cloneNode(true);
      originalReel.replaceWith(clonedReel);
    }

    const style = document.createElement('style');
    style.textContent = `
      html, body {
        background: #1A1A1A !important;
        overflow: hidden !important;
      }
      body > *:not(#wrap), #header_warp, #footer_wrap, .scroll_wrap, .cut-bottom-nav,
      .nav, .cut-mobile-header, .marquee {
        display: none !important;
      }
      #wrap, #container, #contents, .sub_content, .content_box {
        display: block !important;
        width: 100vw !important;
        max-width: none !important;
        min-width: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        float: none !important;
        background: #1A1A1A !important;
      }
      section:not(.examples),
      .examples__header {
        display: none !important;
      }
      .examples {
        display: block !important;
        position: relative !important;
        width: 100vw !important;
        height: 100vh !important;
        min-height: 100vh !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
        background: #1A1A1A !important;
      }
      .examples__marquee {
        display: block !important;
        position: absolute !important;
        top: 210px !important;
        left: 0 !important;
        z-index: 8 !important;
        width: 100vw !important;
        height: auto !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
        -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent) !important;
        mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent) !important;
      }
      .examples__marquee-track {
        animation: none !important;
        will-change: transform !important;
      }
      .examples__marquee span {
        font-size: 70px !important;
        line-height: 1.1 !important;
        color: rgba(245, 240, 232, 0.42) !important;
      }
      .examples__marquee i {
        font-size: 22px !important;
      }
      .film-reel {
        position: absolute !important;
        top: 570px !important;
        left: 50% !important;
        width: min(76vw, 820px) !important;
        max-width: 820px !important;
        margin: 0 !important;
        transform: translateX(-50%) !important;
      }
      .film-reel__ring {
        transition: none !important;
      }
      .film-reel__lens-img {
        transition: none !important;
      }
      .film-reel__viewfinder {
        inset: -12% !important;
      }
    `;
    document.head.appendChild(style);
    document.querySelector('.examples')?.scrollIntoView({ block: 'center' });

    const lensImg = document.querySelector('.film-reel__lens-img');
    const reelRing = document.querySelector('.film-reel__ring');
    const reelSlots = Array.from(document.querySelectorAll('.film-reel__slot img'));
    const marqueeTrack = document.querySelector('.examples__marquee-track');
    const slideSrcs = reelSlots.map((img) => img.src);

    const ease = (x) => {
      const clamped = Math.max(0, Math.min(1, x));
      return clamped * clamped * (3 - 2 * clamped);
    };

    window.__setHomeReelFrame = (seconds) => {
      const stepDuration = 3.2;
      const moveDuration = 0.95;
      const holdDuration = stepDuration - moveDuration;
      const currentStep = Math.floor(seconds / stepDuration);
      const phase = seconds % stepDuration;
      const moveProgress = phase <= holdDuration ? 0 : ease((phase - holdDuration) / moveDuration);
      const virtualStep = currentStep + moveProgress;
      const angle = virtualStep * 30;

      if (reelRing) {
        reelRing.style.transform = `rotate(${angle}deg)`;
      }

      if (lensImg && slideSrcs.length === 12) {
        const visibleStep = currentStep + (moveProgress > 0.55 ? 1 : 0);
        const topSlot = (12 - (visibleStep % 12)) % 12;
        lensImg.src = slideSrcs[topSlot];
        lensImg.style.opacity = moveProgress > 0.42 && moveProgress < 0.62 ? '0.35' : '1';
      }

      if (marqueeTrack) {
        const halfWidth = Math.max(1, marqueeTrack.scrollWidth / 2);
        const offset = (seconds * 34) % halfWidth;
        marqueeTrack.style.transform = `translateX(${-offset}px)`;
      }
    };
  });
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
    defaultViewport: { width: 1080, height: 1920, deviceScaleFactor: 1 },
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
    await page.evaluateOnNewDocument(() => {
      try {
        localStorage.$mylang = 'ja';
        localStorage.removeItem('$lang');
      } catch (error) {
        // Ignore storage failures in transient browser contexts.
      }
    });
    await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });
    await waitForImages(page);
    await preparePage(page);
    await sleep(900);

    const totalFrames = FPS * DURATION;
    const frameDelay = 1000 / FPS;

    for (let frame = 0; frame < totalFrames; frame += 1) {
      await page.evaluate((seconds) => {
        if (typeof window.__setHomeReelFrame === 'function') {
          window.__setHomeReelFrame(seconds);
        }
      }, frame / FPS);
      await page.screenshot({
        path: path.join(OUT_DIR, `frame_${String(frame).padStart(5, '0')}.png`),
        type: 'png',
      });
      if (frame % 120 === 0) {
        console.log(`captured ${frame}/${totalFrames}`);
      }
      await sleep(Math.min(frameDelay, 12));
    }
  } finally {
    await browser.close();
  }

  execFileSync('ffmpeg', [
    '-y',
    '-framerate', String(FPS),
    '-i', path.join(OUT_DIR, 'frame_%05d.png'),
    '-an',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-crf', '18',
    '-preset', 'medium',
    '-movflags', '+faststart',
    OUTPUT,
  ], { stdio: 'inherit' });

  execFileSync('ffmpeg', [
    '-y',
    '-i', OUTPUT,
    '-vf', "select='eq(n,0)+eq(n,96)+eq(n,192)+eq(n,288)+eq(n,384)+eq(n,480)',scale=270:480,tile=3x2",
    '-frames:v', '1',
    '-update', '1',
    CONTACT,
  ], { stdio: 'inherit' });

  console.log(`wrote ${OUTPUT}`);
  console.log(`wrote ${CONTACT}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
