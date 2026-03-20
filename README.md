# 🚗 Parking Garage Management System (PGMS)

A full-stack web application to manage parking garages efficiently — built with **Next.js, Prisma, PostgreSQL, and Tailwind CSS**.

This project simulates a real-world parking system with different user roles (Manager, Attendant, Member), dynamic pricing, reservations, and real-time space tracking.

---

## 📌 Overview

Managing a parking garage is not just about assigning spaces — it involves:

- Handling different types of users
- Managing floors, zones, and spaces
- Tracking vehicle entry and exit
- Calculating pricing based on time and zone
- Supporting reservations and monthly passes

This system solves all of that in a structured and scalable way.

---

## 👥 User Roles

The system supports three types of users:

### 👤 Member

- Reserve parking spaces in advance
- Hold monthly passes for specific zones
- Get priority access in their zone

### 🧑‍💼 Manager

- Configure garages, floors, zones, and spaces
- Define zone types (Standard, Premium, EV, Handicapped)
- Monitor occupancy and structure

### 👷 Attendant

- Handle vehicle check-in and check-out
- Assign spaces to vehicles
- Manage parking sessions

---

## 🧠 Core Features

### 🏗️ Garage Setup

Managers can:

- Create garages
- Add floors → zones → spaces
- Define zone types and pricing

---

### 🚗 Entry & Exit System

- Attendants check vehicles in/out
- System validates:
  - Space availability
  - Vehicle size compatibility
  - Reservation conflicts

- Tracks parking sessions

---

### 📅 Reservations

- Members can reserve spaces in advance
- Prevents double booking
- Reserved spaces cannot be assigned to others

---

### 💳 Pricing Engine

- Charges based on:
  - Duration
  - Zone type
  - Time of day

Example:

- Peak hours → higher rate
- Off-peak → lower rate

---

📧 Email Integration (Resend)

This project includes event-driven email notifications using the Resend API.

Instead of manually triggering emails, the system automatically sends emails based on user actions, making the application more realistic and production-like.

🔔 Implemented Email Triggers

✅ Reservation Confirmation

Sent when a member successfully books a parking space

Includes space details and reservation time

✅ Check-In Notification

Sent when an attendant checks in a vehicle

Confirms parking start with space and timestamp

✅ Checkout Receipt

Sent when a vehicle is checked out

Includes total cost and duration

⚙️ Implementation Details

Used Resend API for sending emails

Created a reusable utility:

lib/email.ts

Emails are triggered directly inside backend API routes:

/api/reservation

/api/checkin

/api/checkout

🔐 Environment Configuration

To enable email functionality, add the following to your .env file:

RESEND_API_KEY=your_resend_api_key
💡 Why This Matters

Demonstrates external API integration

Implements event-driven architecture

Enhances user experience with real-time updates

### ⚠️ Overstay Handling

- If user exceeds reservation time → extra charges apply

---

### 📊 Real-Time Occupancy

- Tracks:
  - Available spaces
  - Reserved spaces
  - Occupied spaces

---

## 🏗️ Tech Stack

### Frontend

- Next.js (App Router)
- React
- Tailwind CSS

### Backend

- Next.js API Routes
- Prisma ORM

### Database

- PostgreSQL (Neon DB)

### Authentication

- Custom auth with cookies
- Password hashing using bcrypt

---

## 🗂️ Project Structure

```
app/
  api/
    auth/
    garage/
    floor/
    zone/
    space/
    reservation/
    checkin/
    checkout/

  login/
  signup/
  setup/
  reserve/
  checkin/
  checkout/

lib/
  prisma.ts
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```
git clone https://github.com/your-username/pgms.git
cd pgms
```

---

### 2️⃣ Install dependencies

```
npm install
```

---

### 3️⃣ Setup environment variables

Create a `.env` file in the root directory:

# this is fake env details

```
DATABASE_URL="your_database_url_here"
```

Example (Neon DB):

```
DATABASE_URL="postgresql://username:password@host/dbname?sslmode=require"
```

---

### 4️⃣ Setup Prisma

```
npx prisma generate
npx prisma migrate dev
```

---

### 5️⃣ Run the project

```
npm run dev
```

App will be running at:

```
http://localhost:3000
```

---

## 🔐 Authentication Flow

- Users sign up with role selection (Member / Attendant / Manager)
- Passwords are hashed using bcrypt
- Session stored using cookies (`userId`)
- Protected routes redirect unauthenticated users

---

## 🧪 Testing Flow (Recommended)

1. Signup as **Manager**
2. Go to **Setup page**
   - Create garage → floor → zone → spaces

3. Signup as **Member**
   - Reserve a parking space

4. Signup as **Attendant**
   - Check-in vehicle
   - Check-out and verify pricing

---

## ⚠️ Known Limitations

- No UI for editing/deleting garage structure yet
- No automated reservation expiry (grace period logic pending)
- Emergency vehicle handling not implemented

---

## 🚀 Future Improvements

- Role-based dashboards
- Better UI/UX
- Payment integration
- Real-time updates using WebSockets
- Grace period automation for reservations

---

## 🧑‍💻 Author

**Adithyan M S**

- BCA Student (Final Year)
- MERN Stack Developer
- Passionate about building real-world systems

---

## 📄 License

This project is for educational purposes and demonstration.

---

## ⭐ Final Note

This project was built to demonstrate:

- Full-stack development skills
- System design thinking
- Real-world problem solving

If you found this useful, feel free to ⭐ the repo!
