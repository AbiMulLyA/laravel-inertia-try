import { ChangeEvent, DragEvent, useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Download, File, Image, Loader2, Trash2, UploadCloud, X } from 'lucide-react';
import { router } from '@inertiajs/react';

export interface UploadCategoryConfig {
    key: string;
    label: string;
    extensions: string[];
    accept: string;
    max_size_kb: number;
    max_files: number;
    optimize: boolean;
}

export interface ExistingAttachment {
    id: number;
    category: string;
    collection: string;
    original_name: string;
    extension: string;
    mime_type: string | null;
    size: number;
    optimized_size: number | null;
    is_optimized: boolean;
    download_url: string;
    preview_url: string | null;
    created_at: string | null;
}

export interface TemporaryAttachment {
    id: number;
    category: string;
    collection: string;
    original_name: string;
    extension: string;
    mime_type: string | null;
    size: number;
    optimized_size: number | null;
    is_optimized: boolean;
    expires_at: string | null;
}

type UploadMode = 'deferred' | 'immediate';
type UploadStatus = 'queued' | 'uploading' | 'uploaded' | 'failed';

interface UploadingFile {
    key: string;
    file: File;
    category: string;
    progress: number;
    status: UploadStatus;
    error?: string;
    temporary?: TemporaryAttachment;
}

interface FileUploadFieldProps {
    label?: string;
    category?: string;
    categories: UploadCategoryConfig[];
    files: File[];
    onFilesChange: (files: File[]) => void;
    existingFiles?: ExistingAttachment[];
    temporaryFiles?: TemporaryAttachment[];
    onTemporaryFilesChange?: (files: TemporaryAttachment[]) => void;
    mode?: UploadMode;
    collection?: string;
    multiple?: boolean;
    maxFiles?: number;
    error?: string;
    description?: string;
}

