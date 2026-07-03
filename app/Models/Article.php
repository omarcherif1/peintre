<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = [
        'titre',
        'contenu',
        'image_data',
        'image_mime',
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
        return $this->image_data ? '/image/article/' . $this->id : null;
    }
}
