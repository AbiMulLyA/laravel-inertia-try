import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageHeader, Card } from '@/Components';
import { Edit, Trash2, Layers, Plus } from 'lucide-react';

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
 * List page with Filament-style data table.
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
                <PageHeader 
                    title="Categories" 
                    subtitle="Manage master data categories"
                    action={{
                        label: 'Add Category',
                        href: '/categories/create',
                        icon: Plus
                    }}
                />

                {/* Categories Table */}
                <Card padding="none" className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Projects
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Budget
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {categories.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-50 rounded-lg flex items-center justify-center border border-primary-200">
                                                    <span className="text-sm font-bold text-primary-700">
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
                                        <td className="px-6 py-4 text-right text-gray-600 font-medium">
                                            {item.total_projects}
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-600">
                                            {formatCurrency(item.total_budget)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                                item.is_active 
                                                    ? 'bg-secondary-50 text-secondary-700 border border-secondary-200' 
                                                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                                            }`}>
                                                {item.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/categories/${item.id}/edit`}
                                                    className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id, item.name)}
                                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Layers className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
                            <p className="text-gray-500 mb-6">Get started by adding your first category</p>
                            <Link
                                href="/categories/create"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Add Category
                            </Link>
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
