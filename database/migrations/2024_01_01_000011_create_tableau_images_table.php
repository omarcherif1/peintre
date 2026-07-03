<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tableau_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tableau_id')->constrained('tableaux')->cascadeOnDelete();
            $table->binary('image_data');
            $table->string('mime_type');
            $table->string('nom_original')->nullable();
            $table->boolean('est_principale')->default(false);
            $table->integer('ordre')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tableau_images');
    }
};
