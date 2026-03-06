<?php
/**
 * /api/settings – Site settings endpoints
 *
 * GET /api/settings       – Get site settings
 * PUT /api/settings       – Update site settings (admin, multipart)
 */

require_once __DIR__ . '/../helpers/cors.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/ftp_upload.php';

handleCors();

// Parse sub-path
$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);
$subPath = preg_replace('#^/api/settings/?#', '', $path);
$subPath = trim($subPath, '/');

$method = $_SERVER['REQUEST_METHOD'];

// ─── Routes ─────────────────────────────────────────────
if ($method === 'GET' && $subPath === '') {
    handleGetSettings();
}
elseif ($method === 'PUT' && $subPath === '') {
    $user = authenticate();
    requireAdmin($user);
    handleUpdateSettings();
}
else {
    errorResponse("Route $method /api/settings/$subPath not found.", 404);
}

// ─── Handlers ───────────────────────────────────────────

function handleGetSettings()
{
    $db = getDB();
    $result = $db->query("SELECT * FROM SiteSettings WHERE id = 1");

    if ($result->num_rows === 0) {
        successResponse(new stdClass()); // empty object {}
        return;
    }

    $settings = $result->fetch_assoc();
    successResponse($settings);
}

function handleUpdateSettings()
{
    $db = getDB();

    // For PUT with multipart, PHP doesn't natively populate $_POST or $_FILES.
    // We need to parse the raw input if Content-Type is multipart/form-data.
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';

    if (strpos($contentType, 'multipart/form-data') !== false) {
        // PHP populates $_POST and $_FILES for POST requests with multipart.
        // For PUT, we need to trick PHP or parse manually.
        // Common workaround: use _method override or parse manually.
        // Since the frontend likely sends as POST with _method=PUT, let's handle both.
        // Actually, PHP does populate $_FILES for PUT on some setups.
        // Let's use the parse_raw_multipart approach for maximum compatibility.
        parseRawMultipart();
    }

    $youtubeUrl = $_POST['youtubeUrl'] ?? null;
    $facebookUrl = $_POST['facebookUrl'] ?? null;
    $instagramUrl = $_POST['instagramUrl'] ?? null;
    $linkedinUrl = $_POST['linkedinUrl'] ?? null;
    $twitterUrl = $_POST['twitterUrl'] ?? null;
    $existingBanners = $_POST['existingBanners'] ?? null;

    // Get existing record
    $result = $db->query("SELECT * FROM SiteSettings WHERE id = 1");
    $oldRecord = $result->num_rows > 0 ? $result->fetch_assoc() : [];

    // --- Banners Logic ---
    $finalBanners = [];
    if (!empty($existingBanners)) {
        $parsed = json_decode($existingBanners, true);
        if (is_array($parsed)) {
            $finalBanners = $parsed;
        }
    }

    if (isset($_FILES['banners'])) {
        $fileCount = is_array($_FILES['banners']['name']) ? count($_FILES['banners']['name']) : 0;
        for ($i = 0; $i < $fileCount; $i++) {
            if ($_FILES['banners']['error'][$i] === UPLOAD_ERR_OK) {
                $url = uploadToSiteGround($_FILES['banners']['tmp_name'][$i], $_FILES['banners']['name'][$i], 'banners');
                $finalBanners[] = $url;
            }
        }
    }

    if (!empty($oldRecord['banners'])) {
        $oldFiles = json_decode($oldRecord['banners'], true);
        if (is_array($oldFiles)) {
            foreach ($oldFiles as $url) {
                if (!in_array($url, $finalBanners)) {
                    deleteFromSiteGround($url);
                }
            }
        }
    }

    $bannersJson = count($finalBanners) > 0 ? json_encode($finalBanners) : null;

    // --- Logo Logic ---
    $logoUrl = $oldRecord['logo'] ?? null;

    // Check if new logo uploaded (parseRawMultipart wraps properties in arrays)
    if (isset($_FILES['logo'])) {
        $logoError = is_array($_FILES['logo']['error']) ? $_FILES['logo']['error'][0] : $_FILES['logo']['error'];
        $logoTmpName = is_array($_FILES['logo']['tmp_name']) ? $_FILES['logo']['tmp_name'][0] : $_FILES['logo']['tmp_name'];
        $logoName = is_array($_FILES['logo']['name']) ? $_FILES['logo']['name'][0] : $_FILES['logo']['name'];

        if ($logoError === UPLOAD_ERR_OK) {
            // Delete old logo
            if ($logoUrl) {
                deleteFromSiteGround($logoUrl);
            }
            $logoUrl = uploadToSiteGround($logoTmpName, $logoName, 'banners');
        }
    }

    if (empty($oldRecord)) {
        // Insert
        $stmt = $db->prepare(
            "INSERT INTO SiteSettings (id, logo, youtubeUrl, facebookUrl, instagramUrl, linkedinUrl, twitterUrl, banners) VALUES (1, ?, ?, ?, ?, ?, ?, ?)"
        );
        $stmt->bind_param('sssssss', $logoUrl, $youtubeUrl, $facebookUrl, $instagramUrl, $linkedinUrl, $twitterUrl, $bannersJson);
        $stmt->execute();
        $stmt->close();
    }
    else {
        // Update
        $stmt = $db->prepare(
            "UPDATE SiteSettings SET logo = ?, youtubeUrl = ?, facebookUrl = ?, instagramUrl = ?, linkedinUrl = ?, twitterUrl = ?, banners = ? WHERE id = 1"
        );
        $stmt->bind_param('sssssss', $logoUrl, $youtubeUrl, $facebookUrl, $instagramUrl, $linkedinUrl, $twitterUrl, $bannersJson);
        $stmt->execute();
        $stmt->close();
    }

    $result = $db->query("SELECT * FROM SiteSettings WHERE id = 1");
    $updated = $result->fetch_assoc();

    successResponse($updated, 'Settings updated successfully');
}

