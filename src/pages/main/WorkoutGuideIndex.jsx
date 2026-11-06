import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
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
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-5 sm:px-8 sm:pb-20 sm:pt-7 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5 sm:pb-6">
          <Link to="/" className="text-base font-black uppercase italic tracking-[0.1em] text-white sm:text-xl sm:tracking-[0.15em]">
            Aarambh Fitness
          </Link>
          <span className="rounded-full border border-white/10 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.1em] text-zinc-400 sm:px-4 sm:tracking-[0.2em]">
            Workout guide
          </span>
        </header>

        <aside className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-amber-300/25 bg-amber-300/5 px-4 py-3 text-sm leading-6 text-amber-100 sm:mt-6" aria-label="Workout guide beta notice">
          <span className="rounded-full bg-amber-300 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-zinc-950">Beta</span>
          <p>Some exercises have visuals only; written instructions are not available for every movement yet.</p>
        </aside>

        <section className="mt-9 sm:mt-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-300 sm:text-xs sm:tracking-[0.3em]">
            Move with purpose
          </p>
          <h1 className="mt-3 text-[clamp(2.5rem,9vw,3.25rem)] font-black uppercase italic leading-[0.95] tracking-tight sm:mt-4 sm:text-7xl lg:text-[5rem] xl:text-8xl">
            Workout<span className="block lg:inline"> Guide</span>
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-zinc-400 sm:mt-7 sm:text-base sm:leading-8">
            Explore exercises by muscle or equipment. Open a movement to see its three-frame demonstration and available instructions.
          </p>
          <div className="mt-6 flex flex-nowrap items-center gap-2 text-[11px] font-bold uppercase text-zinc-300 sm:mt-8 sm:gap-3 sm:text-xs sm:tracking-[0.14em]">
            <span className="whitespace-nowrap rounded-full border border-white/10 px-2 py-2 min-[440px]:px-3 sm:px-4">
              {exercises.length}<span className="min-[440px]:hidden"> exercises</span><span className="hidden min-[440px]:inline"> visual exercises</span>
            </span>
            <span className="whitespace-nowrap rounded-full border border-white/10 px-2 py-2 min-[440px]:px-3 sm:px-4">
              {guidesWithSteps}<span className="min-[440px]:hidden"> step guides</span><span className="hidden min-[440px]:inline"> step-by-step guides</span>
            </span>
          </div>
        </section>

        <section className="mt-10 rounded-[1.5rem] border border-white/10 bg-zinc-900/40 p-4 sm:mt-14 sm:p-6" aria-label="Filter exercises">
          <div className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-zinc-400 sm:tracking-[0.2em]">
            <SlidersHorizontal size={17} /> Find a movement
          </div>
          <div className="grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
            <label className="relative">
              <span className="sr-only">Search exercises</span>
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                value={search}
                onChange={(event) => updateFilter(setSearch)(event.target.value)}
                placeholder="Search exercises"
                className="h-12 w-full rounded-xl border border-white/10 bg-zinc-950 pl-11 pr-4 text-base text-white outline-none placeholder:text-zinc-600 focus:border-emerald-400/60 sm:text-sm"
              />
            </label>
            <label>
              <span className="sr-only">Filter by muscle</span>
              <select
                value={muscle}
                onChange={(event) => updateFilter(setMuscle)(event.target.value)}
                className="h-12 w-full rounded-xl border border-white/10 bg-zinc-950 px-4 text-base text-white outline-none focus:border-emerald-400/60 sm:text-sm"
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
                className="h-12 w-full rounded-xl border border-white/10 bg-zinc-950 px-4 text-base text-white outline-none focus:border-emerald-400/60 sm:text-sm"
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
