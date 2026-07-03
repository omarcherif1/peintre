<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tableaux', function (Blueprint $table) {
            $table->boolean('en_biographie')->default(false)->after('disponible');
        });
    }

    public function down(): void
    {
        Schema::table('tableaux', function (Blueprint $table) {
            $table->dropColumn('en_biographie');
        });
    }
};
