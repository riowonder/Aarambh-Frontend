import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

const playbackSequence = [0, 1, 2, 1];

export default function ExerciseFramePlayer({ name, frames }) {
  const [sequencePosition, setSequencePosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasChosenPlayback, setHasChosenPlayback] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => {
      if (!hasChosenPlayback) setIsPlaying(!mediaQuery.matches);
    };

    syncMotionPreference();
    mediaQuery.addEventListener("change", syncMotionPreference);
    return () => mediaQuery.removeEventListener("change", syncMotionPreference);
  }, [hasChosenPlayback]);

  useEffect(() => {
    frames.forEach((source) => {
      const image = new Image();
      image.src = source;
    });
  }, [frames]);

  useEffect(() => {
    if (!isPlaying) return undefined;
    const timer = window.setInterval(() => {
      setSequencePosition((position) => (position + 1) % playbackSequence.length);
    }, 550);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  const frameIndex = playbackSequence[sequencePosition];

  const stepFrame = (direction) => {
    setIsPlaying(false);
    setHasChosenPlayback(true);
    setSequencePosition((position) =>
      (position + direction + playbackSequence.length) % playbackSequence.length,
    );
  };

  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#111214] shadow-2xl shadow-black/30">
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 sm:px-8">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
          Movement preview
        </span>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">
          3 frame loop
        </span>
      </div>

      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_48%,#303734_0%,#171b1a_40%,#111214_75%)] p-6 sm:p-10">
        <div className="pointer-events-none absolute h-[72%] w-[72%] rounded-full border border-white/5" />
        <div className="pointer-events-none absolute h-[52%] w-[52%] rounded-full border border-white/5" />
        <img
          src={frames[frameIndex]}
          alt={`${name} demonstration, frame ${frameIndex + 1} of 3`}
          className="relative z-10 h-full w-full object-contain drop-shadow-[0_20px_24px_rgba(0,0,0,0.25)]"
        />
        <span className="absolute bottom-6 left-6 font-mono text-xs tracking-widest text-zinc-500 sm:bottom-8 sm:left-8">
          {String(frameIndex + 1).padStart(2, "0")} / 03
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-white/10 px-6 py-5 sm:px-8">
        <p className="text-xs leading-relaxed text-zinc-400">
          Three still poses played in sequence.
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => stepFrame(-1)}
            aria-label="Previous pose"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-zinc-300 transition hover:border-white/30 hover:text-white"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => {
              setHasChosenPlayback(true);
              setIsPlaying((playing) => !playing);
            }}
            aria-label={isPlaying ? "Pause animation" : "Play animation"}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400 text-zinc-950 transition hover:bg-emerald-300"
          >
            {isPlaying ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}
          </button>
          <button
            type="button"
            onClick={() => stepFrame(1)}
            aria-label="Next pose"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-zinc-300 transition hover:border-white/30 hover:text-white"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
