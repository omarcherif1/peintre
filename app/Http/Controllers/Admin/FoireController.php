<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Foire;
use App\Models\FoireImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FoireController extends Controller
{
    public function index(): Response
    {
        $foires = Foire::with('images')
            ->orderByDesc('est_a_venir')
            ->orderByDesc('date_debut')
            ->get();

        return Inertia::render('Admin/Foires/Index', compact('foires'));
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Foires/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'nom'         => 'required|string|max:255',
            'emplacement' => 'required|string|max:255',
            'date_debut'  => 'required|date',
            'date_fin'    => 'nullable|date|after_or_equal:date_debut',
            'description' => 'nullable|string',
            'est_a_venir' => 'boolean',
            'ordre'       => 'integer|min:0',
            'images'      => 'nullable|array',
            'images.*'    => 'image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        if ($request->boolean('est_a_venir')) {
            Foire::where('est_a_venir', true)->update(['est_a_venir' => false]);
        }

        $foire = Foire::create([
            'nom'         => $request->nom,
            'emplacement' => $request->emplacement,
            'date_debut'  => $request->date_debut,
            'date_fin'    => $request->date_fin,
            'description' => $request->description,
            'est_a_venir' => $request->boolean('est_a_venir'),
            'ordre'       => $request->integer('ordre'),
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $file) {
                FoireImage::create([
                    'foire_id'     => $foire->id,
                    'image_data'   => base64_encode($file->get()),
                    'mime_type'    => $file->getMimeType(),
                    'nom_original' => $file->getClientOriginalName(),
                    'ordre'        => $index,
                ]);
            }
        }

        return redirect()->route('admin.foires.index')
            ->with('success', 'Foire créée avec succès.');
    }

    public function show(Foire $foire): Response
    {
        return $this->edit($foire);
    }

    public function edit(Foire $foire): Response
    {
        $foire->load(['images' => fn ($q) => $q->orderBy('ordre')]);

        return Inertia::render('Admin/Foires/Edit', compact('foire'));
    }

    public function update(Request $request, Foire $foire): RedirectResponse
    {
        $request->validate([
            'nom'         => 'required|string|max:255',
            'emplacement' => 'required|string|max:255',
            'date_debut'  => 'required|date',
            'date_fin'    => 'nullable|date|after_or_equal:date_debut',
            'description' => 'nullable|string',
            'est_a_venir' => 'boolean',
            'ordre'       => 'integer|min:0',
            'images'      => 'nullable|array',
            'images.*'    => 'image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        $estAVenir = $request->boolean('est_a_venir');

        if ($estAVenir && ! $foire->est_a_venir) {
            Foire::where('est_a_venir', true)
                ->where('id', '!=', $foire->id)
                ->update(['est_a_venir' => false]);
        }

        $foire->update([
            'nom'         => $request->nom,
            'emplacement' => $request->emplacement,
            'date_debut'  => $request->date_debut,
            'date_fin'    => $request->date_fin,
            'description' => $request->description,
            'est_a_venir' => $estAVenir,
            'ordre'       => $request->integer('ordre'),
        ]);

        if ($request->hasFile('images')) {
            $offset = $foire->images()->count();
            foreach ($request->file('images') as $index => $file) {
                FoireImage::create([
                    'foire_id'     => $foire->id,
                    'image_data'   => base64_encode($file->get()),
                    'mime_type'    => $file->getMimeType(),
                    'nom_original' => $file->getClientOriginalName(),
                    'ordre'        => $offset + $index,
                ]);
            }
        }

        return redirect()->route('admin.foires.index')
            ->with('success', 'Foire modifiée avec succès.');
    }

    public function destroy(Foire $foire): RedirectResponse
    {
        $foire->delete();

        return redirect()->route('admin.foires.index')
            ->with('success', 'Foire supprimée.');
    }

    public function uploadImage(Request $request, Foire $foire): JsonResponse
    {
        $request->validate([
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        $file  = $request->file('image');
        $ordre = $foire->images()->count();

        $image = FoireImage::create([
            'foire_id'     => $foire->id,
            'image_data'   => base64_encode($file->get()),
            'mime_type'    => $file->getMimeType(),
            'nom_original' => $file->getClientOriginalName(),
            'ordre'        => $ordre,
        ]);

        return response()->json([
            'success' => true,
            'image'   => [
                'id'    => $image->id,
                'url'   => route('image.foire', $image->id),
                'ordre' => $image->ordre,
            ],
        ]);
    }

    public function deleteImage(Foire $foire, FoireImage $image): JsonResponse
    {
        abort_if($image->foire_id !== $foire->id, 403);

        $image->delete();

        return response()->json(['success' => true]);
    }
}
