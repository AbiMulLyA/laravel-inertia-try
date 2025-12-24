import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Plus, 
    Edit, 
    Trash2, 
    FolderKanban,
    Filter,
    TrendingUp
} from 'lucide-react';

interface Bidang {
    id: number;
    kode: string;
    nama: string;
}

interface Program {
    id: number;
    kode: string;
    nama: string;
    deskripsi: string | null;
    bidang: Bidang;
    tahun_anggaran: number;
    pagu_anggaran: number;
    realisasi_anggaran: number;
    persentase_realisasi: number;
    status: string;
    total_kegiatan: number;
    tanggal_mulai: string | null;
    tanggal_selesai: string | null;
}

interface Props {
    program: Program[];
    bidang: Bidang[];
    filters: {
        tahun: number;
        bidang_id: string | null;
    };
    summary: {
        total_program: number;
        total_pagu: number;
        total_realisasi: number;
    };
}

export default function ProgramIndex({ program, bidang, filters, summary }: Props) {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 6 }, (_, i) => currentYear - 2 + i);

    const handleDelete = (id: number, nama: string) => {
        if (confirm(`Hapus program "${nama}"? Data ini tidak dapat dikembalikan.`)) {
            router.delete(`/program/${id}`);
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        router.get('/program', { ...filters, [key]: value }, { preserveState: true });
    };

    const formatCurrency = (value: number) => {
        if (value >= 1e12) return `Rp ${(value / 1e12).toFixed(1)}T`;
        if (value >= 1e9) return `Rp ${(value / 1e9).toFixed(1)}M`;
        if (value >= 1e6) return `Rp ${(value / 1e6).toFixed(1)}Jt`;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'aktif': return 'bg-green-100 text-green-700';
            case 'selesai': return 'bg-blue-100 text-blue-700';
            case 'draft': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const persentaseTotal = summary.total_pagu > 0 
        ? Math.round((summary.total_realisasi / summary.total_pagu) * 100) 
        : 0;

    return (
        <AppLayout>
            <Head title="Program" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Program</h1>
                        <p className="text-gray-500">
                            Kelola program kerja Dinas Pertanian tahun {filters.tahun}
                        </p>
                    </div>
                    <Link
                        href="/program/create"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Program
                    </Link>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl border p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <FolderKanban className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{summary.total_program}</p>
                                <p className="text-sm text-gray-500">Total Program</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-gray-900">{formatCurrency(summary.total_pagu)}</p>
                                <p className="text-sm text-gray-500">Total Pagu</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border p-4">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm text-gray-500">Realisasi</span>
                                <span className="text-sm font-medium text-green-600">{persentaseTotal}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-3">
                                <div 
                                    className="bg-green-500 h-3 rounded-full transition-all"
                                    style={{ width: `${Math.min(persentaseTotal, 100)}%` }}
                                />
                            </div>
                            <p className="mt-2 text-sm text-gray-600">{formatCurrency(summary.total_realisasi)}</p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl border p-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">Filter:</span>
                        </div>
                        <select
                            value={filters.tahun}
                            onChange={(e) => handleFilterChange('tahun', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                        >
                            {years.map((year) => (
                                <option key={year} value={year}>Tahun {year}</option>
                            ))}
                        </select>
                        <select
                            value={filters.bidang_id || ''}
                            onChange={(e) => handleFilterChange('bidang_id', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                        >
                            <option value="">Semua Bidang</option>
                            {bidang.map((b) => (
                                <option key={b.id} value={b.id}>{b.nama}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Program Table */}
                <div className="bg-white rounded-xl border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Program</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bidang</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pagu</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Realisasi</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {program.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                                                {item.kode}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{item.nama}</p>
                                                <p className="text-xs text-gray-500">{item.total_kegiatan} kegiatan</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700">
                                                {item.bidang.kode}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {formatCurrency(item.pagu_anggaran)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="w-24">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span>{item.persentase_realisasi}%</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                                    <div 
                                                        className="bg-green-500 h-1.5 rounded-full"
                                                        style={{ width: `${Math.min(item.persentase_realisasi, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/program/${item.id}/edit`}
                                                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id, item.nama)}
                                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {program.length === 0 && (
                        <div className="p-12 text-center">
                            <FolderKanban className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada program</h3>
                            <p className="text-gray-500 mb-4">Belum ada program untuk tahun {filters.tahun}</p>
                            <Link
                                href="/program/create"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                            >
                                <Plus className="w-4 h-4" />
                                Tambah Program
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
