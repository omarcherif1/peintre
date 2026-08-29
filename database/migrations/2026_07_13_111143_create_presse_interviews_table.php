<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('presse_interviews', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['podcast', 'tv'])->default('podcast');
            $table->string('media');
            $table->string('date_publication');
            $table->string('titre');
            $table->text('description')->nullable();
            $table->string('url', 500)->nullable();
            $table->longText('image_data')->nullable();
            $table->string('image_mime')->nullable();
            $table->integer('ordre')->default(0);
            $table->boolean('publie')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('presse_interviews');
    }
};
