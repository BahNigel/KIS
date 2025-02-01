/*
3. Message Encryption and Decryption (AES-256-CTR)
We will use AES-256-CTR for encrypting and decrypting the messages.
AES-CTR is efficient and secure for encrypting messages.

*/
import { DoubleRatchet } from './DoubleRatchet';

export class MessageEncryption {
  private doubleRatchet: DoubleRatchet;

  constructor(rootKey: Uint8Array) {
    this.doubleRatchet = new DoubleRatchet(rootKey);
  }

  public sendMessage(message: string): string {
    this.doubleRatchet.ratchet();
    return this.doubleRatchet.encrypt(message);
  }

  public receiveMessage(encryptedMessage: string): string {
    return this.doubleRatchet.decrypt(encryptedMessage);
  }
}
