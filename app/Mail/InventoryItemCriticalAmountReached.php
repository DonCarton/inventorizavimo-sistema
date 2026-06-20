<?php

namespace App\Mail;

use App\Models\InventoryItem;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InventoryItemCriticalAmountReached extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(public InventoryItem $inventoryItem, public User $user)
    {
        $this->locale($this->user->locale);
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = __('messages.Inventory.Critical amount subject', ['localName' => $this->inventoryItem->local_name]);
        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'mail.inventory.critical',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
