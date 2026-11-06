import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ExerciseCard({ exercise }) {
  return (
    <Link
      to={"/workout-guide/" + exercise.slug}
      className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-zinc-900/50 transition hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-zinc-900"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[radial-gradient(circle_at_50%_50%,#303734_0%,#171b1a_42%,#111214_80%)]">
        <img
          src={exercise.frames[1]}
          alt={exercise.name + " exercise pose"}
          loading="lazy"
          className="h-full w-full object-contain p-6 transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-zinc-950/75 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-zinc-200 sm:tracking-[0.16em]">
          {exercise.primaryMuscle}
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-black uppercase tracking-tight text-white">
            {exercise.name}
          </h2>
          <ArrowUpRight size={18} className="mt-1 shrink-0 text-zinc-500 transition group-hover:text-emerald-300" />
        </div>
        <p className="mt-2 text-sm text-zinc-400 sm:text-xs">{exercise.equipment}</p>
        <p className="mt-5 border-t border-white/10 pt-4 text-[11px] font-bold uppercase tracking-[0.1em] text-zinc-500 sm:tracking-[0.16em]">
          {exercise.steps.length > 0 ? "Visual + step-by-step guide" : "Visual guide"}
        </p>
      </div>
    </Link>
  );
}
