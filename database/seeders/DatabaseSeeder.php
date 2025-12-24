<?php

namespace Database\Seeders;

use App\Models\Bidang;
use App\Models\Program;
use App\Models\Kegiatan;
use App\Models\PelakuUsaha;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\LazyCollection;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Administrator',
            'email' => 'admin@dinaspertanian.go.id',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        // Create Bidang
        $bidangData = [
            ['kode' => 'PTN', 'nama' => 'Bidang Pertanian', 'deskripsi' => 'Mengelola urusan tanaman pangan dan hortikultura'],
            ['kode' => 'PTK', 'nama' => 'Bidang Peternakan', 'deskripsi' => 'Mengelola urusan peternakan dan kesehatan hewan'],
            ['kode' => 'KPG', 'nama' => 'Bidang Ketahanan Pangan', 'deskripsi' => 'Mengelola urusan ketahanan dan keamanan pangan'],
            ['kode' => 'PKN', 'nama' => 'Bidang Perkebunan', 'deskripsi' => 'Mengelola urusan perkebunan'],
        ];

        foreach ($bidangData as $data) {
            Bidang::create([
                ...$data,
                'kepala_bidang' => fake()->name(),
                'nip_kepala' => fake()->numerify('##################'),
                'is_active' => true,
            ]);
        }

        $this->command->info('Bidang created!');

        // Create Programs for each Bidang
        $bidangs = Bidang::all();
        $programCount = 0;

        foreach ($bidangs as $bidang) {
            for ($i = 1; $i <= 5; $i++) {
                $pagu = fake()->numberBetween(100000000, 5000000000);
                Program::create([
                    'bidang_id' => $bidang->id,
                    'kode' => $bidang->kode . '-' . str_pad($i, 3, '0', STR_PAD_LEFT),
                    'nama' => "Program {$bidang->nama} " . fake()->words(3, true),
                    'deskripsi' => fake()->paragraph(),
                    'tahun_anggaran' => now()->year,
                    'pagu_anggaran' => $pagu,
                    'realisasi_anggaran' => $pagu * fake()->randomFloat(2, 0.3, 0.9),
                    'status' => fake()->randomElement(['draft', 'aktif', 'selesai']),
                    'tanggal_mulai' => now()->startOfYear(),
                    'tanggal_selesai' => now()->endOfYear(),
                ]);
                $programCount++;
            }
        }

        $this->command->info("$programCount Programs created!");

        // Create Kegiatan for each Program
        $programs = Program::all();
        $kegiatanCount = 0;

        foreach ($programs as $program) {
            for ($i = 1; $i <= 10; $i++) {
                $target = fake()->numberBetween(100, 10000);
                $anggaran = fake()->numberBetween(10000000, 500000000);

                Kegiatan::create([
                    'program_id' => $program->id,
                    'kode' => $program->kode . '-K' . str_pad($i, 2, '0', STR_PAD_LEFT),
                    'nama' => "Kegiatan " . fake()->words(4, true),
                    'deskripsi' => fake()->paragraph(),
                    'lokasi' => fake()->address(),
                    'kecamatan' => fake()->randomElement($this->getKecamatan()),
                    'desa' => fake()->randomElement($this->getDesa()),
                    'target' => $target,
                    'realisasi' => $target * fake()->randomFloat(2, 0, 1),
                    'satuan' => fake()->randomElement(['Ha', 'Ekor', 'Kg', 'Unit', 'Orang', 'Kelompok']),
                    'anggaran' => $anggaran,
                    'realisasi_anggaran' => $anggaran * fake()->randomFloat(2, 0.3, 0.9),
                    'status' => fake()->randomElement(['belum_mulai', 'berjalan', 'selesai', 'tertunda']),
                    'progress' => fake()->numberBetween(0, 100),
                    'tanggal_mulai' => fake()->dateTimeBetween('first day of January', 'last day of June'),
                    'tanggal_selesai' => fake()->dateTimeBetween('first day of July', 'last day of December'),
                ]);
                $kegiatanCount++;
            }
        }

        $this->command->info("$kegiatanCount Kegiatan created!");

        // Generate Heavy Data - 100.000 Pelaku Usaha
        $this->command->info('Generating 100,000 Pelaku Usaha... This may take a while.');

        $this->generateHeavyPelakuUsaha(100000);

        $this->command->info('Seeding completed!');
    }

    /**
     * Generate heavy data using chunk insert
     */
    private function generateHeavyPelakuUsaha(int $total): void
    {
        $bidangIds = Bidang::pluck('id')->toArray();
        $jenisUsaha = array_keys(PelakuUsaha::JENIS_USAHA);
        $kecamatanList = $this->getKecamatan();
        $desaList = $this->getDesa();
        $kelompokTani = $this->getKelompokTani();

        $batchSize = 1000;
        $batches = ceil($total / $batchSize);

        $progressBar = $this->command->getOutput()->createProgressBar($batches);
        $progressBar->start();

        // Gunakan LazyCollection untuk generate dan insert
        LazyCollection::range(1, $total)
            ->chunk($batchSize)
            ->each(function ($chunk) use ($bidangIds, $jenisUsaha, $kecamatanList, $desaList, $kelompokTani, $progressBar) {
                $records = [];
                $now = now();

                foreach ($chunk as $i) {
                    $jenis = fake()->randomElement($jenisUsaha);

                    $records[] = [
                        'bidang_id' => fake()->randomElement($bidangIds),
                        'nik' => fake()->unique()->numerify('################'),
                        'nama' => fake()->name(),
                        'jenis_kelamin' => fake()->randomElement(['L', 'P']),
                        'alamat' => fake()->streetAddress(),
                        'kecamatan' => fake()->randomElement($kecamatanList),
                        'desa' => fake()->randomElement($desaList),
                        'rt' => fake()->numberBetween(1, 20),
                        'rw' => fake()->numberBetween(1, 10),
                        'no_hp' => fake()->numerify('08##########'),
                        'jenis_usaha' => $jenis,
                        'luas_lahan' => in_array($jenis, ['petani_padi', 'petani_palawija', 'petani_hortikultura'])
                            ? fake()->randomFloat(2, 0.1, 10)
                            : null,
                        'jumlah_ternak' => in_array($jenis, ['peternak_sapi', 'peternak_kambing', 'peternak_ayam', 'peternak_ikan'])
                            ? fake()->numberBetween(5, 1000)
                            : null,
                        'komoditas' => json_encode(fake()->randomElements($this->getKomoditas($jenis), min(fake()->numberBetween(1, 3), count($this->getKomoditas($jenis))))),
                        'kelompok_tani' => fake()->optional(0.7)->randomElement($kelompokTani),
                        'is_active' => fake()->boolean(90),
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }

                // Bulk insert
                DB::table('pelaku_usaha')->insert($records);

                $progressBar->advance();

                // Clear faker unique cache to prevent memory issues
                fake()->unique(true);
            });

        $progressBar->finish();
        $this->command->newLine();
    }

    private function getKecamatan(): array
    {
        return [
            'Ciamis',
            'Cikoneng',
            'Cijeungjing',
            'Sadananya',
            'Cidolog',
            'Cihaurbeuti',
            'Panumbangan',
            'Panjalu',
            'Kawali',
            'Cipaku',
            'Jatinagara',
            'Rajadesa',
            'Rancah',
            'Tambaksari',
            'Lakbok',
        ];
    }

    private function getDesa(): array
    {
        return [
            'Sukamaju',
            'Sukamanah',
            'Sukajadi',
            'Sukasari',
            'Sukarame',
            'Mekarsari',
            'Mekarjaya',
            'Mekarmukti',
            'Mekarwangi',
            'Mekarmanik',
            'Cintarasa',
            'Cintaasih',
            'Cintamulya',
            'Cintajaya',
            'Cintakarya',
        ];
    }

    private function getKelompokTani(): array
    {
        return [
            'Tani Makmur',
            'Tani Jaya',
            'Tani Mulya',
            'Tani Sejahtera',
            'Tani Mandiri',
            'Sumber Rezeki',
            'Mekar Tani',
            'Harapan Tani',
            'Maju Tani',
            'Berkah Tani',
            'Subur Jaya',
            'Lestari Tani',
            'Gemah Ripah',
            'Sauyunan',
            'Gotong Royong',
        ];
    }

    private function getKomoditas(string $jenisUsaha): array
    {
        return match ($jenisUsaha) {
            'petani_padi' => ['Padi IR64', 'Padi Ciherang', 'Padi Inpari', 'Padi Organik'],
            'petani_palawija' => ['Jagung', 'Kedelai', 'Kacang Tanah', 'Ubi Kayu', 'Ubi Jalar'],
            'petani_hortikultura' => ['Cabai', 'Tomat', 'Bawang Merah', 'Bawang Putih', 'Kentang', 'Wortel'],
            'peternak_sapi' => ['Sapi Potong', 'Sapi Perah', 'Sapi Limosin', 'Sapi Brahman'],
            'peternak_kambing' => ['Kambing Etawa', 'Kambing Jawa', 'Kambing Boer', 'Domba'],
            'peternak_ayam' => ['Ayam Broiler', 'Ayam Petelur', 'Ayam Kampung', 'Ayam Arab'],
            'peternak_ikan' => ['Lele', 'Nila', 'Gurame', 'Mas', 'Patin', 'Bawal'],
            'pengolah_pangan' => ['Keripik', 'Tepung', 'Olahan Susu', 'Makanan Ringan'],
            default => ['Lainnya'],
        };
    }
}
