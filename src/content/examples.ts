/**
 * @deprecated Shallow worked-example cards were replaced by the Scenario Studio
 * registry in `@/content/scenarioStudio`. Kept as a thin re-export so any stray
 * imports fail loudly at type level if still used incorrectly.
 */
export {
  scenarioStudioEntries as examples,
  type ScenarioStudioEntry as WorkedExample,
} from "@/content/scenarioStudio";
