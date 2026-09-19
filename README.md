# Financial-Analytics-Dashboard-
A full-stack financial analytics dashboard built with **React + TypeScript** on the frontend and **Node.js + Express + MongoDB** on the backend. It lets an authenticated user explore transactions, view revenue/expense analytics, and export filtered data to CSV.

## Features

- **Authentication** – JWT-based login/logout with protected API routes and protected frontend routes
- **Dashboard analytics** – summary cards (total revenue, expenses, net balance), monthly trend chart, and category breakdown
- **Transactions table** – search, filter (date range, amount range, category, status, user), sort, and pagination
- **CSV export** – download transactions with configurable columns
- **Seed script** – loads the provided `transactions.json` dataset (300 records) and a demo user into MongoDB

## Tech Stack

| Layer    | Technologies                                                        |
| -------- | ------------------------------------------------------------------- |
| Frontend | React, TypeScript, React Router, Material UI, Recharts, Axios       |
| Backend  | Node.js, Express, TypeScript, MongoDB, Mongoose                     |
| Auth     | JSON Web Tokens (JWT), bcryptjs                                     |
| Export   | json2csv                                                            |

## Project Structure

```
financial-analytics-dashboard/
├── client/          # React + TypeScript frontend
└── server/          # Express + TypeScript backend
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB 

### 1. Clone the repository

```bash
git clone https://github.com/abhijeet2716/financial-analytics-dashboard.git
cd financial-analytics-dashboard
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/financial-dashboard
JWT_SECRET=your_jwt_secret
```

Seed the database and start the server:

```bash
npm run seed
npm run dev
```

### 3. Set up the frontend

```bash
cd ../client
npm install
npm run dev
```

The app will be available at the URL printed in the terminal (typically `http://localhost:5173` or `http://localhost:3000`).

## Demo Login

After running the seed script, sign in with:

| Email              | Password   |
| ------------------ | ---------- |
| `demo@example.com` | `demo1234` |

## Dataset

The app uses a supplied `transactions.json` dataset of 300 records. Each record has:

`id`, `date`, `amount`, `category` (Revenue / Expense), `status` (Paid / Pending), `user_id`, `user_profile`

## Author

**Abhijeet** 
GitHub: [@abhijeet2716](https://github.com/abhijeet2716)
