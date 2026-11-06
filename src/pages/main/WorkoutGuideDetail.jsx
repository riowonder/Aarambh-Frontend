import { useEffect } from "react";
import { Dumbbell, Target } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ExerciseFramePlayer from "../../features/workout-guide/components/ExerciseFramePlayer";
import { exerciseBySlug } from "../../features/workout-guide/data/catalog";
import { useGuidePageMeta } from "../../features/workout-guide/hooks/useGuidePageMeta";

export default function WorkoutGuideDetail() {
  const { slug } = useParams();
  const exercise = exerciseBySlug.get(slug);
  useGuidePageMeta(exercise?.name || "Exercise Not Found");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!exercise) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 text-center text-white">
        <h1 className="text-3xl font-black uppercase">Exercise not found</h1>
        <Link to="/workout-guide" className="mt-6 text-sm text-emerald-300 underline underline-offset-4">
          Browse the workout guide
        </Link>
      </main>
    );
  }

  const exerciseType = exercise.exerciseType.replaceAll("_", " ");

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-400/30">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-5 sm:px-8 sm:pb-20 sm:pt-7 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5 sm:pb-6">
          <Link to="/" className="text-base font-black uppercase italic tracking-[0.1em] text-white sm:text-xl sm:tracking-[0.15em]">
            Aarambh Fitness
          </Link>
          <Link to="/workout-guide" className="rounded-full border border-white/10 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.1em] text-zinc-400 transition hover:text-white sm:px-4 sm:tracking-[0.2em]">
            Workout guide
          </Link>
        </header>

        <section className="mt-8 grid gap-8 sm:mt-10 sm:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
          <div className="lg:sticky lg:top-10 lg:self-start">
            <ExerciseFramePlayer key={exercise.slug} name={exercise.name} frames={exercise.frames} />
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-300 sm:text-xs sm:tracking-[0.3em]">
              {exercise.primaryMuscle} / {exercise.equipment}
            </p>
            <h1 className="mt-3 break-words text-3xl font-black uppercase italic leading-tight tracking-tight sm:mt-4 sm:text-5xl lg:text-6xl">
              {exercise.name}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-400 sm:mt-6 sm:text-base sm:leading-8">
              A three-frame visual guide for this {exerciseType} movement.
              {exercise.steps.length > 0 && " Follow the steps below as you practise the movement."}
            </p>

            <div className="mt-7 grid grid-cols-2 gap-2 sm:mt-9 sm:gap-3">
              <div className="min-w-0 rounded-2xl border border-white/10 bg-zinc-900/60 p-3 sm:p-5">
                <Target size={19} className="text-emerald-300" />
                <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.08em] text-zinc-500 sm:mt-5 sm:tracking-[0.23em]">Primary muscle</p>
                <p className="mt-1 break-words text-sm font-bold sm:text-lg">{exercise.primaryMuscle}</p>
              </div>
              <div className="min-w-0 rounded-2xl border border-white/10 bg-zinc-900/60 p-3 sm:p-5">
                <Dumbbell size={19} className="text-emerald-300" />
                <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.08em] text-zinc-500 sm:mt-5 sm:tracking-[0.23em]">Equipment</p>
                <p className="mt-1 break-words text-sm font-bold sm:text-lg">{exercise.equipment}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 px-4 py-2 text-xs capitalize text-zinc-300">
                {exerciseType}
              </span>
              {exercise.difficulty && (
                <span className="rounded-full border border-white/10 px-4 py-2 text-xs capitalize text-zinc-300">
                  {exercise.difficulty}
                </span>
              )}
              {exercise.secondaryMuscles.map((muscle) => (
                <span key={muscle} className="rounded-full border border-white/10 px-4 py-2 text-xs text-zinc-300">
                  {muscle}
                </span>
              ))}
            </div>

            <section className="mt-10 border-t border-white/10 pt-7 sm:mt-12 sm:pt-9">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-2xl font-black uppercase tracking-tight sm:text-3xl">How to perform</h2>
                {exercise.steps.length > 0 && (
                  <span className="text-xs font-semibold text-zinc-500">{exercise.steps.length} steps</span>
                )}
              </div>
              {exercise.steps.length > 0 ? (
                <ol className="mt-6 space-y-3">
                  {exercise.steps.map((step, index) => (
                    <li key={index} className="flex gap-3 rounded-2xl border border-white/10 bg-zinc-900/40 p-4 sm:gap-5 sm:p-5">
                      <span className="font-mono text-sm font-bold text-emerald-300">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="text-sm leading-7 text-zinc-300">{step}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
                  <p className="text-sm leading-7 text-zinc-300">
                    Written instructions are not available for this exercise yet. Ask an Aarambh trainer to demonstrate the movement and check your form.
                  </p>
                </div>
              )}
            </section>

            {exercise.tips.length > 0 && (
              <section className="mt-10 rounded-2xl border border-emerald-400/15 bg-emerald-400/5 p-6">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-200">Form notes</h2>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-zinc-300">
                  {exercise.tips.map((tip, index) => <li key={index}>{tip}</li>)}
                </ul>
              </section>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}
