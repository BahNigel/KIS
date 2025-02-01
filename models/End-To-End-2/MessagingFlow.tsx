/*
6. Complete Messaging Flow with Forward Secrecy
This component orchestrates the entire flow of
sending and receiving messages, ensuring encryption, 
authentication, and forward secrecy.
*/

import { keyExchange } from "./KeyExchange";
import { MessageEncryption } from "./MessageEncryption";


async function messagingFlow() {
  const { publicKey: senderPublicKey, privateKey: senderPrivateKey } = await keyExchange();
  const { publicKey: receiverPublicKey, privateKey: receiverPrivateKey } = await keyExchange();

  const sender = new MessageEncryption(senderPrivateKey);
  const receiver = new MessageEncryption(receiverPrivateKey);

  const messageToSend = "Hello, secure world!";
  const encryptedMessage = sender.sendMessage(messageToSend);
  console.log("Encrypted Message:", encryptedMessage);

  const decryptedMessage = receiver.receiveMessage(encryptedMessage);
  console.log("Decrypted Message:", decryptedMessage);
}

messagingFlow();
