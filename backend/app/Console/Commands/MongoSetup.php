<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class MongodbSetup extends Command
{
    protected $signature = 'mongodb:setup';
    protected $description = 'Setup MongoDB collections, apply JSON schema validation, and seed initial data';

    public function handle()
    {
        $this->info('Starting MongoDB setup...');
        $this->newLine();

        $schemaPath = database_path('schemas');
        if (!File::isDirectory($schemaPath)) {
            $this->error("No schemas directory found at: $schemaPath");
            return;
        }

        $schemas = File::files($schemaPath);
        $count = 0;

        foreach ($schemas as $file) {
            $filename = $file->getFilename();
            $collection = strtolower(str_replace('Schema.json', '', $filename));
                if (!str_ends_with($collection, 's')) {
                    $collection .= 's';
                }


            $this->line("Processing collection: <comment>{$collection}</comment>");

            try {
                $json = json_decode(File::get($file->getRealPath()), true);
                if (!$json) {
                    $this->error("Invalid JSON schema in file: $filename");
                    continue;
                }

                    $collections = iterator_to_array(DB::getMongoDB()->listCollectionNames());
                if (!in_array($collection, $collections)) {
                    $this->line("  -> Collection '{$collection}' does not exist. Creating...");
                    DB::getMongoDB()->createCollection($collection);
                    $this->line("  -> Collection '{$collection}' created");
                }

                // Áp dụng JSON schema validation
                $this->line("  -> Applying JSON schema validation...");
                DB::getMongoDB()->command([
                    'collMod' => $collection,
                    'validator' => ['$jsonSchema' => $json],
                    'validationLevel' => 'moderate',
                ]);

                $this->info("Schema validation applied successfully");
                $this->newLine();
                $count++;
            } catch (\Exception $e) {
                $this->error("  ⚠️ Error applying schema for {$collection}: " . $e->getMessage());
                $this->newLine();
            }
        }

        if (class_exists(\Database\Seeders\DatabaseSeeder::class)) {
            $this->call('db:seed');
        }

        $this->info("MongoDB setup completed successfully!");
        $this->info("{$count} collections configured with schema validation");
        return 0;
    }
}
