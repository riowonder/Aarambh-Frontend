const normalize = (value) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const sourceVariantsToReview = new Set([
  "ab-wheel-rollout",
  "barbell-row",
  "bicycle-crunch",
  "chin-up",
  "close-grip-lat-pulldown",
  "donkey-calf-raise",
  "lat-pulldown",
  "neutral-grip-pull-up",
  "spider-curl",
]);

const equipmentTerms = {
  Barbell: /barbell|ez bar|e-z curl bar|trap bar/i,
  Dumbbell: /dumbbell/i,
  Cable: /cable/i,
  Machine: /machine|lever|smith/i,
  Bodyweight: /body|none/i,
  Kettlebell: /kettlebell/i,
  "Resistance Band": /band/i,
  "Pull-up Bar": /bar|body/i,
};

function equipmentMatches(exercise, sourceEquipment) {
  const expected = equipmentTerms[exercise.equipment];
  if (!expected) return true;
  const actual = Array.isArray(sourceEquipment)
    ? sourceEquipment.join(" ")
    : sourceEquipment || "";
  return expected.test(actual);
}

function indexByName(records, getName) {
  const index = new Map();
  for (const record of records) {
    const key = normalize(getName(record));
    index.set(key, [...(index.get(key) || []), record]);
  }
  return index;
}

function validSteps(value, minimum = 2) {
  return Array.isArray(value) && value.length >= minimum &&
    value.every((step) => typeof step === "string" && step.trim().length > 0);
}

export function createInstructionMatcher({ everkinetic, freeExerciseDb, hasan, manualMatches = {} }) {
  const everById = new Map(everkinetic.map((record) => [record.id_num, record]));
  const everByName = indexByName(everkinetic, (record) => record.title);
  const freeByName = indexByName(freeExerciseDb, (record) => record.name);
  const hasanByName = indexByName(hasan, (record) => record.name);
  const manualSources = {
    ever: {
      records: everkinetic,
      getName: (record) => record.title,
      getSteps: (record) => record.steps,
      sourceName: "Everkinetic",
      sourceUrl: "https://github.com/everkinetic/data",
      sourceLicense: "CC BY-SA 4.0",
    },
    free: {
      records: freeExerciseDb,
      getName: (record) => record.name,
      getSteps: (record) => record.instructions,
      sourceName: "free-exercise-db",
      sourceUrl: "https://github.com/yuhonas/free-exercise-db",
      sourceLicense: "Unlicense",
    },
    hasan: {
      records: hasan,
      getName: (record) => record.name,
      getSteps: (record) => record.instruction_steps?.en,
      sourceName: "exercises-dataset",
      sourceUrl: "https://github.com/hasaneyldrm/exercises-dataset",
      sourceLicense: "MIT",
    },
  };

  return (exercise) => {
    const manualMatch = manualMatches[exercise.slug];
    if (manualMatch) {
      const source = manualSources[manualMatch.source];
      const records = source?.records.filter(
        (record) => source.getName(record) === manualMatch.name,
      );
      if (records?.length !== 1 || !validSteps(source.getSteps(records[0]), 1)) {
        throw new Error(`Invalid manual instruction match for ${exercise.slug}`);
      }
      const record = records[0];
      return {
        steps: source.getSteps(record),
        tips: manualMatch.source === "ever" ? record.tips || [] : [],
        sourceName: source.sourceName,
        sourceUrl: source.sourceUrl,
        sourceLicense: source.sourceLicense,
        difficulty: manualMatch.source === "free" ? record.level : null,
      };
    }

    const sourceId = exercise.attribution?.source?.url?.match(/\/(\d+)-tension\.svg/)?.[1];
    const sourceRecord = sourceId && everById.get(sourceId);
    if (sourceRecord && !sourceVariantsToReview.has(exercise.slug) &&
        equipmentMatches(exercise, sourceRecord.equipment) &&
        validSteps(sourceRecord.steps)) {
      return {
        steps: sourceRecord.steps,
        tips: sourceRecord.tips || [],
        sourceName: "Everkinetic",
        sourceUrl: "https://github.com/everkinetic/data",
        sourceLicense: "CC BY-SA 4.0",
        difficulty: null,
      };
    }

    const key = normalize(exercise.name);
    const sources = [
      {
        records: freeByName.get(key) || [],
        getSteps: (record) => record.instructions,
        name: "free-exercise-db",
        url: "https://github.com/yuhonas/free-exercise-db",
        license: "Unlicense",
        getDifficulty: (record) => record.level,
      },
      {
        records: hasanByName.get(key) || [],
        getSteps: (record) => record.instruction_steps?.en,
        name: "exercises-dataset",
        url: "https://github.com/hasaneyldrm/exercises-dataset",
        license: "MIT",
        getDifficulty: () => null,
      },
      {
        records: everByName.get(key) || [],
        getSteps: (record) => record.steps,
        name: "Everkinetic",
        url: "https://github.com/everkinetic/data",
        license: "CC BY-SA 4.0",
        getDifficulty: () => null,
      },
    ];

    for (const source of sources) {
      const record = source.records.find(
        (candidate) =>
          equipmentMatches(exercise, candidate.equipment) &&
          validSteps(source.getSteps(candidate)),
      );
      if (record) {
        return {
          steps: source.getSteps(record),
          tips: source.name === "Everkinetic" ? record.tips || [] : [],
          sourceName: source.name,
          sourceUrl: source.url,
          sourceLicense: source.license,
          difficulty: source.getDifficulty(record),
        };
      }
    }

    return null;
  };
}
