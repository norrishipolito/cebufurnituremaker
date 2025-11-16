/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs');
const { spawn, spawnSync } = require('child_process');
const puppeteer = require('puppeteer');
const ffmpegStaticPath = require('ffmpeg-static');
let ffmpegInstallerPath = null;
try {
  ffmpegInstallerPath = require('@ffmpeg-installer/ffmpeg').path;
} catch {
  // ignore, optional
}
const ffmpeg = require('fluent-ffmpeg');

const ROOT = path.resolve(__dirname, '..');
const PORT = process.env.PORT || 3100;
// Force a longer white lead-in so frame 0 is guaranteed white
const URL = `http://localhost:${PORT}/logo-preview?leadInMs=800`;
const FRAMES_DIR = path.join(ROOT, '.tmp_frames_logo');
const OUTPUT = path.join(ROOT, 'logo-animation.mp4');
const WIDTH = 1280;
const HEIGHT = 720;
const FPS = 60;
const DURATION_SECONDS = 4 / 3; // capture such that duration * slowdown = 4s total
const TOTAL_FRAMES = Math.round(FPS * DURATION_SECONDS);
const SLOWDOWN_FACTOR = 3.5; // slightly slower playback
const OUTPUT_FPS = 120; // ultra-smooth output

async function ensureDeps() {
  let candidate = ffmpegStaticPath;
  if (!candidate || !fs.existsSync(candidate)) {
    candidate = ffmpegInstallerPath;
  }
  if (!candidate || !fs.existsSync(candidate)) {
    throw new Error('Unable to locate ffmpeg binary from ffmpeg-static or @ffmpeg-installer/ffmpeg');
  }
  ffmpeg.setFfmpegPath(candidate);
}

function run(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, { stdio: 'inherit', ...opts });
  if (result.status !== 0) {
    throw new Error(`${cmd} ${args.join(' ')} failed`);
  }
}

async function startServer() {
  // Build first to ensure next start works
  run('pnpm', ['build'], { cwd: ROOT });
  const child = spawn('pnpm', ['start', '-p', String(PORT)], {
    cwd: ROOT,
    stdio: 'inherit',
    env: { ...process.env, PORT: String(PORT) },
  });
  // Wait for server to become available
  await waitForServer();
  return child;
}

async function waitForServer(timeoutMs = 60000) {
  const start = Date.now();
  const http = require('http');
  while (Date.now() - start < timeoutMs) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(URL, (res) => {
          res.resume();
          res.on('end', resolve);
        });
        req.on('error', reject);
      });
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  throw new Error('Timed out waiting for Next.js to start');
}

async function captureFrames() {
  if (fs.existsSync(FRAMES_DIR)) {
    fs.rmSync(FRAMES_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(FRAMES_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    channel: 'chrome',
    defaultViewport: { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.goto(URL, { waitUntil: 'networkidle0' });
    // Wait a moment to ensure styles and animations are ready
    await new Promise((r) => setTimeout(r, 100));
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const frameId = String(i + 1).padStart(4, '0');
      const outPath = path.join(FRAMES_DIR, `frame_${frameId}.png`);
      await page.screenshot({ path: outPath });
      // Advance using a fixed timer interval approximating 60fps
      await new Promise((r) => setTimeout(r, 1000 / FPS));
    }
  } finally {
    await browser.close();
  }
}

async function encodeVideo() {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(path.join(FRAMES_DIR, 'frame_%04d.png'))
      // Read frames slower to achieve smooth slowdown without setpts
      .inputOptions([`-framerate ${Math.max(1, Math.round(FPS / SLOWDOWN_FACTOR))}`])
      .outputOptions([
        '-c:v libx264',
        // Interpolate up to ultra-smooth output FPS
        `-vf minterpolate=fps=${OUTPUT_FPS}:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1`,
        `-r ${OUTPUT_FPS}`,
        '-pix_fmt yuv420p',
        '-crf 18',
        '-preset slow',
      ])
      .size(`${WIDTH}x${HEIGHT}`)
      .on('error', reject)
      .on('end', resolve)
      .save(OUTPUT);
  });
}

async function main() {
  await ensureDeps();
  const server = await startServer();
  try {
    await captureFrames();
    await encodeVideo();
    // Clean frames
    fs.rmSync(FRAMES_DIR, { recursive: true, force: true });
    // eslint-disable-next-line no-console
    console.log(`Saved MP4 to: ${OUTPUT}`);
  } finally {
    server.kill();
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
