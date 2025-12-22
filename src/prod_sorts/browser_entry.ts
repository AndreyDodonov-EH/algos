// Browser entry point generator - this file is used as a template
// Each introsort variant will have its own bundle that exports runTests()

import { 
    validateArray, 
    validateTyped, 
    benchmarkArray, 
    benchmarkTyped,
    type NumericArray 
} from "./test_harness";

export type IntrosortFn = (A: NumericArray) => void;
export type IntrosortTypedFn = (A: Float64Array) => void;

export function createBrowserRunner(introsort: IntrosortFn, label: string) {
    return async function runTests(mode: 'all' | 'validate' | 'benchmark' = 'all') {
        console.log(`\n========== ${label.toUpperCase()} ==========`);
        
        // Use smaller sizes for browser to avoid freezing
        const benchmarkSize = 100_000;
        
        if (mode === 'all' || mode === 'validate') {
            validateArray(introsort, label);
            validateTyped(introsort, label);
        }
        
        if (mode === 'all' || mode === 'benchmark') {
            benchmarkArray(introsort, label, benchmarkSize);
            benchmarkTyped(introsort, label, benchmarkSize);
        }
        
        // Yield to UI thread between test runs
        await new Promise(resolve => setTimeout(resolve, 10));
    };
}

// For typed-only introsort variants (Float64Array only)
export function createTypedBrowserRunner(introsort: IntrosortTypedFn, label: string) {
    return async function runTests(mode: 'all' | 'validate' | 'benchmark' = 'all') {
        console.log(`\n========== ${label.toUpperCase()} (Float64Array only) ==========`);
        
        // Use smaller sizes for browser to avoid freezing
        const benchmarkSize = 100_000;
        
        if (mode === 'all' || mode === 'validate') {
            validateTyped(introsort, label);
        }
        
        if (mode === 'all' || mode === 'benchmark') {
            benchmarkTyped(introsort, label, benchmarkSize);
        }
        
        // Yield to UI thread between test runs
        await new Promise(resolve => setTimeout(resolve, 10));
    };
}


