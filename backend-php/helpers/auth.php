<?php
require_once __DIR__ . '/../vendor/JWT.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/response.php';
require_once __DIR__ . '/env.php';

/**
 * Generate a JWT token for a user ID.
 */
function generateToken($userId)
{
    $secret = getenv('JWT_SECRET') ?: 'asifemaan123';
    $expiresIn = (int)(getenv('JWT_EXPIRES_IN') ?: 604800); // 7 days in seconds

    $payload = [
        'id' => $userId,
        'iat' => time(),
        'exp' => time() + $expiresIn,
    ];

    return JWT::encode($payload, $secret);
}

/**
 * Authenticate request via Bearer token.
 * Returns the user row (assoc array) or sends 401 and exits.
 */
function authenticate()
{
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? ($_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');

    if (empty($authHeader) || strpos($authHeader, 'Bearer ') !== 0) {
        errorResponse('Access denied. No token provided.', 401);
    }

    $token = substr($authHeader, 7);
    $secret = getenv('JWT_SECRET') ?: 'asifemaan123';

    try {
        $decoded = JWT::decode($token, $secret);
    }
    catch (Exception $e) {
        $msg = $e->getMessage();
        if (strpos($msg, 'expired') !== false) {
            errorResponse('Token has expired.', 401);
        }
        errorResponse('Invalid token.', 401);
    }

    $db = getDB();
    $stmt = $db->prepare("SELECT id, name, email, country, role, createdAt FROM User WHERE id = ?");
    $stmt->bind_param('i', $decoded['id']);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        errorResponse('Token is invalid. User not found.', 401);
    }

    $user = $result->fetch_assoc();
    $stmt->close();
    return $user;
}

/**
 * Require the authenticated user to be an ADMIN.
 * Must be called after authenticate().
 */
function requireAdmin($user)
{
    if (empty($user)) {
        errorResponse('Authentication required.', 401);
    }
    if ($user['role'] !== 'ADMIN') {
        errorResponse('Access denied. Admin privileges required.', 403);
    }
}