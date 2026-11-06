import exerciseCatalog from "./exerciseCatalog.json";

export const exercises = exerciseCatalog;

export const muscleOptions = [...new Set(exercises.map((exercise) => exercise.primaryMuscle))]
  .sort((a, b) => a.localeCompare(b));

export const equipmentOptions = [...new Set(exercises.map((exercise) => exercise.equipment))]
  .sort((a, b) => a.localeCompare(b));

export const exerciseBySlug = new Map(
  exercises.map((exercise) => [exercise.slug, exercise]),
);
