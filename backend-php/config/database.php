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

    $DB_HOST = 'localhost';
    $DB_USER = 'uzwmmbyxy6xmn';
    $DB_PASSWORD = 'asifemaan123';
    $DB_NAME = 'db6bd05mziowfc';
    $PORT = 3306;

    $db = new mysqli($DB_HOST, $DB_USER, $DB_PASSWORD, $DB_NAME, $PORT);


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