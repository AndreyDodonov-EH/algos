#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

run_bun_tests() {
    echo "=== Running Introsort Tests with Bun ==="
    
    echo ""
    echo "--- Generic (number[] + Float64Array) ---"
    for file in src/prod_sorts/introsort_original.ts src/prod_sorts/introsort_loop_tail.ts src/prod_sorts/introsort_loop_tail_semi_pdq.ts; do
        if [ -f "$file" ]; then
            echo ">> $file"
            bun "$file"
            echo ""
        fi
    done
    
    echo ""
    echo "--- Typed (Float64Array only) ---"
    for file in src/prod_sorts/typed_introsort_original.ts src/prod_sorts/typed_introsort_loop_tail.ts src/prod_sorts/typed_introsort_loop_tail_semi_pdq.ts; do
        if [ -f "$file" ]; then
            echo ">> $file"
            bun "$file"
            echo ""
        fi
    done
}

run_node_tests() {
    echo "=== Running Introsort Tests with Node ==="
    tsc
    
    echo ""
    echo "--- Generic (number[] + Float64Array) ---"
    for file in dist/prod_sorts/introsort_original.js dist/prod_sorts/introsort_loop_tail.js dist/prod_sorts/introsort_loop_tail_semi_pdq.js; do
        if [ -f "$file" ]; then
            echo ">> $file"
            node "$file"
            echo ""
        fi
    done
    
    echo ""
    echo "--- Typed (Float64Array only) ---"
    for file in dist/prod_sorts/typed_introsort_original.js dist/prod_sorts/typed_introsort_loop_tail.js dist/prod_sorts/typed_introsort_loop_tail_semi_pdq.js; do
        if [ -f "$file" ]; then
            echo ">> $file"
            node "$file"
            echo ""
        fi
    done
}

build_browser_bundles() {
    echo "=== Building Browser Bundles ==="
    mkdir -p dist-browser
    
    echo ""
    echo "--- Generic (number[] + Float64Array) ---"
    for variant in original loop_tail loop_tail_semi_pdq; do
        echo ">> Bundling introsort_${variant}..."
        bun build "src/prod_sorts/introsort_${variant}.browser.ts" \
            --outfile "dist-browser/introsort_${variant}.bundle.js" \
            --format esm \
            --minify
    done
    
    echo ""
    echo "--- Typed (Float64Array only) ---"
    for variant in original loop_tail loop_tail_semi_pdq; do
        echo ">> Bundling typed_introsort_${variant}..."
        bun build "src/prod_sorts/typed_introsort_${variant}.browser.ts" \
            --outfile "dist-browser/typed_introsort_${variant}.bundle.js" \
            --format esm \
            --minify
    done
    
    echo ""
    echo "✅ Browser bundles ready in dist-browser/"
}

run_browser_tests() {
    echo "=== Running Introsort Tests in Browser ==="
    
    # Build the browser bundles first
    build_browser_bundles
    
    echo ""
    echo "Starting local server on http://localhost:3456"
    echo "Press Ctrl+C to stop the server"
    echo ""
    
    # Open browser (works on Linux, macOS, and WSL)
    if command -v xdg-open &> /dev/null; then
        xdg-open "http://localhost:3456/browser-test.html" &
    elif command -v open &> /dev/null; then
        open "http://localhost:3456/browser-test.html" &
    elif command -v wslview &> /dev/null; then
        wslview "http://localhost:3456/browser-test.html" &
    else
        echo "Open http://localhost:3456/browser-test.html in your browser"
    fi
    
    # Start a simple HTTP server using bun
    bun --eval "
        Bun.serve({
            port: 3456,
            async fetch(req) {
                const url = new URL(req.url);
                let path = url.pathname === '/' ? '/browser-test.html' : url.pathname;
                const file = Bun.file('.' + path);
                if (await file.exists()) {
                    const ext = path.split('.').pop();
                    const contentType = {
                        'html': 'text/html',
                        'js': 'application/javascript',
                        'css': 'text/css',
                        'json': 'application/json'
                    }[ext] || 'application/octet-stream';
                    return new Response(file, { headers: { 'Content-Type': contentType } });
                }
                return new Response('Not Found', { status: 404 });
            }
        });
        console.log('Server running at http://localhost:3456');
    "
}

case "$1" in
    bun)
        run_bun_tests
        ;;
    node)
        run_node_tests
        ;;
    browser)
        run_browser_tests
        ;;
    build-browser)
        build_browser_bundles
        ;;
    all|"")
        run_bun_tests
        echo ""
        run_node_tests
        ;;
    *)
        echo "Usage: $0 [bun|node|browser|build-browser|all]"
        echo ""
        echo "Commands:"
        echo "  bun           Run tests with Bun"
        echo "  node          Run tests with Node.js"
        echo "  browser       Build bundles and open browser test page"
        echo "  build-browser Build browser bundles only"
        echo "  all           Run both bun and node tests (default)"
        exit 1
        ;;
esac

