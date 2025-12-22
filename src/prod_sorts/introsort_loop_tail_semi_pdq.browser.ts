// Browser entry point for introsort_loop_tail_semi_pdq
import { introsort } from "./introsort_loop_tail_semi_pdq";
import { createBrowserRunner } from "./browser_entry";

export const runTests = createBrowserRunner(introsort, "loop_tail_semi_pdq");


