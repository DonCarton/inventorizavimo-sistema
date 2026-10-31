<?php

namespace App\Imports;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithCalculatedFormulas;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use App\Models\ImportRun;
use App\Models\ImportRunRecord;
use App\Models\User;
use App\Mail\ImportReportMail;

class GenericImport implements ToCollection, WithHeadingRow, WithCalculatedFormulas
{
    protected ImportRun $importRun;

    protected User $user;

    protected int $totalRowCount;

    protected string $userLocale;

    public array $caughtErrors = [];

    /**
     * Summary of __construct
     * @param \App\Models\ImportRun $importRun
     * @param string $userLocale
     * @param \App\Models\User $user
     */
    public function __construct(ImportRun $importRun, string $userLocale, User $user)
    {
        $this->importRun = $importRun;
        $this->userLocale = $userLocale;
        $this->user = $user;
    }

    /**
     * Summary of collection
     * @param \Illuminate\Support\Collection $rows
     * @return void
     */
    public function collection(Collection $rows)
    {
        $this->totalRowCount = $rows->count();
        $definition = $this->importRun->definition;
        $modelClass = $definition->model_class;

        $processor = new ImportRowProcessor(
            modelClass: $modelClass,
            fieldMappings: $definition->field_mappings ?? [],
            foreignKeyLookups: $definition->foreign_key_lookups,
            locale: $this->userLocale,
            createdBy: $this->importRun->created_by,
            updatedBy: $this->importRun->updated_by,
        );

        $this->caughtErrors = $processor->process($rows, function ($model) use ($modelClass) {
            ImportRunRecord::create([
                'import_run_id'   => $this->importRun->id,
                'recordable_type' => $modelClass,
                'recordable_id'   => $model->id,
                'action'          => $model->wasRecentlyCreated ? 'created' : 'updated',
            ]);
        });

        if (!empty($this->caughtErrors)) {
            $this->sendFailureEmail();
        } else {
            $this->sendSuccessEmail();
        }
    }

    /**
     * Summary of sendFailureEmail
     * @return void
     */
    private function sendFailureEmail()
    {
        $failFileName = 'failed-imports-' . now()->timestamp . '.xlsx';
        $failedImportPath = "imports/failed/{$failFileName}";

        $exportRows = array_map(fn($error) => Arr::except($error, 'attribute'), $this->caughtErrors);

        Excel::store(new \App\Exports\FailedExports($exportRows, $this->userLocale), $failedImportPath);

        $this->importRun->update([
            'row_count' => $this->totalRowCount,
            'error_count' => count($this->caughtErrors),
            'status' => 'completed_with_errors',
            'output_file_path' => $failedImportPath,
        ]);

        $mailFilePath = storage_path('app/' . $failedImportPath);
        Mail::to($this->user)->send(new ImportReportMail(__('mail.imports.failure'), $mailFilePath, $this->user, true));
    }

    /**
     * Summary of sendSuccessEmail
     * @return void
     */
    private function sendSuccessEmail()
    {
        $this->importRun->update([
            'row_count' => $this->totalRowCount,
            'error_count' => 0,
            'status' => 'completed',
            'output_file_path' => null,
        ]);
        Mail::to($this->user)->send(new ImportReportMail(__('mail.imports.success'), "", $this->user));
    }
}
