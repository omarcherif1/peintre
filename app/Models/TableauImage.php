<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class TableauImage extends Model
{
    protected $fillable = [
        'tableau_id',
        'image_path',
        'nom_original',
        'est_principale',
        'ordre',
    ];

    protected $casts = [
        'est_principale' => 'boolean',
    ];

    protected $appends = ['url'];

    public function tableau(): BelongsTo
    {
        return $this->belongsTo(Tableau::class);
    }

    public function getUrlAttribute(): string
    {
        return '/img/' . $this->image_path;
    }
}
