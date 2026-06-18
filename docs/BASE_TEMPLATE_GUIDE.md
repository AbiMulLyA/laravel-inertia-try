# Base Template Guide - Laravel 13 + React 19 + Inertia 3

Dokumen ini adalah panduan untuk agent berikutnya agar bisa membuat project baru dari nol dengan stack dan standar yang sama seperti base template ini.

## Tujuan Template

Template ini ditujukan untuk aplikasi full-stack web modern berbasis Laravel yang butuh:

- Backend Laravel terbaru dengan auth, API, RBAC, queue, observability, dan quality gate.
- Frontend React + TypeScript dengan Inertia, SSR-ready build, Tailwind, dan UI system yang konsisten.
- Struktur yang aman untuk dikembangkan menjadi aplikasi internal pemerintahan, dashboard operasional, atau sistem administrasi data.

## Runtime Target

Gunakan versi ini sebagai baseline project baru:

- PHP `8.4.x`
- Composer `2.x`
- Node.js `22.x`
- npm `11.x`
- Database default: PostgreSQL
- Queue/cache/session default local: database
- Queue/cache/session production-ready: Redis via `predis/predis`
- Octane server: FrankenPHP

> Catatan: PHP `8.5` belum direkomendasikan untuk template ini karena beberapa dependency ekosistem spreadsheet masih membatasi kompatibilitas PHP `<8.5`.
> Constraint Composer tetap gunakan `"php": "^8.3"` karena Laravel 13 mendukung PHP `8.3 - 8.5`; runtime CI/template saat ini direkomendasikan PHP `8.4` sampai seluruh dependency spreadsheet kompatibel penuh dengan PHP `8.5`.

## Stack Utama

### Backend

- `laravel/framework` `^13.15`
- `inertiajs/inertia-laravel` `^3.1`
- `laravel/octane` `^2.17`
- `laravel/sanctum` `^4.3`
- `laravel/tinker` `^3.0`
- `php-open-source-saver/jwt-auth` `^2.9`
- `spatie/laravel-permission` `^8.0`
- `spatie/laravel-query-builder` `^7.3`
- `maatwebsite/excel` `^3.1.69`
- `laravel/pulse` `^1.4`
- `predis/predis` `^3.0`

### Frontend

- React `^19.2`
- React DOM `^19.2`
- Inertia React `^3.4`
- TypeScript `^6.0`
- Vite `^8.0`
- Laravel Vite Plugin `^3.1`
- Tailwind CSS `^4.3`
- `@tailwindcss/vite`
- `lucide-react`
- `clsx`
- `tailwind-merge`
- `lodash`

### Development & Quality

- Pest `^4`
- PHPUnit `^12`
- Laravel Pint
- Larastan/PHPStan
- ESLint
- Prettier
- Scribe
- Laravel Breeze
- Laravel Pail
- Laravel Sail
- GitHub Actions CI

## Create From Scratch

Gunakan alur berikut saat membuat project baru.

```bash
composer create-project laravel/laravel nama-project
cd nama-project
composer require inertiajs/inertia-laravel laravel/octane laravel/sanctum laravel/tinker maatwebsite/excel php-open-source-saver/jwt-auth spatie/laravel-permission spatie/laravel-query-builder laravel/pulse predis/predis --with-all-dependencies
composer require --dev fakerphp/faker knuckleswtf/scribe laravel/breeze laravel/pail laravel/pint laravel/sail larastan/larastan mockery/mockery nunomaduro/collision pestphp/pest pestphp/pest-plugin-laravel --with-all-dependencies
npm install @inertiajs/react clsx lodash lucide-react react react-dom tailwind-merge
npm install -D @tailwindcss/vite @types/lodash @types/node @types/react @types/react-dom @vitejs/plugin-react autoprefixer concurrently esbuild eslint eslint-plugin-react-hooks laravel-vite-plugin postcss prettier tailwindcss typescript vite
```

Install starter auth dan publish observability:

```bash
php artisan breeze:install react
php artisan vendor:publish --provider="Laravel\\Pulse\\PulseServiceProvider"
php artisan octane:install --server=frankenphp
php artisan jwt:secret
php artisan migrate
npm run build
```

## Required Config Patterns

### Composer Scripts

Tambahkan script berikut di `composer.json`:

```json
{
  "scripts": {
    "dev": [
      "Composer\\Config::disableProcessTimeout",
      "npx concurrently -c \"#93c5fd,#c4b5fd,#fb7185\" \"php artisan serve\" \"php artisan queue:listen --tries=1\" \"npm run dev\" --names=server,queue,vite"
    ],
    "test": ["@php artisan test"],
    "pint": ["@php vendor/bin/pint"],
    "analyse": ["@php vendor/bin/phpstan analyse --memory-limit=1G"],
    "quality": [
      "@composer validate --no-check-publish",
      "@composer audit --ignore-unreachable",
      "@php vendor/bin/pint --test",
      "@php vendor/bin/phpstan analyse --memory-limit=1G",
      "@php artisan test"
    ]
  }
}
```

### NPM Scripts

