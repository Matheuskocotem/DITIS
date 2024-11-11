<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        
        User::create([
            'name' => 'Admin User',
            'email' => 'admin4@example.com',
            'cpf' => '12344608982',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        $faker = Faker::create();

        foreach (range(10, 200) as $index) {
            User::create([
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'cpf' => $faker->numerify('###.###.###-##'),
                'password' => Hash::make('password123'), 
                'role' => 'user', 
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
