import { useEffect } from "react";
import { ArrowLeft, Dumbbell, Target } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ExerciseFramePlayer from "../../features/workout-guide/components/ExerciseFramePlayer";
import GuideCredits from "../../features/workout-guide/components/GuideCredits";
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
      <div className="mx-auto max-w-7xl px-5 pb-20 pt-7 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between border-b border-white/10 pb-6">
          <Link to="/" className="text-lg font-black uppercase italic tracking-[0.15em] text-white sm:text-xl">
            Aarambh Fitness
          </Link>
          <Link to="/workout-guide" className="rounded-full border border-white/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 transition hover:text-white sm:px-4">
            Workout guide
          </Link>
        </header>

        <Link to="/workout-guide" className="mt-9 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-zinc-400 transition hover:text-white">
          <ArrowLeft size={15} /> All exercises
        </Link>

        <section className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
          <div className="lg:sticky lg:top-10 lg:self-start">
            <ExerciseFramePlayer key={exercise.slug} name={exercise.name} frames={exercise.frames} />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">
              {exercise.primaryMuscle} / {exercise.equipment}
            </p>
            <h1 className="mt-4 text-5xl font-black uppercase italic leading-none tracking-tight sm:text-7xl">
              {exercise.name}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-zinc-400">
              A three-pose visual guide for this {exerciseType} movement.
              {exercise.steps.length > 0 && " Follow the steps below as you practise the movement."}
            </p>

            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
                <Target size={19} className="text-emerald-300" />
                <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.23em] text-zinc-500">Primary muscle</p>
                <p className="mt-1 text-lg font-bold">{exercise.primaryMuscle}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
                <Dumbbell size={19} className="text-emerald-300" />
                <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.23em] text-zinc-500">Equipment</p>
                <p className="mt-1 text-lg font-bold">{exercise.equipment}</p>
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

            <section className="mt-12 border-t border-white/10 pt-9">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-2xl font-black uppercase tracking-tight sm:text-3xl">How to perform</h2>
                {exercise.steps.length > 0 && (
                  <span className="text-xs font-semibold text-zinc-500">{exercise.steps.length} steps</span>
                )}
              </div>
              {exercise.steps.length > 0 ? (
                <ol className="mt-6 space-y-3">
                  {exercise.steps.map((step, index) => (
                    <li key={index} className="flex gap-5 rounded-2xl border border-white/10 bg-zinc-900/40 p-5">
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

        <GuideCredits instructionSource={exercise.instructionSource} />
      </div>
    </main>
  );
}
