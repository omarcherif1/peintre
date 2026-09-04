<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Tableau;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $base = config('app.url');
        $now  = now()->toAtomString();

        $staticPages = [
            ['loc' => $base.'/',            'changefreq' => 'monthly', 'priority' => '1.0'],
            ['loc' => $base.'/artiste',     'changefreq' => 'monthly', 'priority' => '0.9'],
            ['loc' => $base.'/oeuvres',     'changefreq' => 'weekly',  'priority' => '0.9'],
            ['loc' => $base.'/expositions', 'changefreq' => 'weekly',  'priority' => '0.8'],
            ['loc' => $base.'/ateliers',    'changefreq' => 'monthly', 'priority' => '0.8'],
            ['loc' => $base.'/presse',      'changefreq' => 'monthly', 'priority' => '0.7'],
            ['loc' => $base.'/blog',        'changefreq' => 'weekly',  'priority' => '0.7'],
            ['loc' => $base.'/contact',     'changefreq' => 'yearly',  'priority' => '0.5'],
        ];

        $tableaux = Tableau::orderBy('ordre')->get()->map(fn ($t) => [
            'loc'        => $base.'/oeuvres/'.$t->slug,
            'changefreq' => 'monthly',
            'priority'   => '0.7',
        ])->toArray();

        $articles = Article::where('publie', true)->orderByDesc('created_at')->get()->map(fn ($a) => [
            'loc'        => $base.'/blog/'.$a->id,
            'changefreq' => 'monthly',
            'priority'   => '0.6',
        ])->toArray();

        $pages = array_merge($staticPages, $tableaux, $articles);

        $xml  = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        foreach ($pages as $page) {
            $xml .= "  <url>\n";
            $xml .= "    <loc>{$page['loc']}</loc>\n";
            $xml .= "    <lastmod>{$now}</lastmod>\n";
            $xml .= "    <changefreq>{$page['changefreq']}</changefreq>\n";
            $xml .= "    <priority>{$page['priority']}</priority>\n";
            $xml .= "  </url>\n";
        }
        $xml .= '</urlset>';

        return response($xml, 200, ['Content-Type' => 'application/xml']);
    }
}
