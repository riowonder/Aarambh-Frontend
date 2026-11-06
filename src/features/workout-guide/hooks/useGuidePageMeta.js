import { useEffect } from "react";

export function useGuidePageMeta(title) {
  useEffect(() => {
    const previousTitle = document.title;
    const existingRobots = document.querySelector('meta[name="robots"]');
    const previousRobots = existingRobots?.content;
    const robots = existingRobots || document.createElement("meta");

    document.title = title + " | Aarambh Fitness";
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    if (!existingRobots) document.head.appendChild(robots);

    return () => {
      document.title = previousTitle;
      if (existingRobots) {
        existingRobots.content = previousRobots;
      } else {
        robots.remove();
      }
    };
  }, [title]);
}
