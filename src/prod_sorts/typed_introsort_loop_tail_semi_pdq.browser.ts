// Browser entry point for typed_introsort_loop_tail_semi_pdq
import { introsort } from "./typed_introsort_loop_tail_semi_pdq";
import { createTypedBrowserRunner } from "./browser_entry";

export const runTests = createTypedBrowserRunner(introsort, "typed_loop_tail_semi_pdq");

