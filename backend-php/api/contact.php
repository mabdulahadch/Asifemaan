<?php
/**
 * /api/contact.php – Endpoint to handle "Write to us" form submissions.
 *
 * POST /api/contact
 */

require_once __DIR__ . '/../helpers/cors.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/env.php';

handleCors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    errorResponse("Method not allowed", 405);
}

$input = json_decode(file_get_contents('php://input'), true);
$name = $input['name'] ?? '';
$email = $input['email'] ?? '';
$country = $input['country'] ?? '';
$message = $input['message'] ?? '';

if (empty($name) || empty($email) || empty($message)) {
    errorResponse('Name, email, and message are required.', 400);
}

// Prepare email headers
$to = 'asifemaan@gmail.com'; // Replace with the actual receiving email address
$subject = "New Contact Form Submission from $name";
$headers = "From: no-reply@asifemaan.com\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

// HTML email body
$body = "
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    table { border-collapse: collapse; width: 100%; max-width: 600px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
  </style>
</head>
<body>
  <h2>New Contact Submission</h2>
  <table>
    <tr><th>Name</th><td>" . htmlspecialchars($name) . "</td></tr>
    <tr><th>Email</th><td>" . htmlspecialchars($email) . "</td></tr>
    <tr><th>Country</th><td>" . htmlspecialchars($country) . "</td></tr>
    <tr><th>Message</th><td>" . nl2br(htmlspecialchars($message)) . "</td></tr>
  </table>
</body>
</html>
";

// Send email using PHP's built-in mail() function
// NOTE: For environments where mail() isn't configured, consider using PHPMailer
$success = mail($to, $subject, $body, $headers);

if ($success) {
    successResponse(null, 'Your message has been sent successfully.', 200);
}
else {
    // If mail fails, we log it and return an error.
    errorResponse('Failed to send message. Please try again later.', 500);
}