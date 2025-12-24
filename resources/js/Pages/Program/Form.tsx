import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

interface Bidang {
    id: number;
    kode: string;
    nama: string;
}

interface Program {
    id: number;
    bidang_id: number;
    kode: string;
    nama: string;
    deskripsi: string | null;
    tahun_anggaran: number;
    pagu_anggaran: number;
    realisasi_anggaran: number;
    status: string;
    tanggal_mulai: string | null;
    tanggal_selesai: string | null;
}

interface Props {
    program?: Program;
    bidang: Bidang[];
}

export default function ProgramForm({ program, bidang }: Props) {
    const isEdit = !!program;
    const currentYear = new Date().getFullYear();

    const { data, setData, post, put, processing, errors } = useForm({
        bidang_id: program?.bidang_id?.toString() ?? '',
        kode: program?.kode ?? '',
        nama: program?.nama ?? '',
        deskripsi: program?.deskripsi ?? '',
        tahun_anggaran: program?.tahun_anggaran?.toString() ?? currentYear.toString(),
        pagu_anggaran: program?.pagu_anggaran?.toString() ?? '',
        realisasi_anggaran: program?.realisasi_anggaran?.toString() ?? '0',
        status: program?.status ?? 'draft',
        tanggal_mulai: program?.tanggal_mulai ?? '',
        tanggal_selesai: program?.tanggal_selesai ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/program/${program.id}`);
        } else {
            post('/program');
        }
    };

    return (
        <AppLayout>
            <Head title={isEdit ? 'Edit Program' : 'Tambah Program'} />

            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href="/program"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Daftar Program
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEdit ? 'Edit Program' : 'Tambah Program Baru'}
                    </h1>
                    <p className="text-gray-500">
                        {isEdit ? 'Perbarui informasi program' : 'Isi form untuk menambah program baru'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bidang <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={data.bidang_id}
                            onChange={(e) => setData('bidang_id', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                errors.bidang_id ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                            <option value="">Pilih Bidang</option>
                            {bidang.map((b) => (
                                <option key={b.id} value={b.id}>{b.kode} - {b.nama}</option>
                            ))}
                        </select>
                        {errors.bidang_id && <p className="mt-1 text-sm text-red-500">{errors.bidang_id}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kode Program <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.kode}
                                onChange={(e) => setData('kode', e.target.value.toUpperCase())}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                    errors.kode ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Contoh: PRG-001"
                            />
                            {errors.kode && <p className="mt-1 text-sm text-red-500">{errors.kode}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tahun Anggaran <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.tahun_anggaran}
                                onChange={(e) => setData('tahun_anggaran', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            >
                                {Array.from({ length: 6 }, (_, i) => currentYear - 2 + i).map((year) => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nama Program <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.nama}
                            onChange={(e) => setData('nama', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                errors.nama ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Nama program"
                        />
                        {errors.nama && <p className="mt-1 text-sm text-red-500">{errors.nama}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Deskripsi
                        </label>
                        <textarea
                            value={data.deskripsi}
                            onChange={(e) => setData('deskripsi', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            placeholder="Deskripsi program..."
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Pagu Anggaran <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={data.pagu_anggaran}
                                onChange={(e) => setData('pagu_anggaran', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                                    errors.pagu_anggaran ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="0"
                                min="0"
                            />
                            {errors.pagu_anggaran && <p className="mt-1 text-sm text-red-500">{errors.pagu_anggaran}</p>}
                        </div>

                        {isEdit && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Realisasi Anggaran
                                </label>
                                <input
                                    type="number"
                                    value={data.realisasi_anggaran}
                                    onChange={(e) => setData('realisasi_anggaran', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    placeholder="0"
                                    min="0"
                                />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            >
                                <option value="draft">Draft</option>
                                <option value="aktif">Aktif</option>
                                <option value="selesai">Selesai</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tanggal Mulai
                            </label>
                            <input
                                type="date"
                                value={data.tanggal_mulai}
                                onChange={(e) => setData('tanggal_mulai', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tanggal Selesai
                            </label>
                            <input
                                type="date"
                                value={data.tanggal_selesai}
                                onChange={(e) => setData('tanggal_selesai', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t">
                        <Link
                            href="/program"
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                        >
                            {processing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            {isEdit ? 'Simpan Perubahan' : 'Tambah Program'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
