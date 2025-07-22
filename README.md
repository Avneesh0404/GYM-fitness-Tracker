# 🏋️‍♂️ GYM Fitness Tracker
A full-stack fitness tracking web application that allows users to register, log in, and track their workouts in a personalized dashboard. Built with the **MERN** stack (MongoDB, Express, React, Node.js), this app is designed for individuals serious about monitoring their fitness journey.


## 🚀 Live Demo

🔗 **Frontend** (Vercel): [(https://gym-fitness-tracker-5djd.vercel.app/)](https://gym-fitness-tracker-5djd.vercel.app/) 
🔗 **Backend API** (Render): ([https://gymfitnessapi.onrender.com](https://gym-fitness-tracker.onrender.com/api))

---

## ✨ Features

- 🔐 Secure authentication using JWT
- 📝 Workout logging with date, exercise, and time
- ✏️ Update or delete workouts
- 📅 View daily and historical workout logs
- 💬 Clean and responsive UI with Tailwind CSS
- 🌍 RESTful API integration with frontend

---

## 🛠️ Tech Stack

### 🔧 Frontend (React + Vite)
- React.js
- React Router DOM
- Axios
- Tailwind CSS
- Vercel for deployment

### 🔧 Backend (Node.js + Express)
- Express.js
- MongoDB (with Mongoose)
- JWT for secure authentication
- bcrypt for password hashing
- dotenv for configuration
- Render for deployment

---

## ⚙️ Getting Started (Local Setup)

### 1. Clone the Repository

```bash
git clone https://github.com/Avneesh0404/GYM-fitness-Tracker.git
cd GYM-fitness-Tracker
cd Backend
npm install
```
## Backend Setup
Create a .env file in /Backend
-MONGO_URI=your_mongodb_connection_string
-JWT_SECRET=your_jwt_secret
-PORT=5000
```bash
npm start
```
## Frontend Setup
```bash
cd ../frontend
npm install
```
## Create .env file and add
REACT_APP_BASE_URL=https://yourapilink.render//
```bash
npm run dev
```



