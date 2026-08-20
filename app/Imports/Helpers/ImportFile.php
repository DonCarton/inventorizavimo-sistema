<?php

namespace App\Imports\Helpers;

use Illuminate\Http\UploadedFile;

class ImportFile
{
    /**
     * Encoding assumed for CSV files that are not valid UTF-8: what Excel uses
     * for a plain "CSV" save on Lithuanian (Baltic) Windows. Without converting,
     * letters like Š, Ž, Ė arrive broken and fail validation and lookups.
     */
    public const LEGACY_CSV_ENCODING = 'CP1257';

    /**
     * Returns something Excel::import()/toArray() can read with correct text:
     * the file itself, or, for a CSV that is not UTF-8, the path of a temporary
     * UTF-8 copy (removed when the request/job ends). The original file is never changed.
     */
    public static function readable(UploadedFile|string $file): UploadedFile|string
    {
        $path = $file instanceof UploadedFile ? $file->getRealPath() : $file;
        $extension = $file instanceof UploadedFile
            ? $file->getClientOriginalExtension()
            : pathinfo($path, PATHINFO_EXTENSION);

        if (strtolower($extension) !== 'csv') {
            return $file;
        }

        $content = @file_get_contents($path);

        if ($content === false || mb_check_encoding($content, 'UTF-8')) {
            return $file;
        }

        $converted = @iconv(self::LEGACY_CSV_ENCODING, 'UTF-8', $content);

        if ($converted === false) {
            return $file;
        }

        $tempPath = sys_get_temp_dir() . '/import_' . bin2hex(random_bytes(8)) . '.csv';
        file_put_contents($tempPath, $converted);
        register_shutdown_function(fn() => @unlink($tempPath));

        return $tempPath;
    }
}
