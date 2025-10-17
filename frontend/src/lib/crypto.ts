export async function importPublicKey(pemKey: string): Promise<CryptoKey> {
  const pemContents = pemKey
    .replace('-----BEGIN PUBLIC KEY-----', '')
    .replace('-----END PUBLIC KEY-----', '')
    .replace(/\s/g, '');

  const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));

  return await crypto.subtle.importKey(
    'spki',
    binaryDer,
    { name: 'RSA-PSS', hash: 'SHA-256' },
    false,
    ['verify']
  );
}

export async function verifySignature(
  publicKey: CryptoKey,
  emailHash: string,
  signatureBase64: string
): Promise<boolean> {
  try {
    const signature = Uint8Array.from(atob(signatureBase64), (c) => c.charCodeAt(0));
    const data = new TextEncoder().encode(emailHash);
    return await crypto.subtle.verify(
      { name: 'RSA-PSS', saltLength: 32 },
      publicKey,
      signature,
      data
    );
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
}
