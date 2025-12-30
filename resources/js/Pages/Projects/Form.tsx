import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { FormInput, FormSelect, FormTextarea, FormSection, FormCard } from '@/Components';

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
                <FormCard>
                    <form onSubmit={handleSubmit}>
                    <FormSection 
                        title="Basic Information" 
                        description="General details about the project."
                        className="mb-8"
                    >
                        {/* Category Selection */}
                        <FormSelect
                            label="Category"
                            required
                            value={data.category_id}
                            onChange={(e) => setData('category_id', e.target.value)}
                            error={errors.category_id}
                            placeholder="Select Category"
                        >
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    [{c.code}] {c.name}
                                </option>
                            ))}
                        </FormSelect>

                        {/* Basic Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <FormInput
                                label="Code"
                                required
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                error={errors.code}
                                placeholder="e.g., PRJ-001"
                            />

                            <FormSelect
                                label="Status"
                                required
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                error={errors.status as string} // Type assertion if needed based on inertia types
                                options={Object.entries(statuses).map(([key, label]) => ({
                                    value: key,
                                    label: label
                                }))}
                            />
                        </div>

                        <FormInput
                            label="Name"
                            required
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={errors.name}
                            placeholder="Project name"
                        />

                        <FormTextarea
                            label="Description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={3}
                            placeholder="Project description..."
                            error={errors.description}
                        />
                    </FormSection>

                    {/* Budget Section */}
                    <FormSection 
                        title="Budget & Timeline" 
                        description="Financial and scheduling details."
                        className="border-t pt-6"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <FormInput
                                label="Year"
                                type="number"
                                required
                                value={data.year}
                                onChange={(e) => setData('year', e.target.value)}
                                error={errors.year}
                                min="2020"
                                max="2100"
                            />

                            <FormInput
                                label="Budget"
                                type="number"
                                required
                                value={data.budget}
                                onChange={(e) => setData('budget', e.target.value)}
                                error={errors.budget}
                                placeholder="0"
                                min="0"
                            />

                            {isEdit && (
                                <FormInput
                                    label="Spent"
                                    type="number"
                                    value={data.spent}
                                    onChange={(e) => setData('spent', e.target.value)}
                                    placeholder="0"
                                    min="0"
                                    error={errors.spent as string}
                                />
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormInput
                                label="Start Date"
                                type="date"
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                                error={errors.start_date as string}
                            />
                            
                            <FormInput
                                label="End Date"
                                type="date"
                                value={data.end_date}
                                onChange={(e) => setData('end_date', e.target.value)}
                                error={errors.end_date as string}
                            />
                        </div>
                    </FormSection>

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
                </FormCard>
            </div>
        </AppLayout>
    );
}
