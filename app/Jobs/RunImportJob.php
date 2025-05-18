<?php

namespace App\Jobs;

use App\Imports\GenericImport;
use App\Models\ImportRun;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Maatwebsite\Excel\Facades\Excel;

class RunImportJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public ImportRun $importRun;
    public User $user;

    public function __construct(ImportRun $importRun, User $user)
    {
        $this->importRun = $importRun;
        $this->user = $user;
    }

    public function handle(): void
    {
        $this->importRun->update([
            'status' => 'running',
            'started_at' => now(),
        ]);

        try {

            $path = storage_path("app/{$this->importRun->file_path}");
            if (!file_exists($path)) {
                throw new \Exception("Import file not found at {$path}");
            }

            $importer = new GenericImport($this->importRun, $this->user->locale);
            Excel::import($importer, $path);
            
        } catch (\Throwable $e) {

            Log::error('Import failed', [
                'import_run_id' => $this->importRun->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            $this->importRun->update([
                'status' => 'failed',
                'finished_at' => now(),
            ]);
            return;
            
        }
        
        $this->importRun->update([
            'finished_at' => now(),
        ]);
    }
}
