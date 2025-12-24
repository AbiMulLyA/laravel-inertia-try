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
    bidang: Bidang;
}

interface Kegiatan {
    id: number;
    program_id: number;
    kode: string;
    nama: string;
    deskripsi: string | null;
    lokasi: string | null;
    kecamatan: string | null;
    desa: string | null;
    target: number;
    realisasi: number;
    satuan: string;
    anggaran: number;
    realisasi_anggaran: number;
    status: string;
    progress: number;
    tanggal_mulai: string | null;
    tanggal_selesai: string | null;
    catatan: string | null;
}

interface Props {
    kegiatan?: Kegiatan;
    program: Program[];
}

export default function KegiatanForm({ kegiatan, program }: Props) {
    const isEdit = !!kegiatan;

    const { data, setData, post, put, processing, errors } = useForm({
        program_id: kegiatan?.program_id?.toString() ?? '',
        kode: kegiatan?.kode ?? '',
        nama: kegiatan?.nama ?? '',
        deskripsi: kegiatan?.deskripsi ?? '',
        lokasi: kegiatan?.lokasi ?? '',
        kecamatan: kegiatan?.kecamatan ?? '',
        desa: kegiatan?.desa ?? '',
        target: kegiatan?.target?.toString() ?? '',
        realisasi: kegiatan?.realisasi?.toString() ?? '0',
        satuan: kegiatan?.satuan ?? '',
        anggaran: kegiatan?.anggaran?.toString() ?? '',
        realisasi_anggaran: kegiatan?.realisasi_anggaran?.toString() ?? '0',
        status: kegiatan?.status ?? 'draft',
        progress: kegiatan?.progress?.toString() ?? '0',
        tanggal_mulai: kegiatan?.tanggal_mulai ?? '',
        tanggal_selesai: kegiatan?.tanggal_selesai ?? '',
        catatan: kegiatan?.catatan ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/kegiatan/${kegiatan.id}`);
        } else {
            post('/kegiatan');
        }
    };

    return (
        <AppLayout>
            <Head title={isEdit ? 'Edit Kegiatan' : 'Tambah Kegiatan'} />

            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href="/kegiatan"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Daftar Kegiatan
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEdit ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}
                    </h1>
                    <p className="text-gray-500">
                        {isEdit ? 'Perbarui informasi kegiatan' : 'Isi form untuk menambah kegiatan baru'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 space-y-6">
                    {/* Program Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Program <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={data.program_id}
                            onChange={(e) => setData('program_id', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                                errors.program_id ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                            <option value="">Pilih Program</option>
                            {program.map((p) => (
                                <option key={p.id} value={p.id}>
                                    [{p.bidang.kode}] {p.nama}
                                </option>
                            ))}
                        </select>
                        {errors.program_id && <p className="mt-1 text-sm text-red-500">{errors.program_id}</p>}
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kode Kegiatan <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.kode}
                                onChange={(e) => setData('kode', e.target.value.toUpperCase())}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                                    errors.kode ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Contoh: KGT-001"
                            />
                            {errors.kode && <p className="mt-1 text-sm text-red-500">{errors.kode}</p>}
                        </div>

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
                                <option value="berjalan">Berjalan</option>
                                <option value="selesai">Selesai</option>
                                <option value="dibatalkan">Dibatalkan</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nama Kegiatan <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.nama}
                            onChange={(e) => setData('nama', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                                errors.nama ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Nama kegiatan"
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
                            placeholder="Deskripsi kegiatan..."
                        />
                    </div>

                    {/* Location */}
                    <div className="border-t pt-6">
                        <h3 className="text-sm font-medium text-gray-900 mb-4">Lokasi</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Kecamatan
                                </label>
                                <input
                                    type="text"
                                    value={data.kecamatan}
                                    onChange={(e) => setData('kecamatan', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    placeholder="Nama kecamatan"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Desa
                                </label>
                                <input
                                    type="text"
                                    value={data.desa}
                                    onChange={(e) => setData('desa', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    placeholder="Nama desa"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Detail Lokasi
                                </label>
                                <input
                                    type="text"
                                    value={data.lokasi}
                                    onChange={(e) => setData('lokasi', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    placeholder="Detail lokasi"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Target & Budget */}
                    <div className="border-t pt-6">
                        <h3 className="text-sm font-medium text-gray-900 mb-4">Target & Anggaran</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Target <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={data.target}
                                    onChange={(e) => setData('target', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                                        errors.target ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                />
                                {errors.target && <p className="mt-1 text-sm text-red-500">{errors.target}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Satuan <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.satuan}
                                    onChange={(e) => setData('satuan', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                                        errors.satuan ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="contoh: Ha, Ekor, Orang"
                                />
                                {errors.satuan && <p className="mt-1 text-sm text-red-500">{errors.satuan}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Anggaran <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={data.anggaran}
                                    onChange={(e) => setData('anggaran', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                                        errors.anggaran ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="0"
                                    min="0"
                                />
                                {errors.anggaran && <p className="mt-1 text-sm text-red-500">{errors.anggaran}</p>}
                            </div>
                        </div>

                        {isEdit && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Realisasi
                                    </label>
                                    <input
                                        type="number"
                                        value={data.realisasi}
                                        onChange={(e) => setData('realisasi', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                        placeholder="0"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Progress (%)
                                    </label>
                                    <input
                                        type="number"
                                        value={data.progress}
                                        onChange={(e) => setData('progress', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                        placeholder="0"
                                        min="0"
                                        max="100"
                                    />
                                </div>
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
                            </div>
                        )}
                    </div>

                    {/* Timeline */}
                    <div className="border-t pt-6">
                        <h3 className="text-sm font-medium text-gray-900 mb-4">Timeline</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    </div>

                    {isEdit && (
                        <div className="border-t pt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Catatan
                            </label>
                            <textarea
                                value={data.catatan}
                                onChange={(e) => setData('catatan', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                placeholder="Catatan tambahan..."
                            />
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-4 border-t">
                        <Link
                            href="/kegiatan"
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
                            {isEdit ? 'Simpan Perubahan' : 'Tambah Kegiatan'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
