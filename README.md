🏫 School Payments & Dashboard System

A full-stack microservice application for managing school fee payments and transaction dashboards, built with Node.js + Express + MongoDB (backend) and React + ShadCN UI + Tailwind CSS (frontend).

It integrates with the Edviron Payment Gateway API, supports secure JWT authentication, real-time webhook updates, and provides a responsive dashboard for administrators.

🚀 Features
🔹 Backend (Node.js + Express + MongoDB)

Authentication (JWT-based)

Register & login with secure password hashing (bcrypt).

All API endpoints protected via JWT middleware.

Order & Payment Management

Order Schema for storing order data.

Order Status Schema for transaction updates.

Webhook Logs Schema for storing webhook calls.

Payment Gateway Integration

Create payment requests via Edviron Payment API.

JWT-signed payloads using PG secret.

Redirect user to payment URL returned by API.

Webhook Handling

POST /webhook endpoint to receive payment status updates.

Updates corresponding Order Status in MongoDB.

Transaction APIs

GET /transactions → Fetch all transactions (with filters, pagination, sorting).

GET /transactions/school/:schoolId → Fetch by school.

GET /transaction-status/:custom_order_id → Get transaction status.

Best Practices

.env for configuration (Mongo URI, JWT secret, API keys).

Centralized error handling & validation.

Logging of failed transactions and webhook events.

🔹 Frontend (React + ShadCN UI + Tailwind CSS)

Authentication

Login & Register pages styled with ShadCN UI.

Protected routes: Unauthorized users are redirected to Login.

Navbar dynamically updates (Login/Register vs Logout).

Dashboard Pages

📊 Transactions Overview

Paginated table of all transactions.

Status filter (single select via dropdown).

Search by collect_id.

Sortable columns (amount, status, date).

Copy-to-clipboard buttons for IDs.

Hover effect with 3D shadow.

🏫 Transactions by School

Enter school_id → see all related transactions.

Card-style layout with badges for status.

✅ Transaction Status Check

Enter custom_order_id → view current transaction status.

Pretty JSON viewer styled with ShadCN Card.

UI Enhancements

Fully responsive design.

Dark/Light mode toggle (ShadCN ThemeProvider).

Loading states (spinners, skeleton loaders).

Toasts (sonner) for user feedback (copy success, errors).

Navigation

Clean Navbar with protected auth state.

Routes: /, /school, /status, /login, /register.

🛠️ Tech Stack
Backend

Node.js + Express

MongoDB Atlas (cloud database)

Mongoose (ODM)

jsonwebtoken (JWT) for authentication

bcryptjs for password hashing

axios for payment API calls

dotenv for environment variables

Frontend

React (Vite)

Tailwind CSS v4

ShadCN UI (modern styled components)

Lucide Icons (icons)

Sonner (toast notifications)

Axios (API calls)

React Router v6 (routing)

⚙️ Installation & Setup
1️⃣ Clone the Repo
git clone https://github.com/your-username/school-payment-dashboard.git
cd school-payment-dashboard

2️⃣ Backend Setup
cd backend
npm install


Create a .env file in backend/:

PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
PG_KEY=edvtest01
API_KEY=your_payment_api_key
SCHOOL_ID=65b0e6293e9f76a9694d84b4


Run locally:

npm run dev

3️⃣ Frontend Setup
cd frontend/school-payment-frontend
npm install


Create a .env file in frontend/:

VITE_API_BASE_URL=http://localhost:5000/api


Run locally:

npm run dev

4️⃣ Deploy

Backend → Render
 (Node.js app + MongoDB Atlas)

Frontend → Vercel
 or Netlify

🔗 API Endpoints
Method	Endpoint	Description
POST	/api/auth/register	Register user
POST	/api/auth/login	Login user (returns JWT)
POST	/api/create-payment	Create payment request
POST	/api/webhook	Webhook listener
GET	/api/transactions	Get all transactions (filters supported)
GET	/api/transactions/school/:id	Get transactions by school
GET	/api/transaction-status/:id	Get transaction status

🧪 Testing with Postman

Import the provided Postman Collection (add link in repo).

Test Auth, Payment API, Webhook simulation.

Example Webhook Payload:

{
  "status": 200,
  "order_info": {
    "order_id": "ORD1234",
    "order_amount": 2000,
    "transaction_amount": 2200,
    "gateway": "Gpay",
    "bank_reference": "KOTAK811",
    "status": "success",
    "payment_mode": "upi",
    "payemnt_details": "success@ktk",
    "Payment_message": "payment success",
    "payment_time": "2025-09-13T08:14:21.945+00:00",
    "error_message": "NA"
  }
}

👨‍💻 Contributors

Kartik Rane – Developer

📜 License

MIT License © 2025 Kartik Rane