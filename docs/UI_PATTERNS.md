# UI Patterns

This document describes the UI patterns used in this template. Use these patterns as a reference when building new features.

## Layout

### AppLayout

The main application layout located at `resources/js/Layouts/AppLayout.tsx`.

**Features:**

- Responsive sidebar with mobile support
- User dropdown menu
- Flash message display
- Inertia.js prefetching for fast navigation

**Customization:**

```typescript
// Add new navigation items
const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Your Menu", href: "/your-path", icon: YourIcon },
];
```

---

## Page Patterns

### 1. Dashboard Page

**File:** `Pages/Dashboard.tsx`

**Components:**

- Stat cards with icons
- Progress bars
- Data tables
- Activity feeds

**Example Stat Card:**

```tsx
<StatCard
  title="Total Items"
  value={100}
  icon={Package}
  color="blue" // blue, green, purple, orange
  trend={5.2} // Optional: percentage change
/>
```

---

### 2. Simple List Page

**Example:** `Pages/Categories/Index.tsx`

**Features:**

- Data table with columns
- Action buttons (edit, delete)
- Empty state
- Add button

**Structure:**

```tsx
<AppLayout>
  <Head title="Items" />
  <div className="space-y-6">
    {/* Header with Add button */}
    {/* Data table */}
    {/* Empty state fallback */}
  </div>
</AppLayout>
```

---

### 3. Filtered List Page

**Example:** `Pages/Projects/Index.tsx`, `Pages/Tasks/Index.tsx`

**Features:**

- Summary cards (clickable filters)
- Search box
- Filter dropdowns
- Pagination
- Status badges

**Filter Pattern:**

```tsx
const handleFilterChange = (key: string, value: string) => {
  router.get("/items", { ...filters, [key]: value }, { preserveState: true });
};
```

---

### 4. Simple Form Page

**Example:** `Pages/Categories/Form.tsx`

**Features:**

- Code + Name fields
- Description textarea
- Active checkbox
- Cancel/Save buttons
- Validation errors

**useForm Pattern:**

```tsx
const { data, setData, post, put, processing, errors } = useForm({
  name: item?.name ?? "",
  // ...other fields
});

const handleSubmit = (e) => {
  e.preventDefault();
  if (isEdit) {
    put(`/items/${item.id}`);
  } else {
    post("/items");
  }
};
```

---

### 5. Complex Form Page

**Example:** `Pages/Tasks/Form.tsx`

**Features:**

- Parent dropdown selection
- Multiple sections
- Date pickers
- Conditional fields (edit-only)

**Section Pattern:**

```tsx
{
  /* Section divider */
}
<div className="border-t pt-6">
  <h3 className="text-sm font-medium text-gray-900 mb-4">Section Title</h3>
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{/* Fields */}</div>
</div>;
```

---

## Component Patterns

### Status Badges

```tsx
const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-blue-100 text-blue-700";
    case "completed":
      return "bg-green-100 text-green-700";
    case "pending":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

<span
  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}
>
  {statusLabel}
</span>;
```

### Progress Bars

```tsx
<div className="w-24">
  <div className="flex justify-between text-xs mb-1">
    <span>{progress}%</span>
  </div>
  <div className="w-full bg-gray-100 rounded-full h-2">
    <div
      className="h-2 rounded-full bg-primary-500"
      style={{ width: `${progress}%` }}
    />
  </div>
</div>
```

### Empty State

```tsx
{
  items.length === 0 && (
    <div className="p-12 text-center">
      <Icon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No items yet</h3>
      <p className="text-gray-500 mb-4">
        Get started by adding your first item
      </p>
      <Link href="/items/create" className="btn-primary">
        <Plus className="w-4 h-4" />
        Add Item
      </Link>
    </div>
  );
}
```

### Pagination

```tsx
{
  data.last_page > 1 && (
    <div className="px-6 py-4 border-t flex items-center justify-between">
      <p className="text-sm text-gray-500">
        Showing {start} - {end} of {data.total}
      </p>
      <div className="flex items-center gap-1">
        {data.links.map((link, index) => (
          <Link
            key={index}
            href={link.url || "#"}
            className={`px-3 py-1 rounded text-sm ${
              link.active
                ? "bg-primary-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            dangerouslySetInnerHTML={{ __html: link.label }}
          />
        ))}
      </div>
    </div>
  );
}
```

---

## Color System

### Primary Colors

Uses CSS custom properties defined in Tailwind config:

- `primary-50` to `primary-900`
- Default: Green (#16a34a)

### Status Colors

| Status              | Background      | Text              |
| ------------------- | --------------- | ----------------- |
| Active/In Progress  | `bg-blue-100`   | `text-blue-700`   |
| Completed/Success   | `bg-green-100`  | `text-green-700`  |
| Pending/Draft       | `bg-gray-100`   | `text-gray-700`   |
| Warning/On Hold     | `bg-yellow-100` | `text-yellow-700` |
| Error/High Priority | `bg-red-100`    | `text-red-700`    |

---

## Icon Usage

Icons from [Lucide React](https://lucide.dev/icons):

```tsx
import { Plus, Edit, Trash2, Eye, Search, Filter } from "lucide-react";

<Plus className="w-4 h-4" />;
```

Common icons:

- Navigation: `LayoutDashboard`, `Layers`, `FolderKanban`, `ClipboardList`
- Actions: `Plus`, `Edit`, `Trash2`, `Eye`, `Save`
- UI: `Search`, `Filter`, `ChevronDown`, `ArrowLeft`
- User: `User`, `LogOut`, `Menu`, `X`
