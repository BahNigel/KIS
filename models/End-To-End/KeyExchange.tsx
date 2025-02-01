import nacl from 'tweetnacl';
import naclutil from 'tweetnacl-util';

export async function performKeyExchange(
  senderPrivateKey: string,
  receiverPublicKey: string
): Promise<string> {
  const senderPrivateKeyDecoded = naclutil.decodeBase64(senderPrivateKey);
  const receiverPublicKeyDecoded = naclutil.decodeBase64(receiverPublicKey);

  const sharedKey = nacl.box.before(receiverPublicKeyDecoded, senderPrivateKeyDecoded);
  return naclutil.encodeBase64(sharedKey);
}
