import nacl from 'tweetnacl';
import naclutil from 'tweetnacl-util';

export async function encryptMessage(
  message: string,
  senderPrivateKey: string,
  receiverPublicKey: string
): Promise<string> {
  const senderPrivateKeyDecoded = naclutil.decodeBase64(senderPrivateKey);
  const receiverPublicKeyDecoded = naclutil.decodeBase64(receiverPublicKey);
  const sharedKey = nacl.box.before(receiverPublicKeyDecoded, senderPrivateKeyDecoded);

  const nonce = nacl.randomBytes(nacl.box.nonceLength);
  const messageEncoded = naclutil.decodeUTF8(message);
  const encryptedMessage = nacl.secretbox(messageEncoded, nonce, sharedKey);

  return JSON.stringify({
    nonce: naclutil.encodeBase64(nonce),
    message: naclutil.encodeBase64(encryptedMessage),
  });
}

export function decryptMessage(
  encryptedData: string,
  receiverPrivateKey: string,
  senderPublicKey: string
): string | null {
  const { nonce, message } = JSON.parse(encryptedData);
  const receiverPrivateKeyDecoded = naclutil.decodeBase64(receiverPrivateKey);
  const senderPublicKeyDecoded = naclutil.decodeBase64(senderPublicKey);
  const sharedKey = nacl.box.before(senderPublicKeyDecoded, receiverPrivateKeyDecoded);

  const decodedNonce = naclutil.decodeBase64(nonce);
  const decodedMessage = naclutil.decodeBase64(message);
  const decrypted = nacl.secretbox.open(decodedMessage, decodedNonce, sharedKey);

  return decrypted ? naclutil.encodeUTF8(decrypted) : null;
}
