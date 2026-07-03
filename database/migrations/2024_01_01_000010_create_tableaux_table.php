<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tableaux', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->decimal('mesure_hauteur', 8, 2);
            $table->decimal('mesure_largeur', 8, 2);
            $table->string('technique');
            $table->enum('categorie', ['peinture', 'dessin']);
            $table->text('idee');
            $table->longText('description');
            $table->boolean('disponible')->default(true);
            $table->integer('ordre')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tableaux');
    }
};
