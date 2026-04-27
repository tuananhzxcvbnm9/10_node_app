# nodejs-10-apps-monorepo

Monorepo chứa 10 ứng dụng full-stack Node.js (NestJS + React + Vite + Prisma) chạy đồng thời bằng Docker Compose.

## Chạy toàn bộ hệ thống

```bash
cp .env.example .env
docker compose up --build
```

## Chạy riêng 1 app (service name)

```bash
docker compose up --build app-01-backend app-01-frontend reverse-proxy postgres redis
```

## URL truy cập

### Frontend
- http://localhost/app-01
- http://localhost/app-02
- http://localhost/app-03
- http://localhost/app-04
- http://localhost/app-05
- http://localhost/app-06
- http://localhost/app-07
- http://localhost/app-08
- http://localhost/app-09
- http://localhost/app-10

### API
- http://localhost/api/app-01
- http://localhost/api/app-02
- http://localhost/api/app-03
- http://localhost/api/app-04
- http://localhost/api/app-05
- http://localhost/api/app-06
- http://localhost/api/app-07
- http://localhost/api/app-08
- http://localhost/api/app-09
- http://localhost/api/app-10

### Swagger
- http://localhost/api/app-01/docs (và tương tự app-02..app-10)

### Monitoring
- Grafana: http://localhost:3000
- Prometheus: http://localhost:9090

## Demo account
- Email: `admin@app-01.local` ... `admin@app-10.local`
- Password: dữ liệu seed lưu hash trong DB.

## Lệnh tiện ích

```bash
make install
make up
make down
make logs
make migrate
make seed
make test
```


## Frontend UI/UX

Tất cả 10 app dùng layout SaaS dashboard thống nhất từ `packages/frontend-common` với:
- Sidebar + icon
- Topbar search + user menu
- Dark mode
- Dashboard cards
- Recharts line/area chart
- Data table (search/filter/sort/pagination)
- Loading skeleton / empty state / error state
- Confirm dialog và toast notification


## Production Deployment Checklist

- Multi-stage Docker build cho backend/frontend.
- Container chạy non-root user.
- Healthcheck cho reverse-proxy/postgres/redis/prometheus/grafana/backend/frontend.
- CORS và rate limiting từ env.
- Nginx security headers bật mặc định.
- Kubernetes có ConfigMap/Secret template + probes + resources + HPA backend.
- Prisma migrate deploy chạy khi backend container start.
- Xem hướng dẫn backup DB tại `docs/database-backup.md`.
