# 🐾 PawMate – Pet Adoption Platform

A full-stack MERN pet adoption platform where users can find their perfect furry companions.

## 🌐 Live URL

[https://pawmate.vercel.app](https://pawmate.vercel.app)

## 📋 Features

- 🔐 **Secure Authentication** – Email/password & Google login with JWT stored in HTTPOnly cookies
- 🐶 **Browse & Adopt Pets** – Search by name, filter by species, sort by price/age
- 📋 **Adoption Requests** – Submit, track, approve, or reject adoption requests with status updates
- 🏠 **Pet Management** – Add, edit, and delete your own pet listings with full CRUD
- 💖 **Wishlist** – Save pets you're interested in and view them from your dashboard
- 🌙 **Dark/Light Theme** – Toggle between themes with persistent preference
- 📱 **Fully Responsive** – Optimized for mobile, tablet, and desktop

## 🛠️ NPM Packages Used

| Package | Purpose |
|---|---|
| `react` | UI library |
| `react-router-dom` | Client-side routing |
| `@tanstack/react-query` | Server state management |
| `axios` | HTTP requests |
| `firebase` | Authentication |
| `react-hot-toast` | Toast notifications |
| `sweetalert2` | Confirmation dialogs |
| `react-icons` | Icon library |
| `tailwindcss` | Utility-first CSS |
| `daisyui` | Tailwind component library |

## 🚀 Setup & Run Locally

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Firebase project

### Client Setup
```bash
cd client
npm install
cp .env.example .env
# Fill in your Firebase config in .env
npm run dev
```

### Server Setup
```bash
cd server
npm install
cp .env.example .env
# Fill in your MongoDB credentials and JWT secret in .env
npm run dev
```

## 🗂️ Project Structure

```
pet-adoption/
├── client/          # React + Vite frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── layouts/
│       ├── context/
│       ├── router/
│       └── utils/
└── server/          # Express backend
    └── index.js
```
