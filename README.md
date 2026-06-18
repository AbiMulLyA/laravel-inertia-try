# Kominfo Laravel Inertia Base

A production-ready template for building modern web applications with **Laravel 13**, **React 19**, **TypeScript**, and **Inertia.js**.

![Laravel](https://img.shields.io/badge/Laravel-13.x-FF2D20?style=flat&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

## ✨ Features

- 🔐 **Dual Authentication** - JWT for APIs + Session for Web
- 📊 **Dashboard Template** - Statistics cards, charts, tables
- 📝 **CRUD Examples** - Categories, Projects, Tasks
- 🎨 **Modern UI** - Responsive design with Tailwind CSS
- ⚡ **Fast Development** - Hot reload with Vite
- 🚀 **SSR Ready** - Server-side rendering support
- 📚 **API Documentation** - Auto-generated with Scribe

## 🚀 Quick Start

### Prerequisites

- PHP 8.3+
- Node.js 18+
- PostgreSQL (or MySQL)
- Composer

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/kominfo-laravel-inertia-base.git my-project
cd my-project

# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Generate JWT secret
php artisan jwt:secret

# Configure your database in .env, then run migrations
php artisan migrate --seed

# Build frontend assets
npm run build

# Start the development server
composer dev
```

Open `http://localhost:8000` and login with:

- **Email:** admin@example.com
- **Password:** password

## 📁 Project Structure

```
├── app/
│   ├── Http/Controllers/
│   │   ├── Api/                    # API controllers
│   │   ├── CategoryController.php  # Master data example
│   │   ├── ProjectController.php   # Relational data example
│   │   ├── TaskController.php      # Full CRUD example
│   │   └── DashboardController.php
│   ├── Models/
│   │   ├── Category.php            # Simple model
│   │   ├── Project.php             # Model with relationships
│   │   └── Task.php                # Model with status/progress
│   └── Services/
│       └── DashboardService.php    # Business logic example
├── database/
│   ├── migrations/                 # Database schema
│   └── seeders/                    # Sample data
├── resources/js/
│   ├── Components/                 # Reusable UI components
│   ├── Layouts/
│   │   └── AppLayout.tsx          # Main layout with sidebar
│   └── Pages/
│       ├── Auth/                   # Login, Register, etc.
│       ├── Categories/             # Simple CRUD pages
│       ├── Projects/               # CRUD with relationships
│       ├── Tasks/                  # Full-featured CRUD
│       └── Dashboard.tsx           # Overview page
├── routes/
│   ├── web.php                     # Web routes (Inertia)
│   └── api.php                     # API routes (JWT)
└── docs/                           # Documentation
```

## 🎨 UI Patterns Included

### Dashboard

- Stat cards with icons and colors
- Progress bars
- Data tables with sorting
- Activity feeds

### List Pages

- Search functionality
- Multi-filter dropdowns
- Pagination
- Empty states
- Summary cards

### Forms

- Validation feedback
- Relationships dropdowns
- Date pickers
- Multi-section layouts

## 🔧 Customization

### Adding a New Module

1. **Create Model**

   ```bash
   php artisan make:model YourModel -mf
   ```

2. **Create Controller**

   ```bash
   php artisan make:controller YourModelController
   ```

3. **Add Routes** in `routes/web.php`

   ```php
   Route::resource('your-models', YourModelController::class);
   ```

4. **Create Pages** in `resources/js/Pages/YourModels/`
   - Copy from `Categories/` for simple CRUD
   - Copy from `Tasks/` for complex CRUD

5. **Update Navigation** in `resources/js/Layouts/AppLayout.tsx`
   ```typescript
   const navigation = [
     // ... existing items
     { name: "Your Models", href: "/your-models", icon: YourIcon },
   ];
   ```

### Changing Branding

1. Update `resources/js/Layouts/AppLayout.tsx`:
   - Logo text
   - App name
   - Colors (primary-\* classes)

2. Update `.env`:
   - `APP_NAME`

3. Update `tailwind.config.js` for custom colors

## 🔐 Authentication

### Web (Session-based)

- Login: `/login`
- Register: `/register`
- Logout: `/logout`

### API (JWT)

- Login: `POST /api/v1/auth/login`
- Register: `POST /api/v1/auth/register`
- Logout: `POST /api/v1/auth/logout` (requires token)
- Refresh: `POST /api/v1/auth/refresh`
- User: `GET /api/v1/auth/user`

#### JWT Token Usage

```bash
# Get token
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Use token
curl http://localhost:8000/api/v1/auth/user \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📦 Tech Stack

| Layer    | Technology                |
| -------- | ------------------------- |
| Backend  | Laravel 13, PHP 8.3+      |
| Frontend | React 19, TypeScript      |
| Bridge   | Inertia.js 3              |
| Styling  | Tailwind CSS 4            |
| Build    | Vite 8                    |
| Database | PostgreSQL / MySQL        |
| Auth     | JWT (API) + Session (Web) |
| Icons    | Lucide React              |

## ⚡ Dashboard Cache

Dashboard aggregate queries use Laravel 13's `Cache::flexible` stale-while-revalidate strategy. Cached dashboard data is served immediately during the stale window while Laravel refreshes it in the background, keeping dashboard pages responsive without changing the API response shape.

## 🛠️ Development

```bash
# Start dev server with hot reload
composer dev

# Or run separately:
php artisan serve
npm run dev

# Build for production
npm run build

# Run tests
php artisan test

# Generate API docs
php artisan scribe:generate
```

## 📄 License

MIT License - feel free to use this template for any project.

---

Made with ❤️ by Kominfo Team
