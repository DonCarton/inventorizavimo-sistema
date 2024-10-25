<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class AttachSuperAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'invicus:attach-super-admin';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Attach a super user role to an existing user.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $emailOfUser = $this->ask('What is the email of the user to which attach the role?');
        $user = \App\Models\User::where('email', $emailOfUser)->first();
        if ($user == null){
            $this->error("No user found with the specified email of [{$emailOfUser}].");
            return 1;
        }

        if (\Spatie\Permission\Models\Role::where('name', 'super-admin')->exists())
        {
            if ($user->roles()->count() >= 1){
                $user->roles()->detach();
            }
            $user->assignRole('super-admin');
        } else {
            $this->error('The [super-admin] role was not found, please run migrations first.');
            return 1;
        }

        $this->info("User [{$emailOfUser}] has been assigned the [super-admin] role.");
    }
}
