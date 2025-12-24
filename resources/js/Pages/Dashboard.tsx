import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import { 
    Users, 
    FolderKanban, 
    ClipboardList, 
    Building2,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';

interface Overview {
    total_bidang: number;
    total_program: number;
    total_kegiatan: number;
    total_pelaku_usaha: number;
    total_anggaran: number;
    total_realisasi: number;
    kegiatan_berjalan: number;
    kegiatan_selesai: number;
}

interface StatistikBidang {
    id: number;
    nama: string;
    kode: string;
    total_program: number;
    total_pelaku_usaha: number;
    total_anggaran: number;
    total_realisasi: number;
    persentase_realisasi: number;
}

interface Props {
    overview: Overview;
    statistikBidang: StatistikBidang[];
    progressKegiatan: any[];
    distribusiPelakuUsaha: any[];
    distribusiKecamatan: any[];
    recentActivities: any[];
    tahun: number;
    tahunOptions: number[];
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

function formatNumber(value: number): string {
    return new Intl.NumberFormat('id-ID').format(value);
}

export default function Dashboard({
    overview,
    statistikBidang,
    distribusiPelakuUsaha,
    recentActivities,
    tahun,
    tahunOptions,
}: Props) {
    const persentaseRealisasi = overview.total_anggaran > 0 
        ? ((overview.total_realisasi / overview.total_anggaran) * 100).toFixed(1)
        : 0;

    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-500">Overview data Dinas Pertanian</p>
                    </div>
                    <select
                        value={tahun}
                        onChange={(e) => router.get('/dashboard', { tahun: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                        {tahunOptions.map((t) => (
                            <option key={t} value={t}>Tahun {t}</option>
                        ))}
                    </select>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Bidang"
                        value={overview.total_bidang}
                        icon={Building2}
                        color="blue"
                    />
                    <StatCard
                        title="Total Program"
                        value={overview.total_program}
                        icon={FolderKanban}
                        color="green"
                    />
                    <StatCard
                        title="Total Kegiatan"
                        value={overview.total_kegiatan}
                        icon={ClipboardList}
                        color="purple"
                    />
                    <StatCard
                        title="Pelaku Usaha"
                        value={formatNumber(overview.total_pelaku_usaha)}
                        icon={Users}
                        color="orange"
                    />
                </div>

                {/* Anggaran Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 bg-white rounded-xl border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Realisasi Anggaran
                        </h2>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-500">Pagu Anggaran</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(overview.total_anggaran)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Realisasi</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {formatCurrency(overview.total_realisasi)}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-500">Progress</span>
                                <span className="text-sm font-medium">{persentaseRealisasi}%</span>
                            </div>
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min(Number(persentaseRealisasi), 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Status Kegiatan
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                                    <span className="text-sm text-gray-600">Berjalan</span>
                                </div>
                                <span className="font-semibold">{overview.kegiatan_berjalan}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                                    <span className="text-sm text-gray-600">Selesai</span>
                                </div>
                                <span className="font-semibold">{overview.kegiatan_selesai}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gray-300 rounded-full" />
                                    <span className="text-sm text-gray-600">Lainnya</span>
                                </div>
                                <span className="font-semibold">
                                    {overview.total_kegiatan - overview.kegiatan_berjalan - overview.kegiatan_selesai}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistik per Bidang */}
                <div className="bg-white rounded-xl border overflow-hidden">
                    <div className="p-6 border-b">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Statistik per Bidang
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Bidang
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        Program
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        Pelaku Usaha
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        Anggaran
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        Realisasi
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        Progress
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {statistikBidang.map((bidang) => (
                                    <tr key={bidang.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-sm font-bold text-green-600">
                                                        {bidang.kode}
                                                    </span>
                                                </div>
                                                <span className="font-medium text-gray-900">
                                                    {bidang.nama}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-600">
                                            {bidang.total_program}
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-600">
                                            {formatNumber(bidang.total_pelaku_usaha)}
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-600">
                                            {formatCurrency(bidang.total_anggaran)}
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-600">
                                            {formatCurrency(bidang.total_realisasi)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-green-500 rounded-full"
                                                        style={{ width: `${bidang.persentase_realisasi}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm text-gray-600 w-12 text-right">
                                                    {bidang.persentase_realisasi}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Distribusi Pelaku Usaha */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Distribusi Pelaku Usaha per Jenis
                        </h2>
                        <div className="space-y-3">
                            {distribusiPelakuUsaha.slice(0, 6).map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        {item.jenis_usaha_label}
                                    </span>
                                    <span className="font-semibold text-gray-900">
                                        {formatNumber(item.total)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Aktivitas Terbaru
                        </h2>
                        <div className="space-y-3">
                            {recentActivities.slice(0, 5).map((activity) => (
                                <div key={activity.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                                    <div className={`
                                        w-2 h-2 rounded-full
                                        ${activity.status === 'selesai' ? 'bg-green-500' : ''}
                                        ${activity.status === 'berjalan' ? 'bg-blue-500' : ''}
                                        ${activity.status === 'belum_mulai' ? 'bg-gray-400' : ''}
                                        ${activity.status === 'tertunda' ? 'bg-yellow-500' : ''}
                                    `} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {activity.nama}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {activity.program?.bidang?.nama}
                                        </p>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {activity.progress}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

// Stat Card Component
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: 'blue' | 'green' | 'purple' | 'orange';
    trend?: number;
}

function StatCard({ title, value, icon: Icon, color, trend }: StatCardProps) {
    const colors = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600',
    };

    return (
        <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend !== undefined && (
                    <div className={`flex items-center gap-1 text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {trend >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <div className="mt-4">
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{title}</p>
            </div>
        </div>
    );
}
