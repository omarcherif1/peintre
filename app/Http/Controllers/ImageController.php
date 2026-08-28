<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\FoireImage;
use App\Models\PresseInterview;
use App\Models\TableauImage;
use Illuminate\Http\Response;

class ImageController extends Controller
{
    public function tableau(TableauImage $image): Response
    {
        return response(base64_decode($image->image_data), 200, [
            'Content-Type'  => $image->mime_type,
            'Cache-Control' => 'public, max-age=31536000',
        ]);
    }

    public function foire(FoireImage $image): Response
    {
        return response(base64_decode($image->image_data), 200, [
            'Content-Type'  => $image->mime_type,
            'Cache-Control' => 'public, max-age=31536000',
        ]);
    }

    public function article(Article $article): Response
    {
        abort_unless($article->image_data, 404);

        return response(base64_decode($article->image_data), 200, [
            'Content-Type'  => $article->image_mime,
            'Cache-Control' => 'public, max-age=31536000',
        ]);
    }

    public function interview(PresseInterview $presseInterview): Response
    {
        abort_unless($presseInterview->image_data, 404);

        return response(base64_decode($presseInterview->image_data), 200, [
            'Content-Type'  => $presseInterview->image_mime,
            'Cache-Control' => 'public, max-age=31536000',
        ]);
    }
}
