<p align="center">
  <h1 align="center">⚡ ELECTRONCE</h1>
  <p align="center">
    <strong>A full-stack e-commerce platform for premium electronics</strong>
  </p>
  <p align="center">
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#api-reference">API Reference</a> •
    <a href="#deployment">Deployment</a>
  </p>
</p>

---

## 📖 Overview

**Electronce** is a modern, full-stack e-commerce web application built for browsing and purchasing premium electronics. It features a **React** frontend with a sleek, dark-themed UI and a **Spring Boot** backend powered by **MongoDB**, with secure JWT authentication, OTP-based email verification, wishlist management, order tracking, and transactional email notifications.

---

## ✨ Features

### 🔐 Authentication & Security
- **User Registration** with email verification (OTP-based)
- **JWT Authentication** — stateless, token-based session management
- **Password Hashing** with BCrypt
- **Forgot / Reset Password** flow via email OTP
- **Route Protection** — authenticated-only access to core pages

### 🛒 Shopping Experience
- **Product Catalog** with category filtering
- **Product Detail Modal** with rich product information
- **Shopping Cart** with add, remove, and quantity management
- **Cart Popup** for quick cart access without page navigation
- **Wishlist** — save products for later, synced to the database

### 📦 Orders & Checkout
- **Multi-item Checkout** with address, area, pincode, and phone fields
- **Order Placement** with confirmation email
- **Order History** — view all past orders sorted by date
- **Order Cancellation** — cancel from the app or directly via email link
- **Email Notifications** — branded HTML confirmation and cancellation receipts

### 📧 Email System
- **Dual Transport** — Brevo HTTP API (production) with SMTP fallback (local dev)
- **Branded HTML Emails** — styled with Electronce branding
- **Transactional Emails** — verification OTP, order confirmation, cancellation receipt, password reset, support enquiry acknowledgement

### 💬 Support
- **Contact / Support Enquiry** form — sends notification to admin and confirmation to user

### 🎨 UI / UX
- Dark-themed, futuristic design with Tailwind CSS
- Custom cursor effect
- Responsive layout
- Scroll-to-top navigation
- Toast notifications via `react-toastify`

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **React Router v6** | Client-side routing |
| **Axios** | HTTP client |
| **Tailwind CSS 3** | Utility-first styling |
| **React Toastify** | Toast notifications |
| **Context API** | State management (Cart, Wishlist) |

### Backend
| Technology | Purpose |
|---|---|
| **Spring Boot 3.5** | REST API framework |
| **Spring Security** | Authentication & authorization |
| **Spring Data MongoDB** | Database access |
| **JJWT 0.12** | JWT token generation & validation |
| **Spring Mail** | SMTP email (local fallback) |
| **Brevo API** | Transactional email (production) |
| **Java 17** | Language runtime |

### Database & Infrastructure
| Technology | Purpose |
|---|---|
| **MongoDB** | NoSQL document database |
| **Docker** | Backend containerization |
| **Render** | Cloud deployment (backend) |

---

## 📁 Project Structure

```
electronce/
├── ecomerce-backend/              # Spring Boot backend
│   ├── src/main/java/.../
│   │   ├── config/                # Data initializer
│   │   ├── controller/
│   │   │   ├── UserController     # Auth, registration, OTP, password reset, support
│   │   │   ├── ProductController  # CRUD for products
│   │   │   ├── OrderController    # Place, view, cancel orders
│   │   │   └── WishlistController # Get & sync wishlists
│   │   ├── model/                 # User, Product, Order, OrderItem, Wishlist
│   │   ├── repository/            # MongoDB repositories
│   │   ├── security/              # JWT filter, token provider, security config
│   │   └── service/               # Email service (Brevo + SMTP)
│   ├── Dockerfile
│   └── pom.xml
│
├── ecommerce-frontend/            # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar             # Navigation bar with search, cart, user menu
│   │   │   ├── ProductList        # Product catalog grid
│   │   │   ├── ProductDetailsModal# Product detail popup
│   │   │   ├── Login              # Login form
│   │   │   ├── LoginRegister      # Registration form
│   │   │   ├── VerifyEmail        # OTP verification page
│   │   │   ├── CartPopup          # Floating cart preview
│   │   │   ├── Footer             # Site footer with support form
│   │   │   ├── CustomCursor       # Custom cursor effect
│   │   │   └── ScrollToTop        # Auto scroll-to-top on navigation
│   │   ├── pages/
│   │   │   ├── CartPage           # Full cart view
│   │   │   ├── Checkout           # Checkout with shipping details
│   │   │   ├── OrderConfirmation  # Post-purchase confirmation
│   │   │   ├── OrdersPage         # Order history
│   │   │   ├── CancelPurchase     # Order cancellation page
│   │   │   └── WishlistPage       # Saved items
│   │   ├── context/               # CartContext, WishlistContext
│   │   ├── styles/                # CSS stylesheets
│   │   └── config.js              # API base URL config
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Java 17+**
- **Maven 3.9+**
- **Node.js 18+** & **npm**
- **MongoDB** (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/electronce.git
cd electronce
```

