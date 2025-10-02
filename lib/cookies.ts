/**
 * @fileoverview Cookie utilities for managing authentication tokens
 * Cung cấp các hàm tiện ích để quản lý cookies với mã hóa/giải mã
 * @version 2.0.0
 * @since 2025-10-02
 * @author Dũng Đàm
 */

/**
 * Secret key dùng để mã hóa cookies
 * Trong production nên lưu trong environment variable
 */
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_COOKIE_SECRET || 'VNA-Secret-Key-2025';

/**
 * Mã hóa chuỗi sử dụng XOR cipher với key
 * @param text - Chuỗi cần mã hóa
 * @returns Chuỗi đã được mã hóa và encode base64
 */
function encrypt(text: string): string {
  try {
    const textBytes = new TextEncoder().encode(text);
    const keyBytes = new TextEncoder().encode(ENCRYPTION_KEY);
    const encrypted = new Uint8Array(textBytes.length);
    
    for (let i = 0; i < textBytes.length; i++) {
      encrypted[i] = textBytes[i] ^ keyBytes[i % keyBytes.length];
    }
    
    return btoa(String.fromCharCode(...encrypted));
  } catch (error) {
    console.error('Encryption error:', error);
    return btoa(text); // Fallback to simple base64
  }
}

/**
 * Giải mã chuỗi đã được mã hóa
 * @param encryptedText - Chuỗi đã mã hóa (base64)
 * @returns Chuỗi gốc sau khi giải mã
 */
function decrypt(encryptedText: string): string {
  try {
    const encryptedBytes = Uint8Array.from(atob(encryptedText), c => c.charCodeAt(0));
    const keyBytes = new TextEncoder().encode(ENCRYPTION_KEY);
    const decrypted = new Uint8Array(encryptedBytes.length);
    
    for (let i = 0; i < encryptedBytes.length; i++) {
      decrypted[i] = encryptedBytes[i] ^ keyBytes[i % keyBytes.length];
    }
    
    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    try {
      return atob(encryptedText); // Fallback to simple base64 decode
    } catch {
      return encryptedText;
    }
  }
}

/**
 * Lưu cookie với giá trị đã được mã hóa
 * @param name - Tên cookie
 * @param value - Giá trị cần lưu
 * @param days - Số ngày hết hạn (mặc định: 7 ngày)
 */
export function setCookie(name: string, value: string, days: number = 7): void {
  if (typeof window === 'undefined') return;
  
  const encryptedValue = encrypt(value);
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  const expiresStr = `expires=${expires.toUTCString()}`;
  
  document.cookie = `${name}=${encodeURIComponent(encryptedValue)};${expiresStr};path=/;SameSite=Lax`;
}

/**
 * Lấy và giải mã giá trị cookie
 * @param name - Tên cookie cần lấy
 * @returns Giá trị đã giải mã hoặc null nếu không tìm thấy
 */
export function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null;
  
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      const encryptedValue = decodeURIComponent(c.substring(nameEQ.length, c.length));
      return decrypt(encryptedValue);
    }
  }
  return null;
}

/**
 * Xóa cookie theo tên
 * @param name - Tên cookie cần xóa
 */
export function deleteCookie(name: string): void {
  if (typeof window === 'undefined') return;
  
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

/**
 * Kiểm tra cookie có tồn tại không
 * @param name - Tên cookie cần kiểm tra
 * @returns true nếu cookie tồn tại, false nếu không
 */
export function hasCookie(name: string): boolean {
  return getCookie(name) !== null;
}

