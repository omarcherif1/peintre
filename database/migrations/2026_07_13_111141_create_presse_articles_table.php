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
        Schema::create('presse_articles', function (Blueprint $table) {
            $table->id();
            $table->string('media');
            $table->string('date_publication');
            $table->string('titre');
            $table->text('extrait')->nullable();
            $table->string('lien', 500)->nullable();
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
        Schema::dropIfExists('presse_articles');
    }
};
