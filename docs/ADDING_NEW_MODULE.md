# Adding a New Module

This guide walks you through adding a new CRUD module to the application.

## Overview

We'll create a new "Products" module as an example. Adapt the names and fields for your specific needs.

---

## Step 1: Create the Model

```bash
php artisan make:model Product -m
```

Edit the migration `database/migrations/xxxx_create_products_table.php`:

```php
public function up(): void
{
    Schema::create('products', function (Blueprint $table) {
        $table->id();
        $table->foreignId('category_id')->constrained()->cascadeOnDelete();
        $table->string('code', 30)->unique();
        $table->string('name');
        $table->text('description')->nullable();
        $table->decimal('price', 12, 2)->default(0);
        $table->integer('stock')->default(0);
        $table->enum('status', ['active', 'inactive'])->default('active');
        $table->timestamps();
        $table->softDeletes();

        $table->index('status');
        $table->index('category_id');
    });
}
```

Edit the model `app/Models/Product.php`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id',
        'code',
        'name',
        'description',
        'price',
        'stock',
        'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    public const STATUS_ACTIVE = 'active';
    public const STATUS_INACTIVE = 'inactive';

    public const STATUSES = [
        self::STATUS_ACTIVE => 'Active',
        self::STATUS_INACTIVE => 'Inactive',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', self::STATUS_ACTIVE);
    }

    public function getStatusLabelAttribute(): string
    {
        return self::STATUSES[$this->status] ?? $this->status;
    }
}
```

Run the migration:

```bash
php artisan migrate
```

---

## Step 2: Create the Controller

```bash
php artisan make:controller ProductController
```

Edit `app/Http/Controllers/ProductController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class ProductController extends Controller
{
    public function index(Request $request): InertiaResponse
    {
        $categoryId = $request->input('category_id');
        $status = $request->input('status');
        $search = $request->input('search');

        $query = Product::with('category:id,code,name');

        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $products = $query->orderBy('created_at', 'desc')
            ->paginate(15)
            ->through(fn ($item) => [
                'id' => $item->id,
                'code' => $item->code,
                'name' => $item->name,
                'category' => $item->category,
                'price' => $item->price,
                'stock' => $item->stock,
                'status' => $item->status,
                'status_label' => $item->status_label,
            ]);

        $categories = Category::active()->select('id', 'code', 'name')->get();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => compact('category_id', 'status', 'search'),
            'statuses' => Product::STATUSES,
        ]);
    }

    public function create(): InertiaResponse
    {
        return Inertia::render('Products/Form', [
            'categories' => Category::active()->select('id', 'code', 'name')->get(),
            'statuses' => Product::STATUSES,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'code' => 'required|max:30|unique:products,code',
            'name' => 'required|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'status' => 'required|in:active,inactive',
        ]);

        Product::create($validated);

        return redirect()->route('products.index')
            ->with('success', 'Product created successfully.');
    }

    public function edit(Product $product): InertiaResponse
    {
        return Inertia::render('Products/Form', [
            'product' => $product,
            'categories' => Category::active()->select('id', 'code', 'name')->get(),
            'statuses' => Product::STATUSES,
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'code' => 'required|max:30|unique:products,code,' . $product->id,
            'name' => 'required|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'status' => 'required|in:active,inactive',
        ]);

        $product->update($validated);

        return redirect()->route('products.index')
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('products.index')
            ->with('success', 'Product deleted successfully.');
    }
}
```

---

## Step 3: Add Routes

Edit `routes/web.php`:

```php
use App\Http\Controllers\ProductController;

Route::middleware(['auth', 'verified'])->group(function () {
    // ... existing routes

    Route::resource('products', ProductController::class);
});
```

---

## Step 4: Create Frontend Pages

### Index Page

Create `resources/js/Pages/Products/Index.tsx`:

Copy from `Pages/Projects/Index.tsx` and adjust:

- Interface names
- Column names and data
- Filter options

### Form Page

Create `resources/js/Pages/Products/Form.tsx`:

Copy from `Pages/Projects/Form.tsx` and adjust:

- Field names
- Validation
- Form layout

---

## Step 5: Update Navigation

Edit `resources/js/Layouts/AppLayout.tsx`:

```typescript
import { Package } from "lucide-react"; // Add icon import

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Categories", href: "/categories", icon: Layers },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Tasks", href: "/tasks", icon: ClipboardList },
  { name: "Products", href: "/products", icon: Package }, // Add this line
];
```

---

## Step 6: Build and Test

```bash
# Run migrations (if not already done)
php artisan migrate

# Build frontend
npm run build

# Or use dev mode
composer dev
```

Navigate to `/products` to see your new module!

---

## Tips

### Copying Existing Pages

1. **Simple CRUD** - Copy from `Categories/`
2. **With Filters** - Copy from `Projects/`
3. **Full Featured** - Copy from `Tasks/`

### TypeScript Interfaces

Always define interfaces for your data:

```typescript
interface Product {
  id: number;
  code: string;
  name: string;
  category: Category | null;
  price: number;
  stock: number;
  status: string;
  status_label: string;
}
```

### Form Validation

Use Laravel's validation rules and display errors:

```tsx
{
  errors.field_name && (
    <p className="mt-1 text-sm text-red-500">{errors.field_name}</p>
  );
}
```
