export default function GuideCredits({ instructionSource }) {
  return (
    <footer className="mt-20 border-t border-white/10 pt-7 text-xs leading-6 text-zinc-500">
      <p>
        Exercise illustrations by{" "}
        <a href="https://github.com/bryllim/workout-guide" target="_blank" rel="noopener noreferrer" className="text-zinc-300 underline underline-offset-4">
          Bryl Lim
        </a>
        , based in part on{" "}
        <a href="https://github.com/everkinetic/data" target="_blank" rel="noopener noreferrer" className="text-zinc-300 underline underline-offset-4">
          Everkinetic
        </a>
        . Visual assets are licensed under{" "}
        <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer" className="text-zinc-300 underline underline-offset-4">
          CC BY-SA 4.0
        </a>
        .
      </p>
      {instructionSource && (
        <p className="mt-2">
          Instructions from{" "}
          <a href={instructionSource.url} target="_blank" rel="noopener noreferrer" className="text-zinc-300 underline underline-offset-4">
            {instructionSource.name}
          </a>
          {" "}({instructionSource.license}).
        </p>
      )}
      <a href="/workout-guide/INSTRUCTION-SOURCES.md" className="mt-2 inline-block text-zinc-300 underline underline-offset-4">
        Source and license details
      </a>
    </footer>
  );
}
