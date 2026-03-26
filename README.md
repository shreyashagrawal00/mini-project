# Smart Attendance Portal

A modern, responsive full-stack application for managing student attendance.

## 🚀 Key Features
- **User Authentication**: Secure login for teachers/admins.
- **Dashboard**: High-level overview of attendance metrics.
- **Student Management**: Full CRUD operations for student records.
- **Attendance System**: Effortless daily attendance marking.
- **Records & Analytics**: History viewing and data visualization with charts.

## 🛠 Tech Stack
- **Frontend**: React (Vite), Lucide-React (Icons), Recharts (Analytics), Vanilla CSS.
- **Backend**: Node.js, Express.
- **Database**: MongoDB (Mongoose).

## 📦 Setup Instructions

### 1. Prerequisites
- Node.js installed.
- MongoDB running locally (default: `mongodb://localhost:27017/smartattendance`).

### 2. Backend Setup
```bash
cd backend
npm install
# To seed the database with sample data:
node seed.js
# To start the server:
npm start (or nodemon server.js)
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Login Credentials (from seed)
- **Email**: `admin@school.com`
- **Password**: `password123`

## 🎨 UI/UX Highlights
- Premium design with glassmorphism and subtle animations.
- Responsive layout for mobile and desktop.
- Color-coded attendance status (Green: Present, Red: Absent).
