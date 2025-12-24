import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { 
    Plus, 
    Search, 
    Filter, 
    Download, 
    Upload, 
    LayoutGrid, 
    List,
    ChevronDown,
    ChevronRight,
    MoreVertical,
    Edit,
    Trash2,
    Eye
} from 'lucide-react';
import debounce from 'lodash/debounce';

interface PelakuUsaha {
    id: number;
    nik: string;
    nama: string;
    kecamatan: string;
    desa: string;
    jenis_usaha: string;
    jenis_usaha_label?: string;
    kelompok_tani: string | null;
    is_active: boolean;
    bidang?: {
        id: number;
        nama: string;
        kode: string;
    };
}

interface Bidang {
    id: number;
    nama: string;
    kode: string;
}

interface PaginatedData {
    data: PelakuUsaha[];
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

interface GroupedData {
    id: number;
    nama: string;
    kode: string;
    total: number;
    pelaku_usaha: PelakuUsaha[];
}

interface FilterOptions {
    bidang: Bidang[];
    kecamatan: string[];
    jenis_usaha: Array<{ value: string; label: string }>;
    kelompok_tani: string[];
}

interface Statistik {
    id: number;
    nama: string;
    kode: string;
    total_pelaku: number;
    total_aktif: number;
    total_luas_lahan: number;
    total_ternak: number;
}

interface Props {
    data: PaginatedData | GroupedData[];
    filters: Record<string, string>;
    filterOptions: FilterOptions;
    viewMode: 'table' | 'grouped';
    statistik: Statistik[];
}

const defaultPaginatedData: PaginatedData = {
    data: [],
    current_page: 1,
    last_page: 1,
    per_page: 50,
    total: 0,
    links: [],
};

const defaultFilterOptions: FilterOptions = {
    bidang: [],
    kecamatan: [],
    jenis_usaha: [],
    kelompok_tani: [],
};

export default function PelakuUsahaIndex({
    data = defaultPaginatedData,
    filters = {},
    filterOptions = defaultFilterOptions,
    viewMode: initialViewMode = 'table',
    statistik = [],
}: Props) {
    const [viewMode, setViewMode] = useState(initialViewMode || 'table');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [expandedBidang, setExpandedBidang] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');

    // Safe data access
    const safeData = data || defaultPaginatedData;
    const safeFilterOptions = filterOptions || defaultFilterOptions;
    const safeStatistik = statistik || [];

    const isGrouped = viewMode === 'grouped';
    const isPaginated = !isGrouped && safeData && 'data' in safeData;

    // Debounced search
    const debouncedSearch = useMemo(
        () => debounce((value: string) => {
            router.get('/pelaku-usaha', { ...filters, search: value }, { preserveState: true });
        }, 300),
        [filters]
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        debouncedSearch(e.target.value);
    };

    const handleFilterChange = (key: string, value: string) => {
        router.get('/pelaku-usaha', { ...filters, [key]: value }, { preserveState: true });
    };

    const handleViewModeChange = (mode: 'table' | 'grouped') => {
        setViewMode(mode);
        router.get('/pelaku-usaha', { ...filters, view_mode: mode }, { preserveState: true });
    };

    const toggleBidang = (bidangId: number) => {
        setExpandedBidang(prev => 
            prev.includes(bidangId) 
                ? prev.filter(id => id !== bidangId)
                : [...prev, bidangId]
        );
    };

    const toggleSelectAll = () => {
        if (isPaginated) {
            const allIds = (data as PaginatedData).data.map(item => item.id);
            setSelectedIds(selectedIds.length === allIds.length ? [] : allIds);
        }
    };

    const toggleSelect = (id: number) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleBulkDelete = () => {
        if (confirm(`Hapus ${selectedIds.length} data?`)) {
            router.delete('/pelaku-usaha/bulk-destroy', { 
                data: { ids: selectedIds },
                onSuccess: () => setSelectedIds([])
            });
        }
    };

    const handleExport = () => {
        const params = new URLSearchParams(filters as Record<string, string>);
        window.location.href = `/pelaku-usaha/export?${params.toString()}`;
    };

    const clearFilters = () => {
        router.get('/pelaku-usaha');
        setSearchTerm('');
    };

    const hasActiveFilters = Object.values(filters).some(v => v);

    return (
        <AppLayout>
            <Head title="Pelaku Usaha" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Pelaku Usaha</h1>
                        <p className="text-gray-500">
                            Kelola data petani, peternak, dan pelaku usaha pertanian
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href="/pelaku-usaha/import"
                            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            <Upload className="w-4 h-4" />
                            Import
                        </Link>
                        <button
                            onClick={handleExport}
                            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                        <Link
                            href="/pelaku-usaha/create"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Data
                        </Link>
                    </div>
                </div>

                {/* Statistik Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {safeStatistik.map((stat) => (
                        <div key={stat.id} className="bg-white rounded-xl border p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <span className="text-xs font-bold text-green-600">{stat.kode}</span>
                                </div>
                                <span className="text-sm font-medium text-gray-700 truncate">{stat.nama}</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stat.total_aktif.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">pelaku usaha aktif</p>
                        </div>
                    ))}
                </div>

                {/* Toolbar */}
                <div className="bg-white rounded-xl border p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                placeholder="Cari nama, NIK, atau kelompok tani..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                            <button
                                onClick={() => handleViewModeChange('table')}
                                className={`p-2 ${viewMode === 'table' ? 'bg-green-50 text-green-600' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleViewModeChange('grouped')}
                                className={`p-2 ${viewMode === 'grouped' ? 'bg-green-50 text-green-600' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                <LayoutGrid className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Filter Button */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium ${
                                hasActiveFilters 
                                    ? 'border-green-500 text-green-600 bg-green-50' 
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <Filter className="w-4 h-4" />
                            Filter
                            {hasActiveFilters && (
                                <span className="w-5 h-5 bg-green-600 text-white rounded-full text-xs flex items-center justify-center">
                                    {Object.values(filters).filter(Boolean).length}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="mt-4 pt-4 border-t grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bidang</label>
                                <select
                                    value={filters.bidang_id || ''}
                                    onChange={(e) => handleFilterChange('bidang_id', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">Semua Bidang</option>
                                    {safeFilterOptions.bidang.map((b) => (
                                        <option key={b.id} value={b.id}>{b.nama}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Usaha</label>
                                <select
                                    value={filters.jenis_usaha || ''}
                                    onChange={(e) => handleFilterChange('jenis_usaha', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">Semua Jenis</option>
                                    {safeFilterOptions.jenis_usaha.map((j) => (
                                        <option key={j.value} value={j.value}>{j.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kecamatan</label>
                                <select
                                    value={filters.kecamatan || ''}
                                    onChange={(e) => handleFilterChange('kecamatan', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">Semua Kecamatan</option>
                                    {safeFilterOptions.kecamatan.map((k) => (
                                        <option key={k} value={k}>{k}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={clearFilters}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Reset Filter
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bulk Actions */}
                {selectedIds.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                        <span className="text-sm text-green-700">
                            {selectedIds.length} data dipilih
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setSelectedIds([])}
                                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleBulkDelete}
                                className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                )}

                {/* Content */}
                {isGrouped ? (
                    <GroupedView 
                        data={(safeData as GroupedData[]) || []} 
                        expandedBidang={expandedBidang}
                        toggleBidang={toggleBidang}
                    />
                ) : (
                    <TableView 
                        data={(safeData as PaginatedData) || defaultPaginatedData}
                        selectedIds={selectedIds}
                        toggleSelect={toggleSelect}
                        toggleSelectAll={toggleSelectAll}
                    />
                )}
            </div>
        </AppLayout>
    );
}

// Grouped View Component
interface GroupedViewProps {
    data: GroupedData[];
    expandedBidang: number[];
    toggleBidang: (id: number) => void;
}

function GroupedView({ data, expandedBidang, toggleBidang }: GroupedViewProps) {
    return (
        <div className="space-y-4">
            {data.map((bidang) => (
                <div key={bidang.id} className="bg-white rounded-xl border overflow-hidden">
                    <button
                        onClick={() => toggleBidang(bidang.id)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="font-bold text-green-600">{bidang.kode}</span>
                            </div>
                            <div className="text-left">
                                <h3 className="font-semibold text-gray-900">{bidang.nama}</h3>
                                <p className="text-sm text-gray-500">{bidang.total} pelaku usaha</p>
                            </div>
                        </div>
                        {expandedBidang.includes(bidang.id) ? (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                        ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                    </button>
                    
                    {expandedBidang.includes(bidang.id) && (
                        <div className="border-t">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIK</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kecamatan</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenis Usaha</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelompok</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {bidang.pelaku_usaha.map((pelaku) => (
                                        <tr key={pelaku.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-600">{pelaku.nik}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{pelaku.nama}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{pelaku.kecamatan}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{pelaku.jenis_usaha}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{pelaku.kelompok_tani || '-'}</td>
                                            <td className="px-6 py-4 text-right">
                                                <ActionMenu pelakuId={pelaku.id} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

// Table View Component
interface TableViewProps {
    data: PaginatedData;
    selectedIds: number[];
    toggleSelect: (id: number) => void;
    toggleSelectAll: () => void;
}

function TableView({ data, selectedIds, toggleSelect, toggleSelectAll }: TableViewProps) {
    const allSelected = data.data.length > 0 && selectedIds.length === data.data.length;

    return (
        <div className="bg-white rounded-xl border overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 w-10">
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    onChange={toggleSelectAll}
                                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIK</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bidang</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kecamatan</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenis Usaha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {data.data.map((pelaku) => (
                            <tr key={pelaku.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(pelaku.id)}
                                        onChange={() => toggleSelect(pelaku.id)}
                                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                    />
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 font-mono">{pelaku.nik}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{pelaku.nama}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700">
                                        {pelaku.bidang?.kode}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{pelaku.kecamatan}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{pelaku.jenis_usaha}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                        pelaku.is_active 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {pelaku.is_active ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <ActionMenu pelakuId={pelaku.id} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    Menampilkan {(data.current_page - 1) * data.per_page + 1} - {Math.min(data.current_page * data.per_page, data.total)} dari {data.total} data
                </p>
                <div className="flex items-center gap-1">
                    {data.links.map((link, index) => (
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
        </div>
    );
}

// Action Menu Component
function ActionMenu({ pelakuId }: { pelakuId: number }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="p-1 text-gray-500 hover:text-gray-700 rounded"
            >
                <MoreVertical className="w-5 h-5" />
            </button>
            
            {open && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-20">
                        <Link
                            href={`/pelaku-usaha/${pelakuId}`}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            <Eye className="w-4 h-4" />
                            Lihat Detail
                        </Link>
                        <Link
                            href={`/pelaku-usaha/${pelakuId}/edit`}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            <Edit className="w-4 h-4" />
                            Edit
                        </Link>
                        <Link
                            href={`/pelaku-usaha/${pelakuId}`}
                            method="delete"
                            as="button"
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            onClick={(e) => {
                                if (!confirm('Hapus data ini?')) {
                                    e.preventDefault();
                                }
                            }}
                        >
                            <Trash2 className="w-4 h-4" />
                            Hapus
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}
