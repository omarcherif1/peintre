<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Cours;
use App\Models\Foire;
use App\Models\PresseArticle;
use App\Models\PresseInterview;
use App\Models\Tableau;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function accueil(): Response
    {
        $tableaux = Tableau::with([
            'images' => fn ($q) => $q->where('est_principale', true),
        ])
            ->where('disponible', true)
            ->orderBy('ordre')
            ->take(3)
            ->get()
            ->map(fn ($t) => [
                'id'        => $t->id,
                'nom'       => $t->nom,
                'technique' => $t->technique,
                'categorie' => $t->categorie,
                'annee'     => $t->created_at->format('Y'),
                'image_url' => $t->images->first()?->url,
            ]);

        return Inertia::render('Accueil', compact('tableaux'));
    }

    public function artiste(): Response
    {
        $images = Tableau::with([
            'images' => fn ($q) => $q->where('est_principale', true),
        ])
            ->where('en_biographie', true)
            ->orderBy('ordre')
            ->get()
            ->map(fn ($t) => [
                'id'        => $t->id,
                'nom'       => $t->nom,
                'technique' => $t->technique,
                'image_url' => $t->images->first()
                                ? '/image/tableau/' . $t->images->first()->id
                                : null,
            ])
            ->filter(fn ($t) => $t['image_url'] !== null)
            ->values();

        return Inertia::render('Artiste', compact('images'));
    }

    public function oeuvres(): Response
    {
        $mapTableau = fn ($t) => [
            'id'            => $t->id,
            'nom'           => $t->nom,
            'technique'     => $t->technique,
            'mesure_h'      => $t->mesure_hauteur,
            'mesure_l'      => $t->mesure_largeur,
            'disponible'    => $t->disponible,
            'annee'         => $t->created_at->format('Y'),
            'description'   => $t->description,
            'idee'          => $t->idee,
            'image_url'     => $t->images->first()
                                ? '/image/tableau/' . $t->images->first()->id
                                : null,
            'toutes_images' => $t->images->map(fn ($img) => [
                'id'  => $img->id,
                'url' => '/image/tableau/' . $img->id,
            ]),
        ];

        $query = fn (string $categorie) => Tableau::with([
            'images' => fn ($q) => $q->orderBy('ordre'),
        ])
            ->where('categorie', $categorie)
            ->orderBy('ordre')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map($mapTableau);

        return Inertia::render('Oeuvres', [
            'peintures' => $query('peinture'),
            'dessins'   => $query('dessin'),
        ]);
    }

    public function expositions(): Response
    {
        $mapFoire = fn ($f) => [
            'id'          => $f->id,
            'nom'         => $f->nom,
            'emplacement' => $f->emplacement,
            'date_debut'  => $f->date_debut?->format('Y-m-d'),
            'date_fin'    => $f->date_fin?->format('Y-m-d'),
            'description' => $f->description,
            'image_url'   => $f->images->first()
                                ? '/image/foire/' . $f->images->first()->id
                                : null,
        ];

        $foireAVenir = Foire::where('est_a_venir', true)->with('images')->first();
        $foireAVenir = $foireAVenir ? $mapFoire($foireAVenir) : null;

        $foiresPassees = Foire::where('est_a_venir', false)
            ->with('images')
            ->orderByDesc('date_debut')
            ->get()
            ->map($mapFoire);

        return Inertia::render('Expositions', compact('foireAVenir', 'foiresPassees'));
    }

    public function presse(): Response
    {
        $articles = PresseArticle::where('publie', true)
            ->orderBy('ordre')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($a) => [
                'id'               => $a->id,
                'media'            => $a->media,
                'date_publication' => $a->date_publication,
                'titre'            => $a->titre,
                'extrait'          => $a->extrait,
                'lien'             => $a->lien,
            ]);

        $interviews = PresseInterview::where('publie', true)
            ->orderBy('ordre')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($i) => [
                'id'               => $i->id,
                'type'             => $i->type,
                'media'            => $i->media,
                'date_publication' => $i->date_publication,
                'titre'            => $i->titre,
                'description'      => $i->description,
                'url'              => $i->url,
                'image_url'        => $i->image_url,
            ]);

        return Inertia::render('Presse', compact('articles', 'interviews'));
    }

    public function ateliers(): Response
    {
        $cours = Cours::where('type', 'cours')
            ->where('actif', true)
            ->orderBy('ordre')
            ->get()
            ->map(fn ($c) => [
                'id'               => $c->id,
                'titre'            => $c->titre,
                'niveau'           => $c->niveau,
                'jour'             => $c->jour,
                'heure_debut'      => $c->heure_debut ? substr($c->heure_debut, 0, 5) : null,
                'heure_fin'        => $c->heure_fin  ? substr($c->heure_fin,  0, 5) : null,
                'emplacement'      => $c->emplacement,
                'places_total'     => $c->places_total,
                'places_restantes' => $c->places_restantes,
                'tarif'            => $c->tarif,
                'description'      => $c->description,
            ]);

        return Inertia::render('Ateliers', compact('cours'));
    }

    public function contact(): Response
    {
        return Inertia::render('Contact');
    }

    public function blog(): Response
    {
        $articles = Article::publies()
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($a) => [
                'id'        => $a->id,
                'titre'     => $a->titre,
                'extrait'   => mb_substr(strip_tags($a->contenu), 0, 160),
                'image_url' => $a->image_url,
                'date'      => Carbon::parse($a->created_at)->locale('fr')->isoFormat('D MMMM YYYY'),
            ]);

        return Inertia::render('Blog', compact('articles'));
    }

    public function article(Article $article): Response
    {
        abort_unless($article->publie, 404);

        return Inertia::render('ArticleDetail', [
            'article' => [
                'id'        => $article->id,
                'titre'     => $article->titre,
                'contenu'   => $article->contenu,
                'image_url' => $article->image_url,
                'date'      => Carbon::parse($article->created_at)->locale('fr')->isoFormat('dddd D MMMM YYYY'),
            ],
        ]);
    }
}
