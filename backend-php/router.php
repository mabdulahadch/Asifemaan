<?php
/**
 * Router for PHP built-in development server.
 * Usage: php -S localhost:3000 router.php
 *
 * This replaces .htaccess rewrite rules when running locally.
 */

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Route API requests to the correct PHP file
$routes = [
    '/api/auth' => __DIR__ . '/api/auth.php',
    '/api/poets' => __DIR__ . '/api/poets.php',
    '/api/content' => __DIR__ . '/api/content.php',
    '/api/favourites' => __DIR__ . '/api/favourites.php',
    '/api/settings' => __DIR__ . '/api/settings.php',
];

foreach ($routes as $prefix => $file) {
    if (strpos($uri, $prefix) === 0) {
        require $file;
        return true;
    }
}

// 404 for unmatched API routes
if (strpos($uri, '/api/') === 0) {
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'message' => "Route {$_SERVER['REQUEST_METHOD']} $uri not found."
    ]);
    return true;
}

// Let the built-in server handle static files
return false;