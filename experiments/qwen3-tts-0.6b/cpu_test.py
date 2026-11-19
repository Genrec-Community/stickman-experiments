import os, time
import numpy as np
import torch
import soundfile as sf
from qwen_tts import Qwen3TTSModel

TEXT = ("A loud bang behind you, and your heart is pounding before you've had time to think. "
        "What just happened inside your body? Your senses race the signal to your brain. "
        "Brain threat-detection circuits, including the amygdala, help flag possible danger. "
        "Within seconds, the sympathetic nervous system switches on. "
        "Stress hormones such as adrenaline enter the bloodstream. "
        "Your heart beats faster, your breathing quickens, and more blood flows to your muscles.")

n = os.cpu_count() or 4
torch.set_num_threads(n)
print(f"cpu_count={n}", flush=True)

t0 = time.time()
model = Qwen3TTSModel.from_pretrained(
    "Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice",
    device_map="cpu",
    dtype=torch.float32,
)
load_s = time.time() - t0
print(f"model load: {load_s:.1f}s", flush=True)

t0 = time.time()
wavs, sr = model.generate_custom_voice(
    text=TEXT,
    language="English",
    speaker="Ryan",
    instruct="Speak clearly and engagingly, like a science explainer video narrator.",
)
gen_s = time.time() - t0

w = wavs[0]
w = w.detach().cpu().numpy() if hasattr(w, "detach") else np.asarray(w)
dur = len(w) / sr
sf.write("/tmp/qwen3tts_ryan_cpu.wav", w, sr)

lines = [
    f"cpu_count={n}",
    f"load_s={load_s:.1f}",
    f"gen_s={gen_s:.2f}",
    f"audio_s={dur:.2f}",
    f"rtf={gen_s / dur:.2f}",
    f"words={len(TEXT.split())}",
]
with open("/tmp/qwen_timing.txt", "w") as f:
    f.write("\n".join(lines) + "\n")
print("\n".join(lines), flush=True)
