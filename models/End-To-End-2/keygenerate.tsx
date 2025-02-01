import * as Crypto from 'expo-crypto';
import nacl from 'tweetnacl';
import naclutil from 'tweetnacl-util';

export async function generateKeyPair() {
  // Generate a random secret key using expo-crypto
  const secretKey = await Crypto.getRandomBytesAsync(nacl.box.secretKeyLength);
  
  // Generate the key pair using the secret key
  const keyPair = nacl.box.keyPair.fromSecretKey(secretKey);

  // Convert keys to Base64 for easier storage and transmission
  const publicKey = naclutil.encodeBase64(keyPair.publicKey);
  const privateKey = naclutil.encodeBase64(secretKey); // Use the original secret key

  return { publicKey, privateKey };
}


/*
DoubleRatchet.tsx
keyExchange.tsx
messageAuthentication.tsx
messageEncription.tsx
messagingFlow.tsx

*/