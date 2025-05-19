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
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Mail;

class NotifyFailedImports implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public array $failures;
    public User $user;

    public function __construct(array $failures, User $user)
    {
        $this->failures = $failures;
        $this->user = $user;
    }

    public function handle(): void
    {
        $failFileName = 'failed-imports-' . now()->timestamp . '.xlsx';
        Excel::store(new FailedExports($this->failures, $this->user->locale), "temp/{$failFileName}");
        $path = storage_path("app/temp/{$failFileName}");
        Mail::to($this->user)->send(new ImportReportMail(__('mail.generic_import'), $path, $this->user));
    }
}
