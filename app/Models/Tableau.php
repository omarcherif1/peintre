<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tableau extends Model
{
    protected $table = 'tableaux';

    protected $fillable = [
        'nom',
        'mesure_hauteur',
        'mesure_largeur',
        'technique',
        'categorie',
        'idee',
        'description',
        'disponible',
        'en_biographie',
        'ordre',
    ];

    protected $casts = [
        'mesure_hauteur' => 'decimal:2',
        'mesure_largeur' => 'decimal:2',
        'disponible'    => 'boolean',
        'en_biographie' => 'boolean',
    ];

    public function images(): HasMany
    {
        return $this->hasMany(TableauImage::class)->orderBy('ordre');
    }

    public function scopePeintures($query)
    {
        return $query->where('categorie', 'peinture');
    }

    public function scopeDessins($query)
    {
        return $query->where('categorie', 'dessin');
    }
}
