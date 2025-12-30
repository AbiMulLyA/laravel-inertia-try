import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { FormInput, FormTextarea, FormCard } from '@/Components';

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
                <FormCard>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Code & Name */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <FormInput
                                label="Code"
                                required
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                error={errors.code}
                                placeholder="e.g., DEV"
                                maxLength={20}
                            />

                            <FormInput
                                label="Name"
                                required
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                error={errors.name}
                                placeholder="Category name"
                            />
                        </div>

                        {/* Description */}
                        <FormTextarea
                            label="Description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={3}
                            placeholder="Optional description..."
                            error={errors.description}
                        />

                        {/* Active Status */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <label htmlFor="is_active" className="text-sm text-gray-700 dark:text-gray-300">
                                Active
                            </label>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
                            <Link
                                href="/categories"
                                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 shadow-sm shadow-primary-600/20"
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
                </FormCard>
            </div>
        </AppLayout>
    );
}
