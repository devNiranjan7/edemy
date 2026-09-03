# Edemy LMS

A full-stack Learning Management System (LMS) built with **React, Node.js, Express, MongoDB, Tailwind CSS, Clerk, Stripe, and Cloudinary**. The project includes a student-facing application, educator dashboard, secure authentication, course management, video lectures, Stripe payments, progress tracking, and cloud media storage.

## Features

### Student Features

- Secure authentication with Clerk
- Browse all available courses
- Search and filter courses
- View detailed course information
- Purchase courses using Stripe Checkout
- Access enrolled courses
- Watch video lectures
- Track course progress
- Continue learning from enrolled courses
- Responsive design

### Educator Features

- Educator authentication
- Educator dashboard
- Create new courses
- Add chapters and lectures
- Upload course thumbnails
- Manage course content
- Publish courses
- View enrolled students
- Track total earnings
- Dashboard analytics

## Integrations

- **MongoDB** — Database
- **Cloudinary** — Course thumbnail storage
- **Stripe** — Online course payments
- **Clerk** — Authentication and user management

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- React Toastify
- Quill
- React Player

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Clerk
- Stripe
- Multer
- Cloudinary
- Svix

## Environment Variables

Create `.env` files in the required directories and add your own credentials.

### Backend

```env
PORT=

MONGODB_URI=

CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
CLERK_PUBLISHABLE_KEY=

STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

CURRENCY=
```

### Frontend

```env
VITE_BACKEND_URL=

VITE_CLERK_PUBLISHABLE_KEY=
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/devNiranjan7/edemy.git
cd edemy
```

### 2. Install dependencies

Install dependencies separately for each application:

```bash
cd server
npm install

cd ../client
npm install
```

### 3. Configure environment variables

Create the required `.env` files and add your MongoDB, Clerk, Cloudinary, Stripe, and application URL credentials.

### 4. Start the backend

```bash
cd server
npm run server
```

### 5. Start the frontend

```bash
cd client
npm run dev
```

Open the URL provided by Vite in your browser.

## Authentication

- The application uses Clerk Authentication for secure user management.
- Protected APIs require authenticated users.
- Role-based access is implemented for students and educators.
- Clerk Webhooks automatically synchronize user data with MongoDB.

## Media Management

- Course thumbnails are uploaded using Multer.
- Cloudinary is used for cloud image storage.
- Uploaded image URLs are stored in MongoDB.
- Educators can manage course thumbnails while creating courses.

## Courses

The course management system supports:

- Course creation
- Chapter management
- Lecture management
- Rich text course descriptions
- Course publishing
- Student enrollment
- Progress tracking
- Educator dashboard analytics

## Payments

Edemy LMS uses **Stripe Checkout** for secure online course purchases.

Users can purchase courses through Stripe, with payment verification handled securely using Stripe Webhooks before granting course access.

## Security Notes

- Keep all secrets inside `.env` files.
- Never commit `.env` files to GitHub.
- Never expose backend secrets through `VITE_*` variables.
- Keep Stripe secret keys on the backend.
- Use environment-specific credentials for development and production.
- Use Clerk authentication for protected API routes.
- Verify Stripe Webhook signatures before processing payments.

## Project Purpose

This project was built to practice and demonstrate full-stack web development, including:

- React application development
- REST API development
- Clerk authentication
- Role-based access control
- MongoDB database integration
- Cloud media storage
- Learning Management System architecture
- Stripe payment integration
- Stripe Webhooks
- Educator dashboard development
- Course management
- Frontend-backend communication
- Responsive UI development

## Author

**Dev Niranjan**

> Built with React, Node.js, Express, MongoDB, Clerk, Stripe, and a lot of debugging.
