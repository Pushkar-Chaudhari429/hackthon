<<<<<<< HEAD
# AI-Powered Self-Healing & Fraud-Resilient Commerce Platform

Enterprise-grade full-stack dashboard prototype for ideathon demos.

## Architecture

### Frontend (React + Vite)
- `frontend/src/components`: Reusable UI blocks (cards, charts, tables, logs)
- `frontend/src/pages`: Page-level composition
- `frontend/src/services`: API request layer
- `frontend/src/hooks`: State orchestration and live polling logic
- `frontend/src/utils`: Constants and format helpers

### Backend (Node.js + Express)
- `backend/src/routes`: API endpoint mapping
- `backend/src/controllers`: Request/response handling
- `backend/src/services`: Simulation and domain logic
- `backend/src/middleware`: Logging and error handling
- `backend/src/utils`: In-memory store and helper utilities

## API Endpoints
- `GET /api/traffic`
- `GET /api/system-health`
- `GET /api/anomalies`
- `GET /api/fraud-transactions`
- `POST /api/simulate/spike`
- `POST /api/simulate/anomaly`
- `POST /api/simulate/fraud`

## Run

1. Install dependencies:
	- `npm install`
2. Start backend:
	- `npm run dev:backend`
3. Start frontend:
	- `npm run dev:frontend`
4. Open the frontend URL shown by Vite (default `http://localhost:5173`).

## Routes
- `/` landing page (product overview and CTA)
- `/dashboard` enterprise monitoring dashboard

## Quality and Behavior
- Backend uses clean separation of concerns with in-memory mock data
- Frontend polls live data every 3 seconds for a real-time monitoring feel
- Simulation buttons call backend APIs and update UI dynamically
- API failure states are shown through user-friendly error banners
- Dashboard remains responsive and demo-ready for enterprise-style presentations
=======
# hackthon
>>>>>>> a92122fd84e06b60b964e7d1bced6142e2e465c5
