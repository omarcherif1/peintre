<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    public function index(): Response
    {
        $articles = Article::orderByDesc('created_at')
            ->get()
            ->map(fn ($a) => [
                'id'         => $a->id,
                'titre'      => $a->titre,
                'contenu'    => $a->contenu,
                'publie'     => $a->publie,
                'ordre'      => $a->ordre,
                'image_url'  => $a->image_url,
                'created_at' => $a->created_at->format('d/m/Y'),
                'extrait'    => mb_substr(strip_tags($a->contenu), 0, 120),
            ]);

        return Inertia::render('Admin/Articles/Index', compact('articles'));
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Articles/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'titre'   => 'required|string|max:255',
            'contenu' => 'required|string',
            'publie'  => 'boolean',
            'ordre'   => 'integer|min:0',
            'image'   => 'nullable|image|mimes:jpeg,png,webp|max:5120',
        ]);

        $article = new Article([
            'titre'   => $data['titre'],
            'contenu' => $data['contenu'],
            'publie'  => $request->boolean('publie'),
            'ordre'   => $data['ordre'] ?? 0,
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $article->image_data = base64_encode($file->get());
            $article->image_mime = $file->getMimeType();
        }

        $article->save();

        return redirect()->route('admin.articles.index')
            ->with('success', 'Article créé avec succès.');
    }

    public function edit(Article $article): Response
    {
        return Inertia::render('Admin/Articles/Edit', [
            'article' => [
                'id'        => $article->id,
                'titre'     => $article->titre,
                'contenu'   => $article->contenu,
                'publie'    => $article->publie,
                'ordre'     => $article->ordre,
                'image_url' => $article->image_url,
            ],
        ]);
    }

    public function update(Request $request, Article $article): RedirectResponse
    {
        $data = $request->validate([
            'titre'           => 'required|string|max:255',
            'contenu'         => 'required|string',
            'publie'          => 'boolean',
            'ordre'           => 'integer|min:0',
            'image'           => 'nullable|image|mimes:jpeg,png,webp|max:5120',
            'supprimer_image' => 'nullable|boolean',
        ]);

        $article->titre   = $data['titre'];
        $article->contenu = $data['contenu'];
        $article->publie  = $request->boolean('publie');
        $article->ordre   = $data['ordre'] ?? 0;

        if ($request->boolean('supprimer_image')) {
            $article->image_data = null;
            $article->image_mime = null;
        } elseif ($request->hasFile('image')) {
            $file = $request->file('image');
            $article->image_data = base64_encode($file->get());
            $article->image_mime = $file->getMimeType();
        }

        $article->save();

        return redirect()->route('admin.articles.index')
            ->with('success', 'Article modifié avec succès.');
    }

    public function destroy(Article $article): RedirectResponse
    {
        $article->delete();

        return redirect()->route('admin.articles.index')
            ->with('success', 'Article supprimé.');
    }
}
