<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PresseInterview extends Model
{
    protected $fillable = [
        'type', 'media', 'date_publication', 'titre',
        'description', 'url', 'image_data', 'image_mime', 'ordre', 'publie',
    ];
    protected $casts = ['publie' => 'boolean'];

    public function getImageUrlAttribute(): ?string
    {
        return $this->image_data ? '/image/interview/' . $this->id : null;
    }
}
