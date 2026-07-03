<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cours;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CoursController extends Controller
{
    public function index(): Response
    {
        $cours = Cours::where('type', 'cours')
            ->orderByDesc('actif')
            ->orderBy('ordre')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Admin/Cours/Index', compact('cours'));
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Cours/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->valider($request);

        Cours::create($data);

        return redirect()->route('admin.cours.index')
            ->with('success', 'Cours créé avec succès.');
    }

    public function show(Cours $cour): Response
    {
        return $this->edit($cour);
    }

    public function edit(Cours $cour): Response
    {
        return Inertia::render('Admin/Cours/Edit', ['cours' => $cour]);
    }

    public function update(Request $request, Cours $cour): RedirectResponse
    {
        $data = $this->valider($request);

        $cour->update($data);

        return redirect()->route('admin.cours.index')
            ->with('success', 'Cours modifié avec succès.');
    }

    public function destroy(Cours $cour): RedirectResponse
    {
        $cour->delete();

        return redirect()->route('admin.cours.index')
            ->with('success', 'Cours supprimé.');
    }

    private function valider(Request $request): array
    {
        $validated = $request->validate([
            'titre'            => 'required|string|max:255',
            'niveau'           => 'required|in:debutant,intermediaire,avance,tous',
            'emplacement'      => 'required|string|max:255',
            'jour'             => 'required|string|max:100',
            'heure_debut'      => 'required|date_format:H:i',
            'heure_fin'        => 'required|date_format:H:i|after:heure_debut',
            'description'      => 'nullable|string',
            'actif'            => 'boolean',
            'ordre'            => 'integer|min:0',
            'tarif'            => 'nullable|numeric|min:0',
            'places_total'     => 'nullable|integer|min:1',
            'places_restantes' => 'nullable|integer|min:0',
        ]);

        $validated['type'] = 'cours';

        if (! empty($validated['places_total']) && empty($validated['places_restantes'])) {
            $validated['places_restantes'] = $validated['places_total'];
        }

        return $validated;
    }
}
