<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\Admin\ArticleController as AdminArticleController;
use App\Http\Controllers\Admin\PresseController as AdminPresseController;
use App\Http\Controllers\Admin\TableauController as AdminTableauController;
use App\Http\Controllers\Admin\FoireController as AdminFoireController;
use App\Http\Controllers\Admin\CoursController as AdminCoursController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

// Routes publiques
Route::get('/', [PageController::class, 'accueil'])->name('accueil');
Route::get('/artiste', [PageController::class, 'artiste'])->name('artiste');
Route::get('/oeuvres', [PageController::class, 'oeuvres'])->name('oeuvres');
Route::get('/expositions', [PageController::class, 'expositions'])->name('expositions');
Route::get('/presse', [PageController::class, 'presse'])->name('presse');
Route::get('/ateliers', [PageController::class, 'ateliers'])->name('ateliers');
Route::get('/contact', [PageController::class, 'contact'])->name('contact');
Route::post('/contact/envoyer', [ContactController::class, 'envoyer'])->name('contact.envoyer');
Route::get('/blog', [PageController::class, 'blog'])->name('blog');
Route::get('/blog/{article}', [PageController::class, 'article'])->name('blog.article');

// Routes profil Breeze
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Routes admin protégées
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminController::class, 'dashboard'])->name('dashboard');

    Route::resource('tableaux', AdminTableauController::class)->parameters(['tableaux' => 'tableau']);
    Route::post('tableaux/{tableau}/images', [AdminTableauController::class, 'uploadImage'])->name('tableaux.images.upload');
    Route::delete('tableaux/{tableau}/images/{image}', [AdminTableauController::class, 'deleteImage'])->name('tableaux.images.delete');
    Route::patch('tableaux/{tableau}/images/{image}/principale', [AdminTableauController::class, 'setImagePrincipale'])->name('tableaux.images.principale');

    Route::resource('foires', AdminFoireController::class);
    Route::post('foires/{foire}/images', [AdminFoireController::class, 'uploadImage'])->name('foires.images.upload');
    Route::delete('foires/{foire}/images/{image}', [AdminFoireController::class, 'deleteImage'])->name('foires.images.delete');

    Route::resource('cours', AdminCoursController::class)->parameters(['cours' => 'cour']);
    Route::resource('articles', AdminArticleController::class);

    // Presse
    Route::get('presse', [AdminPresseController::class, 'index'])->name('presse.index');
    Route::post('presse/articles', [AdminPresseController::class, 'storeArticle'])->name('presse.articles.store');
    Route::put('presse/articles/{presseArticle}', [AdminPresseController::class, 'updateArticle'])->name('presse.articles.update');
    Route::delete('presse/articles/{presseArticle}', [AdminPresseController::class, 'destroyArticle'])->name('presse.articles.destroy');
    Route::post('presse/interviews', [AdminPresseController::class, 'storeInterview'])->name('presse.interviews.store');
    Route::put('presse/interviews/{presseInterview}', [AdminPresseController::class, 'updateInterview'])->name('presse.interviews.update');
    Route::delete('presse/interviews/{presseInterview}', [AdminPresseController::class, 'destroyInterview'])->name('presse.interviews.destroy');
});

require __DIR__.'/auth.php';
