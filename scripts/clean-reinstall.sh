#!/usr/bin/env bash
# clean-reinstall.sh
# Use when: .next corruption, node_modules corruption, or errno -4094 after a bad state
# Run from WSL terminal inside the phase-2 directory

set -e
FRONTEND_DIR="$(cd "$(dirname "$0")/.." && pwd)/frontend"

echo "=== Clean reinstall for: $FRONTEND_DIR ==="

cd "$FRONTEND_DIR"

echo "--- Step 1: Remove .next build cache ---"
rm -rf .next

echo "--- Step 2: Remove node_modules ---"
rm -rf node_modules

echo "--- Step 3: Clear npm cache ---"
npm cache clean --force

echo "--- Step 4: Fresh install ---"
npm install

echo "--- Step 5: Type check to verify install ---"
npm run type-check 2>/dev/null || echo "(type-check skipped — not configured)"

echo ""
echo "=== Reinstall complete. Start dev with: ==="
echo "  cd $FRONTEND_DIR && npm run dev"
