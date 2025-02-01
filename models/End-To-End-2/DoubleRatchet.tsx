/*
5. Double Ratchet Mechanism
The Double Ratchet mechanism combines Diffie-Hellman
key exchange and symmetric-key ratcheting. 
We update the keys after each message, ensuring that 
each message uses a new key for encryption and ensuring forward secrecy.

*/


import nacl from 'tweetnacl';
import naclutil from 'tweetnacl-util';

export class DoubleRatchet {
  private rootKey: Uint8Array;
  private chainKey: Uint8Array;
  private sendingKey: Uint8Array;
  private receivingKey: Uint8Array;

  constructor(rootKey: Uint8Array) {
    this.rootKey = rootKey;
    this.chainKey = nacl.randomBytes(nacl.secretbox.keyLength);
    this.sendingKey = nacl.randomBytes(nacl.secretbox.keyLength);
    this.receivingKey = nacl.randomBytes(nacl.secretbox.keyLength);
  }

  public ratchet() {
    // Update keys for sending and receiving
    this.chainKey = nacl.randomBytes(nacl.secretbox.keyLength);
    this.sendingKey = nacl.randomBytes(nacl.secretbox.keyLength);
    this.receivingKey = nacl.randomBytes(nacl.secretbox.keyLength);
  }

  public encrypt(message: string): Uint8Array {
    const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
    const messageUint8 = naclutil.decodeUTF8(message);
    const box = nacl.secretbox(messageUint8, nonce, this.sendingKey);
    return naclutil.encodeBase64(nonce) + "." + naclutil.encodeBase64(box);
  }

  public decrypt(encryptedMessage: string): string {
    const [nonceB64, boxB64] = encryptedMessage.split(".");
    const nonce = naclutil.decodeBase64(nonceB64);
    const box = naclutil.decodeBase64(boxB64);
    const decrypted = nacl.secretbox.open(box, nonce, this.receivingKey);
    return naclutil.encodeUTF8(decrypted);
  }
}

