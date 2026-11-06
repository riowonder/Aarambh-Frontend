import { readFileSync } from "node:fs";

const [catalogPath, everPath, freePath, hasanPath, startArg = "0", countArg = "50"] = process.argv.slice(2);
if (!catalogPath || !everPath || !freePath || !hasanPath) {
  throw new Error("Provide catalog, Everkinetic, free-exercise-db, and exercises-dataset JSON paths");
}

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
const catalog = readJson(catalogPath).filter((exercise) => exercise.steps.length === 0);
const sources = [
  ...readJson(everPath).map((record) => ({ source: "ever", name: record.title, equipment: record.equipment, steps: record.steps, id: record.id_num })),
  ...readJson(freePath).map((record) => ({ source: "free", name: record.name, equipment: record.equipment, steps: record.instructions, id: record.id })),
  ...readJson(hasanPath).map((record) => ({ source: "hasan", name: record.name, equipment: record.equipment, steps: record.instruction_steps?.en, id: record.id })),
].filter((record) => Array.isArray(record.steps) && record.steps.length > 1);

function tokens(name) {
  return new Set(name.toLowerCase()
    .replace(/push[ -]?up/g, "pushup")
    .replace(/pull[ -]?up/g, "pullup")
    .replace(/chin[ -]?up/g, "chinup")
    .replace(/tricep\b/g, "triceps")
    .replace(/rear delt/g, "reverse fly")
    .replace(/[^a-z0-9]+/g, " ")
    .trim().split(/\s+/)
    .filter(Boolean));
}

function score(a, b) {
  const first = tokens(a);
  const second = tokens(b);
  const overlap = [...first].filter((word) => second.has(word)).length;
  const union = new Set([...first, ...second]).size;
  return overlap / union;
}

const start = Number(startArg);
const count = Number(countArg);
for (const exercise of catalog.slice(start, start + count)) {
  const candidates = sources.map((candidate) => ({ ...candidate, score: score(exercise.name, candidate.name) }))
    .filter((candidate) => candidate.score >= 0.25)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ source, name, equipment, score, id }) => ({ source, name, equipment, score: Number(score.toFixed(2)), id }));
  console.log(`${start + catalog.slice(start, start + count).indexOf(exercise)}. ${exercise.name} [${exercise.equipment}] => ${candidates.map((candidate) => `${candidate.source}:${candidate.name} [${candidate.equipment}] (${candidate.score})`).join("; ")}`);
}
