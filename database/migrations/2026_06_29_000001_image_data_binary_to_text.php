<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tableau_images', function (Blueprint $table) {
            $table->longText('image_data')->change();
        });

        Schema::table('foire_images', function (Blueprint $table) {
            $table->longText('image_data')->change();
        });
    }

    public function down(): void
    {
        Schema::table('tableau_images', function (Blueprint $table) {
            $table->binary('image_data')->change();
        });

        Schema::table('foire_images', function (Blueprint $table) {
            $table->binary('image_data')->change();
        });
    }
};