function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';

    const units = ['B', 'KB', 'MB', 'GB'];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));

    return `${(bytes / Math.pow(1024, index)).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function progressEventToPercent(event: ProgressEvent): number {
    if (!event.lengthComputable || event.total === 0) return 50;

    return Math.min(99, Math.round((event.loaded / event.total) * 100));
}

export default function FileUploadField({
    label = 'Attachments',
    category,
    categories,
    files,
    onFilesChange,
    existingFiles = [],
    temporaryFiles = [],
    onTemporaryFilesChange,
    mode = 'deferred',
    collection = 'attachments',
    multiple = true,
    maxFiles = 10,
    error,
    description,
}: FileUploadFieldProps) {
    const [clientError, setClientError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
    const temporaryFilesRef = useRef<TemporaryAttachment[]>(temporaryFiles);
    const selectedCategory = useMemo(
        () => categories.find((item) => item.key === category),
        [categories, category],
    );
    const allowedExtensions = useMemo(
        () => (selectedCategory ? selectedCategory.extensions : categories.flatMap((item) => item.extensions)).map((extension) => extension.toLowerCase()),
        [categories, selectedCategory],
    );
    const accept = useMemo(
        () => selectedCategory?.accept ?? categories.flatMap((item) => item.extensions.map((extension) => `.${extension}`)).join(','),
        [categories, selectedCategory],
    );
    const maxSizeKb = selectedCategory?.max_size_kb ?? Math.max(...categories.map((item) => item.max_size_kb), 0);
    const categoryLabels = selectedCategory?.label ?? categories.map((item) => item.label).join(' / ');

    useEffect(() => {
        temporaryFilesRef.current = temporaryFiles;
    }, [temporaryFiles]);

    const activeFileCount = mode === 'immediate' ? temporaryFiles.length + uploadingFiles.length : files.length;

    const resolveCategoryForFile = (file: File): UploadCategoryConfig | undefined => {
        if (selectedCategory) return selectedCategory;

        const extension = file.name.split('.').pop()?.toLowerCase() ?? '';

        return categories.find((item) => item.extensions.map((categoryExtension) => categoryExtension.toLowerCase()).includes(extension));
    };

    const validateFiles = (selectedFiles: File[]): boolean => {
        setClientError(null);

        if (!selectedFiles.length || categories.length === 0) return false;

        if (activeFileCount + selectedFiles.length > maxFiles) {
            setClientError(`Maximum ${maxFiles} files are allowed.`);
            return false;
        }

        const invalidExtensionFile = selectedFiles.find((file) => {
            const extension = file.name.split('.').pop()?.toLowerCase() ?? '';

            return !allowedExtensions.includes(extension);
        });

        if (invalidExtensionFile) {
            setClientError(`${invalidExtensionFile.name} is not allowed. Use: ${allowedExtensions.join(', ')}.`);
            return false;
        }

        const invalidFile = selectedFiles.find((file) => {
            const fileCategory = resolveCategoryForFile(file);
            const maxSizeBytes = (fileCategory?.max_size_kb ?? maxSizeKb) * 1024;

            return file.size > maxSizeBytes;
        });

        if (invalidFile) {
            const fileCategory = resolveCategoryForFile(invalidFile);
            setClientError(`${invalidFile.name} exceeds ${formatBytes((fileCategory?.max_size_kb ?? maxSizeKb) * 1024)}.`);
            return false;
        }

        return true;
    };

    const addDeferredFiles = (selectedFiles: File[]) => {
        if (!validateFiles(selectedFiles)) return;

        onFilesChange(multiple ? [...files, ...selectedFiles] : selectedFiles.slice(0, 1));
    };

    const uploadTemporaryFile = (file: File, uploadCategory: string, uploadKey: string) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', uploadCategory);
        formData.append('collection', collection);

        const request = new XMLHttpRequest();
        request.open('POST', '/media/temp');
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

        const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
        if (csrfToken) request.setRequestHeader('X-CSRF-TOKEN', csrfToken);

        request.upload.onprogress = (event) => {
            const progress = progressEventToPercent(event);
            setUploadingFiles((currentFiles) => currentFiles.map((currentFile) => currentFile.key === uploadKey ? { ...currentFile, progress } : currentFile));
        };

        request.onload = () => {
            if (request.status >= 200 && request.status < 300) {
                const response = JSON.parse(request.responseText) as { data: TemporaryAttachment };
                const nextTemporaryFiles = multiple ? [...temporaryFilesRef.current, response.data] : [response.data];
                temporaryFilesRef.current = nextTemporaryFiles;
                onTemporaryFilesChange?.(nextTemporaryFiles);
                setUploadingFiles((currentFiles) => currentFiles.filter((currentFile) => currentFile.key !== uploadKey));
                return;
            }

            setUploadingFiles((currentFiles) => currentFiles.map((currentFile) => currentFile.key === uploadKey ? { ...currentFile, status: 'failed', error: 'Upload failed.' } : currentFile));
        };

        request.onerror = () => {
            setUploadingFiles((currentFiles) => currentFiles.map((currentFile) => currentFile.key === uploadKey ? { ...currentFile, status: 'failed', error: 'Network error.' } : currentFile));
        };

        request.send(formData);
    };

    const addImmediateFiles = (selectedFiles: File[]) => {
        if (!validateFiles(selectedFiles)) return;

        const nextFiles = selectedFiles.map((file) => ({
            key: `${file.name}-${file.size}-${crypto.randomUUID()}`,
            file,
            category: resolveCategoryForFile(file)?.key ?? selectedCategory?.key ?? categories[0].key,
            progress: 0,
            status: 'uploading' as UploadStatus,
        }));

        setUploadingFiles((currentFiles) => multiple ? [...currentFiles, ...nextFiles] : nextFiles.slice(0, 1));
        nextFiles.forEach((uploadingFile) => uploadTemporaryFile(uploadingFile.file, uploadingFile.category, uploadingFile.key));
    };

    const addFiles = (selectedFiles: File[]) => {
        if (mode === 'immediate') {
            addImmediateFiles(selectedFiles);
            return;
        }

        addDeferredFiles(selectedFiles);
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        addFiles(Array.from(event.target.files ?? []));
        event.target.value = '';
    };

    const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
        addFiles(Array.from(event.dataTransfer.files ?? []));
    };

    const removeSelectedFile = (index: number) => {
        onFilesChange(files.filter((_, fileIndex) => fileIndex !== index));
    };

    const removeUploadingFile = (uploadKey: string) => {
        setUploadingFiles((currentFiles) => currentFiles.filter((currentFile) => currentFile.key !== uploadKey));
    };

    const removeTemporaryFile = (attachment: TemporaryAttachment) => {
        fetch(`/media/temp/${attachment.id}`, {
            method: 'DELETE',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '',
            },
        });

        const nextTemporaryFiles = temporaryFiles.filter((file) => file.id !== attachment.id);
        temporaryFilesRef.current = nextTemporaryFiles;
        onTemporaryFilesChange?.(nextTemporaryFiles);
    };

    const deleteExistingFile = (attachment: ExistingAttachment) => {
        if (!confirm(`Delete ${attachment.original_name}?`)) return;

        router.delete(`/media/${attachment.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <div className="space-y-3">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {label}
                </label>
                {(description || categories.length > 0) && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {description ?? `Allowed: ${categoryLabels}.`}
                    </p>
                )}
            </div>

            <label
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-white px-4 py-6 text-center transition dark:bg-[#1a2744] ${
                    isDragging
                        ? 'border-primary-500 bg-primary-50/70 ring-4 ring-primary-100 dark:bg-primary-900/20 dark:ring-primary-900/30'
                        : 'border-gray-200 hover:border-primary-400 hover:bg-primary-50/40 dark:border-gray-700 dark:hover:bg-primary-900/10'
                }`}
            >
                <UploadCloud className={`mb-2 h-8 w-8 ${isDragging ? 'text-primary-600' : 'text-primary-500'}`} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {isDragging ? 'Drop files here' : `Drag & drop or choose file${multiple ? 's' : ''}`}
                </span>
                <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {mode === 'immediate' ? 'Files upload immediately after selection.' : selectedCategory?.optimize ? 'Images will be optimized automatically.' : 'Files are validated before saving.'}
                </span>
                <input
                    type="file"
                    className="sr-only"
                    multiple={multiple && maxFiles > 1}
                    accept={accept}
                    onChange={handleFileChange}
                />
            </label>

            {(error || clientError) && <p className="text-sm text-red-500">{error ?? clientError}</p>}

            {uploadingFiles.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Upload progress</p>
                    {uploadingFiles.map((uploadingFile) => (
                        <div key={uploadingFile.key} className="rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex min-w-0 items-center gap-2">
                                    {uploadingFile.file.type.startsWith('image/') ? <Image className="h-4 w-4 text-primary-500" /> : <File className="h-4 w-4 text-gray-500" />}
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-gray-700 dark:text-gray-200">{uploadingFile.file.name}</p>
                                        <p className="text-xs text-gray-500">{formatBytes(uploadingFile.file.size)}</p>
                                    </div>
                                </div>
                                {uploadingFile.status === 'failed' ? (
                                    <button type="button" onClick={() => removeUploadingFile(uploadingFile.key)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500 dark:hover:bg-gray-800">
                                        <X className="h-4 w-4" />
                                    </button>
                                ) : uploadingFile.status === 'uploaded' ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : (
                                    <Loader2 className="h-4 w-4 animate-spin text-primary-500" />
                                )}
                            </div>
                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                                <div className="h-full rounded-full bg-primary-500 transition-all" style={{ width: `${uploadingFile.progress}%` }} />
                            </div>
                            {uploadingFile.error && <p className="mt-1 text-xs text-red-500">{uploadingFile.error}</p>}
                        </div>
                    ))}
                </div>
            )}

            {files.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Selected files</p>
                    {files.map((file, index) => (
                        <div key={`${file.name}-${index}`} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700">
                            <div className="flex min-w-0 items-center gap-2">
                                {file.type.startsWith('image/') ? <Image className="h-4 w-4 text-primary-500" /> : <File className="h-4 w-4 text-gray-500" />}
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-gray-700 dark:text-gray-200">{file.name}</p>
                                    <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
                                </div>
                            </div>
                            <button type="button" onClick={() => removeSelectedFile(index)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500 dark:hover:bg-gray-800">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {temporaryFiles.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Ready attachments</p>
                    {temporaryFiles.map((attachment) => (
                        <div key={attachment.id} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700">
                            <div className="flex min-w-0 items-center gap-2">
                                {attachment.mime_type?.startsWith('image/') ? <Image className="h-4 w-4 text-primary-500" /> : <File className="h-4 w-4 text-gray-500" />}
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-gray-700 dark:text-gray-200">{attachment.original_name}</p>
                                    <p className="text-xs text-gray-500">{formatBytes(attachment.optimized_size ?? attachment.size)} · uploaded</p>
                                </div>
                            </div>
                            <button type="button" onClick={() => removeTemporaryFile(attachment)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500 dark:hover:bg-gray-800">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {existingFiles.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Uploaded files</p>
                    {existingFiles.map((attachment) => (
                        <div key={attachment.id} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700">
                            <div className="flex min-w-0 items-center gap-2">
                                {attachment.mime_type?.startsWith('image/') ? <Image className="h-4 w-4 text-primary-500" /> : <File className="h-4 w-4 text-gray-500" />}
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-gray-700 dark:text-gray-200">{attachment.original_name}</p>
                                    <p className="text-xs text-gray-500">
                                        {formatBytes(attachment.optimized_size ?? attachment.size)}{attachment.is_optimized ? ' · optimized' : ''}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <a href={attachment.download_url} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-primary-600 dark:hover:bg-gray-800">
                                    <Download className="h-4 w-4" />
                                </a>
                                <button type="button" onClick={() => deleteExistingFile(attachment)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500 dark:hover:bg-gray-800">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
