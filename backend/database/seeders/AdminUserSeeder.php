<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run()
{
    $user = User::firstOrCreate(
        ['email' => 'admin@gmail.com'],
        [
            'name' => 'Admin',
            'password' => Hash::make('admin123'),
            'is_admin' => true,
        ]
    );
}

}