### 2. Backend Setup

```bash
cd ecomerce-backend
```

Create or edit `src/main/resources/application.properties` with your environment values:

```properties
# MongoDB
spring.data.mongodb.uri=mongodb://localhost:27017/ecommerce_db

# SMTP (local dev — use a Gmail App Password)
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password

# Or use Brevo for production
brevo.api.key=your-brevo-api-key
email.from=your-verified@email.com

# Frontend URL (for email links)
frontend.url=http://localhost:3000
```

Run the backend:

```bash
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080`.

### 3. Frontend Setup

```bash
cd ecommerce-frontend
npm install
```

Optionally create a `.env` file:

```env
REACT_APP_API_URL=http://localhost:8080
```

Start the dev server:

```bash
npm start
```

The app will be available at `http://localhost:3000`.

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/verify-email` | Verify email with OTP |
| `POST` | `/api/auth/resend-otp` | Resend verification OTP |
| `POST` | `/api/auth/login` | Login and receive JWT token |
| `POST` | `/api/auth/forgot-password` | Request password reset OTP |
| `POST` | `/api/auth/reset-password` | Reset password with OTP |
| `POST` | `/api/auth/support-enquiry` | Submit a support enquiry |

### Products

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Get all products (public) |
| `POST` | `/api/products` | Add a new product |
| `DELETE` | `/api/products/{id}` | Delete a product |

### Orders

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/orders/place` | Place a new order |
| `GET` | `/api/auth/orders/{id}` | Get order by ID |
| `GET` | `/api/auth/orders/user?email=` | Get all orders for a user |
| `POST` | `/api/auth/orders/cancel?orderId=` | Cancel an order |

### Wishlist

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/auth/wishlist?email=` | Get wishlist for a user |
| `POST` | `/api/auth/wishlist/sync` | Sync/update wishlist |

---

## 🐳 Docker

Build and run the backend with Docker:

```bash
cd ecomerce-backend

# Build the image
docker build -t electronce-backend .

# Run the container
docker run -p 8080:8080 \
  -e MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/ecommerce_db \
  -e BREVO_API_KEY=your-key \
  -e EMAIL_FROM=your@email.com \
  -e FRONTEND_URL=https://your-frontend.com \
  -e ALLOWED_ORIGINS=https://your-frontend.com \
  electronce-backend
```

---

## ☁️ Deployment

### Backend (Render)

1. Push the `ecomerce-backend` directory to a GitHub repo
2. Create a new **Web Service** on [Render](https://render.com)
3. Set the **Root Directory** to `ecomerce-backend`
4. Set the **Build Command** to: `./mvnw clean package -DskipTests`
5. Set the **Start Command** to: `java -jar target/ecomerce-backend-0.0.1-SNAPSHOT.jar`
6. Add the following **Environment Variables**:

| Variable | Value |
|---|---|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `BREVO_API_KEY` | Your Brevo API key |
| `EMAIL_FROM` | Your verified sender email |
| `FRONTEND_URL` | Your deployed frontend URL |
| `ALLOWED_ORIGINS` | Your frontend URL (for CORS) |
| `PORT` | `8080` |

### Frontend

Build and deploy to any static hosting (Netlify, Vercel, Render Static, etc.):

```bash
cd ecommerce-frontend

# Set API URL for production
REACT_APP_API_URL=https://your-backend.onrender.com npm run build
```

Deploy the generated `build/` folder.

---

## 🔑 Environment Variables

| Variable | Service | Description |
|---|---|---|
| `MONGODB_URI` | Backend | MongoDB connection string |
| `BREVO_API_KEY` | Backend | Brevo transactional email API key |
| `EMAIL_FROM` | Backend | Verified sender email address |
| `GMAIL_APP_PASSWORD` | Backend | Gmail app password (local SMTP fallback) |
| `FRONTEND_URL` | Backend | Frontend URL for email links |
| `ALLOWED_ORIGINS` | Backend | Comma-separated allowed CORS origins |
| `PORT` | Backend | Server port (default: `8080`) |
| `REACT_APP_API_URL` | Frontend | Backend API base URL |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ☕ Java, ⚛️ React, and 🍃 MongoDB
</p>
