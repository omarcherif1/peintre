<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tableau;
use App\Models\TableauImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TableauController extends Controller
{
    public function index(): Response
    {
        $tableaux = Tableau::with([
            'images' => fn ($q) => $q->where('est_principale', true),
        ])
            ->orderBy('ordre')
            ->orderBy('id')
            ->get();

        return Inertia::render('Admin/Tableaux/Index', compact('tableaux'));
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Tableaux/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nom'            => 'required|string|max:255',
            'mesure_hauteur' => 'required|numeric',
            'mesure_largeur' => 'required|numeric',
            'technique'      => 'required|string|max:255',
            'categorie'      => 'required|in:peinture,dessin',
            'idee'           => 'nullable|string|max:1000',
            'description'    => 'nullable|string',
            'disponible'     => 'boolean',
            'en_biographie'  => 'boolean',
            'ordre'          => 'integer',
            'images'         => 'nullable|array',
            'images.*'       => 'image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        $tableau = Tableau::create($validated);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $file) {
                $path = $file->store('images/tableaux', 'public');
                TableauImage::create([
                    'tableau_id'     => $tableau->id,
                    'image_path'     => $path,
                    'nom_original'   => $file->getClientOriginalName(),
                    'est_principale' => $index === 0,
                    'ordre'          => $index,
                ]);
            }
        }

        return redirect()->route('admin.tableaux.index')
            ->with('success', 'Tableau créé avec succès.');
    }

    public function show(Tableau $tableau): Response
    {
        return $this->edit($tableau);
    }

    public function edit(Tableau $tableau): Response
    {
        $tableau->load('images');

        return Inertia::render('Admin/Tableaux/Edit', compact('tableau'));
    }

    public function update(Request $request, Tableau $tableau): RedirectResponse
    {
        $validated = $request->validate([
            'nom'            => 'required|string|max:255',
            'mesure_hauteur' => 'required|numeric',
            'mesure_largeur' => 'required|numeric',
            'technique'      => 'required|string|max:255',
            'categorie'      => 'required|in:peinture,dessin',
            'idee'           => 'nullable|string|max:1000',
            'description'    => 'nullable|string',
            'disponible'     => 'boolean',
            'en_biographie'  => 'boolean',
            'ordre'          => 'integer',
            'images'         => 'nullable|array',
            'images.*'       => 'image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        $tableau->update($validated);

        if ($request->hasFile('images')) {
            $offset          = $tableau->images()->count();
            $pasEncoreImages = ! $tableau->images()->exists();

            foreach ($request->file('images') as $index => $file) {
                $path = $file->store('images/tableaux', 'public');
                TableauImage::create([
                    'tableau_id'     => $tableau->id,
                    'image_path'     => $path,
                    'nom_original'   => $file->getClientOriginalName(),
                    'est_principale' => $pasEncoreImages && $index === 0,
                    'ordre'          => $offset + $index,
                ]);
            }
        }

        return redirect()->route('admin.tableaux.index')
            ->with('success', 'Tableau modifié avec succès.');
    }

    public function destroy(Tableau $tableau): RedirectResponse
    {
        foreach ($tableau->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }
        $tableau->delete();

        return redirect()->route('admin.tableaux.index')
            ->with('success', 'Tableau supprimé.');
    }

    public function uploadImage(Request $request, Tableau $tableau): JsonResponse
    {
        $request->validate([
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        $file       = $request->file('image');
        $isPremiere = ! $tableau->images()->exists();
        $path       = $file->store('images/tableaux', 'public');

        $image = TableauImage::create([
            'tableau_id'     => $tableau->id,
            'image_path'     => $path,
            'nom_original'   => $file->getClientOriginalName(),
            'est_principale' => $isPremiere,
            'ordre'          => $tableau->images()->count(),
        ]);

        return response()->json([
            'success' => true,
            'image'   => [
                'id'             => $image->id,
                'url'            => $image->url,
                'est_principale' => $image->est_principale,
                'nom_original'   => $image->nom_original,
            ],
        ]);
    }

    public function deleteImage(Tableau $tableau, TableauImage $image): JsonResponse
    {
        abort_if($image->tableau_id !== $tableau->id, 403);

        Storage::disk('public')->delete($image->image_path);

        $etaitPrincipale = $image->est_principale;
        $image->delete();

        if ($etaitPrincipale) {
            $tableau->images()->first()?->update(['est_principale' => true]);
        }

        return response()->json(['success' => true]);
    }

    public function setImagePrincipale(Tableau $tableau, TableauImage $image): JsonResponse
    {
        abort_if($image->tableau_id !== $tableau->id, 403);

        $tableau->images()->update(['est_principale' => false]);
        $image->update(['est_principale' => true]);

        return response()->json(['success' => true]);
    }
}
