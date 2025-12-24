import { Head, useForm, Link } from '@inertiajs/react';
import { FormEvent } from 'react';
import { Sprout, Mail, Lock, User, Loader2 } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <>
            <Head title="Daftar" />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50 px-4 py-12">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-4">
                            <Sprout className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Dinas Pertanian
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Buat akun baru
                        </p>
                    </div>

                    {/* Register Form */}
                    <div className="bg-white rounded-2xl shadow-xl border p-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Lengkap
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className={`
                                            block w-full pl-10 pr-4 py-3 rounded-xl border 
                                            focus:ring-2 focus:ring-green-500 focus:border-green-500
                                            ${errors.name ? 'border-red-500' : 'border-gray-300'}
                                        `}
                                        placeholder="Nama lengkap Anda"
                                    />
                                </div>
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className={`
                                            block w-full pl-10 pr-4 py-3 rounded-xl border 
                                            focus:ring-2 focus:ring-green-500 focus:border-green-500
                                            ${errors.email ? 'border-red-500' : 'border-gray-300'}
                                        `}
                                        placeholder="nama@email.com"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className={`
                                            block w-full pl-10 pr-4 py-3 rounded-xl border 
                                            focus:ring-2 focus:ring-green-500 focus:border-green-500
                                            ${errors.password ? 'border-red-500' : 'border-gray-300'}
                                        `}
                                        placeholder="Minimal 8 karakter"
                                    />
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                                )}
                            </div>

                            {/* Password Confirmation */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Konfirmasi Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className={`
                                            block w-full pl-10 pr-4 py-3 rounded-xl border 
                                            focus:ring-2 focus:ring-green-500 focus:border-green-500
                                            ${errors.password_confirmation ? 'border-red-500' : 'border-gray-300'}
                                        `}
                                        placeholder="Ulangi password"
                                    />
                                </div>
                                {errors.password_confirmation && (
                                    <p className="mt-1 text-sm text-red-500">{errors.password_confirmation}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Memproses...
                                    </>
                                ) : (
                                    'Daftar'
                                )}
                            </button>
                        </form>

                        {/* Login Link */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Sudah punya akun?{' '}
                                <Link href="/login" className="text-green-600 font-medium hover:text-green-700">
                                    Masuk
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-sm text-gray-500 mt-6">
                        © {new Date().getFullYear()} Dinas Pertanian. All rights reserved.
                    </p>
                </div>
            </div>
        </>
    );
}
