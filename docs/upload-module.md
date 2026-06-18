# Upload Module

Module upload ini disiapkan sebagai fitur base template Laravel + Inertia agar module lain bisa memakai attachment/file upload tanpa membuat ulang validasi, storage, penamaan file, dan optimasi image.

## Fitur

- Kategori upload configurable melalui `config/upload.php` dan `.env`.
- Kategori bawaan: `image`, `document`, `spreadsheet`, dan `archive`.
- Validasi extension, MIME type, jumlah file per request, dan ukuran per kategori.
- Storage private/public berbasis disk Laravel di `config/filesystems.php`.
- Metadata file tersimpan di tabel `media_attachments`.
- Penamaan file configurable: `system`, `original`, `original_with_suffix`, `hash`, `date_prefix_original`.
- Optimasi image native memakai GD jika extension GD tersedia.
- Frontend reusable component: `FileUploadField`.
- Frontend mendukung file picker dan drag-and-drop dengan pre-check extension, ukuran file, dan jumlah file sebelum submit.
- Mode upload `deferred` dan `immediate`; mode immediate mengupload ke temporary storage saat file di-attach.
- Contoh integrasi tersedia di module Tasks.

## File Penting

- `config/upload.php`: konfigurasi kategori, limit, naming, visibility, dan optimasi.
- `config/filesystems.php`: disk `uploads_private` dan `uploads_public`.
- `app/Services/Upload/UploadManager.php`: entrypoint upload untuk semua module.
- `app/Models/Media/MediaAttachment.php`: model metadata file.
- `app/Models/Concerns/HasMediaAttachments.php`: trait untuk model yang ingin punya attachments.
- `resources/js/Components/Upload/FileUploadField.tsx`: komponen upload Inertia/React.
- `database/migrations/2026_06_17_000001_create_media_attachments_table.php`: tabel metadata media.
- `database/migrations/2026_06_17_000002_create_temporary_uploads_table.php`: tabel upload sementara untuk immediate upload.

## Setup Server VM

Buat direktori upload di luar folder aplikasi:

```bash
sudo mkdir -p /srv/dinas-pertanian/uploads/private /srv/dinas-pertanian/uploads/public
sudo chown -R www-data:www-data /srv/dinas-pertanian/uploads
sudo chmod -R 775 /srv/dinas-pertanian/uploads
```

Sesuaikan user web server jika tidak memakai `www-data`.

`.env` minimum:

```env
UPLOAD_PRIVATE_PATH=/srv/dinas-pertanian/uploads/private
UPLOAD_PUBLIC_PATH=/srv/dinas-pertanian/uploads/public
UPLOAD_DEFAULT_VISIBILITY=private
UPLOAD_NAMING_STRATEGY=system
```

Jalankan migration:

```bash
php artisan migrate
```

## Konfigurasi Kategori

Kategori disimpan di `config/upload.php`:

```php
'image' => [
    'enabled' => env('UPLOAD_IMAGE_ENABLED', true),
    'extensions' => ['jpg', 'jpeg', 'png', 'webp'],
    'mimes' => ['image/jpeg', 'image/png', 'image/webp'],
    'max_size_kb' => 1024,
    'visibility' => 'private',
    'naming_strategy' => 'system',
    'optimize' => true,
]
```

Jika project turunan hanya butuh image upload, matikan kategori lain melalui `.env`:

```env
UPLOAD_DOCUMENT_ENABLED=false
UPLOAD_SPREADSHEET_ENABLED=false
UPLOAD_ARCHIVE_ENABLED=false
```

## Naming Strategy

- `system`: nama UUID, default dan paling aman.
- `original`: mengikuti nama file user, tidak disarankan untuk public upload.
- `original_with_suffix`: nama asli + UUID.
- `hash`: nama berdasarkan SHA-256 isi file.
- `date_prefix_original`: timestamp + nama asli.

Nama asli tetap disimpan di metadata `original_name` untuk display dan download.

## Memakai Di Model Lain

Tambahkan trait ke model:

```php
use App\Models\Concerns\HasMediaAttachments;

class Report extends Model
{
    use HasMediaAttachments;
}
```

Di controller:

```php
use App\Services\Upload\UploadManager;

public function store(Request $request, UploadManager $uploadManager)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'attachment_category' => 'nullable|string',
        'attachments' => 'nullable|array',
        'attachments.*' => 'file',
    ]);

    $files = $request->file('attachments', []);
    unset($validated['attachment_category'], $validated['attachments']);

    $report = Report::create($validated);

    if ($files) {
        $uploadManager->uploadManyForModel(
            $report,
            is_array($files) ? $files : [$files],
            $request->input('attachment_category', 'document'),
            'attachments',
            $request->user()?->id,
        );
    }
}
```

Kirim konfigurasi upload ke Inertia page:

```php
'uploadCategories' => app(UploadManager::class)->publicConfig(),
```

Batasi kategori per form/fitur jika tidak semua kategori boleh dipakai:

```php
// Contoh: Tasks hanya menerima document dan image.
'uploadCategories' => app(UploadManager::class)->publicConfig(['document', 'image']),

// Contoh: Avatar hanya menerima image.
'uploadCategories' => app(UploadManager::class)->publicConfig(['image']),

// Contoh: Import hanya menerima spreadsheet.
'uploadCategories' => app(UploadManager::class)->publicConfig(['spreadsheet']),
```

