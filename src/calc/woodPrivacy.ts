import { fillSegments } from "@/domain/geometry";
import type { FenceProject } from "@/domain/types";

export type WoodPrivacyResult = {
  spans: number;
  rails: number;
  pickets: number;
  linePostsAlongRuns: number;
};

export function calculateWoodPrivacy(project: FenceProject): WoodPrivacyResult {
  const spacing = project.settings.postSpacing;
  const { railsPerSpan, picketWidth, picketGap, wastePercent } = project.settings;
  let spans = 0;
  let linePostsAlongRuns = 0;

  for (const run of project.runs) {
    for (const seg of fillSegments(project, run)) {
      if (seg.length <= 0 || spacing <= 0) continue;
      const segSpans = Math.max(1, Math.ceil(seg.length / spacing));
      spans += segSpans;
      linePostsAlongRuns += Math.max(0, segSpans - 1);
    }
  }

  let rails = spans * railsPerSpan;
  const picketPitch = picketWidth + picketGap;
  let pickets = 0;
  if (picketPitch > 0) {
    for (const run of project.runs) {
      for (const seg of fillSegments(project, run)) {
        pickets += Math.ceil(seg.length / picketPitch);
      }
    }
  }

  if (project.settings.applyWasteToRails && wastePercent > 0) {
    rails = Math.ceil(rails * (1 + wastePercent / 100));
  }
  if (project.settings.applyWasteToPickets && wastePercent > 0) {
    pickets = Math.ceil(pickets * (1 + wastePercent / 100));
  }

  return { spans, rails, pickets, linePostsAlongRuns };
}
