<?php

namespace App\Listeners;

use App\Events\UserCreated;
use App\Mail\UserCreatedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class SendUserCreatedNotification implements ShouldQueue
{
    public int $tries = 3;

    /**
     * Seconds to wait before each retry: 1 minute, then 5, then 15.
     *
     * @return array<int, int>
     */
    public function backoff(): array
    {
        return [60, 300, 900];
    }

    /**
     * Handle the event.
     */
    public function handle(UserCreated $event): void
    {
        Mail::to($event->user->email)->send(new UserCreatedNotification($event->user, $event->password));
    }

    /**
     * Handle a job failure.
     */
    public function failed(UserCreated $event, Throwable $exception): void
    {
        Log::error('Failed to send new-user credentials email', [
            'user_id' => $event->user->id,
            'email' => $event->user->email,
            'exception' => $exception->getMessage(),
        ]);
    }
}