Tambahkan script berikut di `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build && vite build --ssr",
    "preview": "vite preview",
    "lint": "eslint resources/js --ext .ts,.tsx",
    "format": "prettier --write resources/js/**/*.{ts,tsx}",
    "typecheck": "tsc --noEmit",
    "quality": "npm run typecheck && npm run build && npm audit --audit-level=moderate"
  }
}
```

### Inertia 3 Blade Contract

Pastikan compiled view sudah format Inertia v3. Jika setelah upgrade muncul white screen dengan error `Cannot read properties of null (reading 'component')`, jalankan:

```bash
php artisan optimize:clear
php artisan view:clear
```

Inertia v3 membaca initial page dari:

```html
<script data-page="app" type="application/json">...</script>
<div id="app"></div>
```

Bukan lagi dari `div#app[data-page]`.

### Vite 8 Manual Chunks

Untuk Vite 8/Rolldown, jangan gunakan `manualChunks` object. Gunakan function:

```ts
manualChunks(id) {
  if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
    return 'react-vendor';
  }

  if (id.includes('node_modules/@inertiajs/react')) {
    return 'inertia';
  }

  if (id.includes('node_modules/lucide-react')) {
    return 'icons';
  }
}
```

### TypeScript 6 Alias Compatibility

Jika masih memakai `baseUrl`, tambahkan:

```json
{
  "compilerOptions": {
    "ignoreDeprecations": "6.0",
    "baseUrl": ".",
    "paths": {
      "@/*": ["resources/js/*"]
    }
  }
}
```

### Frontend Error Boundary

Project baru wajib punya error boundary agar error React tidak menjadi white screen kosong. Letakkan di:

```text
resources/js/Components/ErrorBoundary/AppErrorBoundary.tsx
```

Wrap root Inertia app dengan:

```tsx
<AppErrorBoundary>
  <ThemeProvider>
    <DeferredCacheProvider>
      <App {...props} />
    </DeferredCacheProvider>
  </ThemeProvider>
</AppErrorBoundary>
```

## Environment Baseline

Gunakan pola `.env.example` berikut:

```env
APP_TIMEZONE=Asia/Jakarta
APP_LOCALE=id
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=id_ID

DB_CONNECTION=pgsql
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

OCTANE_SERVER=frankenphp

PULSE_ENABLED=true
PULSE_PATH=pulse
PULSE_STORAGE_DRIVER=database
PULSE_INGEST_DRIVER=storage

# Redis-ready production profile
# REDIS_CLIENT=predis
# CACHE_STORE=redis
# QUEUE_CONNECTION=redis
# SESSION_DRIVER=redis
```

## Testing Baseline

Minimal project baru harus punya:

- `phpunit.xml`
- `tests/Pest.php`
- `tests/TestCase.php`
- Smoke test untuk `/up`, `/login`, dan redirect guest dari `/dashboard`.

Testing environment sebaiknya memakai:

```xml
<env name="CACHE_STORE" value="array"/>
<env name="DB_CONNECTION" value="sqlite"/>
<env name="DB_DATABASE" value=":memory:"/>
<env name="QUEUE_CONNECTION" value="sync"/>
<env name="SESSION_DRIVER" value="array"/>
<env name="PULSE_ENABLED" value="false"/>
```

## Static Analysis Baseline

This template includes `phpstan.neon` and `phpstan-baseline.neon`. The baseline records existing type debt in the demo domain so CI still catches new PHPStan/Larastan errors. When creating a new project from scratch, prefer fixing generated PHPStan findings instead of growing the baseline. If you intentionally inherit demo code, keep the baseline and reduce it over time.

## CI Baseline

CI wajib menjalankan:

```bash
composer install --prefer-dist --no-interaction --no-progress
npm ci
composer validate --no-check-publish
composer audit --ignore-unreachable
npm audit --audit-level=moderate
composer analyse
composer pint -- --test
composer test
npm run build
```

Gunakan PHP `8.4` dan Node `22` di CI.

## Observability & Production Notes

- Pulse aktif sebagai monitoring dashboard ringan.
- Redis sudah disiapkan via `predis/predis`, tetapi local default tetap database agar onboarding mudah.
- Aggregate dashboard memakai `Cache::flexible` untuk pola stale-while-revalidate: default `[300, 1800]` dan short `[120, 900]`. Gunakan pola ini untuk data ringkasan yang mahal dihitung tetapi toleran terhadap stale data singkat.
- Horizon belum dipasang karena stable release yang kompatibel Laravel 13 belum tersedia saat template ini dibuat. Tambahkan Horizon saat package stable kompatibel Laravel 13 sudah rilis.
- Telescope belum dipasang karena stable release Laravel 13 belum tersedia saat template ini dibuat. Tambahkan Telescope hanya untuk local/dev setelah release kompatibel tersedia.
- Untuk production, jalankan Octane dengan FrankenPHP dan aktifkan Redis untuk cache, session, dan queue.

## Definition Of Done Project Baru

Sebelum template turunan dianggap siap:

```bash
composer quality
npm run quality
php artisan about
```

Pastikan hasilnya:

- Laravel `13.x`
- PHP `8.4.x`
- Octane `frankenphp`
- Composer audit bersih
- NPM audit bersih
- Test suite hijau
- Frontend client + SSR build hijau
