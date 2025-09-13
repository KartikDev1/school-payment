# School Payment Dashboard System

A comprehensive full-stack microservice application for managing school fee payments and transaction monitoring, built with modern web technologies and integrated with Edviron Payment Gateway.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Overview

This application provides a robust solution for educational institutions to manage fee payments efficiently. It features secure authentication, real-time payment processing through Edviron Payment Gateway, comprehensive transaction tracking, and an intuitive administrative dashboard.

**Key Capabilities:**
- Secure JWT-based authentication system
- Real-time payment processing and status updates
- Comprehensive transaction management and reporting
- Responsive web interface with dark/light theme support
- Webhook integration for automatic payment status synchronization

## Features

### Backend Services (Node.js + Express + MongoDB)

#### 🔐 Authentication & Security
- JWT-based authentication with secure password hashing (bcrypt)
- Protected API endpoints with middleware validation
- Environment-based configuration management

#### 💳 Payment Processing
- **Order Management**: Complete order lifecycle tracking
- **Payment Gateway Integration**: Seamless Edviron API integration
- **Webhook Processing**: Real-time payment status updates
- **Transaction Logging**: Comprehensive audit trail

#### 📊 Data Management
- **Transaction APIs**: Advanced filtering, pagination, and sorting
- **School-specific Queries**: Targeted data retrieval
- **Status Tracking**: Real-time transaction monitoring
- **Error Handling**: Centralized error management and logging

### Frontend Application (React + Tailwind CSS)

#### 🎨 User Interface
- **Modern Design**: ShadCN UI components with Tailwind CSS styling
- **Responsive Layout**: Mobile-first design approach
- **Theme Support**: Dark/light mode toggle
- **Interactive Elements**: Hover effects, animations, and transitions

#### 📈 Dashboard Features
- **Transaction Overview**: Paginated table with advanced filtering
- **School Analytics**: Institution-specific transaction views
- **Status Monitoring**: Real-time transaction status checking
- **Data Export**: Copy-to-clipboard functionality

#### 🚀 User Experience
- **Protected Routing**: Secure navigation with authentication checks
- **Loading States**: Skeleton loaders and progress indicators
- **Toast Notifications**: User feedback system
- **Search & Filter**: Advanced data discovery tools

## Technology Stack

### Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime Environment | Latest LTS |
| **Express.js** | Web Framework | ^4.18.0 |
| **MongoDB Atlas** | Cloud Database | Latest |
| **Mongoose** | ODM | ^7.0.0 |
| **JWT** | Authentication | ^9.0.0 |
| **bcryptjs** | Password Hashing | ^2.4.3 |
| **Axios** | HTTP Client | ^1.4.0 |

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Framework | ^18.2.0 |
| **Vite** | Build Tool | ^4.4.0 |
| **Tailwind CSS** | Styling | ^4.0.0 |
| **ShadCN UI** | Component Library | Latest |
| **React Router** | Navigation | ^6.14.0 |
| **Lucide React** | Icons | ^0.263.0 |

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Git

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/KartikDev1/school-payment.git
   cd school-payment-dashboard
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secure_jwt_secret
   PG_KEY=edvtest01
   API_KEY=your_edviron_api_key
   SCHOOL_ID=your_school_id
   ```

   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend/school-payment-frontend
   npm install
   ```

   Create `.env` file in the frontend directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

   Start the frontend application:
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Frontend: `https://school-payment-one.vercel.app/`
   - Backend API: `https://school-payment-yinu.onrender.com`

## API Documentation

### Authentication Endpoints
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `POST` | `/api/auth/register` | User registration | None |
| `POST` | `/api/auth/login` | User login | None |

### Payment Endpoints
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `POST` | `/api/create-payment` | Create payment request | JWT Required |
| `POST` | `/api/webhook` | Payment status webhook | None |

### Transaction Endpoints
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/api/transactions` | Get all transactions | JWT Required |
| `GET` | `/api/transactions/school/:schoolId` | Get school transactions | JWT Required |
| `GET` | `/api/transaction-status/:orderId` | Get transaction status | JWT Required |

### Query Parameters
- **Pagination**: `page`, `limit`
- **Filtering**: `status`, `school_id`, `date_range`
- **Sorting**: `sort_by`, `order` (asc/desc)
- **Search**: `search` (by collect_id)

### Sample Webhook Payload
```json
{
  "status": 200,
  "order_info": {
    "order_id": "ORD1234567890",
    "order_amount": 2000,
    "transaction_amount": 2200,
    "gateway": "Gpay",
    "bank_reference": "KOTAK811",
    "status": "success",
    "payment_mode": "upi",
    "payment_details": "success@ktk",
    "payment_message": "payment success",
    "payment_time": "2025-09-13T08:14:21.945+00:00",
    "error_message": "NA"
  }
}
```

## Deployment

### Backend (Render)
1. Connect your GitHub repository to Render
2. Configure environment variables in Render dashboard
3. Deploy as Node.js service

### Frontend (Vercel/Netlify)
1. Connect repository to Vercel or Netlify
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Set environment variables

### Environment Variables
Ensure all production environment variables are properly configured in your deployment platform.

## Testing

### Using Postman
1. Import the provided Postman collection
2. Configure environment variables (base URL, JWT token)
3. Test authentication flow
4. Simulate webhook payloads
5. Validate transaction endpoints

### Test Coverage
- Authentication flows
- Payment processing
- Webhook handling
- Transaction queries
- Error handling scenarios

## Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the Repository**
2. **Create Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Commit Changes**: `git commit -m 'Add amazing feature'`
4. **Push to Branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Development Standards
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## Support

For support and questions:
- Create an issue in the GitHub repository
- Contact: [raneeyy18@gmail.com]

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
<img width="1918" height="867" alt="image" src="https://github.com/user-attachments/assets/e3a38822-cb96-48f8-9841-311848354bdc" />


**Developed by Kartik Rane** | © 2025 All Rights Reserved


![GitHub stars](https://img.shields.io/github/stars/your-username/school-payment-dashboard?style=social)
![GitHub forks](https://img.shields.io/github/forks/your-username/school-payment-dashboard?style=social)
![GitHub issues](https://img.shields.io/github/issues/your-username/school-payment-dashboard)
