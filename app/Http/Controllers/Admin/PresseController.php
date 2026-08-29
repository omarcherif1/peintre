<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PresseArticle;
use App\Models\PresseInterview;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PresseController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Presse/Index', [
            'articles' => PresseArticle::orderBy('ordre')->orderByDesc('created_at')->get()
                ->map(fn ($a) => [
                    'id'               => $a->id,
                    'media'            => $a->media,
                    'date_publication' => $a->date_publication,
                    'titre'            => $a->titre,
                    'extrait'          => $a->extrait,
                    'lien'             => $a->lien,
                    'ordre'            => $a->ordre,
                    'publie'           => $a->publie,
                ]),

            'interviews' => PresseInterview::orderBy('ordre')->orderByDesc('created_at')->get()
                ->map(fn ($i) => [
                    'id'               => $i->id,
                    'type'             => $i->type,
                    'media'            => $i->media,
                    'date_publication' => $i->date_publication,
                    'titre'            => $i->titre,
                    'description'      => $i->description,
                    'url'              => $i->url,
                    'ordre'            => $i->ordre,
                    'publie'           => $i->publie,
                    'image_url'        => $i->image_url,
                ]),
        ]);
    }

    /* ── ARTICLES ── */

    public function storeArticle(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'media'            => 'required|string|max:255',
            'date_publication' => 'required|string|max:100',
            'titre'            => 'required|string|max:255',
            'extrait'          => 'nullable|string',
            'lien'             => 'nullable|string|max:500',
            'ordre'            => 'integer|min:0',
            'publie'           => 'boolean',
        ]);
        PresseArticle::create([...$data, 'publie' => $request->boolean('publie'), 'ordre' => $data['ordre'] ?? 0]);
        return back()->with('success', 'Article créé.');
    }

    public function updateArticle(Request $request, PresseArticle $presseArticle): RedirectResponse
    {
        $data = $request->validate([
            'media'            => 'required|string|max:255',
            'date_publication' => 'required|string|max:100',
            'titre'            => 'required|string|max:255',
            'extrait'          => 'nullable|string',
            'lien'             => 'nullable|string|max:500',
            'ordre'            => 'integer|min:0',
            'publie'           => 'boolean',
        ]);
        $presseArticle->update([...$data, 'publie' => $request->boolean('publie')]);
        return back()->with('success', 'Article modifié.');
    }

    public function destroyArticle(PresseArticle $presseArticle): RedirectResponse
    {
        $presseArticle->delete();
        return back()->with('success', 'Article supprimé.');
    }

    /* ── INTERVIEWS ── */

    public function storeInterview(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'type'             => 'required|in:podcast,tv',
            'media'            => 'required|string|max:255',
            'date_publication' => 'required|string|max:100',
            'titre'            => 'required|string|max:255',
            'description'      => 'nullable|string',
            'url'              => 'nullable|string|max:500',
            'ordre'            => 'integer|min:0',
            'publie'           => 'boolean',
            'image'            => 'nullable|image|mimes:jpeg,png,webp|max:5120',
        ]);

        $interview = new PresseInterview([
            'type'             => $data['type'],
            'media'            => $data['media'],
            'date_publication' => $data['date_publication'],
            'titre'            => $data['titre'],
            'description'      => $data['description'] ?? null,
            'url'              => $data['url'] ?? null,
            'ordre'            => $data['ordre'] ?? 0,
            'publie'           => $request->boolean('publie'),
        ]);

        if ($request->hasFile('image')) {
            $interview->image_path = $request->file('image')->store('images/presse', 'public');
        }

        $interview->save();
        return back()->with('success', 'Interview créée.');
    }

    public function updateInterview(Request $request, PresseInterview $presseInterview): RedirectResponse
    {
        $request->validate([
            'type'             => 'required|in:podcast,tv',
            'media'            => 'required|string|max:255',
            'date_publication' => 'required|string|max:100',
            'titre'            => 'required|string|max:255',
            'description'      => 'nullable|string',
            'url'              => 'nullable|string|max:500',
            'ordre'            => 'integer|min:0',
            'publie'           => 'boolean',
            'image'            => 'nullable|image|mimes:jpeg,png,webp|max:5120',
            'supprimer_image'  => 'nullable|boolean',
        ]);

        $presseInterview->type             = $request->input('type');
        $presseInterview->media            = $request->input('media');
        $presseInterview->date_publication = $request->input('date_publication');
        $presseInterview->titre            = $request->input('titre');
        $presseInterview->description      = $request->input('description');
        $presseInterview->url              = $request->input('url');
        $presseInterview->ordre            = $request->integer('ordre', 0);
        $presseInterview->publie           = $request->boolean('publie');

        if ($request->boolean('supprimer_image') && $presseInterview->image_path) {
            Storage::disk('public')->delete($presseInterview->image_path);
            $presseInterview->image_path = null;
        } elseif ($request->hasFile('image')) {
            if ($presseInterview->image_path) {
                Storage::disk('public')->delete($presseInterview->image_path);
            }
            $presseInterview->image_path = $request->file('image')->store('images/presse', 'public');
        }

        $presseInterview->save();
        return back()->with('success', 'Interview modifiée.');
    }

    public function destroyInterview(PresseInterview $presseInterview): RedirectResponse
    {
        if ($presseInterview->image_path) {
            Storage::disk('public')->delete($presseInterview->image_path);
        }
        $presseInterview->delete();
        return back()->with('success', 'Interview supprimée.');
    }
}
