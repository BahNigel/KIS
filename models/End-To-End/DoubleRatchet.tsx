import nacl from 'tweetnacl';
import naclutil from 'tweetnacl-util';
import * as Crypto from 'expo-crypto';

export class DoubleRatchet {
  publicKey: Uint8Array;
  privateKey: Uint8Array;
  sharedKey: Uint8Array;

  constructor(publicKey: Uint8Array, privateKey: Uint8Array) {
    this.publicKey = publicKey;
    this.privateKey = privateKey;
    this.sharedKey = new Uint8Array(nacl.box.sharedKeyLength);
  }

  async initialize(peerPublicKey: string) {
    const decodedPeerKey = naclutil.decodeBase64(peerPublicKey);
    this.sharedKey = nacl.box.before(decodedPeerKey, this.privateKey);
  }

  async encrypt(message: string): Promise<string> {
    const nonce = await Crypto.getRandomBytesAsync(nacl.box.nonceLength);
    const encodedMessage = naclutil.decodeUTF8(message);
    const encryptedMessage = nacl.secretbox(encodedMessage, nonce, this.sharedKey);
    return JSON.stringify({
      nonce: naclutil.encodeBase64(nonce),
      message: naclutil.encodeBase64(encryptedMessage),
    });
  }

  decrypt(ciphertext: string): string | null {
    const { nonce, message } = JSON.parse(ciphertext);
    const decodedNonce = naclutil.decodeBase64(nonce);
    const decodedMessage = naclutil.decodeBase64(message);
    const decrypted = nacl.secretbox.open(decodedMessage, decodedNonce, this.sharedKey);
    return decrypted ? naclutil.encodeUTF8(decrypted) : null;
  }
}
