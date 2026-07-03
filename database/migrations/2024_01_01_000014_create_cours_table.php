<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cours', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->enum('type', ['cours', 'stage']);
            $table->enum('niveau', ['debutant', 'intermediaire', 'avance', 'tous']);
            $table->string('jour')->nullable();
            $table->time('heure_debut')->nullable();
            $table->time('heure_fin')->nullable();
            $table->date('date_debut_stage')->nullable();
            $table->date('date_fin_stage')->nullable();
            $table->string('emplacement');
            $table->integer('places_total')->nullable();
            $table->integer('places_restantes')->nullable();
            $table->decimal('tarif', 8, 2)->nullable();
            $table->text('description')->nullable();
            $table->boolean('actif')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cours');
    }
};
