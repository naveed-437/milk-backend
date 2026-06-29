# ASN Dairy Hub

ASN Dairy Hub is a full-stack dairy business management application built with Node.js, Express, Supabase, React, and Vite.

## Features

- Customer management
- Product management
- Daily delivery tracking
- Subscription management
- Modern dashboard UI
- CRUD operations from the frontend

## Tech Stack

### Backend
- Node.js
- Express.js
- Supabase
- CORS
- Dotenv

### Frontend
- React
- Vite
- CSS

## Project Structure

- backend API routes and controllers in the root project
- frontend React app in the `frontend` folder

## Getting Started

### 1. Install backend dependencies

```bash
npm install
```

### 2. Start the backend server

```bash
node server.js
```

### 3. Install frontend dependencies

```bash
cd frontend
npm install
```

### 4. Start the frontend app

```bash
cd frontend
npm run dev
```

The frontend will run at:

```text
http://localhost:5173
```

The backend will run at:

```text
http://localhost:5000
```

## API Endpoints

- Customers: `/api/customers`
- Products: `/api/products`
- Deliveries: `/api/deliveries`
- Subscriptions: `/api/subscriptions`

## Notes

This project is designed as a personal portfolio application for dairy business workflow management.
