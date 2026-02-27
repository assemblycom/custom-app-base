import crypto from 'crypto';

/**
 * Derives a 16-byte AES-128 key from an API key.
 *
 * Algorithm (ported from Go's Generate128BitKey):
 *   1. HMAC-SHA256 with apiKey as key and empty string as message
 *   2. Hex-encode the digest
 *   3. Take the first 32 hex characters (= 16 bytes)
 *   4. Decode those 32 hex characters into a 16-byte Buffer
 */
export function deriveKey(apiKey: string): Buffer {
  const hmac = crypto.createHmac('sha256', apiKey).digest('hex');
  return Buffer.from(hmac.slice(0, 32), 'hex');
}

/**
 * PKCS7-pads data to the given block size.
 */
function pkcs7Pad(data: Buffer, blockSize: number): Buffer {
  const padLen = blockSize - (data.length % blockSize);
  const padding = Buffer.alloc(padLen, padLen);
  return Buffer.concat([data, padding]);
}

/**
 * Encrypts a token payload using AES-128-CBC.
 *
 * Algorithm (ported from Go's EncryptAES128BitToken):
 *   1. Derive key from API key
 *   2. Generate random 16-byte IV
 *   3. PKCS7-pad the JSON plaintext
 *   4. AES-128-CBC encrypt
 *   5. Return hex(IV) + hex(ciphertext)
 */
export function encryptToken(apiKey: string, payload: object): string {
  const key = deriveKey(apiKey);
  const iv = crypto.randomBytes(16);
  const plaintext = Buffer.from(JSON.stringify(payload), 'utf-8');
  const padded = pkcs7Pad(plaintext, 16);

  const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
  cipher.setAutoPadding(false); // we handle PKCS7 ourselves
  const encrypted = Buffer.concat([cipher.update(padded), cipher.final()]);

  return iv.toString('hex') + encrypted.toString('hex');
}
