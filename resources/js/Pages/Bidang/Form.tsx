import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

interface Bidang {
    id: number;
    kode: string;
    nama: string;
    deskripsi: string | null;
    kepala_bidang: string | null;
    nip_kepala: string | null;
    is_active: boolean;
}

interface Props {
    bidang?: Bidang;
}

export default function BidangForm({ bidang }: Props) {
    const isEdit = !!bidang;

    const { data, setData, post, put, processing, errors } = useForm({
        kode: bidang?.kode ?? '',
        nama: bidang?.nama ?? '',
        deskripsi: bidang?.deskripsi ?? '',
        kepala_bidang: bidang?.kepala_bidang ?? '',
        nip_kepala: bidang?.nip_kepala ?? '',
        is_active: bidang?.is_active ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/bidang/${bidang.id}`);
        } else {
            post('/bidang');
        }
    };

    return (
        <AppLayout>
            <Head title={isEdit ? 'Edit Bidang' : 'Tambah Bidang'} />

            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href="/bidang"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Daftar Bidang
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEdit ? 'Edit Bidang' : 'Tambah Bidang Baru'}
                    </h1>
                    <p className="text-gray-500">
                        {isEdit ? 'Perbarui informasi bidang' : 'Isi form untuk menambah bidang baru'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kode <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.kode}
                                onChange={(e) => setData('kode', e.target.value.toUpperCase())}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                    errors.kode ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Contoh: TPH"
                                maxLength={10}
                            />
                            {errors.kode && <p className="mt-1 text-sm text-red-500">{errors.kode}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nama Bidang <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                    errors.nama ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Contoh: Tanaman Pangan dan Hortikultura"
                            />
                            {errors.nama && <p className="mt-1 text-sm text-red-500">{errors.nama}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Deskripsi
                        </label>
                        <textarea
                            value={data.deskripsi}
                            onChange={(e) => setData('deskripsi', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            placeholder="Deskripsi singkat tentang bidang ini..."
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kepala Bidang
                            </label>
                            <input
                                type="text"
                                value={data.kepala_bidang}
                                onChange={(e) => setData('kepala_bidang', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                placeholder="Nama kepala bidang"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                NIP
                            </label>
                            <input
                                type="text"
                                value={data.nip_kepala}
                                onChange={(e) => setData('nip_kepala', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                placeholder="NIP kepala bidang"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <label htmlFor="is_active" className="text-sm text-gray-700">
                            Bidang aktif
                        </label>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t">
                        <Link
                            href="/bidang"
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
                            {isEdit ? 'Simpan Perubahan' : 'Tambah Bidang'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
