Gateway (main entry) — README

Overview

This repository uses a single main entry/gateway at `backend/main.js` that mounts each microservice's Express app under `/api`.

Services and their default local ports (from each service `src/config/config.js`):

- product-service: 3000
- auth-service: 3000
- cart-service: 3002
- order-service: 3003
- payment-service: 3002
- seller-service: 3006
- admin-service: 3007
- aiBuddy-service: 3005

Note: A few services share default ports in their config (e.g., product and auth both default to 3000; cart and payment default to 3002). When running under the gateway, each service is started and mounted on the same process by `main.js`, so port collisions are not an issue when using `main.js` as the single host. If you instead prefer to run each service as a separate process, ensure unique PORTs in each service's environment.

MAIN_ENTRY_URL

Services now use `config.mainEntryURL` (driven by `process.env.MAIN_ENTRY_URL`) for inter-service calls. By default, `MAIN_ENTRY_URL` is `http://localhost:3000` and the gateway (main.js) listens on that port.

How to run (PowerShell)

1) From `backend/` install dependencies and start the gateway which also starts each service in-process:

```powershell
# from backend folder
npm install
npm run dev
```

2) Health-check (in a separate PowerShell window):

```powershell
# Check gateway
curl http://localhost:3000/
# Expect: "API is running..."

# Check mounted service endpoints (example)
curl http://localhost:3000/api/product
curl http://localhost:3000/api/auth
```

Smoke tests — inter-service calls

If a service calls another via `config.mainEntryURL`, the call will go to the gateway which is responsible for routing to the mounted service apps (main.js mounts each service under `/api`). Example (PowerShell):

```powershell
# Example: ask seller-service helper to fetch seller products by calling gateway
# Replace with your actual endpoints that require auth headers/cookies if needed
curl http://localhost:3000/api/product/seller/me
```

When Not to Use `main.js`

If you prefer to run each service as a standalone process for development (separate Node processes), do not use `main.js` as the gateway; instead set unique PORT values per service and run them individually. In that scenario, you'll need to set MAIN_ENTRY_URL to the gateway/proxy you're using (or update helper configs to point directly to service-specific URLs).

Optional: Standalone proxy

If you want a standalone reverse-proxy that routes `/api/product` -> http://localhost:3000, `/api/auth` -> http://localhost:3001 etc, I can scaffold `backend/gateway-proxy.js` using Express + http-proxy-middleware and npm scripts; tell me the exact per-service ports and I will scaffold it.

Notes

- The gateway approach used here avoids per-service port conflicts by mounting service Express instances into a single server process.
- Ensure `MAIN_ENTRY_URL` is set in your environment for services that make inter-service HTTP calls; default is http://localhost:3000.
