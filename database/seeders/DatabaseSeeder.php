<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * DatabaseSeeder
 * 
 * Seeds the database with sample data for development and testing.
 * Customize this seeder for your specific needs.
 */
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // =============================================
        // 1. Create Admin User
        // =============================================
        User::create([
            'name' => 'Administrator',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        $this->command->info('✓ Admin user created (admin@example.com / password)');

        // =============================================
        // 2. Create Sample Categories
        // =============================================
        $categories = [
            ['code' => 'DEV', 'name' => 'Development', 'description' => 'Software development projects'],
            ['code' => 'MKT', 'name' => 'Marketing', 'description' => 'Marketing and promotional activities'],
            ['code' => 'OPS', 'name' => 'Operations', 'description' => 'Operational and infrastructure projects'],
            ['code' => 'RND', 'name' => 'Research & Development', 'description' => 'R&D and innovation initiatives'],
        ];

        foreach ($categories as $data) {
            Category::create([
                ...$data,
                'is_active' => true,
            ]);
        }

        $this->command->info('✓ ' . count($categories) . ' categories created');

        // =============================================
        // 3. Create Sample Projects
        // =============================================
        $categoryIds = Category::pluck('id')->toArray();
        $projectCount = 0;

        foreach ($categoryIds as $categoryId) {
            for ($i = 1; $i <= 3; $i++) {
                $budget = fake()->numberBetween(10000000, 500000000);
                Project::create([
                    'category_id' => $categoryId,
                    'code' => "PRJ-" . str_pad((($categoryId - 1) * 3) + $i, 3, '0', STR_PAD_LEFT),
                    'name' => fake()->sentence(3),
                    'description' => fake()->paragraph(),
                    'year' => now()->year,
                    'budget' => $budget,
                    'spent' => $budget * fake()->randomFloat(2, 0.2, 0.8),
                    'status' => fake()->randomElement(['draft', 'active', 'completed']),
                    'start_date' => now()->startOfYear(),
                    'end_date' => now()->endOfYear(),
                ]);
                $projectCount++;
            }
        }

        $this->command->info("✓ {$projectCount} projects created");

        // =============================================
        // 4. Create Sample Tasks
        // =============================================
        $projects = Project::all();
        $taskCount = 0;

        foreach ($projects as $project) {
            $taskNum = fake()->numberBetween(3, 8);

            for ($i = 1; $i <= $taskNum; $i++) {
                $target = fake()->numberBetween(10, 1000);
                $budget = fake()->numberBetween(1000000, 50000000);

                Task::create([
                    'project_id' => $project->id,
                    'code' => $project->code . '-T' . str_pad($i, 2, '0', STR_PAD_LEFT),
                    'name' => fake()->sentence(4),
                    'description' => fake()->paragraph(),
                    'location' => fake()->city(),
                    'target' => $target,
                    'achieved' => $target * fake()->randomFloat(2, 0, 1),
                    'unit' => fake()->randomElement(['units', 'items', 'hours', 'people', 'documents']),
                    'budget' => $budget,
                    'spent' => $budget * fake()->randomFloat(2, 0.2, 0.9),
                    'status' => fake()->randomElement(['pending', 'in_progress', 'completed', 'on_hold']),
                    'progress' => fake()->numberBetween(0, 100),
                    'priority' => fake()->randomElement(['low', 'medium', 'high']),
                    'start_date' => fake()->dateTimeBetween('first day of January', 'last day of June'),
                    'end_date' => fake()->dateTimeBetween('first day of July', 'last day of December'),
                ]);
                $taskCount++;
            }
        }

        $this->command->info("✓ {$taskCount} tasks created");

        $this->command->newLine();
        $this->command->info('🎉 Database seeding completed!');
        $this->command->info('   Login with: admin@example.com / password');
    }
}
