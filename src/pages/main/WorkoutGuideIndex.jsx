import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Search, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import ExerciseCard from "../../features/workout-guide/components/ExerciseCard";
import GuideCredits from "../../features/workout-guide/components/GuideCredits";
import { equipmentOptions, exercises, muscleOptions } from "../../features/workout-guide/data/catalog";
import { useGuidePageMeta } from "../../features/workout-guide/hooks/useGuidePageMeta";
import { filterExercises } from "../../features/workout-guide/utils/filterExercises";

const pageSize = 24;

export default function WorkoutGuideIndex() {
  useGuidePageMeta("Workout Guide");
  const [search, setSearch] = useState("");
  const [muscle, setMuscle] = useState("");
  const [equipment, setEquipment] = useState("");
  const [withSteps, setWithSteps] = useState(false);
  const [visibleCount, setVisibleCount] = useState(pageSize);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const results = useMemo(
    () => filterExercises(exercises, { search, muscle, equipment, withSteps }),
    [search, muscle, equipment, withSteps],
  );
  const visibleExercises = results.slice(0, visibleCount);
  const guidesWithSteps = exercises.filter((exercise) => exercise.steps.length > 0).length;

  const updateFilter = (setter) => (value) => {
    setter(value);
    setVisibleCount(pageSize);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-400/30">
      <div className="mx-auto max-w-7xl px-5 pb-20 pt-7 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between border-b border-white/10 pb-6">
          <Link to="/" className="text-lg font-black uppercase italic tracking-[0.15em] text-white sm:text-xl">
            Aarambh Fitness
          </Link>
          <span className="rounded-full border border-white/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 sm:px-4">
            Workout guide
          </span>
        </header>

        <aside className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-amber-300/25 bg-amber-300/5 px-4 py-3 text-sm text-amber-100" aria-label="Workout guide beta notice">
          <span className="rounded-full bg-amber-300 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-950">Beta</span>
          <p>Some exercises have visuals only; written instructions are not available for every movement yet.</p>
        </aside>

        <Link to="/" className="mt-9 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-zinc-400 transition hover:text-white">
          <ArrowLeft size={15} /> Back to home
        </Link>

        <section className="mt-12 max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">
            Move with purpose
          </p>
          <h1 className="mt-4 text-5xl font-black uppercase italic leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
            Workout<br />Guide
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-zinc-400">
            Explore exercises by muscle or equipment. Open a movement to see its three-pose demonstration and available instructions.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-xs font-bold uppercase tracking-[0.14em] text-zinc-300">
            <span className="rounded-full border border-white/10 px-4 py-2">{exercises.length} visual exercises</span>
            <span className="rounded-full border border-white/10 px-4 py-2">{guidesWithSteps} step-by-step guides</span>
          </div>
        </section>

        <section className="mt-14 rounded-[1.5rem] border border-white/10 bg-zinc-900/40 p-5 sm:p-6" aria-label="Filter exercises">
          <div className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
            <SlidersHorizontal size={17} /> Find a movement
          </div>
          <div className="grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
            <label className="relative">
              <span className="sr-only">Search exercises</span>
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                value={search}
                onChange={(event) => updateFilter(setSearch)(event.target.value)}
                placeholder="Search exercises or muscles"
                className="h-12 w-full rounded-xl border border-white/10 bg-zinc-950 pl-11 pr-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-emerald-400/60"
              />
            </label>
            <label>
              <span className="sr-only">Filter by muscle</span>
              <select
                value={muscle}
                onChange={(event) => updateFilter(setMuscle)(event.target.value)}
                className="h-12 w-full rounded-xl border border-white/10 bg-zinc-950 px-4 text-sm text-white outline-none focus:border-emerald-400/60"
              >
                <option value="">All muscles</option>
                {muscleOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
            <label>
              <span className="sr-only">Filter by equipment</span>
              <select
                value={equipment}
                onChange={(event) => updateFilter(setEquipment)(event.target.value)}
                className="h-12 w-full rounded-xl border border-white/10 bg-zinc-950 px-4 text-sm text-white outline-none focus:border-emerald-400/60"
              >
                <option value="">All equipment</option>
                {equipmentOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
          </div>
          <label className="mt-5 inline-flex cursor-pointer items-center gap-3 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={withSteps}
              onChange={(event) => updateFilter(setWithSteps)(event.target.checked)}
              className="h-4 w-4 accent-emerald-400"
            />
            Show only exercises with instructions
          </label>
        </section>

        <section className="mt-10" aria-live="polite">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-black uppercase tracking-tight sm:text-3xl">Exercises</h2>
            <p className="text-xs font-semibold text-zinc-500">
              {results.length} {results.length === 1 ? "result" : "results"}
            </p>
          </div>
          {results.length > 0 ? (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleExercises.map((exercise) => <ExerciseCard key={exercise.id} exercise={exercise} />)}
              </div>
              {visibleCount < results.length && (
                <div className="mt-10 text-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((count) => count + pageSize)}
                    className="rounded-full border border-white/20 px-7 py-3 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:border-emerald-300 hover:text-emerald-300"
                  >
                    Load more
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-10 text-center">
              <p className="text-lg font-bold">No exercises found</p>
              <p className="mt-2 text-sm text-zinc-400">Try another search or change the filters.</p>
            </div>
          )}
        </section>

        <GuideCredits />
      </div>
    </main>
  );
}
