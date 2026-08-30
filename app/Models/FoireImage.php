<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class FoireImage extends Model
{
    protected $fillable = [
        'foire_id',
        'image_path',
        'nom_original',
        'ordre',
    ];

    protected $appends = ['url'];

    public function foire(): BelongsTo
    {
        return $this->belongsTo(Foire::class);
    }

    public function getUrlAttribute(): string
    {
        return '/img/' . $this->image_path;
    }
}
