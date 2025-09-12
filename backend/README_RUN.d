# School Payments — Backend (Express + MongoDB)

## Overview
Backend microservice for School Payment & Dashboard. Implements:
- Order, OrderStatus, WebhookLog, User schemas (MongoDB)
- JWT authentication (register/login)
- `POST /api/payment/create` — create order, sign payload, call payment gateway (create-collect-request)
- `POST /api/webhook` — receive gateway webhook and update OrderStatus
- `GET /api/transactions` — aggregation join of orders + order status (paginated, sortable)
- `GET /api/transactions/school/:schoolId`
- `GET /api/transaction-status/:custom_order_id`

> Note: Payment gateway integration is implemented with a robust fallback (mock redirect) so the demo works without a live gateway. If you provide the exact `create-collect-request` sample, I can adjust the request format to match exactly.

---

## Quick start (local)
1. Copy `.env.example` to `.env` and set values:
