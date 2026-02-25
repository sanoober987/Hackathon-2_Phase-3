#!/usr/bin/env bash
# dev-start.sh — Start both backend and frontend for development
# Run from WSL: bash scripts/dev-start.sh
# Requires: tmux (sudo apt install tmux) OR run each block manually in separate terminals

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FRONTEND="$ROOT/frontend"
BACKEND="$ROOT/backend"

echo "=== Phase-2 Dev Environment ==="
echo "Root: $ROOT"
echo ""

# Verify .env files exist
if [ ! -f "$BACKEND/.env" ]; then
  echo "ERROR: $BACKEND/.env not found."
  echo "       Copy backend/.env.example to backend/.env and fill in your values."
  exit 1
fi

if [ ! -f "$FRONTEND/.env.local" ]; then
  echo "ERROR: $FRONTEND/.env.local not found."
  echo "       Create it with: echo 'NEXT_PUBLIC_API_URL=http://127.0.0.1:8000' > frontend/.env.local"
  exit 1
fi

# ── Start with tmux if available ──────────────────────────────────────────────
if command -v tmux &>/dev/null; then
  SESSION="phase2-dev"
  tmux kill-session -t "$SESSION" 2>/dev/null || true

  tmux new-session -d -s "$SESSION" -x 220 -y 50

  # Pane 1: Backend
  tmux rename-window -t "$SESSION:0" "backend"
  tmux send-keys -t "$SESSION:0" "cd '$BACKEND' && source venv/bin/activate && uvicorn app.main:app --reload --host 127.0.0.1 --port 8000" Enter

  # Pane 2: Frontend
  tmux new-window -t "$SESSION" -n "frontend"
  tmux send-keys -t "$SESSION:1" "cd '$FRONTEND' && npm run dev" Enter

  tmux attach-session -t "$SESSION"
else
  # No tmux — print manual instructions
  echo "tmux not found. Start each service manually:"
  echo ""
  echo "Terminal 1 — Backend:"
  echo "  cd '$BACKEND'"
  echo "  source venv/bin/activate"
  echo "  uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"
  echo ""
  echo "Terminal 2 — Frontend:"
  echo "  cd '$FRONTEND'"
  echo "  npm run dev"
  echo ""
  echo "Then open: http://localhost:3000"
  echo "API docs:  http://127.0.0.1:8000/docs"
fi
