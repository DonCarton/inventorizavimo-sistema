<?php

namespace App\Jobs;

use App\Exports\FailedExports;
use App\Mail\ImportReportMail;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Mail;
use Throwable;

class NotifyFailedImports implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public array $failures;
    public User $user;

    public function __construct(array $failures, User $user)
    {
        $this->failures = $failures;
        $this->user = $user;
    }

    /**
     * Seconds to wait before each retry: 1 minute, then 5, then 15.
     *
     * @return array<int, int>
     */
    public function backoff(): array
    {
        return [60, 300, 900];
    }

    public function handle(): void
    {
        $failFileName = 'failed-imports-' . now()->timestamp . '.xlsx';
        Excel::store(new FailedExports($this->failures, $this->user->locale), "temp/{$failFileName}");
        $path = storage_path("app/temp/{$failFileName}");
        Mail::to($this->user)->send(new ImportReportMail(__('mail.generic_import'), $path, $this->user));
    }

    /**
     * Handle a job failure.
     */
    public function failed(Throwable $exception): void
    {
        Log::error('Failed to send failed-import report email', [
            'user_id' => $this->user->id,
            'email' => $this->user->email,
            'exception' => $exception->getMessage(),
        ]);
    }
}
