<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('foire_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('foire_id')->constrained('foires')->cascadeOnDelete();
            $table->binary('image_data');
            $table->string('mime_type');
            $table->string('nom_original')->nullable();
            $table->integer('ordre')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('foire_images');
    }
};
