<?php
/**
 * /api/content – Content CRUD endpoints (with file uploads)
 *
 * GET    /api/content/featured       – Featured content
 * GET    /api/content/poet/:poetId   – Content by poet
 * GET    /api/content/:id            – Single content
 * POST   /api/content                – Create content (admin, multipart)
 * PUT    /api/content/:id            – Update content (admin, multipart)
 * DELETE /api/content/:id            – Delete content (admin)
 */

require_once __DIR__ . '/../helpers/cors.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/ftp_upload.php';

handleCors();

// Parse sub-path: /api/content/poet/5 -> "poet/5"
$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);
$subPath = preg_replace('#^/api/content/?#', '', $path);
$subPath = trim($subPath, '/');
$segments = $subPath !== '' ? explode('/', $subPath) : [];

$method = $_SERVER['REQUEST_METHOD'];

// ─── Routes ─────────────────────────────────────────────
if ($method === 'GET' && $subPath === 'featured') {
    handleGetFeaturedContent();
}
elseif ($method === 'GET' && count($segments) === 2 && $segments[0] === 'poet' && is_numeric($segments[1])) {
    handleGetContentByPoet((int)$segments[1]);
}
elseif ($method === 'GET' && count($segments) === 1 && is_numeric($segments[0])) {
    handleGetContentById((int)$segments[0]);
}
elseif ($method === 'POST' && $subPath === '') {
    $user = authenticate();
    requireAdmin($user);
    handleCreateContent();
}
elseif ($method === 'PUT' && count($segments) === 1 && is_numeric($segments[0])) {
    $user = authenticate();
    requireAdmin($user);
    handleUpdateContent((int)$segments[0]);
}
elseif ($method === 'DELETE' && count($segments) === 1 && is_numeric($segments[0])) {
    $user = authenticate();
    requireAdmin($user);
    handleDeleteContent((int)$segments[0]);
}
else {
    errorResponse("Route $method /api/content/$subPath not found.", 404);
}

// ─── Handlers ───────────────────────────────────────────

function handleGetFeaturedContent()
{
    $db = getDB();
    $result = $db->query(
        "SELECT c.*, p.penName, p.realName 
         FROM Content c 
         JOIN Poet p ON c.poetId = p.id 
         WHERE c.isFeatured = 1 
         ORDER BY c.createdAt DESC 
         LIMIT 20"
    );
    $rows = [];
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    successResponse($rows);
}

function handleGetContentByPoet($poetId)
{
    $db = getDB();
    $stmt = $db->prepare("SELECT * FROM Content WHERE poetId = ? ORDER BY type ASC, title ASC");
    $stmt->bind_param('i', $poetId);
    $stmt->execute();
    $result = $stmt->get_result();
    $rows = [];
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    $stmt->close();
    successResponse($rows);
}

function handleGetContentById($id)
{
    $db = getDB();
    $stmt = $db->prepare("SELECT * FROM Content WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        $stmt->close();
        errorResponse('Content not found.', 404);
    }

    $content = $result->fetch_assoc();
    $stmt->close();
    successResponse($content);
}

