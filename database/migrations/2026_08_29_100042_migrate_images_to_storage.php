<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // tableau_images
        Schema::table('tableau_images', function (Blueprint $table) {
            $table->string('image_path')->nullable()->after('tableau_id');
        });
        Schema::table('tableau_images', function (Blueprint $table) {
            $table->dropColumn(['image_data', 'mime_type']);
        });

        // foire_images
        Schema::table('foire_images', function (Blueprint $table) {
            $table->string('image_path')->nullable()->after('foire_id');
        });
        Schema::table('foire_images', function (Blueprint $table) {
            $table->dropColumn(['image_data', 'mime_type']);
        });

        // articles
        Schema::table('articles', function (Blueprint $table) {
            $table->string('image_path')->nullable()->after('contenu');
        });
        Schema::table('articles', function (Blueprint $table) {
            $table->dropColumn(['image_data', 'image_mime']);
        });

        // presse_interviews
        Schema::table('presse_interviews', function (Blueprint $table) {
            $table->string('image_path')->nullable()->after('description');
        });
        Schema::table('presse_interviews', function (Blueprint $table) {
            $table->dropColumn(['image_data', 'image_mime']);
        });
    }

    public function down(): void
    {
        Schema::table('tableau_images', function (Blueprint $table) {
            $table->longText('image_data')->nullable();
            $table->string('mime_type')->nullable();
            $table->dropColumn('image_path');
        });
        Schema::table('foire_images', function (Blueprint $table) {
            $table->longText('image_data')->nullable();
            $table->string('mime_type')->nullable();
            $table->dropColumn('image_path');
        });
        Schema::table('articles', function (Blueprint $table) {
            $table->longText('image_data')->nullable();
            $table->string('image_mime')->nullable();
            $table->dropColumn('image_path');
        });
        Schema::table('presse_interviews', function (Blueprint $table) {
            $table->longText('image_data')->nullable();
            $table->string('image_mime')->nullable();
            $table->dropColumn('image_path');
        });
    }
};
