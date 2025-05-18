<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Attachment;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ImportReportMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $emailTitle;
    public string $filePath;
    public bool $importFailed;

    /**
     * Create a new message instance.
     */
    public function __construct(string $emailTitle = 'Imports have failed', string $filePath, public User $user, bool $importFailed = false)
    {
        $this->emailTitle = $emailTitle;
        $this->filePath = $filePath;
        $this->importFailed = $importFailed;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->emailTitle,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'mail.inventory.import-report',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        if (!$this->importFailed || empty($this->filePath) || !file_exists($this->filePath)){
            return [];
        }
        return [
            Attachment::fromPath($this->filePath)
                ->as('failed-import-'.now())
        ];
    }
}
