<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Article extends Model
{
    protected $fillable = [
        'titre',
        'contenu',
        'image_path',
        'publie',
        'ordre',
    ];

    protected $casts = [
        'publie' => 'boolean',
    ];

    public function scopePublies($query)
    {
        return $query->where('publie', true);
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path ? '/img/' . $this->image_path : null;
    }
}
