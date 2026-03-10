<?php
/**
 * Send a JSON response and exit.
 */
function jsonResponse($data, $statusCode = 200)
{
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    header('Cache-Control: post-check=0, pre-check=0', false);
    header('Pragma: no-cache');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Send a success JSON response.
 */
function successResponse($data = null, $message = null, $statusCode = 200)
{
    $response = ['success' => true];
    if ($message !== null)
        $response['message'] = $message;
    if ($data !== null)
        $response['data'] = $data;
    jsonResponse($response, $statusCode);
}

/**
 * Send an error JSON response.
 */
function errorResponse($message, $statusCode = 400)
{
    jsonResponse([
        'success' => false,
        'message' => $message
    ], $statusCode);
}