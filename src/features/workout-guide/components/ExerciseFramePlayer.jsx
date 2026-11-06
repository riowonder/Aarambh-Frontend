import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Repeat2 } from "lucide-react";

export default function ExerciseFramePlayer({ name, frames }) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [isLooping, setIsLooping] = useState(false);

  useEffect(() => {
    frames.forEach((source) => {
      const image = new Image();
      image.src = source;
    });
  }, [frames]);

  useEffect(() => {
    if (!isLooping || frames.length < 2) return undefined;

    const timer = window.setInterval(() => {
      setFrameIndex((index) => (index + 1) % frames.length);
    }, 550);

    return () => window.clearInterval(timer);
  }, [frames.length, isLooping]);

  const stepFrame = (direction) => {
    setIsLooping(false);
    setFrameIndex((index) => (index + direction + frames.length) % frames.length);
  };

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#111214] shadow-2xl shadow-black/30 sm:rounded-[2rem]">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-4 sm:px-8 sm:py-5">
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-400 sm:tracking-[0.3em]">
          Movement preview
        </span>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-emerald-300 sm:tracking-[0.2em]">
          {frames.length} frames
        </span>
      </div>

      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_48%,#303734_0%,#171b1a_40%,#111214_75%)] p-5 sm:p-10">
        <div className="pointer-events-none absolute h-[72%] w-[72%] rounded-full border border-white/5" />
        <div className="pointer-events-none absolute h-[52%] w-[52%] rounded-full border border-white/5" />
        <img
          src={frames[frameIndex]}
          alt={`${name} demonstration, frame ${frameIndex + 1} of ${frames.length}`}
          className="relative z-10 h-full w-full object-contain drop-shadow-[0_20px_24px_rgba(0,0,0,0.25)]"
        />
        <span className="absolute bottom-5 left-5 font-mono text-xs tracking-widest text-zinc-400 sm:bottom-8 sm:left-8">
          {String(frameIndex + 1).padStart(2, "0")} / {String(frames.length).padStart(2, "0")}
        </span>
      </div>

      <div className="flex flex-col gap-3 border-t border-white/10 px-4 py-4 sm:px-8 sm:py-5 xl:flex-row xl:items-center xl:justify-between">
        <p className="text-sm leading-5 text-zinc-400">
          {isLooping ? "Looping through frames." : "Use the arrows to view each frame."}
        </p>
        <div className="flex items-center justify-between gap-2 sm:justify-end">
          <button
            type="button"
            onClick={() => stepFrame(-1)}
            aria-label="Previous frame"
            disabled={frames.length < 2}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-zinc-200 transition hover:border-white/40 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 disabled:opacity-40"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => setIsLooping((looping) => !looping)}
            aria-pressed={isLooping}
            disabled={frames.length < 2}
            className={`flex h-11 items-center justify-center gap-2 rounded-full px-4 text-xs font-bold uppercase tracking-[0.08em] transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 disabled:opacity-40 ${isLooping ? "bg-emerald-400 text-zinc-950 hover:bg-emerald-300" : "border border-emerald-400/50 text-emerald-300 hover:bg-emerald-400/10"}`}
          >
            <Repeat2 size={17} /> {isLooping ? "Stop loop" : "Loop"}
          </button>
          <button
            type="button"
            onClick={() => stepFrame(1)}
            aria-label="Next frame"
            disabled={frames.length < 2}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-zinc-200 transition hover:border-white/40 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 disabled:opacity-40"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