/**
 * Parse raw multipart/form-data for PUT requests.
 * PHP only auto-populates $_POST and $_FILES for POST method.
 * This function manually parses the raw input for PUT requests.
 */
function parseRawMultipart()
{
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';

    // Extract boundary
    if (!preg_match('/boundary=(.+)$/i', $contentType, $matches))
        return;
    $boundary = $matches[1];

    $rawData = file_get_contents('php://input');
    if (empty($rawData))
        return;

    $parts = preg_split('/-+' . preg_quote($boundary, '/') . '/', $rawData);
    array_pop($parts); // Remove last empty part

    foreach ($parts as $part) {
        if (empty(trim($part)))
            continue;

        // Split headers from body
        $splitPos = strpos($part, "\r\n\r\n");
        if ($splitPos === false)
            continue;

        $rawHeaders = substr($part, 0, $splitPos);
        $body = substr($part, $splitPos + 4);
        // Remove trailing \r\n
        $body = rtrim($body, "\r\n");

        // Parse Content-Disposition
        if (!preg_match('/name="([^"]+)"/', $rawHeaders, $nameMatch))
            continue;
        $fieldName = $nameMatch[1];

        // Check if it's a file
        if (preg_match('/filename="([^"]*)"/', $rawHeaders, $fileMatch)) {
            $fileName = $fileMatch[0] !== '' ? $fileMatch[1] : '';
            if (empty($fileName))
                continue;

            // Save to temp file
            $tmpFile = tempnam(sys_get_temp_dir(), 'php_put_');
            file_put_contents($tmpFile, $body);

            // Detect MIME type
            $mimeType = 'application/octet-stream';
            if (preg_match('/Content-Type:\s*(.+)/i', $rawHeaders, $ctMatch)) {
                $mimeType = trim($ctMatch[1]);
            }

            // Handle array fields like "banners" -> banners[]
            $cleanName = rtrim($fieldName, '[]');

            if (!isset($_FILES[$cleanName])) {
                $_FILES[$cleanName] = [
                    'name' => [],
                    'type' => [],
                    'tmp_name' => [],
                    'error' => [],
                    'size' => [],
                ];
            }
            $_FILES[$cleanName]['name'][] = $fileName;
            $_FILES[$cleanName]['type'][] = $mimeType;
            $_FILES[$cleanName]['tmp_name'][] = $tmpFile;
            $_FILES[$cleanName]['error'][] = UPLOAD_ERR_OK;
            $_FILES[$cleanName]['size'][] = strlen($body);
        }
        else {
            // Regular form field
            $_POST[$fieldName] = $body;
        }
    }
}