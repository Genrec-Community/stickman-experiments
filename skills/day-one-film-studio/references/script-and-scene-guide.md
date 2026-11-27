# Script Writing and Scene JSON Reference

## 1. Format A: Silent / Dialogue-Minimal Emotional Parable (2:00 to 3:30)

Best for emotional habits, self-worth, phone addiction, perfectionism, or family themes.

### 5-Act Beat Sheet

1. **Act 1 - Hook and Inciting Pattern (0:00 to 0:20)**
   - Opening title card or immediate scene with 1 short line (`"Just five minutes." He said it every day.`).
   - Show the protagonist repeating the flaw immediately.
2. **Act 2 - Escalation and Shadow Whispers (0:20 to 1:15)**
   - 3 escalating moments where the flaw hurts the protagonist or someone they care about.
   - After each beat, the Red-Aura Shadow appears behind them with a 2-to-5 word crimson whisper (`"you're not good enough."`, `"just one more."`).
   - If relevant, keep a persistent HUD ticking up (`SCREEN TIME TODAY: 0h 05m -> 9h 13m`).
3. **Act 3 - Rock Bottom and Reframe (1:15 to 1:45)**
   - Deliver a stark numerical shock (`stat_impact`) or a quiet mentor reframe (`"Broken isn't finished. It's where the gold goes."`).
4. **Act 4 - The Quiet Rebuild and Final Test (1:45 to 2:45)**
   - Short daily progression montage (`DAY 1` through `DAY 6`) under warm desk lamps or training lights.
   - The Red Shadow returns one last time at the climax; the protagonist refuses and shatters it (`shatterAt`).
5. **Act 5 - Full-Circle Payoff and CTA (2:45 to 3:20)**
   - Mirror Act 1 with the new behavior, end on a 2-to-4 word punchline (`"Look up."`), and finish with `end_card`.

## 2. Format B: 30-Day Milestone Narrated Explainer (3:30 to 5:00)

Best for habit-quitting timelines, dopamine resets, or mental-model breakdowns.

### 7-Chapter Structure

- **DAY 1 (The False High):** Confident promise + `matrix_grid` 5x5 zoom-out showing how many times you made the same promise.
- **DAY 3 (The Withdrawal Peak):** Sleepless night + Red Shadow temptation + `graph_insert` Craving Wave (`0 min` to `20 min`).
- **DAY 7 (The Energy Return):** Waking up early + training/studying + optional golden peak graph.
- **DAY 10 (The Negotiator):** Urges get quieter; Red Shadow stops screaming and starts bargaining (`"you've earned one."` - "the voice that sounds like you").
- **DAY 14 (The Flatline):** Low energy, muted mood, temptation to quit; reframe ("Boring comes before better.").
- **DAY 21 (The Return):** Normal joys hit again (food, music, eye contact); Shadow shrinks and fades.
- **DAY 30 (Control, Not Magic):** Mirror scene; Shadow still exists in the background but no longer runs your life. Close on `"Start your Day 1 today."`.

### Voiceover Pacing Rules

- Write in second person ("you").
- Keep sentences short: 6 to 10 words average.
- Target ~125 to 135 words per minute with 0.5s to 1.2s silent beats after every punchline.
- Pitch-shift the Red Shadow lines down by 4 to 6 semitones with subtle reverb so it contrasts sharply with the calm main narrator.

## 3. Declarative `FILM_SCRIPT` JSON Schema

```json
{
  "meta": {
    "title": "Episode Title",
    "aspect": "16:9",
    "fps": 30
  },
  "scenes": [
    {
      "id": "unique_scene_id",
      "label": "1. Short Pill Label",
      "type": "title_card | stage | matrix_grid | stat_impact | graph_insert | end_card",
      "duration": 5.0,
      "chapterTop": "DAY 1",
      "stampBottomRight": "MONDAY",
      "caption": "Optional bottom subtitle line.",
      "chord": [220, 261.63, 329.63]
    }
  ]
}
```

### Scene-Specific Fields

- **`title_card`**: `headline`, `subline`.
- **`stage`**:
  - `env`: `"bedroom"` or `"desk"` (extend `drawEnvironment()` for custom sets).
  - `hudTopLeft`: `{ "label": "SCREEN TIME TODAY", "startMin": 5, "endMin": 312 }`.
  - `camera`: `{ "zoomFrom": 1.0, "zoomTo": 1.1, "focusX": 640, "focusY": 420 }`.
  - `actors`: Array of `{ id, role: "protagonist" | "shadow", x, xTo, pose: "stand" | "sit_phone" | "loom", expression: "neutral" | "tired" | "determined", facing: 1 | -1, phoneGlow, notifications, goldCracks, appearAt, shatterAt, speech: { text, at, color } }`.
- **`matrix_grid`**: `speechText` (repeated in all 25 tiles).
- **`stat_impact`**: `steps` array of `{ at, text, color, size, glow, sub }`.
- **`graph_insert`**: `xStart`, `xEnd`, `peakLabel`, `color`.
- **`end_card`**: `closingTop`, `closingMain`, `ctaText`.
