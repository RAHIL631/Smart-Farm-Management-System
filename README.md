# 🌾 FarmLink — Smart Farm Management System

A full-stack web application that connects local farmers directly with consumers, eliminating middlemen and ensuring fair prices for fresh, organic produce.

![FarmLink Hero](client/public/images/hero_farm.png)

---

## ✨ Features

### 👤 Consumer
- Browse & search fresh produce from verified local farmers
- Filter by category (Vegetables, Fruits, Grains, Dairy, Spices, Organic)
- Add products to cart and checkout with multiple payment options
- Track orders in real-time
- Leave product reviews and ratings

### 🧑‍🌾 Farmer
- Dedicated dashboard with sales analytics
- Add, edit, and manage product listings
- Track incoming orders and update status
- View revenue charts and performance metrics

### 🛡️ Admin
- User management (view, approve, remove)
- Product moderation and approval
- Order monitoring across the platform
- Platform-wide analytics and statistics

---

## 🛠️ Tech Stack

| Layer       | Technology                                                |
|-------------|-----------------------------------------------------------|
| **Frontend** | React 19, Vite, Tailwind CSS 4, React Router, Recharts  |
| **Backend**  | Node.js, Express.js, JWT Authentication, Multer          |
| **Database** | MySQL (mysql2 driver)                                    |
| **Styling**  | Tailwind CSS 4 with custom theme, CSS animations         |

---

## 📁 Project Structure

```
Smart-Farm-Management-System/
├── client/                    # React frontend
│   ├── public/images/         # Product & hero images
│   ├── src/
│   │   ├── components/        # Navbar, Footer, ProductCard
│   │   ├── pages/             # All page components
│   │   ├── AuthContext.jsx    # Authentication context
│   │   ├── CartContext.jsx    # Shopping cart context
│   │   ├── api.js             # API service layer
│   │   ├── App.jsx            # Main app with routing
│   │   └── index.css          # Global styles & theme
│   ├── package.json
│   └── vite.config.js
├── server/                    # Express backend
│   ├── config/db.js           # MySQL connection
│   ├── middleware/auth.js     # JWT middleware
│   ├── routes/
│   │   ├── auth.js            # Login, Register
│   │   ├── products.js        # CRUD products
│   │   ├── orders.js          # Order management
│   │   ├── reviews.js         # Product reviews
│   │   └── admin.js           # Admin operations
│   ├── schema.sql             # Database schema
│   ├── index.js               # Server entry point
│   └── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **MySQL** 8.0+
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone https://github.com/RAHIL631/Smart-Farm-Management-System.git
cd Smart-Farm-Management-System
```

### 2. Set Up the Database

```bash
mysql -u root -p < server/schema.sql
```

This creates the `farmlink` database with all required tables and seeds an admin user.

### 3. Configure Environment Variables

Create a `.env` file in the `server/` directory:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=farmlink
JWT_SECRET=your_secret_key
```

### 4. Install Dependencies & Run

**Backend:**
```bash
cd server
npm install
npm run dev
```

**Frontend (new terminal):**
```bash
cd client
npm install
npm run dev
```

The app will be available at **http://localhost:5173**

---

## 📊 Database Schema

| Table          | Description                        |
|----------------|------------------------------------|
| `users`        | User accounts (consumer/farmer/admin) |
| `farmers`      | Farmer profiles with farm details  |
| `products`     | Product listings with categories   |
| `orders`       | Customer orders with status tracking |
| `order_items`  | Individual items within orders     |
| `reviews`      | Product ratings and comments       |
| `payments`     | Payment records and transactions   |

---

## 🔑 Default Admin Credentials

| Field    | Value                |
|----------|----------------------|
| Email    | admin@farmlink.com   |
| Password | admin123             |

---

## 📸 Pages

| Page              | Route              | Description                        |
|-------------------|--------------------|------------------------------------|
| Landing Page      | `/`                | Hero, featured products, CTA       |
| Shop              | `/shop`            | Product listing with filters       |
| Product Detail    | `/product/:id`     | Full product info & reviews        |
| Login             | `/login`           | User authentication                |
| Register          | `/register`        | New account (consumer/farmer)      |
| Checkout          | `/checkout`        | Shipping, payment & order summary  |
| My Orders         | `/orders`          | Order history & tracking           |
| Profile           | `/profile`         | User profile & details             |
| About             | `/about`           | Company mission, values & stats    |
| Farmer Dashboard  | `/farmer`          | Farmer product & order management  |
| Admin Panel       | `/admin`           | Platform-wide administration       |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Made with 💚 by <a href="https://github.com/RAHIL631">RAHIL631</a>
</p>