function handleCreateContent()
{
    $db = getDB();

    // For multipart form data, fields come from $_POST
    $poetId = $_POST['poetId'] ?? '';
    $title = $_POST['title'] ?? '';
    $type = $_POST['type'] ?? '';
    $textContent = $_POST['textContent'] ?? null;
    $youtubeLink = $_POST['youtubeLink'] ?? null;
    $isFeatured = ($_POST['isFeatured'] ?? '0') === '1' ? 1 : 0;

    if (empty($poetId) || empty($title) || empty($type)) {
        errorResponse('poetId, title, and type are required.', 400);
    }

    // Verify poet exists
    $stmt = $db->prepare("SELECT id FROM Poet WHERE id = ?");
    $stmt->bind_param('i', $poetId);
    $stmt->execute();
    if ($stmt->get_result()->num_rows === 0) {
        $stmt->close();
        errorResponse('Poet not found.', 404);
    }
    $stmt->close();

    // Handle PDF file upload
    $pdfFileUrl = null;
    if ($type === 'EBOOK' && isset($_FILES['pdfFile']) && $_FILES['pdfFile']['error'] === UPLOAD_ERR_OK) {
        $pdfFileUrl = uploadToSiteGround($_FILES['pdfFile']['tmp_name'], $_FILES['pdfFile']['name'], 'ebooks');
    }

    // Handle Audio file upload
    $audioFileUrl = null;
    if ($type === 'AUDIO' && isset($_FILES['audioFile']) && $_FILES['audioFile']['error'] === UPLOAD_ERR_OK) {
        $audioFileUrl = uploadToSiteGround($_FILES['audioFile']['tmp_name'], $_FILES['audioFile']['name'], 'audio');
    }

    // Handle Cover Image upload
    $coverImageUrl = null;
    if (isset($_FILES['coverImage']) && $_FILES['coverImage']['error'] === UPLOAD_ERR_OK) {
        $coverImageUrl = uploadToSiteGround($_FILES['coverImage']['tmp_name'], $_FILES['coverImage']['name'], 'covers');
    }

    // Handle Sher Media Files (multiple)
    $mediaFilesUrls = [];
    if ($type === 'SHER' && isset($_FILES['mediaFiles'])) {
        $fileCount = is_array($_FILES['mediaFiles']['name']) ? count($_FILES['mediaFiles']['name']) : 0;
        for ($i = 0; $i < $fileCount; $i++) {
            if ($_FILES['mediaFiles']['error'][$i] === UPLOAD_ERR_OK) {
                $url = uploadToSiteGround($_FILES['mediaFiles']['tmp_name'][$i], $_FILES['mediaFiles']['name'][$i], 'sher_media');
                $mediaFilesUrls[] = $url;
            }
        }
    }

    $mediaFilesJson = count($mediaFilesUrls) > 0 ? json_encode($mediaFilesUrls) : null;

    $stmt = $db->prepare(
        "INSERT INTO Content (poetId, title, type, textContent, pdfFile, youtubeLink, audioFile, coverImage, isFeatured, mediaFiles) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->bind_param(
        'isssssssis',
        $poetId, $title, $type, $textContent, $pdfFileUrl, $youtubeLink, $audioFileUrl, $coverImageUrl, $isFeatured, $mediaFilesJson
    );
    $stmt->execute();
    $contentId = $stmt->insert_id;
    $stmt->close();

    $stmt = $db->prepare("SELECT * FROM Content WHERE id = ?");
    $stmt->bind_param('i', $contentId);
    $stmt->execute();
    $newContent = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    successResponse($newContent, 'Content created successfully.', 201);
}

