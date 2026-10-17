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

        return Inertia::render('Accueil', compact('tableaux'))
            ->withViewData([
                'title'       => "Chokri Benomrane — Peintre Tunisien, Fondateur de la Peinture de l'Absurde",
                'description' => "Site officiel de Chokri Benomrane, peintre tunisien et fondateur de la peinture de l'absurde. Découvrez ses œuvres, expositions et ateliers de peinture à Tunis.",
            ]);
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
                'image_url' => $t->images->first()?->url,
            ])
            ->filter(fn ($t) => $t['image_url'] !== null)
            ->values();

        return Inertia::render('Artiste', compact('images'))
            ->withViewData([
                'title'       => "Artiste — Biographie de Chokri Benomrane, Peintre Tunisien",
                'description' => "Biographie et démarche artistique de Chokri Benomrane, peintre tunisien fondateur de la peinture de l'absurde. Découvrez son univers, sa philosophie et son parcours.",
            ]);
    }

    public function oeuvres(): Response
    {
        $mapTableau = fn ($t) => [
            'id'            => $t->id,
            'slug'          => $t->slug,
            'nom'           => $t->nom,
            'technique'     => $t->technique,
            'mesure_h'      => $t->mesure_hauteur,
            'mesure_l'      => $t->mesure_largeur,
            'disponible'    => $t->disponible,
            'annee'         => $t->created_at->format('Y'),
            'description'   => $t->description,
            'idee'          => $t->idee,
            'image_url'     => $t->images->first()?->url,
            'toutes_images' => $t->images->map(fn ($img) => [
                'id'  => $img->id,
                'url' => $img->url,
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
        ])->withViewData([
            'title'       => "Œuvres — Tableaux et Dessins de Chokri Benomrane",
            'description' => "Galerie des peintures et dessins de Chokri Benomrane, peintre tunisien fondateur de la peinture de l'absurde. Explorez toutes ses œuvres.",
        ]);
    }

    public function tableauDetail(string $slug): Response
    {
        $mapTableau = fn ($t) => [
            'id'            => $t->id,
            'slug'          => $t->slug,
            'nom'           => $t->nom,
            'technique'     => $t->technique,
            'mesure_h'      => $t->mesure_hauteur,
            'mesure_l'      => $t->mesure_largeur,
            'disponible'    => $t->disponible,
            'annee'         => $t->created_at->format('Y'),
            'description'   => $t->description,
            'idee'          => $t->idee,
            'image_url'     => $t->images->first()?->url,
            'toutes_images' => $t->images->map(fn ($img) => [
                'id'  => $img->id,
                'url' => $img->url,
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

        $peintures = $query('peinture');
        $dessins   = $query('dessin');
        $all       = $peintures->merge($dessins);
        $selected  = $all->firstWhere('slug', $slug);

        abort_if(!$selected, 404);

        $base = config('app.url');

        return Inertia::render('Oeuvres', [
            'peintures'    => $peintures,
            'dessins'      => $dessins,
            'selectedSlug' => $slug,
        ])->withViewData([
            'title'       => $selected['nom'].' — Œuvre de Chokri Benomrane, Peintre Tunisien',
            'description' => $selected['nom'].($selected['technique'] ? ', '.$selected['technique'] : '').($selected['annee'] ? ', '.$selected['annee'] : '').' — Tableau de Chokri Benomrane, peintre tunisien fondateur de la peinture de l\'absurde.',
            'og_image'    => $selected['image_url'] ? $base.$selected['image_url'] : null,
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
            'image_url'   => $f->images->first()?->url,
        ];

        $foireAVenir = Foire::where('est_a_venir', true)->with('images')->first();
        $foireAVenir = $foireAVenir ? $mapFoire($foireAVenir) : null;

        $foiresPassees = Foire::where('est_a_venir', false)
            ->with('images')
            ->orderByDesc('date_debut')
            ->get()
            ->map($mapFoire);

        return Inertia::render('Expositions', compact('foireAVenir', 'foiresPassees'))
            ->withViewData([
                'title'       => "Expositions — Chokri Benomrane, Peintre Tunisien",
                'description' => "Calendrier des expositions et foires d'art de Chokri Benomrane en Tunisie et à l'international.",
            ]);
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

        return Inertia::render('Presse', compact('articles', 'interviews'))
            ->withViewData([
                'title'       => "Presse — Articles et Interviews de Chokri Benomrane",
                'description' => "Revue de presse, articles et interviews du peintre tunisien Chokri Benomrane.",
            ]);
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

        return Inertia::render('Ateliers', compact('cours'))
            ->withViewData([
                'title'       => "Ateliers de Peinture à Tunis — Club de Peinture · Chokri Benomrane",
                'description' => "Rejoignez les ateliers et le club de peinture de Chokri Benomrane à Tunis. Cours pour débutants, intermédiaires et avancés.",
            ]);
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

        return Inertia::render('Blog', compact('articles'))
            ->withViewData([
                'title'       => "Blog — Chokri Benomrane, Peintre Tunisien",
                'description' => "Articles et réflexions du peintre tunisien Chokri Benomrane sur l'art et la peinture de l'absurde.",
            ]);
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
        ])->withViewData([
            'title'       => $article->titre . ' — Blog · Chokri Benomrane',
            'description' => mb_substr(strip_tags($article->contenu), 0, 160),
        ]);
    }
}
