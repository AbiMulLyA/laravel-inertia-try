import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

interface Category {
    id: number;
    code: string;
    name: string;
}

interface Project {
    id: number;
    category_id: number;
    code: string;
    name: string;
    description: string | null;
    year: number;
    budget: number;
    spent: number;
    status: string;
    start_date: string | null;
    end_date: string | null;
}

interface Props {
    project?: Project;
    categories: Category[];
    statuses: Record<string, string>;
}

/**
 * Project Form Page
 * 
 * Example of a form with dropdown relationships and date fields.
 * UI Pattern: Sectioned form with related data selection.
 */
export default function ProjectForm({ project, categories, statuses }: Props) {
    const isEdit = !!project;

    const { data, setData, post, put, processing, errors } = useForm({
        category_id: project?.category_id?.toString() ?? '',
        code: project?.code ?? '',
        name: project?.name ?? '',
        description: project?.description ?? '',
        year: project?.year?.toString() ?? new Date().getFullYear().toString(),
        budget: project?.budget?.toString() ?? '',
        spent: project?.spent?.toString() ?? '0',
        status: project?.status ?? 'draft',
        start_date: project?.start_date ?? '',
        end_date: project?.end_date ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/projects/${project.id}`);
        } else {
            post('/projects');
        }
    };

    return (
        <AppLayout>
            <Head title={isEdit ? 'Edit Project' : 'Add Project'} />

            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Projects
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEdit ? 'Edit Project' : 'Add New Project'}
                    </h1>
                    <p className="text-gray-500">
                        {isEdit ? 'Update project information' : 'Fill in the form to create a new project'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 space-y-6">
                    {/* Category Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={data.category_id}
                            onChange={(e) => setData('category_id', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                                errors.category_id ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                            <option value="">Select Category</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    [{c.code}] {c.name}
                                </option>
                            ))}
                        </select>
                        {errors.category_id && <p className="mt-1 text-sm text-red-500">{errors.category_id}</p>}
                    </div>

                    {/* Basic Info */}
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
                                placeholder="e.g., PRJ-001"
                            />
                            {errors.code && <p className="mt-1 text-sm text-red-500">{errors.code}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            >
                                {Object.entries(statuses).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>
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
                            placeholder="Project name"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            placeholder="Project description..."
                        />
                    </div>

                    {/* Budget Section */}
                    <div className="border-t pt-6">
                        <h3 className="text-sm font-medium text-gray-900 mb-4">Budget & Timeline</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Year <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={data.year}
                                    onChange={(e) => setData('year', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                                        errors.year ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    min="2020"
                                    max="2100"
                                />
                                {errors.year && <p className="mt-1 text-sm text-red-500">{errors.year}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Budget <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={data.budget}
                                    onChange={(e) => setData('budget', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                                        errors.budget ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="0"
                                    min="0"
                                />
                                {errors.budget && <p className="mt-1 text-sm text-red-500">{errors.budget}</p>}
                            </div>

                            {isEdit && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Spent
                                    </label>
                                    <input
                                        type="number"
                                        value={data.spent}
                                        onChange={(e) => setData('spent', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="0"
                                        min="0"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) => setData('end_date', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t">
                        <Link
                            href="/projects"
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
                            {isEdit ? 'Save Changes' : 'Add Project'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
