<?php
/**
 * /api/auth – Authentication endpoints
 *
 * POST /api/auth/register  – Register a new user
 * POST /api/auth/login     – Login and get JWT
 * GET  /api/auth/profile   – Get current user profile (auth required)
 */

require_once __DIR__ . '/../helpers/cors.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';

handleCors();

// Parse the sub-path: e.g. /api/auth/login -> "login"
$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);
// Remove /api/auth prefix
$subPath = preg_replace('#^/api/auth/?#', '', $path);
$subPath = trim($subPath, '/');

$method = $_SERVER['REQUEST_METHOD'];

// ─── Routes ─────────────────────────────────────────────
if ($method === 'POST' && $subPath === 'register') {
    handleRegister();
}
elseif ($method === 'POST' && $subPath === 'login') {
    handleLogin();
}
elseif ($method === 'GET' && $subPath === 'profile') {
    handleGetProfile();
}
else {
    errorResponse("Route $method /api/auth/$subPath not found.", 404);
}

// ─── Handlers ───────────────────────────────────────────

function handleRegister()
{
    $input = json_decode(file_get_contents('php://input'), true);
    $name = $input['name'] ?? '';
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    $country = $input['country'] ?? '';

    if (empty($name) || empty($email) || empty($password) || empty($country)) {
        errorResponse('Name, email, password, and country are required.', 400);
    }

    $db = getDB();

    // Check if user exists
    $stmt = $db->prepare("SELECT id FROM User WHERE email = ?");
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $stmt->close();
        errorResponse('User with this email already exists.', 409);
    }
    $stmt->close();

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);

    // Insert user
    $stmt = $db->prepare(
        "INSERT INTO User (name, email, password, country, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, 'USER', NOW(), NOW())"
    );
    $stmt->bind_param('ssss', $name, $email, $hashedPassword, $country);
    $stmt->execute();
    $userId = $stmt->insert_id;
    $stmt->close();

    // Fetch created user
    $stmt = $db->prepare("SELECT id, name, email, country, role, createdAt FROM User WHERE id = ?");
    $stmt->bind_param('i', $userId);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    $token = generateToken($user['id']);

    successResponse(['user' => $user, 'token' => $token], 'User registered successfully.', 201);
}

function handleLogin()
{
    $input = json_decode(file_get_contents('php://input'), true);
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';

    if (empty($email) || empty($password)) {
        errorResponse('Email and password are required.', 400);
    }

    $db = getDB();

    $stmt = $db->prepare("SELECT * FROM User WHERE email = ?");
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        $stmt->close();
        errorResponse('Invalid email or password.', 401);
    }

    $user = $result->fetch_assoc();
    $stmt->close();

    if (!password_verify($password, $user['password'])) {
        errorResponse('Invalid email or password.', 401);
    }

    $token = generateToken($user['id']);

    // Remove password from response
    unset($user['password']);

    successResponse(['user' => $user, 'token' => $token], 'Login successful.', 200);
}

function handleGetProfile()
{
    $user = authenticate();

    $db = getDB();
    $stmt = $db->prepare("SELECT id, name, email, country, role, createdAt, updatedAt FROM User WHERE id = ?");
    $stmt->bind_param('i', $user['id']);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        $stmt->close();
        errorResponse('User not found.', 404);
    }

    $profileUser = $result->fetch_assoc();
    $stmt->close();

    successResponse($profileUser);
}