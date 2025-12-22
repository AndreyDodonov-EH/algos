// Browser entry point for introsort_original
import { introsort } from "./introsort_original";
import { createBrowserRunner } from "./browser_entry";

export const runTests = createBrowserRunner(introsort, "original");


