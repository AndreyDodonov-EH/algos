// Browser entry point for introsort_loop_tail
import { introsort } from "./introsort_loop_tail";
import { createBrowserRunner } from "./browser_entry";

export const runTests = createBrowserRunner(introsort, "loop_tail");


