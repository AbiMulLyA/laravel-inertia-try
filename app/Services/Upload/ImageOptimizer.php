<?php

namespace App\Services\Upload;

class ImageOptimizer
{
    public function optimize(string $sourcePath, string $targetPath, string $mimeType, array $settings): bool
    {
        if (! extension_loaded('gd')) {
            return false;
        }

        $image = match ($mimeType) {
            'image/jpeg' => @imagecreatefromjpeg($sourcePath),
            'image/png' => @imagecreatefrompng($sourcePath),
            'image/webp' => function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($sourcePath) : false,
            default => false,
        };

        if (! $image) {
            return false;
        }

        $width = imagesx($image);
        $height = imagesy($image);
        $maxWidth = (int) ($settings['max_width'] ?? 1920);
        $maxHeight = (int) ($settings['max_height'] ?? 1920);
        $ratio = min($maxWidth / max($width, 1), $maxHeight / max($height, 1), 1);

        if ($ratio < 1) {
            $newWidth = max(1, (int) round($width * $ratio));
            $newHeight = max(1, (int) round($height * $ratio));
            $resized = imagecreatetruecolor($newWidth, $newHeight);

            if (in_array($mimeType, ['image/png', 'image/webp'], true)) {
                imagealphablending($resized, false);
                imagesavealpha($resized, true);
            }

            imagecopyresampled($resized, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
            imagedestroy($image);
            $image = $resized;
        }

        $directory = dirname($targetPath);
        if (! is_dir($directory)) {
            mkdir($directory, 0775, true);
        }

        $saved = match ($mimeType) {
            'image/jpeg' => imagejpeg($image, $targetPath, (int) ($settings['jpeg_quality'] ?? 82)),
            'image/png' => imagepng($image, $targetPath, (int) ($settings['png_compression'] ?? 7)),
            'image/webp' => function_exists('imagewebp') && imagewebp($image, $targetPath, (int) ($settings['webp_quality'] ?? 82)),
            default => false,
        };

        imagedestroy($image);

        return (bool) $saved;
    }
}
