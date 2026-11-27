#!/usr/bin/env node
/**
 * Deterministic Code-to-HTML -> MP4 Renderer for Day One Film Studio
 *
 * Uses Playwright headless Chromium + FFmpeg stdin image2pipe so every frame
 * is rendered deterministically via window.FILM_ENGINE.seekTo(t) with zero
 * dropped frames (works reliably on CPU-only GitHub Actions runners).
 *
 * Prerequisites:
 *   npm install playwright
 *   npx playwright install chromium
 *   ffmpeg installed on PATH
 *
 * Usage:
 *   node render_video.js <input.html> <output.mp4> [--fps 30] [--aspect 16:9|9:16] [--audio vo.mp3] [--music bgm.mp3]
 */

const { chromium } = require("playwright");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

function parseArgs(argv) {
  const args = { fps: 30, aspect: "16:9", audio: null, music: null };
  const positional = [];
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--fps") args.fps = Number(argv[++i]);
    else if (a === "--aspect") args.aspect = argv[++i];
    else if (a === "--audio") args.audio = argv[++i];
    else if (a === "--music") args.music = argv[++i];
    else positional.push(a);
  }
  if (positional.length < 2) {
    console.error("Usage: node render_video.js <input.html> <output.mp4> [--fps 30] [--aspect 16:9|9:16] [--audio vo.mp3] [--music bgm.mp3]");
    process.exit(1);
  }
  args.input = path.resolve(positional[0]);
  args.output = path.resolve(positional[1]);
  return args;
}

async function main() {
  const opts = parseArgs(process.argv);
  if (!fs.existsSync(opts.input)) {
    throw new Error(`Input HTML not found: ${opts.input}`);
  }

  const isVert = opts.aspect === "9:16";
  const width = isVert ? 1080 : 1920;
  const height = isVert ? 1920 : 1080;

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });

  const fileUrl = `file://${opts.input}?export=1&aspect=${encodeURIComponent(opts.aspect)}`;
  await page.goto(fileUrl, { waitUntil: "load" });
  await page.waitForFunction(() => typeof window.FILM_ENGINE === "object");

  const duration = await page.evaluate(() => window.FILM_ENGINE.getDuration());
  const totalFrames = Math.ceil(duration * opts.fps);
  console.log(`Rendering ${totalFrames} frames (${duration.toFixed(2)}s @ ${opts.fps}fps, ${width}x${height})...`);

  const ffArgs = [
    "-y",
    "-f", "image2pipe",
    "-vcodec", "png",
    "-r", String(opts.fps),
    "-i", "-"
  ];

  let audioInputs = 0;
  if (opts.audio) { ffArgs.push("-i", path.resolve(opts.audio)); audioInputs++; }
  if (opts.music) { ffArgs.push("-i", path.resolve(opts.music)); audioInputs++; }

  if (opts.audio && opts.music) {
    ffArgs.push(
      "-filter_complex", "[1:a]volume=1.0[vo];[2:a]volume=0.22[bgm];[vo][bgm]amix=inputs=2:duration=first:dropout_transition=2[aout]",
      "-map", "0:v", "-map", "[aout]"
    );
  } else if (audioInputs === 1) {
    ffArgs.push("-map", "0:v", "-map", "1:a", "-shortest");
  }

  ffArgs.push(
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-preset", "medium",
    "-crf", "18",
    ...(audioInputs > 0 ? ["-c:a", "aac", "-b:a", "192k"] : []),
    "-movflags", "+faststart",
    opts.output
  );

  const ffmpeg = spawn("ffmpeg", ffArgs, { stdio: ["pipe", "inherit", "inherit"] });

  for (let frame = 0; frame < totalFrames; frame++) {
    const t = frame / opts.fps;
    await page.evaluate((sec) => window.FILM_ENGINE.seekTo(sec), t);
    const pngBuffer = await page.screenshot({ type: "png" });
    if (!ffmpeg.stdin.write(pngBuffer)) {
      await new Promise((resolve) => ffmpeg.stdin.once("drain", resolve));
    }
    if (frame % opts.fps === 0) {
      process.stdout.write(`\rProgress: ${Math.round((frame / totalFrames) * 100)}% (${frame}/${totalFrames})`);
    }
  }

  ffmpeg.stdin.end();
  await new Promise((resolve, reject) => {
    ffmpeg.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`FFmpeg exited with code ${code}`))));
  });
  await browser.close();
  console.log(`\nDone: ${opts.output}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
