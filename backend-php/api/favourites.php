<?php
/**
 * /api/favourites – Favourite content & poet follow endpoints
 *
 * All routes require authentication (Bearer token).
 *
 * GET    /api/favourites/content           – Get favourite contents
 * GET    /api/favourites/content/ids       – Get favourite content IDs
 * POST   /api/favourites/content/:id       – Add favourite
 * DELETE /api/favourites/content/:id       – Remove favourite
 * GET    /api/favourites/poets             – Get followed poets
 * GET    /api/favourites/poets/ids         – Get followed poet IDs
 * POST   /api/favourites/poet/:id          – Follow poet
 * DELETE /api/favourites/poet/:id          – Unfollow poet
 */

require_once __DIR__ . '/../helpers/cors.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';

handleCors();

// All favourites routes require auth
$user = authenticate();

// Parse sub-path: /api/favourites/content/ids -> "content/ids"
$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);
$subPath = preg_replace('#^/api/favourites/?#', '', $path);
$subPath = trim($subPath, '/');
$segments = $subPath !== '' ? explode('/', $subPath) : [];

$method = $_SERVER['REQUEST_METHOD'];

// ─── Routes ─────────────────────────────────────────────

// Content favourites
if ($method === 'GET' && $subPath === 'content') {
    handleGetFavContents($user);
}
elseif ($method === 'GET' && $subPath === 'content/ids') {
    handleGetFavContentIds($user);
}
elseif ($method === 'POST' && count($segments) === 2 && $segments[0] === 'content' && is_numeric($segments[1])) {
    handleAddFavContent($user, (int)$segments[1]);
}
elseif ($method === 'DELETE' && count($segments) === 2 && $segments[0] === 'content' && is_numeric($segments[1])) {
    handleRemoveFavContent($user, (int)$segments[1]);
}
// Poet follows
elseif ($method === 'GET' && $subPath === 'poets') {
    handleGetFollowedPoets($user);
}
elseif ($method === 'GET' && $subPath === 'poets/ids') {
    handleGetFollowedPoetIds($user);
}
elseif ($method === 'POST' && count($segments) === 2 && $segments[0] === 'poet' && is_numeric($segments[1])) {
    handleFollowPoet($user, (int)$segments[1]);
}
elseif ($method === 'DELETE' && count($segments) === 2 && $segments[0] === 'poet' && is_numeric($segments[1])) {
    handleUnfollowPoet($user, (int)$segments[1]);
}
else {
    errorResponse("Route $method /api/favourites/$subPath not found.", 404);
}

// ─── Content Favourite Handlers ─────────────────────────

function handleAddFavContent($user, $contentId)
{
    $db = getDB();
    $stmt = $db->prepare("INSERT IGNORE INTO Favourite_Content (userId, contentId) VALUES (?, ?)");
    $stmt->bind_param('ii', $user['id'], $contentId);
    $stmt->execute();
    $stmt->close();

    successResponse(null, 'Added to favourites.', 201);
}

function handleRemoveFavContent($user, $contentId)
{
    $db = getDB();
    $stmt = $db->prepare("DELETE FROM Favourite_Content WHERE userId = ? AND contentId = ?");
    $stmt->bind_param('ii', $user['id'], $contentId);
    $stmt->execute();
    $stmt->close();

    successResponse(null, 'Removed from favourites.');
}

function handleGetFavContents($user)
{
    $db = getDB();
    $stmt = $db->prepare(
        "SELECT c.*, p.realName AS poetName, p.penName AS poetPenName, p.profilePicture AS poetImage
         FROM Favourite_Content fc
         JOIN Content c ON fc.contentId = c.id
         JOIN Poet p ON c.poetId = p.id
         WHERE fc.userId = ?
         ORDER BY fc.createdAt DESC"
    );
    $stmt->bind_param('i', $user['id']);
    $stmt->execute();
    $result = $stmt->get_result();
    $rows = [];
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    $stmt->close();

    successResponse($rows);
}

function handleGetFavContentIds($user)
{
    $db = getDB();
    $stmt = $db->prepare("SELECT contentId FROM Favourite_Content WHERE userId = ?");
    $stmt->bind_param('i', $user['id']);
    $stmt->execute();
    $result = $stmt->get_result();
    $ids = [];
    while ($row = $result->fetch_assoc()) {
        $ids[] = (int)$row['contentId'];
    }
    $stmt->close();

    successResponse($ids);
}

// ─── Poet Follow Handlers ───────────────────────────────

function handleFollowPoet($user, $poetId)
{
    $db = getDB();
    $stmt = $db->prepare("INSERT IGNORE INTO Favourite_Poet (userId, poetId) VALUES (?, ?)");
    $stmt->bind_param('ii', $user['id'], $poetId);
    $stmt->execute();
    $stmt->close();

    successResponse(null, 'Poet followed.', 201);
}

function handleUnfollowPoet($user, $poetId)
{
    $db = getDB();
    $stmt = $db->prepare("DELETE FROM Favourite_Poet WHERE userId = ? AND poetId = ?");
    $stmt->bind_param('ii', $user['id'], $poetId);
    $stmt->execute();
    $stmt->close();

    successResponse(null, 'Poet unfollowed.');
}

function handleGetFollowedPoets($user)
{
    $db = getDB();
    $stmt = $db->prepare(
        "SELECT p.*
         FROM Favourite_Poet fp
         JOIN Poet p ON fp.poetId = p.id
         WHERE fp.userId = ?
         ORDER BY fp.createdAt DESC"
    );
    $stmt->bind_param('i', $user['id']);
    $stmt->execute();
    $result = $stmt->get_result();
    $rows = [];
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    $stmt->close();

    successResponse($rows);
}

function handleGetFollowedPoetIds($user)
{
    $db = getDB();
    $stmt = $db->prepare("SELECT poetId FROM Favourite_Poet WHERE userId = ?");
    $stmt->bind_param('i', $user['id']);
    $stmt->execute();
    $result = $stmt->get_result();
    $ids = [];
    while ($row = $result->fetch_assoc()) {
        $ids[] = (int)$row['poetId'];
    }
    $stmt->close();

    successResponse($ids);
}