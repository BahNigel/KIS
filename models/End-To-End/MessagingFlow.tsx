
import { DoubleRatchet } from './DoubleRatchet';
import { performKeyExchange } from './KeyExchange';
import { generateKeyPair } from './keygenerate';
import naclutil from 'tweetnacl-util';
import { decryptMessage, encryptMessage } from './MessageEncryption';

export async function initializeMessaging() {
  const senderKeys = await generateKeyPair();
  const receiverKeys = await generateKeyPair();

  console.log('Sender Keys:', senderKeys);
  console.log('Receiver Keys:', receiverKeys);

  // Key exchange phase
  const sharedKeySender = await performKeyExchange(
    senderKeys.privateKey,
    receiverKeys.publicKey
  );

  console.log('Shared Key (Sender):', sharedKeySender);

  const doubleRatchetSender = new DoubleRatchet(
    naclutil.decodeBase64(senderKeys.publicKey),
    naclutil.decodeBase64(senderKeys.privateKey)
  );

  const doubleRatchetReceiver = new DoubleRatchet(
    naclutil.decodeBase64(receiverKeys.publicKey),
    naclutil.decodeBase64(receiverKeys.privateKey)
  );

  await doubleRatchetSender.initialize(receiverKeys.publicKey);
  await doubleRatchetReceiver.initialize(senderKeys.publicKey);

  // Messaging phase
  const originalMessage = 'Hello, secure world!';
  const encryptedMessage = await encryptMessage(
    originalMessage,
    senderKeys.privateKey,
    receiverKeys.publicKey
  );

  console.log('Encrypted Message:', encryptedMessage);

  const decryptedMessage = decryptMessage(
    encryptedMessage,
    receiverKeys.privateKey,
    senderKeys.publicKey
  );

  console.log('Decrypted Message:', decryptedMessage);
}
