<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cours extends Model
{
    protected $table = 'cours';

    protected $fillable = [
        'titre',
        'type',
        'niveau',
        'jour',
        'heure_debut',
        'heure_fin',
        'date_debut_stage',
        'date_fin_stage',
        'emplacement',
        'places_total',
        'places_restantes',
        'tarif',
        'description',
        'actif',
        'ordre',
    ];

    protected $casts = [
        'date_debut_stage' => 'date',
        'date_fin_stage' => 'date',
        'tarif' => 'decimal:2',
        'actif' => 'boolean',
    ];

    public function scopeCours($query)
    {
        return $query->where('type', 'cours');
    }

    public function scopeStages($query)
    {
        return $query->where('type', 'stage');
    }

    public function scopeActifs($query)
    {
        return $query->where('actif', true);
    }
}
