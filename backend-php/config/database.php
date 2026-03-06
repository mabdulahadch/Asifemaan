<?php
require_once __DIR__ . '/../helpers/env.php';

/**
 * Returns a singleton mysqli connection.
 */
function getDB()
{
    static $db = null;
    if ($db !== null)
        return $db;

    $host = getenv('DB_HOST') ?: '127.0.0.1';
    $user = getenv('DB_USER') ?: 'root';
    $password = getenv('DB_PASSWORD') ?: '';
    $dbname = getenv('DB_NAME') ?: 'poetry';
    $port = (int)(getenv('DB_PORT') ?: 3306);

    $db = new mysqli($host, $user, $password, $dbname, $port);

    if ($db->connect_error) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Database connection failed: ' . $db->connect_error
        ]);
        exit;
    }

    $db->set_charset('utf8mb4');
    return $db;
}