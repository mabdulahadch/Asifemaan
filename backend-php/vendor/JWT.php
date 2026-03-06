<?php
/**
 * Minimal JWT implementation (HS256 only).
 * No external dependencies required.
 */
class JWT
{
    /**
     * Encode a payload into a JWT string.
     */
    public static function encode($payload, $secret)
    {
        $header = self::base64UrlEncode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
        $payload = self::base64UrlEncode(json_encode($payload));
        $signature = self::base64UrlEncode(
            hash_hmac('sha256', "$header.$payload", $secret, true)
        );
        return "$header.$payload.$signature";
    }

    /**
     * Decode and verify a JWT string. Returns the payload as an associative array.
     * Throws Exception on invalid/expired token.
     */
    public static function decode($token, $secret)
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            throw new Exception('Invalid token structure');
        }

        list($header64, $payload64, $signature64) = $parts;

        // Verify signature
        $expectedSig = self::base64UrlEncode(
            hash_hmac('sha256', "$header64.$payload64", $secret, true)
        );

        if (!hash_equals($expectedSig, $signature64)) {
            throw new Exception('Invalid token signature');
        }

        $payload = json_decode(self::base64UrlDecode($payload64), true);
        if ($payload === null) {
            throw new Exception('Invalid token payload');
        }

        // Check expiration
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            throw new Exception('Token has expired');
        }

        return $payload;
    }

    private static function base64UrlEncode($data)
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode($data)
    {
        return base64_decode(strtr($data, '-_', '+/'));
    }
}