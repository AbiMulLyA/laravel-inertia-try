import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

interface Category {
    id: number;
    code: string;
    name: string;
    description: string | null;
    is_active: boolean;
}

interface Props {
    category?: Category;
}

/**
 * Category Form Page
 * 
 * Example of a simple create/edit form.
 * UI Pattern: Form with validation, back button, submit action.
 */
export default function CategoryForm({ category }: Props) {
    const isEdit = !!category;

    const { data, setData, post, put, processing, errors } = useForm({
        code: category?.code ?? '',
        name: category?.name ?? '',
        description: category?.description ?? '',
        is_active: category?.is_active ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/categories/${category.id}`);
        } else {
            post('/categories');
        }
    };

    return (
        <AppLayout>
            <Head title={isEdit ? 'Edit Category' : 'Add Category'} />

            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href="/categories"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Categories
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEdit ? 'Edit Category' : 'Add New Category'}
                    </h1>
                    <p className="text-gray-500">
                        {isEdit ? 'Update category information' : 'Fill in the form to add a new category'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 space-y-6">
                    {/* Code & Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Code <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                                    errors.code ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="e.g., DEV"
                                maxLength={20}
                            />
                            {errors.code && <p className="mt-1 text-sm text-red-500">{errors.code}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                                    errors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Category name"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            placeholder="Optional description..."
                        />
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <label htmlFor="is_active" className="text-sm text-gray-700">
                            Active
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t">
                        <Link
                            href="/categories"
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
                        >
                            {processing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            {isEdit ? 'Save Changes' : 'Add Category'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
