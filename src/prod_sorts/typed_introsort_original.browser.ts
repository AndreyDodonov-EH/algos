// Browser entry point for typed_introsort_original
import { introsort } from "./typed_introsort_original";
import { createTypedBrowserRunner } from "./browser_entry";

export const runTests = createTypedBrowserRunner(introsort, "typed_original");

