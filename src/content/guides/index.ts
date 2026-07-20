import { chainLinkFenceMaterialsChecklist } from "./chain-link-fence-materials-checklist";
import { commonFencePlanningMistakes } from "./common-fence-planning-mistakes";
import { fenceInstallationOrder } from "./fence-installation-order";
import { fencePermitAndPropertyLineChecklist } from "./fence-permit-and-property-line-checklist";
import { fencePostSpacingExplained } from "./fence-post-spacing-explained";
import { fenceProjectShoppingList } from "./fence-project-shopping-list";
import { howMuchConcreteForFencePosts } from "./how-much-concrete-for-fence-posts";
import { howToCalculateFencePanelsAndPosts } from "./how-to-calculate-fence-panels-and-posts";
import { howToEstimateFenceWaste } from "./how-to-estimate-fence-waste";
import { howToMeasureForANewFence } from "./how-to-measure-for-a-new-fence";
import { markUndergroundUtilitiesBeforeDigging } from "./mark-underground-utilities-before-digging";
import { measureAndPlanAFenceGate } from "./measure-and-plan-a-fence-gate";
import { planFenceAroundHouseOrStructure } from "./plan-fence-around-house-or-structure";
import { planFenceCornersAndEndPosts } from "./plan-fence-corners-and-end-posts";
import { planFenceOnSlopedGround } from "./plan-fence-on-sloped-ground";
import { privacyFenceMaterialsChecklist } from "./privacy-fence-materials-checklist";
import type { Guide } from "./types";
import { woodPanelsVsIndividualPickets } from "./wood-panels-vs-individual-pickets";

export type { Guide, GuideBlock, GuideCalloutTone } from "./types";
export { estimateReadingMinutes } from "./types";

/**
 * Canonical published guides.
 * Retired (permanent redirects in next.config.ts):
 * - six-foot-vs-eight-foot-fence-sections → fence-post-spacing-explained
 * - handle-uneven-final-fence-section → how-to-calculate-fence-panels-and-posts
 * - fence-post-depth-and-frost → how-much-concrete-for-fence-posts
 */
export const guides: Guide[] = [
  howToMeasureForANewFence,
  howToCalculateFencePanelsAndPosts,
  fencePostSpacingExplained,
  howMuchConcreteForFencePosts,
  planFenceCornersAndEndPosts,
  measureAndPlanAFenceGate,
  woodPanelsVsIndividualPickets,
  planFenceOnSlopedGround,
  privacyFenceMaterialsChecklist,
  chainLinkFenceMaterialsChecklist,
  fenceInstallationOrder,
  commonFencePlanningMistakes,
  fencePermitAndPropertyLineChecklist,
  markUndergroundUtilitiesBeforeDigging,
  fenceProjectShoppingList,
  howToEstimateFenceWaste,
  planFenceAroundHouseOrStructure,
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
