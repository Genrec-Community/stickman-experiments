# Qwen3-TTS 0.6B voice experiment (2026-11-19)

User asked to test Qwen3-TTS 0.6B (ONNX preferred) as a candidate narration voice,
with a ~30 second sample, after picking tiny-voca F2 for production the same evening.

## What exists

- Official models (Apache-2.0): Qwen/Qwen3-TTS-12Hz-0.6B-Base (voice CLONING - needs a
  reference speaker, not usable for us) and Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice
  (9 preset voices; English presets: Ryan, Aiden - both male; no English female).
- Official ONNX export: none.
- Community INT8 ONNX (sivasub987/Qwen3-TTS-0.6B-ONNX-INT8, 2.1 GB): Base (cloning)
  variant only, and its bundled sample script does not actually synthesize speech
  (encodes a 440 Hz test tone). Not usable.
- Community CustomVoice ONNX (elbruno, 5.7 GB fp32): aimed at C#; no Python runner.
  Porting the pipeline (KV cache + 15-codebook loop + vocoder) is possible but a real build.

## Samples

Speaker Aiden sample: generated via Qwen's official HF Space (Qwen/Qwen3-TTS),
/generate_custom_voice, model_size 0.6B, language English, instruct "Speak clearly and
engagingly, like a science explainer video narrator." Result: qwen3tts_aiden.wav,
32.4 s, 24 kHz mono, word-perfect transcription. Delivered to the user 2026-11-19.

Speaker Ryan sample + honest CPU timing: generated in GitHub Actions on a plain
ubuntu-latest CPU runner via .github/workflows/qwen3-tts-cpu.yml, which runs
cpu_test.py (this directory) with the official qwen-tts package, fp32 on CPU.
Timing numbers are in the run artifact qwen_timing.txt.

## Script (75 words, fear-explainer family, same as the tiny-voca/Kokoro comparison clips)

A loud bang behind you, and your heart is pounding before you've had time to think.
What just happened inside your body? Your senses race the signal to your brain.
Brain threat-detection circuits, including the amygdala, help flag possible danger.
Within seconds, the sympathetic nervous system switches on. Stress hormones such as
adrenaline enter the bloodstream. Your heart beats faster, your breathing quickens,
and more blood flows to your muscles.

## If Qwen wins

Production path: official qwen-tts package, CustomVoice 0.6B, CPU on the 16 GB
Actions runner (fp32). True ONNX in CI requires porting the C# ONNX runner to Python.
User picks between Ryan and Aiden (the only two English presets).
