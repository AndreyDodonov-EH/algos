#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

run_bun_tests() {
    echo "=== Running Introsort Tests with Bun ==="
    for file in src/prod_sorts/introsort_*.ts; do
        echo ">> $file"
        bun "$file"
        echo ""
    done
}

run_node_tests() {
    echo "=== Running Introsort Tests with Node ==="
    tsc
    for file in dist/prod_sorts/introsort_*.js; do
        echo ">> $file"
        node "$file"
        echo ""
    done
}

case "$1" in
    bun)
        run_bun_tests
        ;;
    node)
        run_node_tests
        ;;
    all|"")
        run_bun_tests
        echo ""
        run_node_tests
        ;;
    *)
        echo "Usage: $0 [bun|node|all]"
        exit 1
        ;;
esac