function handleUpdateContent($id)
{
    $db = getDB();

    // Check exists
    $stmt = $db->prepare("SELECT * FROM Content WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows === 0) {
        $stmt->close();
        errorResponse('Content not found.', 404);
    }
    $oldRecord = $result->fetch_assoc();
    $stmt->close();

    $updates = [];
    $params = [];
    $types = '';

    // Fields from multipart form
    if (isset($_POST['title'])) {
        $updates[] = "title = ?";
        $params[] = $_POST['title'];
        $types .= 's';
    }
    if (isset($_POST['type'])) {
        $updates[] = "type = ?";
        $params[] = $_POST['type'];
        $types .= 's';
    }
    if (isset($_POST['textContent'])) {
        $updates[] = "textContent = ?";
        $params[] = $_POST['textContent'] ?: null;
        $types .= 's';
    }
    if (isset($_POST['youtubeLink'])) {
        $updates[] = "youtubeLink = ?";
        $params[] = $_POST['youtubeLink'] ?: null;
        $types .= 's';
    }
    if (isset($_POST['isFeatured'])) {
        $updates[] = "isFeatured = ?";
        $val = ($_POST['isFeatured'] === '1') ? 1 : 0;
        $params[] = $val;
        $types .= 'i';
    }

    $type = $_POST['type'] ?? $oldRecord['type'];

    // Handle PDF file
    if (isset($_FILES['pdfFile']) && $_FILES['pdfFile']['error'] === UPLOAD_ERR_OK) {
        $pdfFileUrl = uploadToSiteGround($_FILES['pdfFile']['tmp_name'], $_FILES['pdfFile']['name'], 'ebooks');
        $updates[] = "pdfFile = ?";
        $params[] = $pdfFileUrl;
        $types .= 's';
        if (!empty($oldRecord['pdfFile'])) {
            deleteFromSiteGround($oldRecord['pdfFile']);
        }
    }
    elseif (isset($_POST['type']) && $_POST['type'] !== 'EBOOK' && !empty($oldRecord['pdfFile'])) {
        $updates[] = "pdfFile = ?";
        $params[] = null;
        $types .= 's';
        deleteFromSiteGround($oldRecord['pdfFile']);
    }

    // Handle Audio file
    if (isset($_FILES['audioFile']) && $_FILES['audioFile']['error'] === UPLOAD_ERR_OK) {
        $audioFileUrl = uploadToSiteGround($_FILES['audioFile']['tmp_name'], $_FILES['audioFile']['name'], 'audio');
        $updates[] = "audioFile = ?";
        $params[] = $audioFileUrl;
        $types .= 's';
        if (!empty($oldRecord['audioFile'])) {
            deleteFromSiteGround($oldRecord['audioFile']);
        }
    }
    elseif (isset($_POST['type']) && $_POST['type'] !== 'AUDIO' && !empty($oldRecord['audioFile'])) {
        $updates[] = "audioFile = ?";
        $params[] = null;
        $types .= 's';
        deleteFromSiteGround($oldRecord['audioFile']);
    }

    // Handle Cover Image
    if (isset($_FILES['coverImage']) && $_FILES['coverImage']['error'] === UPLOAD_ERR_OK) {
        $coverImageUrl = uploadToSiteGround($_FILES['coverImage']['tmp_name'], $_FILES['coverImage']['name'], 'covers');
        $updates[] = "coverImage = ?";
        $params[] = $coverImageUrl;
        $types .= 's';
        if (!empty($oldRecord['coverImage'])) {
            deleteFromSiteGround($oldRecord['coverImage']);
        }
    }

    // Handle Media Files (Sher)
    if ($oldRecord['type'] === 'SHER' || $type === 'SHER') {
        $finalMediaFiles = [];

        // Parse existing kept media files
        if (isset($_POST['existingMediaFiles'])) {
            $parsed = json_decode($_POST['existingMediaFiles'], true);
            if (is_array($parsed)) {
                $finalMediaFiles = $parsed;
            }
        }

        // Upload new media files
        if (isset($_FILES['mediaFiles'])) {
            $fileCount = is_array($_FILES['mediaFiles']['name']) ? count($_FILES['mediaFiles']['name']) : 0;
            for ($i = 0; $i < $fileCount; $i++) {
                if ($_FILES['mediaFiles']['error'][$i] === UPLOAD_ERR_OK) {
                    $url = uploadToSiteGround($_FILES['mediaFiles']['tmp_name'][$i], $_FILES['mediaFiles']['name'][$i], 'sher_media');
                    $finalMediaFiles[] = $url;
                }
            }
        }

        $updates[] = "mediaFiles = ?";
        $params[] = count($finalMediaFiles) > 0 ? json_encode($finalMediaFiles) : null;
        $types .= 's';

        // Cleanup removed files
        if (!empty($oldRecord['mediaFiles'])) {
            $oldFiles = json_decode($oldRecord['mediaFiles'], true);
            if (is_array($oldFiles)) {
                foreach ($oldFiles as $url) {
                    if (!in_array($url, $finalMediaFiles)) {
                        deleteFromSiteGround($url);
                    }
                }
            }
        }
    }

    if (count($updates) > 0) {
        $params[] = $id;
        $types .= 'i';

        $sql = "UPDATE Content SET " . implode(', ', $updates) . " WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $stmt->close();
    }

    $stmt = $db->prepare("SELECT * FROM Content WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $updated = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    successResponse($updated, 'Content updated successfully.');
}

function handleDeleteContent($id)
{
    $db = getDB();

    $stmt = $db->prepare("SELECT * FROM Content WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows === 0) {
        $stmt->close();
        errorResponse('Content not found.', 404);
    }
    $record = $result->fetch_assoc();
    $stmt->close();

    // Delete associated files from SiteGround
    if (!empty($record['pdfFile'])) {
        deleteFromSiteGround($record['pdfFile']);
    }
    if (!empty($record['audioFile']) && strpos($record['audioFile'], 'http') === 0) {
        deleteFromSiteGround($record['audioFile']);
    }
    if (!empty($record['coverImage'])) {
        deleteFromSiteGround($record['coverImage']);
    }
    if (!empty($record['mediaFiles'])) {
        $mediaFiles = json_decode($record['mediaFiles'], true);
        if (is_array($mediaFiles)) {
            foreach ($mediaFiles as $url) {
                deleteFromSiteGround($url);
            }
        }
    }

    $stmt = $db->prepare("DELETE FROM Content WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $stmt->close();

    successResponse(null, 'Content deleted successfully.');
}