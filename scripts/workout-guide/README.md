# Workout guide catalog generation

The checked-in catalog uses these sources:

- Workout Guide artwork and manifest: https://github.com/bryllim/workout-guide
- Everkinetic instruction data: https://github.com/everkinetic/data/blob/main/exercises.json
- free-exercise-db instruction data: https://github.com/yuhonas/free-exercise-db/blob/main/dist/exercises.json
- exercises-dataset instruction data: https://github.com/hasaneyldrm/exercises-dataset/blob/main/data/exercises.json

Run the generator with a local Workout Guide checkout and the three downloaded JSON files:

    node scripts/workout-guide/buildCatalog.mjs <workout-guide-checkout> <everkinetic.json> <free-exercise-db.json> <exercises-dataset.json>

It writes src/features/workout-guide/data/exerciseCatalog.json with image URLs pinned to the Workout Guide commit below, and copies the artwork license and attribution files. The frontend does not contain the SVG frames or any exercise images or GIFs from an instruction dataset. The image URLs use jsDelivr's GitHub CDN, so the guide needs that service to be reachable for visuals to load.

Instruction matching uses the Everkinetic source ID where the illustration manifest provides one. Otherwise, it accepts an exact exercise name with compatible equipment. Known mismatched variations are excluded. `manualInstructionMatches.json` records additional matches checked against the exercise name, equipment, and source steps. These checks are editorial, not a trainer's review. Exercises without a suitable instruction match remain in the visual catalog and say that written instructions are not yet available. A gym trainer should check sourced steps before using them as coaching guidance.

To inspect candidate instructions for the remaining exercises, run:

    node scripts/workout-guide/auditCandidates.mjs <catalog.json> <everkinetic.json> <free-exercise-db.json> <exercises-dataset.json> [start] [count]

The audit prints possible names only. A matching name is not sufficient evidence to publish the source steps.

Source snapshot used for the initial catalog:

- Workout Guide commit: aac599224bb9780305239607ef98540b7e0ce389
- Everkinetic JSON SHA-256: 39AEA039B5F4097B58965A7F33FDDB3C1ACCFBC47A94F76CCFD5559E3CB955E9
- free-exercise-db JSON SHA-256: 5BB747E3FC658F095A60DCBF6D53C96627ACDCC6FFB6FFFDE86F7E26995D40BF
- exercises-dataset JSON SHA-256: 656634224B8977B99A6D765470EE123260D4979715EAA4E7C0B7C8BB0D79F93D

The current catalog contains 302 visual exercises and 162 exercises with sourced instructions. The other 140 still have no suitable checked match.
