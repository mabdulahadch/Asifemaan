<?php
/**
 * /api/poets – Poet CRUD endpoints
 *
 * GET    /api/poets        – List all poets
 * GET    /api/poets/:id    – Get poet by ID
 * POST   /api/poets        – Create poet (admin)
 * PUT    /api/poets/:id    – Update poet (admin)
 * DELETE /api/poets/:id    – Delete poet (admin)
 */

require_once __DIR__ . '/../helpers/cors.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';

handleCors();

// Parse sub-path: /api/poets/123 -> "123"
$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);
$subPath = preg_replace('#^/api/poets/?#', '', $path);
$subPath = trim($subPath, '/');

$method = $_SERVER['REQUEST_METHOD'];

// ─── Routes ─────────────────────────────────────────────
if ($method === 'GET' && $subPath === '') {
    handleGetAllPoets();
}
elseif ($method === 'GET' && is_numeric($subPath)) {
    handleGetPoetById((int)$subPath);
}
elseif ($method === 'POST' && $subPath === '') {
    $user = authenticate();
    requireAdmin($user);
    handleCreatePoet();
}
elseif ($method === 'PUT' && is_numeric($subPath)) {
    $user = authenticate();
    requireAdmin($user);
    handleUpdatePoet((int)$subPath);
}
elseif ($method === 'DELETE' && is_numeric($subPath)) {
    $user = authenticate();
    requireAdmin($user);
    handleDeletePoet((int)$subPath);
}
else {
    errorResponse("Route $method /api/poets/$subPath not found.", 404);
}

// ─── Handlers ───────────────────────────────────────────

function handleGetAllPoets()
{
    $db = getDB();
    $result = $db->query("SELECT * FROM Poet ORDER BY realName ASC");
    $rows = [];
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    successResponse($rows);
}

function handleGetPoetById($id)
{
    $db = getDB();
    $stmt = $db->prepare("SELECT * FROM Poet WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        $stmt->close();
        errorResponse('Poet not found.', 404);
    }

    $poet = $result->fetch_assoc();
    $stmt->close();
    successResponse($poet);
}

function handleCreatePoet()
{
    $input = json_decode(file_get_contents('php://input'), true);
    $realName = $input['realName'] ?? '';
    $penName = $input['penName'] ?? null;
    $dateOfBirth = $input['dateOfBirth'] ?? null;
    $placeOfBirth = $input['placeOfBirth'] ?? null;
    $profilePicture = $input['profilePicture'] ?? null;
    $bio = $input['bio'] ?? null;

    if (empty($realName)) {
        errorResponse('realName is required.', 400);
    }

    $db = getDB();
    $stmt = $db->prepare(
        "INSERT INTO Poet (realName, penName, dateOfBirth, placeOfBirth, profilePicture, bio) VALUES (?, ?, ?, ?, ?, ?)"
    );
    $stmt->bind_param('ssssss', $realName, $penName, $dateOfBirth, $placeOfBirth, $profilePicture, $bio);
    $stmt->execute();
    $poetId = $stmt->insert_id;
    $stmt->close();

    $stmt = $db->prepare("SELECT * FROM Poet WHERE id = ?");
    $stmt->bind_param('i', $poetId);
    $stmt->execute();
    $newPoet = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    successResponse($newPoet, 'Poet created successfully.', 201);
}

function handleUpdatePoet($id)
{
    $db = getDB();

    // Check exists
    $stmt = $db->prepare("SELECT id FROM Poet WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    if ($stmt->get_result()->num_rows === 0) {
        $stmt->close();
        errorResponse('Poet not found.', 404);
    }
    $stmt->close();

    $input = json_decode(file_get_contents('php://input'), true);
    $realName = $input['realName'] ?? '';
    $penName = $input['penName'] ?? null;
    $dateOfBirth = $input['dateOfBirth'] ?? null;
    $placeOfBirth = $input['placeOfBirth'] ?? null;
    $profilePicture = $input['profilePicture'] ?? null;
    $bio = $input['bio'] ?? null;

    $stmt = $db->prepare(
        "UPDATE Poet SET realName = ?, penName = ?, dateOfBirth = ?, placeOfBirth = ?, profilePicture = ?, bio = ? WHERE id = ?"
    );
    $stmt->bind_param('ssssssi', $realName, $penName, $dateOfBirth, $placeOfBirth, $profilePicture, $bio, $id);
    $stmt->execute();
    $stmt->close();

    $stmt = $db->prepare("SELECT * FROM Poet WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $updated = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    successResponse($updated, 'Poet updated successfully.');
}

function handleDeletePoet($id)
{
    $db = getDB();

    $stmt = $db->prepare("SELECT id FROM Poet WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    if ($stmt->get_result()->num_rows === 0) {
        $stmt->close();
        errorResponse('Poet not found.', 404);
    }
    $stmt->close();

    $stmt = $db->prepare("DELETE FROM Poet WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $stmt->close();

    successResponse(null, 'Poet deleted successfully.');
}