Global config tetap menjadi source of truth untuk extension, MIME, size, visibility, dan naming. Policy per form hanya memilih kategori mana yang boleh muncul di UI fitur tersebut.

## Memakai Di React/Inertia

### Deferred Upload

Mode deferred menyimpan file di state React dan mengirim file saat form submit.

```tsx
<FileUploadField
  categories={uploadCategories}
  files={data.attachments}
  onFilesChange={(files) => setData('attachments', files)}
  existingFiles={model.attachments ?? []}
/>
```

Jika `category` tidak dikirim, komponen otomatis menerima semua kategori yang tersedia di prop `categories` dan menentukan kategori upload dari extension file. Jika ingin mengunci satu kategori saja, kirim `category="image"` atau `category="document"`.

Untuk submit form berisi file:

```tsx
post('/reports', { forceFormData: true });
```

Untuk update route Laravel resource, gunakan method spoofing:

```tsx
const form = useForm({
  _method: 'put',
  attachments: [] as File[],
});

form.post(`/reports/${report.id}`, { forceFormData: true });
```

### Immediate Upload

Mode immediate langsung mengupload file ke `/media/temp` saat file dipilih/drop. Komponen menampilkan progress upload, lalu menyimpan `temporary_upload_ids` untuk dikirim bersama form utama.

```tsx
const [temporaryAttachments, setTemporaryAttachments] = useState<TemporaryAttachment[]>([]);

const form = useForm({
  temporary_upload_ids: [] as number[],
});

const handleTemporaryFilesChange = (attachments: TemporaryAttachment[]) => {
  setTemporaryAttachments(attachments);
  form.setData('temporary_upload_ids', attachments.map((attachment) => attachment.id));
};

<FileUploadField
  mode="immediate"
  categories={uploadCategories}
  files={[]}
  onFilesChange={() => undefined}
  temporaryFiles={temporaryAttachments}
  onTemporaryFilesChange={handleTemporaryFilesChange}
/>
```

Di controller module, attach temp upload setelah model final dibuat/diupdate:

```php
$uploadManager->attachTemporaryUploads(
    $report,
    $validated['temporary_upload_ids'] ?? [],
    'attachments',
    $request->user()?->id,
);
```

## Contoh Integrasi Tasks

Module Tasks sudah menjadi contoh implementasi:

- Backend upload: `app/Http/Controllers/TaskController.php`
- Trait model: `app/Models/Task.php`
- Frontend upload field: `resources/js/Pages/Tasks/Form.tsx`

Create/edit Task sekarang memakai mode `immediate`, sehingga file langsung upload saat attach dan submit form hanya mengirim `temporary_upload_ids`. Tasks juga menjadi contoh feature policy yang hanya membuka kategori `document` dan `image`, tanpa selector manual; kategori ditentukan otomatis dari extension file.

## Cleanup Temporary Upload

File temporary yang tidak pernah disubmit akan expired berdasarkan `UPLOAD_TEMP_TTL_MINUTES`. Bersihkan secara manual dengan:

```bash
php artisan media:clear-temp
```

Di production, jadwalkan command ini lewat cron/scheduler, misalnya tiap jam.

## Catatan Optimasi Dokumen

Optimasi image dilakukan otomatis jika:

- kategori `image` aktif,
- `UPLOAD_IMAGE_OPTIMIZE=true`,
- extension PHP `gd` tersedia.

Optimasi tidak berjalan ketika file baru dipilih di browser. Alurnya adalah:

1. `FileUploadField` menolak extension, size, dan jumlah file yang tidak sesuai konfigurasi.
2. Form dikirim dengan `forceFormData: true`.
3. `UploadManager` memvalidasi ulang di backend melalui `validateFile()`.
4. File disimpan ke disk private/public.
5. Jika kategori image dan optimasi aktif, `ImageOptimizer` membuat file optimized lalu menyimpan metadata `optimized_path`, `optimized_size`, dan `is_optimized`.

Titik kode utamanya:

- Limit kategori: `config/upload.php`.
- Validasi backend: `app/Services/Upload/UploadManager.php` method `validateFile()`.
- Compress image: `app/Services/Upload/UploadManager.php` method `uploadForModel()` dan `app/Services/Upload/ImageOptimizer.php`.
- Validasi browser: `resources/js/Components/Upload/FileUploadField.tsx`.

Dokumen (`pdf`, `docx`, `xlsx`) tidak dikompres secara default karena berisiko mengubah fidelity dokumen dan membutuhkan binary server tambahan seperti Ghostscript. Jika nanti diperlukan, tambahkan job khusus untuk PDF compression dan aktifkan hanya untuk kategori tertentu.

## Rekomendasi Production

- Default gunakan private storage.
- Jangan simpan upload di folder project/repository.
- Backup direktori `/srv/dinas-pertanian/uploads` secara terjadwal.
- Sinkronkan limit `.env`, PHP, dan Nginx/FrankenPHP.
- Gunakan queue jika optimasi file nanti dibuat async.
- Tambahkan antivirus scanning jika file diupload oleh publik.
