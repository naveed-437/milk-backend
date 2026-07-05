# API Documentation

## Overview
This backend exposes REST endpoints for dairy distribution management.

## Authentication
Most endpoints require a bearer token. Register a user and sign in to receive a token.

## Core Endpoints

### Health
- GET /health
- Returns service status.

### Products
- GET /api/products
- POST /api/products
- PUT /api/products/:id
- DELETE /api/products/:id

### Customers
- GET /api/customers
- POST /api/customers
- PUT /api/customers/:id
- DELETE /api/customers/:id

### Deliveries
- GET /api/deliveries
- POST /api/deliveries
- PUT /api/deliveries/:id
- DELETE /api/deliveries/:id

### Subscriptions
- GET /api/subscriptions
- POST /api/subscriptions
- PUT /api/subscriptions/:id
- DELETE /api/subscriptions/:id

### Auth
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile
