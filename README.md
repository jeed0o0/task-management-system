# Task Management System

نظام إدارة المهام المتكامل - مشروع مقرر تطوير تطبيقات الويب باستخدام React.js

---

## 📋 جدول المحتويات

1. [توزيع المهام بين الفريق (بالعربي)](#-توزيع-المهام-بين-الفريق)
2. [Project Architecture](#-project-architecture)
3. [Tech Stack](#-tech-stack)
4. [Implementation Roadmap](#-implementation-roadmap)
5. [Error Handling Strategy](#-error-handling-strategy)
6. [Quick Start](#-quick-start)
7. [Advanced Features](#-advanced-features)

---

## 👥 توزيع المهام بين الفريق

### استراتيجية العمل المقترحة



```
الشخص الأول (Frontend Lead):
├── واجهة المستخدم (React + TypeScript)
│   ├── إعداد المشروع باستخدام Vite
│   ├── التوجيه (React Router) والصفحات
│   ├── إدارة الحالة (Zustand)
│   ├── جلب البيانات (TanStack Query)
│   └── مكونات واجهة المستخدم
├── تكامل Keycloak في الواجهة
├── WebSocket Client (اتصال لحظي)
├── التقارير (Grafana dashboards)
└── اختبارات الواجهة

الشخص الثاني (Backend/DevOps Lead):
├── الخادم (Node.js + Express)
│   ├── نموذج قاعدة البيانات (Prisma)
│   ├── واجهات API (RESTful)
│   ├── التحقق من الصحة (Zod)
│   └── معالجة الأخطاء الموحدة
├── تكامل Keycloak في الخادم
├── Redis (تخزين مؤقت)
├── Prometheus (مراقبة الأداء)
├── Docker Compose
├── CI/CD scripts
└── اختبارات الخادم
```

##
### معيار "Increased Workload"

لتحقيق متطلبات زيادة عبء العمل لفريق من شخصين، قمنا بإضافة:

| الميزة | المسؤول | القيمة المضافة |
|--------|---------|----------------|
| **Redis Caching** | Backend Lead | تخزين مؤقت للبيانات - تحسين الأداء |
| **WebSockets (Socket.IO)** | Both (FE + BE) | تحديثات لحظية للمهام |
| **RBAC (Role-Based Access Control)** | Both (FE + BE) | صلاحيات ADMIN/MANAGER/USER |
| **Prometheus + Grafana** | Backend Lead | مراقبة الأداء والطلبات |
| **Keycloak SSO** | Both | تسجيل دخول موحد وآمن |
| **Kommentare & Benachrichtigungen** | Both | تعليقات + إشعارات لحظية |

---

## 🏗 Project Architecture

```
task-management-system/
├── docker-compose.yml          # Orchestration of all services
├── .env.example                # Environment variables template
├── Makefile                    # Convenience commands
├── README.md                   # You are here
│
├── backend/                    # Node.js + Express API
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema (PostgreSQL)
│   │   └── seed.ts             # Seed data
│   └── src/
│       ├── index.ts            # Entry point (HTTP + WebSocket)
│       ├── app.ts              # Express app setup
│       ├── config/
│       │   ├── database.ts     # Prisma client
│       │   ├── keycloak.ts     # Keycloak config
│       │   ├── redis.ts        # Redis client + caching helpers
│       │   └── prometheus.ts   # Prometheus metrics
│       ├── middleware/
│       │   ├── errorHandler.ts # Global error handler
│       │   ├── auth.ts         # Authentication + RBAC
│       │   ├── validate.ts     # Zod validation middleware
│       │   └── metrics.ts      # Request metrics
│       ├── routes/
│       │   ├── index.ts
│       │   ├── tasks.routes.ts
│       │   ├── users.routes.ts
│       │   └── health.routes.ts
│       ├── controllers/
│       ├── services/
│       │   ├── tasks.service.ts
│       │   ├── users.service.ts
│       │   └── cache.service.ts
│       ├── validators/
│       ├── types/
│       └── utils/
│           ├── ApiError.ts     # Custom error class
│           ├── logger.ts       # Winston logger
│           └── websocket.ts    # Socket.IO setup
│
├── frontend/                   # React + TypeScript
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│   ├── nginx.conf              # Production nginx config
│   └── src/
│       ├── main.tsx
│       ├── App.tsx             # Router + QueryClient
│       ├── api/
│       │   ├── client.ts       # Axios instance with Keycloak
│       │   ├── tasks.ts        # Task API calls
│       │   └── auth.ts         # Auth API calls
│       ├── components/
│       │   ├── Layout.tsx
│       │   ├── ProtectedRoute.tsx
│       │   ├── TaskCard.tsx
│       │   ├── TaskForm.tsx
│       │   ├── TaskList.tsx
│       │   └── LoadingSpinner.tsx
│       ├── hooks/
│       │   ├── useAuth.ts      # Auth hook + Keycloak init
│       │   ├── useTasks.ts     # TanStack Query hooks
│       │   └── useWebSocket.ts # Socket.IO client hook
│       ├── pages/
│       │   ├── Dashboard.tsx
│       │   ├── Login.tsx
│       │   ├── Tasks.tsx
│       │   ├── TaskDetail.tsx
│       │   └── Users.tsx
│       ├── stores/
│       │   ├── authStore.ts    # Zustand auth state
│       │   └── uiStore.ts      # Zustand UI state
│       ├── types/
│       │   └── index.ts
│       └── utils/
│           └── keycloak.ts     # Keycloak JS instance
│
├── monitoring/
│   ├── prometheus/
│   │   └── prometheus.yml
│   └── grafana/
│       ├── datasources/
│       │   └── datasource.yml
│       └── dashboards/
│           └── task-manager.json
│
└── scripts/
    ├── setup.sh
    ├── ci.sh
    └── cd.sh
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite |
| **State Management** | Zustand |
| **Server State** | TanStack Query (React Query v5) |
| **Routing** | React Router v6 |
| **Styling** | Tailwind CSS (utility classes inline) |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | PostgreSQL 16 |
| **ORM** | Prisma |
| **Validation** | Zod |
| **Auth** | Keycloak 24 (OpenID Connect) |
| **Caching** | Redis 7 |
| **Real-time** | Socket.IO (WebSockets) |
| **Monitoring** | Prometheus + Grafana |
| **Containerization** | Docker + Docker Compose |
| **CI/CD** | Shell scripts |

---



### Backend Global Error Handler

```typescript
// Unified error response format
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",   // Machine-readable code
    "message": "Request validation failed",  // Human-readable message
    "details": [                  // Optional: field-level errors
      { "path": "title", "message": "Title is required" }
    ]
  }
}
```

### Error Categories

| HTTP Code | Code | When |
|-----------|------|------|
| 400 | `BAD_REQUEST` | Invalid input |
| 401 | `UNAUTHORIZED` | Missing/invalid token |
| 403 | `FORBIDDEN` | Insufficient role |
| 404 | `NOT_FOUND` | Resource doesn't exist |
| 409 | `CONFLICT` | Duplicate resource |
| 422 | `VALIDATION_ERROR` | Zod validation failure |
| 429 | `RATE_LIMIT` | Too many requests |
| 500 | `INTERNAL_ERROR` | Unexpected server error |

### Layers of Error Handling

1. **Zod Validation Layer** (`middleware/validate.ts`): Catches schema violations
2. **Service Layer** (`services/`): Throws `ApiError` for business logic errors
3. **Controller Layer** (`controllers/`): Catches errors and passes via `next(err)`
4. **Global Handler** (`middleware/errorHandler.ts`): Catches all, formats response
5. **Unhandled Rejections**: Process-level handler for uncaught promises

### Frontend Error Handling

- **Axios interceptor** (`api/client.ts`): Auto-refreshes expired tokens
- **React Query onError** (`hooks/useTasks.ts`): Shows toast notifications
- **Global error boundary**: Catches rendering errors

---

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local development)
- Git

### Setup & Run

```bash
# 1. Clone the repository
git clone <repo-url> && cd task-management-system

# 2. Configure environment
cp .env.example .env
# Edit .env with your settings (Keycloak client secret, etc.)

# 3. Start all services
docker compose up

# 4. Access the application
Frontend:  http://localhost:5173
Backend:   http://localhost:4000
Keycloak:  http://localhost:8080 (admin/admin)
Prometheus: http://localhost:9090
Grafana:   http://localhost:3000 (admin/admin)
```

### Local Development (without Docker)

```bash
# Terminal 1: Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

### Useful Commands

```bash
make dev           # Start all Docker services
make dev-backend   # Start backend locally
make dev-frontend  # Start frontend locally
make test          # Run all tests
make lint          # Run linters
make logs          # View Docker logs
make clean         # Stop and remove volumes
```

---

## ✨ Advanced Features (Increased Workload)

### 1. Redis Caching
- **Location**: `backend/src/services/cache.service.ts`
- **What**: Caches task queries for 5 minutes
- **Why**: Reduces database load, faster response times
- **Invalidation**: On task create/update/delete

### 2. WebSockets (Socket.IO)
- **Location**: `backend/src/utils/websocket.ts`, `frontend/src/hooks/useWebSocket.ts`
- **What**: Real-time task updates, comments, notifications
- **Why**: Instant UI updates without polling
- **Events**: `task:created`, `task:updated`, `task:deleted`, `comment:added`

### 3. Role-Based Access Control (RBAC)
- **Location**: `backend/src/middleware/auth.ts`
- **Roles**: `ADMIN`, `MANAGER`, `USER`
- **ADMIN**: Full access, user management
- **MANAGER**: Can assign tasks, view team
- **USER**: Personal task management
- **Frontend**: `ProtectedRoute` component with role checking

### 4. Prometheus + Grafana Monitoring
- **Metrics**: Request count, duration, tasks created/completed, active users
- **Dashboards**: Pre-configured Grafana dashboard
- **Alerts**: Can be extended for error rate alerts

### 5. Keycloak Integration
- **OpenID Connect**: Full SSO flow with PKCE
- **Token Refresh**: Automatic silent refresh
- **Role Mapping**: Keycloak roles -> application roles

---

## 📁 File Reference

| File | Purpose |
|------|---------|
| `docker-compose.yml` | All 7 services orchestrated |
| `backend/prisma/schema.prisma` | User, Task, Comment, Notification models |
| `backend/src/middleware/errorHandler.ts` | Global error handler (custom + Zod) |
| `backend/src/utils/ApiError.ts` | Custom error class with status codes |
| `backend/src/config/prometheus.ts` | Prometheus metrics setup |
| `backend/src/config/redis.ts` | Redis connection + cache utilities |
| `backend/src/utils/websocket.ts` | Socket.IO server initialization |
| `frontend/src/stores/authStore.ts` | Zustand store for auth state |
| `frontend/src/hooks/useTasks.ts` | TanStack Query hooks for CRUD |
| `frontend/src/hooks/useWebSocket.ts` | Real-time connectivity hook |
| `monitoring/grafana/dashboards/task-manager.json` | Pre-built dashboard |
| `scripts/ci.sh` | CI pipeline script |
