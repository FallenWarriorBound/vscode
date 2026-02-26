# HemayatVam
پلتفرم فول‌استک سرمایه‌گذاری و وام‌دهی P2P با تمرکز بر بازار ایران.

## ساختار پروژه
```text
HemayatVam/
├── server/        # Node.js + Express + MongoDB
├── client/        # React + Vite + Tailwind RTL
├── infra/         # Nginx/Prometheus/Grafana provisioning
├── scripts/       # backup/deploy scripts
├── docs/          # legal/load/owasp/launch checklists
└── cypress/       # E2E specs
```

## اجرای محلی
```bash
cp .env.example .env
cd server && npm i
cd ../client && npm i
```

### Start backend
```bash
cd server
npm run dev
```

### Start frontend
```bash
cd client
npm run dev
```

## اجرای Docker
```bash
docker compose up --build
```
