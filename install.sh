#!/usr/bin/env bash
set -euo pipefail
if ! command -v docker >/dev/null 2>&1; then echo 'Docker is required: https://docs.docker.com/get-docker/' >&2; exit 1; fi
if [ ! -f .env ]; then cp .env.example .env; echo 'Created .env from .env.example. Review API_KEYS and billing settings before production use.'; fi
docker compose up --build -d
echo 'Nexus Engine is running at http://localhost:3000'
echo 'API docs: http://localhost:3000/docs'
