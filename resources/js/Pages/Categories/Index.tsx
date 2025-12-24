import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, Layers } from 'lucide-react';

interface Category {
    id: number;
    code: string;
    name: string;
    description: string | null;
    is_active: boolean;
    total_projects: number;
    total_budget: number;
    total_spent: number;
}

interface Props {
    categories: Category[];
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

/**
 * Categories Index Page
 * 
 * Example of a simple list page with CRUD actions.
 * UI Pattern: Data table with actions column.
 */
export default function CategoriesIndex({ categories = [] }: Props) {
    const handleDelete = (id: number, name: string) => {
        if (confirm(`Delete category "${name}"?`)) {
            router.delete(`/categories/${id}`);
        }
    };

    return (
        <AppLayout>
            <Head title="Categories" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                        <p className="text-gray-500">
                            Manage master data categories
                        </p>
                    </div>
                    <Link
                        href="/categories/create"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
                    >
                        <Plus className="w-4 h-4" />
                        Add Category
                    </Link>
                </div>

                {/* Categories Table */}
                <div className="bg-white rounded-xl border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        Projects
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        Budget
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {categories.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-sm font-bold text-primary-600">
                                                        {item.code}
                                                    </span>
                                                </div>
                                                <span className="font-medium text-gray-900">
                                                    {item.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                            {item.description || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-600">
                                            {item.total_projects}
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-600">
                                            {formatCurrency(item.total_budget)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                item.is_active 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {item.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/categories/${item.id}/edit`}
                                                    className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id, item.name)}
                                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {categories.length === 0 && (
                        <div className="p-12 text-center">
                            <Layers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
                            <p className="text-gray-500 mb-4">Get started by adding your first category</p>
                            <Link
                                href="/categories/create"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
                            >
                                <Plus className="w-4 h-4" />
                                Add Category
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
