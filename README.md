# cvg-public

**The Board**: the public site for CVG FC.
Part of the CVG FC Club Management System, built by Devstrike Digital Limited.

- **Stack:** Next.js 16 · React 19 · TypeScript
- **API:** [cvg-backend](https://github.com/EQua-Dev/cvg-backend) (Kotlin Spring Boot), public endpoints only

## What's in it

| Page | What it does |
|---|---|
| `/` | Club landing (fixtures, results and the squad come later) |
| `/verify/{code}/{signature}` | Opened by scanning the QR code on a CVG ID card. Server-rendered: **✓ Current CVG member** or **✕ Not a current member**, with name, member ID, status, season, jersey. Photo and position only if the member agreed. Tampered or unknown links show "We can't find this card" |

## Run locally

```bash
npm install
CVG_API_URL=http://localhost:8080 npm run dev     # http://localhost:3000
```

Only `/api/public/*` is proxied to the backend.
