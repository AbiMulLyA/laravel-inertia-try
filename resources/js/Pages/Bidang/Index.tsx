import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Plus, 
    Edit, 
    Trash2, 
    Building2,
    Users,
    FolderKanban,
    TrendingUp
} from 'lucide-react';

interface Bidang {
    id: number;
    kode: string;
    nama: string;
    deskripsi: string | null;
    kepala_bidang: string | null;
    nip_kepala: string | null;
    is_active: boolean;
    total_program: number;
    total_pelaku_usaha: number;
    total_anggaran: number;
    total_realisasi: number;
}

interface Props {
    bidang: Bidang[];
}

export default function BidangIndex({ bidang }: Props) {
    const handleDelete = (id: number, nama: string) => {
        if (confirm(`Hapus bidang "${nama}"? Data ini tidak dapat dikembalikan.`)) {
            router.delete(`/bidang/${id}`);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const totalAnggaran = bidang.reduce((sum, b) => sum + b.total_anggaran, 0);
    const totalRealisasi = bidang.reduce((sum, b) => sum + b.total_realisasi, 0);
    const totalProgram = bidang.reduce((sum, b) => sum + b.total_program, 0);
    const totalPelakuUsaha = bidang.reduce((sum, b) => sum + b.total_pelaku_usaha, 0);

    return (
        <AppLayout>
            <Head title="Bidang" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Bidang</h1>
                        <p className="text-gray-500">
                            Kelola bidang atau unit kerja di Dinas Pertanian
                        </p>
                    </div>
                    <Link
                        href="/bidang/create"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Bidang
                    </Link>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl border p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{bidang.length}</p>
                                <p className="text-sm text-gray-500">Total Bidang</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <FolderKanban className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{totalProgram}</p>
                                <p className="text-sm text-gray-500">Total Program</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{totalPelakuUsaha.toLocaleString()}</p>
                                <p className="text-sm text-gray-500">Pelaku Usaha</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-gray-900">
                                    {totalAnggaran > 0 
                                        ? Math.round((totalRealisasi / totalAnggaran) * 100) 
                                        : 0}%
                                </p>
                                <p className="text-sm text-gray-500">Realisasi</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bidang Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bidang.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                            <span className="text-lg font-bold text-green-600">{item.kode}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{item.nama}</h3>
                                            {item.kepala_bidang && (
                                                <p className="text-sm text-gray-500">{item.kepala_bidang}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Link
                                            href={`/bidang/${item.id}/edit`}
                                            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(item.id, item.nama)}
                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {item.deskripsi && (
                                    <p className="mt-3 text-sm text-gray-600 line-clamp-2">{item.deskripsi}</p>
                                )}

                                <div className="mt-4 grid grid-cols-3 gap-4">
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <p className="text-lg font-semibold text-gray-900">{item.total_program}</p>
                                        <p className="text-xs text-gray-500">Program</p>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <p className="text-lg font-semibold text-gray-900">{item.total_pelaku_usaha.toLocaleString()}</p>
                                        <p className="text-xs text-gray-500">Pelaku Usaha</p>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <p className="text-lg font-semibold text-gray-900">
                                            {item.total_anggaran > 0 
                                                ? Math.round((item.total_realisasi / item.total_anggaran) * 100) 
                                                : 0}%
                                        </p>
                                        <p className="text-xs text-gray-500">Realisasi</p>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-500">Total Anggaran</span>
                                        <span className="font-medium text-gray-900">{formatCurrency(item.total_anggaran)}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div 
                                            className="bg-green-500 h-2 rounded-full transition-all"
                                            style={{ 
                                                width: `${item.total_anggaran > 0 
                                                    ? Math.min((item.total_realisasi / item.total_anggaran) * 100, 100) 
                                                    : 0}%` 
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {bidang.length === 0 && (
                    <div className="bg-white rounded-xl border p-12 text-center">
                        <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada data bidang</h3>
                        <p className="text-gray-500 mb-4">Mulai dengan menambahkan bidang baru</p>
                        <Link
                            href="/bidang/create"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Bidang
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
