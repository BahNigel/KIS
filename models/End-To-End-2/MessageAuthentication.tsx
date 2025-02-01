/*
4. Message Authentication (HMAC-SHA256)
To ensure message integrity and authenticity, we will use HMAC-SHA256 for message authentication.
*/

import nacl from 'tweetnacl';
import naclutil from 'tweetnacl-util';

export function authenticateMessage(message: string, privateKey: Uint8Array) {
  const messageUint8 = naclutil.decodeUTF8(message);
  const signature = nacl.sign.detached(messageUint8, privateKey);
  return naclutil.encodeBase64(signature);
}

export function verifyMessage(message: string, signature: string, publicKey: Uint8Array) {
  const messageUint8 = naclutil.decodeUTF8(message);
  const signatureUint8 = naclutil.decodeBase64(signature);
  return nacl.sign.detached.verify(messageUint8, signatureUint8, publicKey);
}

