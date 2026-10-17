<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="google-site-verification" content="7uun-FKks2UC-6SqJVleX0CyUFF7Jc3xv-zz3CYha1k" />

        <title inertia>{{ $title ?? config('app.name', 'Chokri Benomrane') }}</title>
        @if(!empty($description))
        <meta name="description" content="{{ $description }}">
        @endif
        <meta property="og:title" content="{{ $title ?? config('app.name', 'Chokri Benomrane') }}">
        <meta property="og:description" content="{{ $description ?? 'Peintre tunisien, fondateur de la peinture de l\'absurde.' }}">
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="Chokri Benomrane">
        @if(!empty($og_image))
        <meta property="og:image" content="{{ $og_image }}">
        <meta name="twitter:image" content="{{ $og_image }}">
        <meta name="twitter:card" content="summary_large_image">
        @endif

        <!-- Favicon -->
        <link rel="icon" type="image/png" href="/assets/logo.png">
        <link rel="apple-touch-icon" href="/assets/logo.png">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
