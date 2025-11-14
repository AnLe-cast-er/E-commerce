<?php

namespace App\Models\Traits;

use Illuminate\Support\Facades\DB;

trait MongoSchema
{
    public static function applyMongoSchema($collection)
{
    $schemaFileMap = [
        'products' => 'productSchema.json',
        'orders' => 'orderSchema.json'
    ];

    if (!isset($schemaFileMap[$collection])) {
        throw new \Exception("No schema file defined for collection: {$collection}");
    }

    $schemaPath = database_path("schemas/" . $schemaFileMap[$collection]);
    if (!file_exists($schemaPath)) {
        throw new \Exception("Schema file not found: {$schemaPath}");
    }

    $schema = json_decode(file_get_contents($schemaPath), true);
    if ($schema === null) {
        throw new \Exception("Invalid JSON in schema file: {$schemaPath}");
    }

    DB::connection('mongodb')->getMongoDB()->command([
        "collMod" => $collection,
        "validator" => ['$jsonSchema' => $schema],
        "validationAction" => "error"
    ]);
}
}
