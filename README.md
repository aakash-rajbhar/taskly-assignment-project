# Task Management Application

A full-stack web application with authentication, user dashboard, and task CRUD functionality built with modern technologies.

## 📋 Tech Stack

### Frontend
- **Framework**: Next.js 16.1.6 (React 19.2.3)
- **Styling**: TailwindCSS 4
- **Animations**: Framer Motion 12.30.0
- **Icons**: Lucide React 0.563.0
- **HTTP Client**: Axios 1.13.4
- **Fonts**: Montserrat (Google Fonts)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB (with Mongoose 9.1.5)
- **Authentication**: JWT (jsonwebtoken 9.0.3)
- **Password Hashing**: bcrypt 6.0.0
- **Validation**: Zod 4.3.6
- **CORS**: cors 2.8.6

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

**Example `.env` file:**
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
JWT_SECRET=supersecretkey123
```

### Installation & Running

#### 1. Clone the repository
```bash
git clone <repository-url>
cd assignment-project
```

#### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

#### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

#### 4. Run Backend Server
```bash
cd backend
npm run dev
```
Backend will start on `http://localhost:5000`

#### 5. Run Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend will start on `http://localhost:3000`

## 🧪 Demo Credentials

You can create a new account via the signup page, or use these test credentials:

**Test User 1:**
- Email: `test@example.com`
- Password: `test123`

**Test User 2:**
- Email: `demo@example.com`
- Password: `demo123`

*(Note: You'll need to create these accounts first via the signup page)*

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### POST `/auth/signup`
Create a new user account
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST `/auth/login`
Login to existing account
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST `/auth/logout`
Logout current user (clears cookie)

### Profile Endpoints (Protected)

#### GET `/me`
Get current user profile

#### PUT `/me`
Update user profile
```json
{
  "name": "New Name",
  "email": "newemail@example.com"
}
```

### Task Endpoints (Protected)

#### POST `/tasks`
Create a new task
```json
{
  "title": "Complete project documentation"
}
```

#### GET `/tasks`
Get all tasks for current user

#### PUT `/tasks/:id`
Update a task
```json
{
  "title": "Updated task title",
  "completed": true
}
```

#### DELETE `/tasks/:id`
Delete a task

## ✨ Features Implemented

### Frontend
- ✅ Responsive UI with TailwindCSS
- ✅ Client-side form validation (email format, password min 6 chars, name min 2 chars)
- ✅ Server error message display
- ✅ Protected routes with Next.js middleware
- ✅ Loading states and error states
- ✅ Password visibility toggle
- ✅ Search and filter functionality
- ✅ Task CRUD operations
- ✅ Delete confirmation dialogs
- ✅ Profile dropdown with user info
- ✅ Smooth animations with Framer Motion

### Backend
- ✅ RESTful API with Express
- ✅ JWT authentication middleware
- ✅ Password hashing with bcrypt (12 rounds)
- ✅ Input validation with Zod schemas
- ✅ MongoDB database integration
- ✅ API versioning (/api/v1/*)
- ✅ Consistent error responses
- ✅ Request logging
- ✅ Error logging with stack traces
- ✅ CORS configuration
- ✅ Cookie-based authentication

### Security
- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens stored in HTTP-only cookies
- ✅ Protected routes require authentication
- ✅ Input validation on all endpoints
- ✅ Email uniqueness validation
- ✅ User-scoped data (tasks belong to specific users)

## 📊 Project Structure

```
assignment-project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js          # MongoDB connection
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js    # JWT verification
│   │   │   └── error.middleware.js   # Global error handler
│   │   ├── modules/
│   │   │   ├── auth/          # Authentication routes & model
│   │   │   ├── tasks/         # Task CRUD routes & model
│   │   │   └── user/          # User profile routes
│   │   ├── app.js             # Express app setup
│   │   └── server.js          # Server entry point
│   ├── .env                   # Environment variables
│   └── package.json
│
└── frontend/
    ├── app/
    │   ├── (auth)/
    │   │   ├── login/page.js
    │   │   └── signup/page.js
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   └── TaskCard.js
    │   ├── dashboard/page.js
    │   ├── lib/
    │   │   └── api.js         # Axios instance
    │   ├── globals.css
    │   ├── layout.js
    │   └── page.js            # Home page
    ├── middleware.js          # Route protection
    └── package.json
```

## 🎯 Validation Rules

### Frontend Validation
- **Name**: Minimum 2 characters
- **Email**: Valid email format (HTML5 validation)
- **Password**: Minimum 6 characters

### Backend Validation (Zod Schemas)
- **Signup**: Name (2-50 chars), valid email, password (min 6 chars)
- **Login**: Valid email format, password required
- **Create Task**: Title required (1-200 chars)
- **Update Task**: Title (1-200 chars) or completed boolean
- **Update Profile**: Name (2-50 chars) or valid email

## 🏗️ Scaling for Production

### Deployment
- **Frontend**: Deploy to Vercel, Netlify, or AWS Amplify with environment-specific configs
- **Backend**: Deploy to AWS EC2, DigitalOcean, or Heroku with PM2 for process management
- **Database**: Use MongoDB Atlas with replica sets for high availability

### CORS Configuration
- Update CORS whitelist to include production frontend URL
- Implement environment-based CORS origins
- Set `secure: true` for cookies in production (HTTPS only)

### Environment Management
- Use environment-specific .env files (.env.production, .env.staging)
- Store secrets in AWS Secrets Manager, HashiCorp Vault, or similar
- Never commit .env files to version control

### Database Optimization
- Add indexes on frequently queried fields (userId, email)
- Implement connection pooling
- Use MongoDB aggregation pipelines for complex queries
- Consider read replicas for scaling reads

### Caching
- Implement Redis for session storage and frequently accessed data
- Cache user profiles and task lists with TTL
- Use CDN for static assets (Next.js images, CSS, JS)

### Security Enhancements
- Implement rate limiting (express-rate-limit) on auth endpoints
- Add refresh tokens for longer sessions
- Implement CSRF protection
- Add helmet.js for security headers
- Enable HTTPS/TLS everywhere
- Implement input sanitization against XSS/injection attacks

### Monitoring & Logging
- Implement structured logging (Winston, Pino)
- Set up error tracking (Sentry, Rollbar)
- Monitor API performance (New Relic, DataDog)
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Implement distributed tracing for microservices

### Performance
- Implement pagination for task lists
- Add database query optimization
- Use Next.js ISR (Incremental Static Regeneration) where applicable
- Implement lazy loading for components
- Optimize images with Next.js Image component
- Use compression middleware (gzip/brotli)

### Scalability Patterns
- Implement load balancing (NGINX, AWS ALB)
- Use horizontal scaling with container orchestration (Kubernetes, Docker Swarm)
- Separate read/write databases
- Implement message queues (RabbitMQ, AWS SQS) for async tasks
- Use microservices architecture for independent scaling
- Implement API Gateway for request routing and throttling

### CI/CD Pipeline
- Automated testing (Jest, Cypress)
- Automated builds on git push
- Staging environment for pre-production testing
- Blue-green or canary deployments
- Automated rollback on failures

## 📝 Notes

- JWT tokens are stored in HTTP-only cookies for security
- All API endpoints use consistent error response format
- Protected routes automatically redirect to login if unauthenticated
- Tasks are user-scoped and filtered by userId
- Frontend uses Next.js 13+ App Router with client components

## 🤝 Contributing

This is an assignment project. For production use, consider implementing the scaling recommendations above.

## 📄 License

MIT
