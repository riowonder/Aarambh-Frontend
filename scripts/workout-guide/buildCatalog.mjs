import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createInstructionMatcher } from "./matchInstructions.mjs";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const frontendDir = resolve(scriptDir, "../..");
const [guideRoot, everPath, freePath, hasanPath] = process.argv.slice(2);

if (!guideRoot || !everPath || !freePath || !hasanPath) {
  console.error("Usage: node scripts/workout-guide/buildCatalog.mjs <workout-guide-repo> <everkinetic.json> <free-exercise-db.json> <hasan.json>");
  process.exit(1);
}

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
const packageRoot = join(resolve(guideRoot), "packages", "workout-guide");
const visualRevision = "aac599224bb9780305239607ef98540b7e0ce389";
const visualAssetBase = `https://cdn.jsdelivr.net/gh/bryllim/workout-guide@${visualRevision}/packages/workout-guide/`;
const visualExercises = readJson(join(packageRoot, "manifest.json"));
const matchInstructions = createInstructionMatcher({
  everkinetic: readJson(everPath),
  freeExerciseDb: readJson(freePath),
  hasan: readJson(hasanPath),
  manualMatches: readJson(join(scriptDir, "manualInstructionMatches.json")),
});
const publicDir = join(frontendDir, "public", "workout-guide");

const catalog = visualExercises.map((exercise) => {
  if (exercise.frames.length !== 3 ||
      exercise.frames.some((frame) => frame.format !== "svg")) {
    throw new Error("Expected three SVG frames for " + exercise.slug);
  }

  const frames = exercise.frames.map((frame) =>
    visualAssetBase + frame.path.replaceAll("\\", "/"),
  );
  const instruction = matchInstructions(exercise);

  return {
    id: exercise.id,
    slug: exercise.slug,
    name: exercise.name,
    exerciseType: exercise.exerciseType,
    equipment: exercise.equipment,
    primaryMuscle: exercise.primaryMuscle,
    secondaryMuscles: exercise.secondaryMuscles,
    isStretch: exercise.isStretch,
    frames,
    steps: instruction?.steps || [],
    tips: instruction?.tips || [],
    difficulty: instruction?.difficulty || null,
    instructionSource: instruction && {
      name: instruction.sourceName,
      url: instruction.sourceUrl,
      license: instruction.sourceLicense,
    },
    visualSource: exercise.attribution?.source?.name || null,
  };
});

const outputPath = join(frontendDir, "src", "features", "workout-guide", "data", "exerciseCatalog.json");
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, JSON.stringify(catalog, null, 2) + "\n");
copyFileSync(join(packageRoot, "LICENSE-ASSETS"), join(publicDir, "LICENSE-ASSETS"));
copyFileSync(join(packageRoot, "ATTRIBUTION.md"), join(publicDir, "ATTRIBUTION.md"));
console.log("Catalog: " + catalog.length + " exercises, " +
  catalog.filter((exercise) => exercise.steps.length > 0).length +
  " with sourced instructions.");
