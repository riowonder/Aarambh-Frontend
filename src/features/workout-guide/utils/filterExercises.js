export function filterExercises(exercises, { search, muscle, equipment, withSteps }) {
  const query = search.trim().toLowerCase();

  return exercises.filter((exercise) => {
    if (muscle && exercise.primaryMuscle !== muscle) return false;
    if (equipment && exercise.equipment !== equipment) return false;
    if (withSteps && exercise.steps.length === 0) return false;
    if (!query) return true;

    return [
      exercise.name,
      exercise.primaryMuscle,
      exercise.equipment,
      ...exercise.secondaryMuscles,
    ].some((value) => value.toLowerCase().includes(query));
  });
}
