const textEncoder = new TextEncoder();

/**
 * 生成随机盐值（hex）
 */
export function generateSalt(length = 16) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return [...array].map((value) => value.toString(16).padStart(2, '0')).join('');
}

/**
 * 使用 PBKDF2 + SHA-256 生成 hash
 */
export async function hashPassword(password, salt, iterations = 100_000) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: textEncoder.encode(salt),
      iterations,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );

  return [...new Uint8Array(derivedBits)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifyPassword(inputPassword, storedSalt, storedHash) {
  const inputHash = await hashPassword(inputPassword, storedSalt);
  return inputHash === storedHash;
}

