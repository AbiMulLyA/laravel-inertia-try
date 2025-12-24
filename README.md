# Aplikasi CRUD Dinas Pertanian

Aplikasi manajemen data Dinas Pertanian dengan stack modern 2025.

## Tech Stack (Latest Versions)

- **Backend:** Laravel 12.11
- **Frontend:** React 19.2 + Inertia.js 2.3.4 + TypeScript 5.x
- **Styling:** Tailwind CSS 4.1 (CSS-first config)
- **Database:** PostgreSQL 18.1
- **Performance:** Laravel Octane + FrankenPHP

## Requirements

- PHP 8.2+ (recommended 8.4)
- Composer 2.8+
- Node.js 22+ (LTS)
- PostgreSQL 18+
- pnpm (recommended) atau npm

## Quick Start

```bash
# 1. Create Laravel 12.11 Project
composer create-project laravel/laravel:^12.11 dinas-pertanian
cd dinas-pertanian

# 2. Install Breeze dengan React 19 + TypeScript + Inertia 2.x
composer require laravel/breeze --dev
php artisan breeze:install react --typescript --ssr

# 3. Install Octane untuk performance
composer require laravel/octane
php artisan octane:install --server=frankenphp

# 4. Install additional packages
composer require spatie/laravel-permission
composer require spatie/laravel-query-builder
composer require maatwebsite/excel

# 5. Setup database
cp .env.example .env
# Edit .env untuk PostgreSQL 18

# 6. Run migrations
php artisan migrate

# 7. Run development server
pnpm install  # atau npm install
pnpm dev      # atau npm run dev

# Terminal terpisah
php artisan octane:start --workers=4
```

## Environment Setup (.env)

```env
APP_NAME="Dinas Pertanian"
APP_ENV=local
APP_DEBUG=true

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=dinas_pertanian
DB_USERNAME=postgres
DB_PASSWORD=your_password

CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
```

## Database Schema

```
bidang
├── id
├── nama (Pertanian, Peternakan, Ketahanan Pangan)
├── kode
├── deskripsi
└── timestamps

program
├── id
├── bidang_id (FK)
├── nama
├── tahun_anggaran
├── pagu_anggaran
├── status
└── timestamps

kegiatan
├── id
├── program_id (FK)
├── nama
├── lokasi
├── target
├── realisasi
├── satuan
├── anggaran
├── status
└── timestamps

pelaku_usaha
├── id
├── bidang_id (FK)
├── nik
├── nama
├── alamat
├── no_hp
├── jenis_usaha
├── luas_lahan
├── komoditas (JSON)
└── timestamps
```

## Fitur Utama

1. **Dashboard** - Overview statistik per bidang
2. **Master Bidang** - CRUD bidang organisasi
3. **Program** - Manajemen program kerja
4. **Kegiatan** - Tracking kegiatan per program
5. **Pelaku Usaha** - Database petani/peternak
6. **Laporan** - Export data ke Excel/PDF
7. **Import Data** - Bulk import dari Excel

## Performance Optimization

- Lazy Collections untuk data > 10.000 records
- Cursor-based pagination
- Chunked exports
- Redis caching
- Query optimization dengan indexes
