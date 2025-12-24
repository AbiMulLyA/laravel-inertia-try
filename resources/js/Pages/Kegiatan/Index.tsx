import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Plus, 
    Edit, 
    Trash2, 
    ClipboardList,
    Search,
    Filter,
    Eye,
    MapPin
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
    bidang?: Bidang;
}

interface Kegiatan {
    id: number;
    kode: string;
    nama: string;
    program?: Program;
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
    persentase_realisasi: number;
    tanggal_mulai: string | null;
    tanggal_selesai: string | null;
}

interface PaginatedData {
    data: Kegiatan[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Props {
    kegiatan: PaginatedData;
    program: Program[];
    kecamatanList: string[];
    filters: {
        program_id: string | null;
        status: string | null;
        kecamatan: string | null;
        search: string | null;
    };
    summary: {
        total: number;
        berjalan: number;
        selesai: number;
        lainnya: number;
    };
}

export default function KegiatanIndex({ 
    kegiatan = { data: [], current_page: 1, last_page: 1, per_page: 20, total: 0, links: [] }, 
    program = [], 
    kecamatanList = [], 
    filters = { program_id: null, status: null, kecamatan: null, search: null }, 
    summary = { total: 0, berjalan: 0, selesai: 0, lainnya: 0 } 
}: Props) {
    const handleDelete = (id: number, nama: string) => {
        if (confirm(`Hapus kegiatan "${nama}"?`)) {
            router.delete(`/kegiatan/${id}`);
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        router.get('/kegiatan', { ...filters, [key]: value }, { preserveState: true });
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        handleFilterChange('search', formData.get('search') as string);
    };

    const formatCurrency = (value: number) => {
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
            case 'berjalan': return 'bg-blue-100 text-blue-700';
            case 'selesai': return 'bg-green-100 text-green-700';
            case 'draft': return 'bg-gray-100 text-gray-700';
            case 'dibatalkan': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getProgressColor = (progress: number) => {
        if (progress >= 80) return 'bg-green-500';
        if (progress >= 50) return 'bg-blue-500';
        if (progress >= 25) return 'bg-yellow-500';
        return 'bg-gray-400';
    };

    return (
        <AppLayout>
            <Head title="Kegiatan" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Kegiatan</h1>
                        <p className="text-gray-500">
                            Kelola kegiatan dan monitoring progress
                        </p>
                    </div>
                    <Link
                        href="/kegiatan/create"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Kegiatan
                    </Link>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl border p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <ClipboardList className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{summary.total}</p>
                                <p className="text-sm text-gray-500">Total Kegiatan</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border p-4 cursor-pointer hover:bg-blue-50 transition-colors"
                        onClick={() => handleFilterChange('status', 'berjalan')}>
                        <p className="text-2xl font-bold text-blue-600">{summary.berjalan}</p>
                        <p className="text-sm text-gray-500">Berjalan</p>
                    </div>
                    <div className="bg-white rounded-xl border p-4 cursor-pointer hover:bg-green-50 transition-colors"
                        onClick={() => handleFilterChange('status', 'selesai')}>
                        <p className="text-2xl font-bold text-green-600">{summary.selesai}</p>
                        <p className="text-sm text-gray-500">Selesai</p>
                    </div>
                    <div className="bg-white rounded-xl border p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleFilterChange('status', '')}>
                        <p className="text-2xl font-bold text-gray-600">{summary.lainnya}</p>
                        <p className="text-sm text-gray-500">Lainnya</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl border p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <form onSubmit={handleSearch} className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="search"
                                    defaultValue={filters.search || ''}
                                    placeholder="Cari kegiatan..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                        </form>
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-400" />
                            <select
                                value={filters.program_id || ''}
                                onChange={(e) => handleFilterChange('program_id', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                            >
                                <option value="">Semua Program</option>
                                {program.map((p) => (
                                    <option key={p.id} value={p.id}>{p.nama}</option>
                                ))}
                            </select>
                            <select
                                value={filters.status || ''}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                            >
                                <option value="">Semua Status</option>
                                <option value="draft">Draft</option>
                                <option value="berjalan">Berjalan</option>
                                <option value="selesai">Selesai</option>
                                <option value="dibatalkan">Dibatalkan</option>
                            </select>
                            <select
                                value={filters.kecamatan || ''}
                                onChange={(e) => handleFilterChange('kecamatan', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                            >
                                <option value="">Semua Kecamatan</option>
                                {kecamatanList.map((k) => (
                                    <option key={k} value={k}>{k}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Kegiatan Table */}
                <div className="bg-white rounded-xl border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kegiatan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Program</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lokasi</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {kegiatan.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{item.nama}</p>
                                                <p className="text-xs text-gray-500">{item.kode}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700">
                                                    {item.program?.bidang?.kode || '-'}
                                                </span>
                                                <p className="text-xs text-gray-500 mt-1">{item.program?.nama || '-'}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-1">
                                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-gray-900">{item.kecamatan || '-'}</p>
                                                    <p className="text-xs text-gray-500">{item.desa}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-900">
                                                {item.realisasi}/{item.target} {item.satuan}
                                            </p>
                                            <p className="text-xs text-gray-500">{formatCurrency(item.anggaran)}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="w-24">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span>{item.progress}%</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2">
                                                    <div 
                                                        className={`h-2 rounded-full ${getProgressColor(item.progress)}`}
                                                        style={{ width: `${item.progress}%` }}
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
                                                    href={`/kegiatan/${item.id}`}
                                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/kegiatan/${item.id}/edit`}
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

                    {kegiatan.data.length === 0 && (
                        <div className="p-12 text-center">
                            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada kegiatan</h3>
                            <p className="text-gray-500 mb-4">Mulai dengan menambahkan kegiatan baru</p>
                            <Link
                                href="/kegiatan/create"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                            >
                                <Plus className="w-4 h-4" />
                                Tambah Kegiatan
                            </Link>
                        </div>
                    )}

                    {/* Pagination */}
                    {kegiatan.last_page > 1 && (
                        <div className="px-6 py-4 border-t flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                Menampilkan {(kegiatan.current_page - 1) * kegiatan.per_page + 1} - {Math.min(kegiatan.current_page * kegiatan.per_page, kegiatan.total)} dari {kegiatan.total} data
                            </p>
                            <div className="flex items-center gap-1">
                                {kegiatan.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-3 py-1 rounded text-sm ${
                                            link.active
                                                ? 'bg-green-600 text-white'
                                                : link.url
                                                ? 'text-gray-600 hover:bg-gray-100'
                                                : 'text-gray-400 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
