<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Foire extends Model
{
    protected $fillable = [
        'nom',
        'emplacement',
        'date_debut',
        'date_fin',
        'description',
        'est_a_venir',
        'ordre',
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
        'est_a_venir' => 'boolean',
    ];

    public function images(): HasMany
    {
        return $this->hasMany(FoireImage::class)->orderBy('ordre');
    }

    public function scopeAVenir($query)
    {
        return $query->where('est_a_venir', true);
    }

    public function scopePassees($query)
    {
        return $query->where('est_a_venir', false);
    }
}
