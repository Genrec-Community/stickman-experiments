---
name: day-one-film-studio
description: Design, script, and generate Day One Films style minimalist dark-vector animated short films using a self-contained HTML5/SVG/JS engine and deterministic Playwright-to-FFmpeg MP4 export. Use whenever the user asks to make a Day One Films style video, write a self-improvement animated short film script, build a code-to-HTML animated explainer, create a dark minimalist character animation with a Red-Aura Shadow inner voice, or render an HTML animation into a YouTube or Shorts MP4.
---

# day-one-film-studio

Create Day One Films style animated short films end-to-end using a single declarative JSON script rendered by a self-contained HTML5/SVG/JS engine and exported deterministically to 1080p MP4 via headless Chromium and FFmpeg.

## When to Use

- The user wants a new Day One Films style animated short film on discipline, focus, habits, phone addiction, overthinking, or self-respect.
- The user wants to convert a topic or rough idea into a high-retention emotional parable or 30-day milestone explainer script.
- The user wants a playable HTML5/SVG animation file that can be previewed in the browser and rendered frame-by-frame to MP4 locally or in GitHub Actions.

## Core Visual and Script DNA

Match these signature visual and narrative principles so every generated film feels cohesive and authentic rather than generic.

### Two Proven Script Formats

1. **Format A - Silent or Dialogue-Minimal Emotional Parable (2 to 3.5 min):** Driven by emotional ambient piano, crisp Foley sound cues, 1-sentence narrator captions, and 2-to-5 word lowercase character lines. Follows a 5-act arc: Hook and Inciting Pattern, 3 Escalating Beats with Red Shadow whispers, Rock Bottom and Truth Reframe (often a stark stat or visual metaphor), Quiet Rebuild Montage plus Final Shadow Confrontation, and a Full-Circle Mirror Ending.
2. **Format B - Milestone Narrated Explainer (3 to 5 min):** Calm second-person voiceover ("you") in short punchy sentences (6 to 10 words, ~130 WPM with deliberate pauses) organized into timestamped chapters (`DAY 1`, `DAY 3`, `DAY 7`, `DAY 10`, `DAY 14`, `DAY 21`, `DAY 30`) combining behavioral psychology with visual metaphors (5x5 repeating loop grid, craving-wave curve, peak graph, and Red Shadow negotiations).

Read `references/script-and-scene-guide.md` for exact beat-by-beat pacing templates and the complete JSON schema.

### Visual Direction Rules

- **Dark High-Contrast Stage:** Use a deep charcoal radial vignette (`#0b0b0e` to `#17171d`), horizontal letterbox bars top and bottom, and soft volumetric light cones (warm hanging bulb, moonlight window, desk lamp, or cold blue phone glow) so the bright cream protagonist pops immediately.
- **Bean-Puppet Silhouette:** Render the protagonist as a rounded off-white pill torso (`#ece9e1`) with dark `2.6px` outlines and slightly darker back limbs (`#b8b4ab`) for depth. Express emotion strictly through thick eyebrows, simple dot eyes, and posture.
- **The Red-Aura Shadow Motif:** Represent doubt, craving, or procrastination as a taller pitch-black silhouette (`#050507`) wrapped in a pulsing crimson glow (`#e03131`), narrow red squinting eyes, and floating red lowercase dialogue. Always resolve the climax by having the protagonist stand up and shatter the shadow into red and gold particles.
- **Clean Rounded Typography:** Use rounded marker-style sans-serif typography, white for main text, crimson (`#ef4444`) for shadow whispers and gut-punch stats, and warm gold (`#f5b82e`) for breakthroughs. Keep on-screen text minimal so visuals carry the emotion.

## Workflow

### Step 1: Choose Format and Draft the Script

1. Decide between Format A (parable) or Format B (milestone explainer) based on the user's topic. If the topic is a time-based challenge ("What happens when you quit X for 30 days"), default to Format B; if it is an emotional habit or mindset theme ("Your phone is killing you", "Perfectionism"), default to Format A.
2. Write the tight beat-by-beat script first, keeping every line under 10 words. Ensure at least one **Visual Gut-Punch** scene (`stat_impact`, `matrix_grid`, or `graph_insert`) and one **Shadow Confrontation** scene (`shatterAt`).

### Step 2: Translate Script to Declarative `FILM_SCRIPT` JSON

Map every story beat into the `FILM_SCRIPT.scenes` array using the 6 supported scene types from `assets/template.html` and `references/script-and-scene-guide.md`:

- `title_card`: Opening hook quote or chapter transition.
- `stage`: 2D side-view environments (`bedroom`, `desk`, or custom SVG set extensions) with animated actors, walks, phone glow, floating notifications, HUD counters, camera zooms, and shadow shatter FX.
- `matrix_grid`: Signature 5x5 repeating zoom-out for "you made this promise a hundred times" moments.
- `stat_impact`: Escalating 3-line numerical shock reveal ending in glowing crimson.
- `graph_insert`: Animated glowing bell curve or milestone line chart (`0 min` to `20 min` craving wave, or `DAY 1` to `DAY 14` peak).
- `end_card`: Closing punchline followed by the animated cursor clicking `SUBSCRIBE` and thumbs-up.

### Step 3: Build the Self-Contained HTML Film

1. Start from `assets/template.html` so the film has zero external CDN dependencies and works identically offline, in browser preview, and in headless CI/CD runners.
2. Replace `FILM_SCRIPT` with the new episode JSON. If the story requires a custom prop or environment (for example a soccer field, kitchen mug, or locker hallway), add a new `envName` branch inside `drawEnvironment()` following the exact dark-line (`#3a3a46`) + volumetric spotlight style.
3. Keep `window.FILM_ENGINE.seekTo(sec)`, `getDuration()`, `setExportMode(true)`, and `?export=1&aspect=9:16` intact so automated rendering never breaks.

### Step 4: Verify and Export to MP4

1. Verify there are zero JavaScript syntax errors by parsing the inline script before presenting the HTML file.
2. For browser preview, open the HTML file directly (includes play/pause, scrubber, scene jump pills, 16:9 / 9:16 toggle, synthesized Web Audio chords, and live JSON editor).
3. For deterministic 1080p MP4 rendering (locally or in GitHub Actions), run `scripts/render_video.js` with Playwright and FFmpeg:

```bash
node scripts/render_video.js my-film.html output.mp4 --fps 30 --aspect 16:9 --audio voiceover.mp3 --music piano.mp3
```

## Gotchas

- **Never rely on real-time screen recording:** Real-time capture drops frames on slow CI runners. Always step time deterministically with `window.FILM_ENGINE.seekTo(frame / fps)` as implemented in `scripts/render_video.js`.
- **Avoid walls of text:** Day One Films works because captions are 4 to 9 words and dialogue is 2 to 5 words. Trim anything longer.
- **No external fonts or CDN scripts:** Keep the HTML 100 percent self-contained so headless export never stalls waiting on network requests.
- **Audio sync:** When using Format B voiceover (such as Kokoro-82M or ElevenLabs), measure exact audio clip durations first and set each scene's `duration` in `FILM_SCRIPT` to match the narration timestamps plus a 0.5-second breathing pause.
