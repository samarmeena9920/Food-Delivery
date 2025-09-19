# Susangat Food Order

Susangat Food Order is a full-stack food delivery application with separate admin and user interfaces. It allows users to browse food items, add them to cart, place orders, and track their orders. Admins can manage food items and view all orders.

## Project Structure

```
Susangat-Food-Order-main/
  admin/      # Admin dashboard (React + Vite)
  backend/    # Backend API (Node.js + Express + MongoDB)
  frontend/   # User-facing frontend (React + Vite)
```

## Features

### User (Frontend)
- Browse menu and food items by category
- Add/remove items to cart
- Place orders and pay via Stripe
- Track order status
- User authentication (register/login)
- Responsive UI

### Admin
- Login/register as admin
- Add new food items (with image upload)
- Remove food items
- View all orders and update order status

### Backend
- RESTful API for food, user, cart, and order management
- Stripe payment integration
- JWT-based authentication
- MongoDB for data storage

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB database (local or Atlas)
- Stripe account (for payment integration)

### Setup

#### 1. Clone the repository
```sh
git clone https://github.com/yourusername/Susangat-Food-Order-main.git
cd Susangat-Food-Order-main
```

#### 2. Backend
- Copy `.env.example` to `.env` in the `backend` folder and fill in your MongoDB URI, JWT secret, Stripe keys, etc.
- Install dependencies:
  ```sh
  cd backend
  npm install
  ```
- Start the backend server:
  ```sh
  npm run server
  ```
  The backend runs on port `4000` by default.

#### 3. Frontend (User)
- Install dependencies:
  ```sh
  cd ../frontend
  npm install
  ```
- Start the frontend:
  ```sh
  npm run dev
  ```
  The frontend runs on port `5173` by default.

#### 4. Admin
- Install dependencies:
  ```sh
  cd ../admin
  npm install
  ```
- Start the admin dashboard:
  ```sh
  npm run dev
  ```
  The admin dashboard runs on port `5174` by default.

## Environment Variables

See [`backend/.env.example`](backend/.env.example) for required environment variables.

## Usage

- Access the user frontend at `http://localhost:5173`
- Access the admin dashboard at `http://localhost:5174`
- Backend API runs at `http://localhost:4000`

## Technologies Used

- React, Vite
- Node.js, Express
- MongoDB, Mongoose
- Stripe API
- JWT Authentication
- Multer (file uploads)

## License
For any questions or issues, please open an issue on [GitHub](https://github.com/samarmeena9920/Susangat-Food-Order-main).
