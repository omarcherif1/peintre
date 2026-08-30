<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class PresseInterview extends Model
{
    protected $fillable = [
        'type', 'media', 'date_publication', 'titre',
        'description', 'url', 'image_path', 'ordre', 'publie',
    ];

    protected $casts = ['publie' => 'boolean'];

    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path ? '/img/' . $this->image_path : null;
    }
}
