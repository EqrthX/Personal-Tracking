/**
 * Authentication utilities for JWT token management
 * Handles cookie-based JWT authentication
 * Note: Backend sends JWT as HTTP-Only cookie, not in response body
 */

const JWT_STORAGE_KEY = 'auth_token';

/**
 * Get JWT token from cookie (HTTP-Only)
 * Note: Can't directly read HTTP-Only cookies from JS
 * This function is for manual token if backend sends it
 * @returns JWT token string or null
 */
export function getJWTToken(): string | null {
    try {
        // Try to get from localStorage if manually stored
        return localStorage.getItem(JWT_STORAGE_KEY);
    } catch (error) {
        console.error('Failed to get JWT token:', error);
        return null;
    }
}

/**
 * Save JWT token to localStorage (optional backup)
 * @param token - JWT token from backend
 */
export function saveJWTToken(token: string): void {
    try {
        localStorage.setItem(JWT_STORAGE_KEY, token);
    } catch (error) {
        console.error('Failed to save JWT token:', error);
    }
}

/**
 * Remove JWT token from localStorage
 */
export function removeJWTToken(): void {
    try {
        localStorage.removeItem(JWT_STORAGE_KEY);
    } catch (error) {
        console.error('Failed to remove JWT token:', error);
    }
}

/**
 * Check if user is authenticated
 * For HTTP-Only cookies: browser sends them automatically
 * @returns true if JWT token exists (either in storage or as cookie)
 */
export function isAuthenticated(): boolean {
    return !!getJWTToken();
}

/**
 * Decode JWT token (basic decoding, doesn't verify signature)
 * Note: Cannot decode 'COOKIE_AUTH' flag, it's not a real JWT
 * @param token - JWT token
 * @returns Decoded payload or null
 */
export function decodeJWT(token: string): Record<string, any> | null {
    // Special handling for COOKIE_AUTH flag
    if (token === 'COOKIE_AUTH') {
        return null;  // Not a real JWT, can't decode
    }

    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const payload = parts[1];
        const decoded = JSON.parse(atob(payload));
        return decoded;
    } catch (error) {
        console.error('Failed to decode JWT:', error);
        return null;
    }
}

/**
 * Check if JWT token is expired
 * @param token - JWT token
 * @returns true if token is expired
 */
export function isTokenExpired(token: string): boolean {
    // COOKIE_AUTH flag never expires (browser handles it)
    if (token === 'COOKIE_AUTH') {
        return false;
    }

    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return true;

    // exp is in seconds, convert to milliseconds
    const expirationTime = decoded.exp * 1000;
    return Date.now() >= expirationTime;
}

/**
 * Get Authorization header with JWT token
 * Note: For HTTP-Only cookies, browser auto-includes them
 * This header is optional but can help
 * @returns Authorization header object or empty object
 */
export function getAuthHeader(): Record<string, string> {
    const token = getJWTToken();

    // Special handling for COOKIE_AUTH flag
    if (token === 'COOKIE_AUTH') {
        // Don't add header, browser sends cookie automatically
        return {};
    }

    if (!token) return {};

    return {
        Authorization: `Bearer ${token}`,
    };
}

export function clearAuthData(): void {
    removeJWTToken();
}



