import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEvent, useState, useTransition } from 'react';
import { 
    ArrowLeft, 
    Upload, 
    Download, 
    FileSpreadsheet, 
    CheckCircle, 
    AlertCircle,
    Loader2,
    FileText
} from 'lucide-react';

interface Bidang {
    id: number;
    nama: string;
    kode: string;
}

interface FilterOptions {
    bidang: Bidang[];
}

interface ImportResult {
    total: number;
    success: number;
    failed: number;
    errors: string[];
}

interface Props {
    filterOptions: FilterOptions;
}

export default function PelakuUsahaImport({ filterOptions }: Props) {
    const { flash } = usePage().props as any;
    const importResult = flash?.import_result as ImportResult | undefined;
    const [isPending, startTransition] = useTransition();

    const { data, setData, post, processing, errors, reset, progress } = useForm({
        file: null as File | null,
        bidang_id: '',
    });

    const [dragActive, setDragActive] = useState(false);
    const [fileName, setFileName] = useState('');

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        const allowedTypes = [
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ];
        
        if (!allowedTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx|xls)$/i)) {
            alert('File harus berformat CSV atau Excel (.xlsx, .xls)');
            return;
        }

        setData('file', file);
        setFileName(file.name);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        startTransition(() => {
            post('/pelaku-usaha/import', {
                forceFormData: true,
                onSuccess: () => {
                    reset();
                    setFileName('');
                },
            });
        });
    };

    const removeFile = () => {
        setData('file', null);
        setFileName('');
    };

    return (
        <AppLayout>
            <Head title="Import Pelaku Usaha" />

            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link
                        href="/pelaku-usaha"
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Import Data</h1>
                        <p className="text-gray-500">Import data pelaku usaha dari file Excel/CSV</p>
                    </div>
                </div>

                {/* Import Result */}
                {importResult && (
                    <div className={`mb-6 p-4 rounded-xl border animate-slide-up ${
                        importResult.failed === 0 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-yellow-50 border-yellow-200'
                    }`}>
                        <div className="flex items-start gap-3">
                            {importResult.failed === 0 ? (
                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                            )}
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">Hasil Import</h3>
                                <div className="mt-3 grid grid-cols-3 gap-4">
                                    <div className="text-center p-3 bg-white rounded-lg">
                                        <p className="text-2xl font-bold text-gray-900">{importResult.total}</p>
                                        <p className="text-sm text-gray-500">Total</p>
                                    </div>
                                    <div className="text-center p-3 bg-white rounded-lg">
                                        <p className="text-2xl font-bold text-green-600">{importResult.success}</p>
                                        <p className="text-sm text-gray-500">Berhasil</p>
                                    </div>
                                    <div className="text-center p-3 bg-white rounded-lg">
                                        <p className="text-2xl font-bold text-red-600">{importResult.failed}</p>
                                        <p className="text-sm text-gray-500">Gagal</p>
                                    </div>
                                </div>
                                
                                {importResult.errors.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Error Details:</p>
                                        <div className="max-h-40 overflow-y-auto bg-white rounded-lg p-3 text-sm text-red-600 space-y-1">
                                            {importResult.errors.slice(0, 10).map((error, index) => (
                                                <p key={index}>• {error}</p>
                                            ))}
                                            {importResult.errors.length > 10 && (
                                                <p className="text-gray-500">
                                                    ...dan {importResult.errors.length - 10} error lainnya
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Download Template */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FileSpreadsheet className="w-8 h-8 text-blue-600" />
                            <div>
                                <h3 className="font-medium text-blue-900">Template Import</h3>
                                <p className="text-sm text-blue-700">Download template untuk format data yang benar</p>
                            </div>
                        </div>
                        <a
                            href="/pelaku-usaha/template"
                            className="btn-primary bg-blue-600 hover:bg-blue-700"
                        >
                            <Download className="w-4 h-4" />
                            Download
                        </a>
                    </div>
                </div>

                {/* Import Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-xl border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload File</h2>

                        {/* Bidang Selection */}
                        <div className="mb-4">
                            <label className="form-label">
                                Bidang <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.bidang_id}
                                onChange={(e) => setData('bidang_id', e.target.value)}
                                className={`form-input ${errors.bidang_id ? 'form-input-error' : ''}`}
                            >
                                <option value="">Pilih Bidang</option>
                                {filterOptions.bidang.map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.kode} - {b.nama}
                                    </option>
                                ))}
                            </select>
                            {errors.bidang_id && (
                                <p className="text-red-500 text-sm mt-1">{errors.bidang_id}</p>
                            )}
                        </div>

                        {/* File Upload Area */}
                        <div
                            className={`
                                relative border-2 border-dashed rounded-xl p-8 text-center transition-all
                                ${dragActive 
                                    ? 'border-primary-500 bg-primary-50' 
                                    : fileName 
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-gray-300 hover:border-gray-400'
                                }
                            `}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                id="file-upload"
                                accept=".csv,.xlsx,.xls"
                                onChange={handleFileInput}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />

                            {fileName ? (
                                <div className="space-y-3">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                        <FileText className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{fileName}</p>
                                        <button
                                            type="button"
                                            onClick={removeFile}
                                            className="text-sm text-red-600 hover:text-red-700 mt-1"
                                        >
                                            Hapus file
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                                        <Upload className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            Drag & drop file di sini
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            atau <span className="text-primary-600">browse</span> untuk memilih file
                                        </p>
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        Format: CSV, XLSX, XLS (Max. 10MB)
                                    </p>
                                </div>
                            )}
                        </div>

                        {errors.file && (
                            <p className="text-red-500 text-sm mt-2">{errors.file}</p>
                        )}

                        {/* Upload Progress */}
                        {progress && (
                            <div className="mt-4">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-gray-600">Uploading...</span>
                                    <span className="text-sm font-medium">{progress.percentage}%</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-primary-500 rounded-full transition-all duration-300"
                                        style={{ width: `${progress.percentage}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <Link
                            href="/pelaku-usaha"
                            className="btn-outline"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing || isPending || !data.file || !data.bidang_id}
                            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {(processing || isPending) ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Mengimport...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4" />
                                    Import Data
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Instructions */}
                <div className="mt-6 bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Panduan Import</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                        <li>Download template terlebih dahulu untuk mengetahui format data yang benar</li>
                        <li>Isi data sesuai dengan kolom yang tersedia pada template</li>
                        <li>Pastikan NIK unik dan tidak duplikat</li>
                        <li>Pilih bidang yang sesuai untuk data yang akan diimport</li>
                        <li>Upload file dan tunggu proses import selesai</li>
                    </ol>
                </div>
            </div>
        </AppLayout>
    );
}
