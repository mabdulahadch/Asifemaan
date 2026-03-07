<?php
require_once __DIR__ . '/../helpers/env.php';

/**
 * Uploads a file to SiteGround via FTP (SSL).
 *
 * @param string $tmpPath   Local temporary file path (from $_FILES['tmp_name'])
 * @param string $originalName  Original filename
 * @param string $folder    Target subfolder inside /uploads/ (e.g. "ebooks", "audio", "covers")
 * @return string  The public URL of the uploaded file
 */
function uploadToSiteGround($tmpPath, $originalName, $folder = 'ebooks')
{
    // $host = getenv('FTP_HOST');
    // $user = getenv('FTP_USER');
    // $password = getenv('FTP_PASSWORD');
    // $port = (int)(getenv('FTP_PORT') ?: 21);
    // $baseUrl = getenv('SITE_BASE_URL') ?: 'https://asifemaan.com';

    $host = 'ftp.asifemaan.com';
    $user = 'ftp_pdf@asifemaan.com';
    $password = '1?s@2c3mR1@6';
    $port = 21;
    $baseUrl = 'https://asifemaan.com';

    // Connect via FTP SSL
    $conn = ftp_ssl_connect($host, $port);
    if (!$conn) {
        throw new Exception("FTP connection failed to $host:$port");
    }

    if (!ftp_login($conn, $user, $password)) {
        ftp_close($conn);
        throw new Exception("FTP login failed for user $user");
    }

    ftp_pasv($conn, true);

    // Generate unique filename
    $sanitized = preg_replace('/[^a-zA-Z0-9._-]/', '_', strtolower($originalName));
    $uniqueName = time() . '-' . $sanitized;

    $remotePath = "/asifemaan.com/public_html/uploads/$folder";

    // Ensure directory exists
    @ftp_mkdir($conn, $remotePath);

    $remoteFile = "$remotePath/$uniqueName";

    if (!ftp_put($conn, $remoteFile, $tmpPath, FTP_BINARY)) {
        ftp_close($conn);
        throw new Exception("FTP upload failed for $remoteFile");
    }

    ftp_close($conn);

    $publicUrl = "$baseUrl/uploads/$folder/$uniqueName";
    return $publicUrl;
}

/**
 * Uploads a file from a buffer string to SiteGround via FTP.
 * Writes to a temp file first, then uploads.
 *
 * @param string $buffer    File contents as a string
 * @param string $originalName  Original filename
 * @param string $folder    Target subfolder
 * @return string  The public URL
 */
function uploadBufferToSiteGround($buffer, $originalName, $folder = 'ebooks')
{
    $tmpFile = tempnam(sys_get_temp_dir(), 'ftp_');
    file_put_contents($tmpFile, $buffer);
    try {
        $url = uploadToSiteGround($tmpFile, $originalName, $folder);
    }
    finally {
        @unlink($tmpFile);
    }
    return $url;
}

/**
 * Deletes a file from SiteGround via FTP.
 *
 * @param string $publicUrl  The full public URL of the file to delete
 */
function deleteFromSiteGround($publicUrl)
{
    if (empty($publicUrl) || strpos($publicUrl, '/uploads/') === false)
        return;

    $host = getenv('FTP_HOST');
    $user = getenv('FTP_USER');
    $password = getenv('FTP_PASSWORD');
    $port = (int)(getenv('FTP_PORT') ?: 21);

    $conn = ftp_ssl_connect($host, $port);
    if (!$conn)
        return;

    if (!ftp_login($conn, $user, $password)) {
        ftp_close($conn);
        return;
    }

    ftp_pasv($conn, true);

    // Extract path from URL: e.g. /uploads/ebooks/filename.pdf
    $urlPath = parse_url($publicUrl, PHP_URL_PATH);
    $remotePath = "/asifemaan.com/public_html" . $urlPath;

    @ftp_delete($conn, $remotePath);
    ftp_close($conn);
}