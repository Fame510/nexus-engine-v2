# Nexus Engine v2

**Created and authored solely by Dante Bullock (@Fame510).**

Nexus Engine is browser intelligence that ships: an open-core execution runtime with a hosted SaaS path for teams that need rendered web data to become structured, auditable, repeatable evidence. This README distinguishes implemented controls from roadmap claims.

Nexus Engine v2 is an industrial browser-intelligence runtime built from the original Nexus Scraper vision. It provides a durable Redis-backed job plane, a unified Playwright/Puppeteer execution interface, headed and headless browser modes, bounded extraction, artifacts, replayable job state, WebSocket-ready events, Prometheus metrics, and explicit security policy enforcement.

## What is implemented

- **Durable jobs:** BullMQ with Redis persistence, retries, exponential backoff, stalled-job recovery, cancellation, and retention.
- **Browser execution:** Playwright Chromium and Puppeteer adapters behind one interface, isolated contexts, headless production mode, and headed mode under Xvfb.
- **Extraction:** CSS selector extraction with text and numeric transforms, content hashing, HTML and screenshot artifacts, and metadata capture.
- **Security:** Bearer API keys, SSRF protection through DNS resolution, private-network blocking, protocol validation, action caps, disabled arbitrary script execution, payload limits, navigation limits, and screenshot limits.
- **Operations:** Structured JSON logs, health endpoint, Prometheus metrics, graceful worker shutdown, separate API and worker containers, read-only API container, and persistent volumes.
- **SaaS layer:** Install-first public landing page, plans endpoint, tenant API keys, monthly usage quotas, account usage, hosted upgrade checkout, and Stripe webhook verification.

## Run locally

```bash
cp .env.example .env
npm install
redis-server
npm start
# separate shell
npm run worker
```

Submit a job:

```bash
curl -X POST http://localhost:3000/v1/jobs \
  -H 'Authorization: Bearer dev-key-change-me' \
  -H 'Content-Type: application/json' \
  -d '{"url":"https://example.com","engine":"playwright","mode":"headless","extract":{"schema":{"title":{"selector":"h1"}}},"artifacts":{"html":true,"screenshot":true}}'
```

Run the container stack:

```bash
docker compose up --build
```

## API

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/v1/jobs` | Submit a browser/extraction job |
| GET | `/v1/jobs/:id` | Read durable status and result |
| GET | `/v1/jobs/:id/events` | Read lifecycle events |
| POST | `/v1/jobs/:id/cancel` | Cancel a queued job |
| GET | `/v1/jobs/:id/artifacts/:name` | Serve an artifact by safe basename |
| GET | `/health` | Liveness check |
| GET | `/metrics` | Prometheus metrics |

Every API endpoint except `/health` and `/metrics` requires `Authorization: Bearer <API key>`.

The public landing page is served at `/`, API docs at `/docs`, and plan metadata at `/v1/plans`. The configured `API_KEYS` act as owner keys. Owner keys can mint tenant API keys through `POST /v1/account/api-keys`; generated keys are stored only as SHA-256 hashes. Configure `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and the three `STRIPE_PRICE_*` values to enable `POST /v1/billing/checkout`.

For a developer-first signup flow, send `POST /v1/signup` with `{ "email": "you@example.com" }`. The response returns a Community API key once; store it immediately and use it as a bearer token for job submission. This is the open-core wedge: users can download and self-host the engine immediately, then upgrade to hosted Starter or Growth capacity without changing the API contract.

## Industrial production requirements before public multi-tenant launch

This repository is a hardened execution core, not a claim of solved abuse, compliance, or global scale. Before exposing it to untrusted customers, add a real identity/tenant service, per-tenant quotas, domain allow/deny controls, a managed object store, encrypted secrets, egress proxy policy, distributed tracing, a dead-letter workflow, backup/restore tests, vulnerability scanning, and legal/robots/acceptable-use review. Do not expose browser remote debugging ports. Keep headed sessions short-lived and operator-authorized.
