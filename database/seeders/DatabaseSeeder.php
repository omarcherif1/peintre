<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@chokribenomrane.com'],
            [
                'name'     => 'Chokri Benomrane',
                'password' => bcrypt('Admin@2024!'),
            ]
        );
    }
}
