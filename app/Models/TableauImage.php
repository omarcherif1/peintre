<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TableauImage extends Model
{
    protected $fillable = [
        'tableau_id',
        'image_data',
        'mime_type',
        'nom_original',
        'est_principale',
        'ordre',
    ];

    protected $casts = [
        'est_principale' => 'boolean',
    ];

    protected $appends = ['url'];

    // Exclure image_data des sérialisations JSON pour éviter de charger les binaires inutilement
    protected $hidden = ['image_data'];

    public function tableau(): BelongsTo
    {
        return $this->belongsTo(Tableau::class);
    }

    public function getUrlAttribute(): string
    {
        return route('image.tableau', $this->id);
    }
}
