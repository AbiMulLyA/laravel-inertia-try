import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

interface Bidang {
    id: number;
    nama: string;
    kode: string;
}

interface FilterOptions {
    bidang: Bidang[];
    kecamatan: string[];
    jenis_usaha: Array<{ value: string; label: string }>;
    kelompok_tani: string[];
}

interface PelakuUsaha {
    id?: number;
    bidang_id: number;
    nik: string;
    nama: string;
    jenis_kelamin: string;
    alamat: string;
    kecamatan: string;
    desa: string;
    rt: string;
    rw: string;
    no_hp: string;
    email: string;
    jenis_usaha: string;
    luas_lahan: number | null;
    jumlah_ternak: number | null;
    komoditas: string[];
    kelompok_tani: string;
}

interface Props {
    pelakuUsaha?: PelakuUsaha;
    filterOptions: FilterOptions;
    jenisUsaha: Record<string, string>;
}

export default function PelakuUsahaForm({ pelakuUsaha, filterOptions, jenisUsaha }: Props) {
    const isEdit = !!pelakuUsaha?.id;

    const { data, setData, post, put, processing, errors } = useForm({
        bidang_id: pelakuUsaha?.bidang_id || '',
        nik: pelakuUsaha?.nik || '',
        nama: pelakuUsaha?.nama || '',
        jenis_kelamin: pelakuUsaha?.jenis_kelamin || 'L',
        alamat: pelakuUsaha?.alamat || '',
        kecamatan: pelakuUsaha?.kecamatan || '',
        desa: pelakuUsaha?.desa || '',
        rt: pelakuUsaha?.rt || '',
        rw: pelakuUsaha?.rw || '',
        no_hp: pelakuUsaha?.no_hp || '',
        email: pelakuUsaha?.email || '',
        jenis_usaha: pelakuUsaha?.jenis_usaha || '',
        luas_lahan: pelakuUsaha?.luas_lahan || '',
        jumlah_ternak: pelakuUsaha?.jumlah_ternak || '',
        komoditas: pelakuUsaha?.komoditas || [],
        kelompok_tani: pelakuUsaha?.kelompok_tani || '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        if (isEdit) {
            put(`/pelaku-usaha/${pelakuUsaha.id}`);
        } else {
            post('/pelaku-usaha');
        }
    };

    const isPetani = ['petani_padi', 'petani_palawija', 'petani_hortikultura'].includes(data.jenis_usaha);
    const isPeternak = ['peternak_sapi', 'peternak_kambing', 'peternak_ayam', 'peternak_ikan'].includes(data.jenis_usaha);

    return (
        <AppLayout>
            <Head title={isEdit ? 'Edit Pelaku Usaha' : 'Tambah Pelaku Usaha'} />

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link
                        href="/pelaku-usaha"
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isEdit ? 'Edit Pelaku Usaha' : 'Tambah Pelaku Usaha'}
                        </h1>
                        <p className="text-gray-500">
                            {isEdit ? 'Perbarui data pelaku usaha' : 'Tambahkan data pelaku usaha baru'}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Data Diri */}
                    <div className="bg-white rounded-xl border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Diri</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Bidang <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.bidang_id}
                                    onChange={(e) => setData('bidang_id', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                                        errors.bidang_id ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Pilih Bidang</option>
                                    {filterOptions.bidang.map((b) => (
                                        <option key={b.id} value={b.id}>{b.nama}</option>
                                    ))}
                                </select>
                                {errors.bidang_id && <p className="text-red-500 text-sm mt-1">{errors.bidang_id}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    NIK <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.nik}
                                    onChange={(e) => setData('nik', e.target.value.replace(/\D/g, '').slice(0, 16))}
                                    placeholder="16 digit NIK"
                                    maxLength={16}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                                        errors.nik ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.nik && <p className="text-red-500 text-sm mt-1">{errors.nik}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Lengkap <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                                        errors.nama ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.nama && <p className="text-red-500 text-sm mt-1">{errors.nama}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Jenis Kelamin <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-4 mt-2">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="L"
                                            checked={data.jenis_kelamin === 'L'}
                                            onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                            className="text-green-600 focus:ring-green-500"
                                        />
                                        <span className="ml-2">Laki-laki</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="P"
                                            checked={data.jenis_kelamin === 'P'}
                                            onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                            className="text-green-600 focus:ring-green-500"
                                        />
                                        <span className="ml-2">Perempuan</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">No. HP</label>
                                <input
                                    type="text"
                                    value={data.no_hp}
                                    onChange={(e) => setData('no_hp', e.target.value.replace(/\D/g, '').slice(0, 15))}
                                    placeholder="08xxxxxxxxxx"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Alamat */}
                    <div className="bg-white rounded-xl border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Alamat</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Alamat Lengkap <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={data.alamat}
                                    onChange={(e) => setData('alamat', e.target.value)}
                                    rows={2}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                                        errors.alamat ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.alamat && <p className="text-red-500 text-sm mt-1">{errors.alamat}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">RT</label>
                                    <input
                                        type="text"
                                        value={data.rt}
                                        onChange={(e) => setData('rt', e.target.value)}
                                        maxLength={5}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">RW</label>
                                    <input
                                        type="text"
                                        value={data.rw}
                                        onChange={(e) => setData('rw', e.target.value)}
                                        maxLength={5}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Kecamatan <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.kecamatan}
                                    onChange={(e) => setData('kecamatan', e.target.value)}
                                    list="kecamatan-list"
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                                        errors.kecamatan ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                <datalist id="kecamatan-list">
                                    {filterOptions.kecamatan.map((k) => (
                                        <option key={k} value={k} />
                                    ))}
                                </datalist>
                                {errors.kecamatan && <p className="text-red-500 text-sm mt-1">{errors.kecamatan}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Desa <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.desa}
                                    onChange={(e) => setData('desa', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                                        errors.desa ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.desa && <p className="text-red-500 text-sm mt-1">{errors.desa}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Data Usaha */}
                    <div className="bg-white rounded-xl border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Usaha</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Jenis Usaha <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.jenis_usaha}
                                    onChange={(e) => setData('jenis_usaha', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                                        errors.jenis_usaha ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Pilih Jenis Usaha</option>
                                    {Object.entries(jenisUsaha).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                                {errors.jenis_usaha && <p className="text-red-500 text-sm mt-1">{errors.jenis_usaha}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kelompok Tani</label>
                                <input
                                    type="text"
                                    value={data.kelompok_tani}
                                    onChange={(e) => setData('kelompok_tani', e.target.value)}
                                    list="kelompok-list"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                />
                                <datalist id="kelompok-list">
                                    {filterOptions.kelompok_tani.map((k) => (
                                        <option key={k} value={k} />
                                    ))}
                                </datalist>
                            </div>

                            {isPetani && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Luas Lahan (Ha)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.luas_lahan}
                                        onChange={(e) => setData('luas_lahan', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            )}

                            {isPeternak && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Jumlah Ternak
                                    </label>
                                    <input
                                        type="number"
                                        value={data.jumlah_ternak}
                                        onChange={(e) => setData('jumlah_ternak', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <Link
                            href="/pelaku-usaha"
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                            {processing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            {isEdit ? 'Simpan Perubahan' : 'Simpan Data'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
