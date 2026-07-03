<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FoireImage extends Model
{
    protected $fillable = [
        'foire_id',
        'image_data',
        'mime_type',
        'nom_original',
        'ordre',
    ];

    protected $appends = ['url'];

    // Exclure image_data des sérialisations JSON pour éviter de charger les binaires inutilement
    protected $hidden = ['image_data'];

    public function foire(): BelongsTo
    {
        return $this->belongsTo(Foire::class);
    }

    public function getUrlAttribute(): string
    {
        return route('image.foire', $this->id);
    }
}
