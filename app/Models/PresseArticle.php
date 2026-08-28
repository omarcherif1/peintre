<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PresseArticle extends Model
{
    protected $fillable = ['media', 'date_publication', 'titre', 'extrait', 'lien', 'ordre', 'publie'];
    protected $casts    = ['publie' => 'boolean'];
}
