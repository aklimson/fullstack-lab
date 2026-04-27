# 🎬 Movie Watchlist App

## 📌 Overview

This is a fullstack web application that allows users to manage a personal movie watchlist. Users can add movies, categorize them by genre, track whether they have watched them and update or delete entries.

## ❓ Problem Statement

This application solves the problem of organizing and tracking movies in a structured and interactive way.

---

## 🚀 Technologies Used

* **Frontend:** React (Vite)
* **Backend:** Node.js + Express
* **Database:** MongoDB Atlas
* **Other Tools:** Mongoose, Concurrently, dotenv

---

## 🧱 Project Structure

```
/frontend        → React application
/backend         → Express API
    /models          → Mongoose schemas
    /routes          → API routes
    /controllers     → Business logic
```

The backend follows the **Router → Controller → Model** pattern for clean structure and scalability.

---

## 🗄️ Database Design

The application uses **3 collections**:

### 1. Genres

* name (String, required)

### 2. Movies

* title (String, required)
* releaseYear (Number)
* genreId (ObjectId → Genres)

### 3. WatchlistEntries

* movieId (ObjectId → Movies)
* watched (Boolean)
* rating (Number)
* comment (String)

### 🔗 Relationships

* Movie → Genre (many-to-one)
* WatchlistEntry → Movie (many-to-one)

---

## 🌱 Seed Data

Each collection contains **at least 5 realistic documents**.
Example genres:

* Sci-Fi
* Action
* Drama
* Comedy
* Fantasy

---

## 🔌 API Endpoints

### 🎬 Movies

* `GET /api/movies` → Get all movies (with genre)
* `POST /api/movies` → Create a new movie
* `PUT /api/movies/:id` → Update a movie

### 📺 Watchlist

* `GET /api/watchlist` → Get watchlist (populated)
* `POST /api/watchlist` → Add to watchlist
* `PUT /api/watchlist/:id` → Update watched status
* `DELETE /api/watchlist/:id` → Delete entry

### 🔍 Custom Endpoint (Filtering)

* `GET /api/watchlist?watched=true`
* `GET /api/watchlist?watched=false`

---

## 🎨 Frontend Features

* Display movies in a table
* Add new movies via form (controlled inputs)
* Edit and delete movies
* Filter watchlist (All / Watched / Not Watched)
* Auto-refresh using `setInterval`
* Loading and error states handled
* Modular components (not a single App.jsx)

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/aklimson/fullstack-lab.git
cd <project-folder>
```

### 2. Install dependencies

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 3. Create `.env` file in backend

```env
CONNECTION_URL=your_mongodb_connection_string
PORT=4000
```

### 4. Seed the database

```bash
cd backend
npm run seed
```

### 5. Run the application

```bash
cd ..
npm run dev
```

This will start both frontend and backend using **concurrently**.

### ⏱️ Quick Start Note

The application can be set up and running in under **5 minutes** by following the steps above.

---

## ☁️ Deployment

The backend can be deployed on **Render** and connected to **MongoDB Atlas** using environment variables.

---

## 🧪 Error Handling

The API returns proper HTTP status codes:

* 200 → Success
* 201 → Created
* 400 → Bad request
* 404 → Not found
* 409 → Conflict
* 500 → Server error

All errors return JSON responses.

---

## 🔄 Feature Iteration

One example improvement:

* Initially, movies were displayed without filtering.
* Later, a filter feature was added (`watched=true/false`) to improve usability.

---

## 📚 What I Learned

* Building fullstack apps with the MERN stack
* Structuring backend using controllers
* Handling relationships in MongoDB
* Managing React state and effects
* Importance of clean Git history

---

## 👨‍💻 Author

Developed as part of the Fullstack Development Lab.
