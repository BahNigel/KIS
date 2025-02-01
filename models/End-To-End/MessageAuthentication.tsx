import nacl from 'tweetnacl';
import naclutil from 'tweetnacl-util';

export function signMessage(privateKey: string, message: string): string {
  const privateKeyDecoded = naclutil.decodeBase64(privateKey);
  const messageEncoded = naclutil.decodeUTF8(message);
  const signature = nacl.sign.detached(messageEncoded, privateKeyDecoded);
  return naclutil.encodeBase64(signature);
}

export function verifyMessage(publicKey: string, message: string, signature: string): boolean {
  const publicKeyDecoded = naclutil.decodeBase64(publicKey);
  const messageEncoded = naclutil.decodeUTF8(message);
  const signatureDecoded = naclutil.decodeBase64(signature);
  return nacl.sign.detached.verify(messageEncoded, signatureDecoded, publicKeyDecoded);
}
