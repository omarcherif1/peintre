<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Cours;
use App\Models\Foire;
use App\Models\Tableau;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function dashboard(): Response
    {
        // ── Stats tableaux ──
        $total_tableaux      = Tableau::count();
        $total_peintures     = Tableau::where('categorie', 'peinture')->count();
        $total_dessins       = Tableau::where('categorie', 'dessin')->count();
        $tableaux_disponibles = Tableau::where('disponible', true)->count();

        // ── Stats foires ──
        $total_foires      = Foire::count();
        $foire_a_venir_raw = Foire::where('est_a_venir', true)->with('images')->first();
        $foire_a_venir = $foire_a_venir_raw ? [
            'id'          => $foire_a_venir_raw->id,
            'nom'         => $foire_a_venir_raw->nom,
            'emplacement' => $foire_a_venir_raw->emplacement,
            'date_debut'  => $foire_a_venir_raw->date_debut?->toDateString(),
            'date_fin'    => $foire_a_venir_raw->date_fin?->toDateString(),
            'description' => $foire_a_venir_raw->description ?? '',
            'est_a_venir' => $foire_a_venir_raw->est_a_venir,
            'ordre'       => $foire_a_venir_raw->ordre ?? 0,
            'images'      => $foire_a_venir_raw->images->map(fn ($img) => [
                'id'  => $img->id,
                'url' => $img->url,
            ])->values()->all(),
        ] : null;

        // ── Stats articles ──
        $total_articles    = Article::count();
        $articles_publies  = Article::where('publie', true)->count();

        // ── Stats cours/stages actifs ──
        $total_cours   = Cours::where('type', 'cours')->where('actif', true)->count();
        $total_stages  = Cours::where('type', 'stage')->where('actif', true)->count();

        // ── Derniers tableaux (5) — données complètes pour la modale d'édition ──
        $derniers_tableaux = Tableau::with('images')
            ->orderByDesc('created_at')
            ->take(5)
            ->get()
            ->map(fn ($t) => [
                'id'             => $t->id,
                'nom'            => $t->nom,
                'categorie'      => $t->categorie,
                'technique'      => $t->technique,
                'mesure_hauteur' => $t->mesure_hauteur,
                'mesure_largeur' => $t->mesure_largeur,
                'idee'           => $t->idee ?? '',
                'description'    => $t->description ?? '',
                'disponible'     => $t->disponible,
                'ordre'          => $t->ordre ?? 0,
                'images'         => $t->images->map(fn ($img) => [
                    'id'             => $img->id,
                    'url'            => $img->url,
                    'est_principale' => $img->est_principale,
                ])->values()->all(),
                'image_url'      => $t->images->firstWhere('est_principale', true)?->url
                                    ?? $t->images->first()?->url,
            ]);

        // ── Prochains stages à venir ──
        $prochains_stages = Cours::where('type', 'stage')
            ->where('actif', true)
            ->where('date_debut_stage', '>=', Carbon::today())
            ->orderBy('date_debut_stage')
            ->take(3)
            ->get()
            ->map(fn ($c) => [
                'id'               => $c->id,
                'titre'            => $c->titre,
                'date_debut_stage' => $c->date_debut_stage?->toDateString(),
                'date_fin_stage'   => $c->date_fin_stage?->toDateString(),
                'emplacement'      => $c->emplacement,
                'places_total'     => $c->places_total,
                'places_restantes' => $c->places_restantes,
            ]);

        return Inertia::render('Admin/Dashboard', compact(
            'total_tableaux',
            'total_peintures',
            'total_dessins',
            'tableaux_disponibles',
            'total_foires',
            'foire_a_venir',
            'total_cours',
            'total_stages',
            'derniers_tableaux',
            'prochains_stages',
            'total_articles',
            'articles_publies',
        ));
    }
}
