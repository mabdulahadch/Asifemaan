<?php
/**
 * Simple .env file parser.
 * Loads key=value pairs from .env into $_ENV and getenv().
 */
function loadEnv($path)
{
    if (!file_exists($path))
        return;

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        // Skip comment lines
        if (strpos($line, '#') === 0)
            continue;
        // Split on first '='
        $pos = strpos($line, '=');
        if ($pos === false)
            continue;

        $key = trim(substr($line, 0, $pos));
        $value = trim(substr($line, $pos + 1));

        // Handle quoted values: extract content between quotes
        if (preg_match('/^"(.*?)"/', $value, $m)) {
            $value = $m[1];
        }
        elseif (preg_match("/^'(.*?)'/", $value, $m)) {
            $value = $m[1];
        }
        else {
            // Unquoted: strip inline comments (space + #)
            $commentPos = strpos($value, ' #');
            if ($commentPos !== false) {
                $value = substr($value, 0, $commentPos);
            }
            $value = trim($value);
        }

        $_ENV[$key] = $value;
        putenv("$key=$value");
    }
}

// Auto-load .env from project root
loadEnv(__DIR__ . '/../.env');