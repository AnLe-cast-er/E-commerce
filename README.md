# 🛍️ E-commerce Platform

A modern e-commerce platform built with **React (Frontend)**, **Laravel (Backend)**, and **MongoDB (Database)**.

---

## 🚀 Features

### 👤 For Customers
- **Product Information**: Display detailed product information  
- **Product Browsing**: Browse products by categories and subcategories  
- **Sub-category Filtering**: Filter products by sub-category  
- **Search Functionality**: Search products across the store  
- **Shopping Cart**: Add/remove items, update quantities  
- **User Authentication**: Secure login/registration system  
- **Order Tracking**: Customers can view their order information and status  

### 🧑💼 Admin Dashboard
- **Product Management**: Full CRUD operations for products  
- **Order Management**: View and update order status  

---

## 🛠️ Tech Stack

### 💻 Frontend
- **React 18** - Frontend library  
- **React Router** - Client-side routing  
- **Tailwind CSS** - Styling framework  
- **Axios** - HTTP client  
- **Vite** - Build tool  

### ⚙️ Backend
- **Laravel** - PHP web framework  
- **MongoDB** - NoSQL database  
- **JWT** - Authentication  

---

## 📦 Installation

### 🧩 Prerequisites
- Node.js (v16+)  
- PHP (v8.1+)  
- Composer  
- MongoDB (v5+)  
- NPM or Yarn  

---

### ⚙️ Setup Instructions

#### 1. **Clone the repository**
```bash
git clone https://github.com/AnLe-cast-er/E-commerce.git
cd E-commerce
```

---

### 🧱 Backend Setup
```bash
cd backend
cp .env.example .env
# Update .env with your MongoDB credentials
composer install
php artisan key:generate
php artisan serve
```

---

### 💻 Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

---

### 🌐 Environment Variables
Create a `.env` file in the `frontend` directory:

```bash
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=YourAppName
```

---

## 🖥️ Project Structure

```bash
E-commerce/
├── frontend/               # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   ├── api/            # API service
│   │   └── App.jsx         # Main App component
│   └── package.json
│
├── backend/                # Laravel backend
│   ├── app/                # Application code
│   ├── config/             # Configuration files
│   ├── database/           # Migrations and seeders (if any)
│   ├── routes/             # API routes
│   └── resources/          # Views and assets
│
└── admin/                  # Admin dashboard (React)
    └── ...                 # Similar to frontend structure
```

---

## 🔧 Configuration

### Backend (Laravel)
- Database configuration in `.env`  
- Generate JWT secret:
  ```bash
  php artisan jwt:secret
  ```
- If using local storage:
  ```bash
  php artisan storage:link
  ```

### Frontend (React)
- API base URL set in `.env`  
- Environment variables must be prefixed with `VITE_`

---

## 🌐 Deployment

### ⚙️ Production Build

**Frontend**
```bash
cd frontend
npm run build
```

**Backend**
```bash
cd ../backend
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 🤝 Contributing

1. Fork the repository  
2. Create your feature branch  
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes  
   ```bash
   git commit -m "Add some AmazingFeature"
   ```
4. Push to the branch  
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request  

---

## 🙏 Acknowledgments

- [Laravel](https://laravel.com/)  
- [React](https://reactjs.org/)  
- [Tailwind CSS](https://tailwindcss.com/)  
- [Vite](https://vitejs.dev/)

