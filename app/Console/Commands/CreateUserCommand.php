<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Role;

class CreateUserCommand extends Command
{
    protected $signature = 'invicus:user-create';
    protected $description = 'Create a new user and assign roles';

    public function handle(): void
    {
        $firstName = $this->ask('What is the user\'s first name?');
        $lastName = $this->ask('What is the user\'s last name?');
        $name = $firstName . ' ' . $lastName;
        $email = $this->ask('What is the user\'s email?');
        $password = $this->secret('What is the user\'s password?');

        $isSuperAdmin = $this->confirm('Should the user be a super-admin?', true);

        $user = new User([
            'first_name' => $firstName,
            'last_name' => $lastName,
            'name' => $name,
            'email' => $email,
            'password' => bcrypt($password),
            'laboratory' => 1
        ]);

        $user->saveQuietly();

        $postSave = [
            'created_by' => $user->id,
            'updated_by' => $user->id,
        ];

        $user->update($postSave);

        if ($isSuperAdmin) {
            $user->assignRole('super-admin');
            $this->info("Assigned 'super-admin' role to {$user->email}");
        } else {
            $role = $this->ask('What role should be assigned to this user?');
            if (Role::where('name', $role)->exists()) {
                $user->assignRole($role);
                $this->info("Assigned '{$role}' role to {$user->email}");
            } else {
                $this->error("Role '{$role}' does not exist. The user will be created without a role.");
            }
        }

        $this->info("User '{$user->email}' created successfully!");
    }
}
