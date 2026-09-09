# Security policy

Nexus Engine treats browser execution as a high-risk capability. The runtime defaults to fail closed: unauthenticated API and WebSocket control requests are rejected, private network targets are blocked, arbitrary script actions are disabled, quotas and rate limits are enforced through Redis, and tenant job data is isolated by account ID.

## Reporting

Report suspected vulnerabilities privately to the repository owner through the GitHub security advisory workflow. Do not publish exploit details before a fix or coordinated disclosure decision. Include the affected release, deployment mode, reproduction steps, impact, and any logs that do not contain credentials or customer data.

## Release boundary

The current release is an industrial execution and SaaS foundation. It is not a certification, SOC 2 attestation, penetration-test report, or guarantee that customer deployments are compliant with a particular law. Before public multi-tenant production, deploy Redis with authentication and TLS, place the API behind a TLS reverse proxy, rotate secrets, enable immutable off-host artifact retention, scan the container image, and perform an external penetration test.

## Acceptance tests

Security changes must preserve: private-target rejection, arbitrary-script rejection, API-key enforcement, WebSocket token enforcement, tenant ownership checks, idempotency behavior, quota enforcement, and zero high-severity dependency findings.
