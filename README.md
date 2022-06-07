# ur-registry-xtz

This repository defines [UR Types](https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-006-urtypes.md) based on [TZIP-25](https://gitlab.com/tezos/tzip/-/merge_requests/174)

The project is still in an early stage, there may still be breaking changes.

## Introduction

This library allows internet connected wallets to connect to offline signers via QR codes. One shortcoming of QR codes is that the data they can contain is limited. The BC UR standard solves this by using fountain codes.

Apps that want to adopt this standard need to be able to show "animated" QR codes, as well as be able to scan multiple QR codes in sequence in order to send or receive larger payloads.

## Examples

> Take a look at `example.ts`. You can run it with `npm run example`

> Check the tests for an example for every message type.

This is an example of an animated QR code.

https://user-images.githubusercontent.com/680814/172477732-d5f809e7-4809-49ae-938f-68c6238db292.mov

It contains the following data:

```
{
  requestId: '', // Random UUID
  publicKey: '370ffb098088e67f8284ca4938f8f1eac02c3e2ab150f29adc8a7075a5ce7e63',
  keyType: PublicKeyType.ED25519,
  masterFingerprint: '73c5da0a',
  label: 'Abandon'
}
```

### Reading Public Key

```typescript
const qrData =
  "ur:xtz-public-key/oxaohdcxcfbagrbatdjtwpgmadecswuerezchkfxgaldwdlyctcetksraoahrnoslyjloxwdaxadaafyjladzmspahjlfpinjpflhsjocxdpcxfwjlkpjtiaihnemttbmt";

const decoder = new URRegistryDecoder();

// "Receive" qr data that has been scanned
decoder.receivePart(qrData);

// Check if the data is complete
if (decoder.isComplete() && decoder.isSuccess()) {
  const publicKey = TezosPublicKey.fromCBOR(decoder.resultUR().cbor);

  publicKey.getKeyType();
  publicKey.getPublicKey();
  // ...
} else {
  // Decoding is not complete yet, scan next part and call `decoder.receivePart(qrData);` again.
}
```

### Sharing Public Key

```typescript
const pubKey = new TezosPublicKey({
  publicKey: Buffer.from(
    "190e4b0ed26eec520135c6deb5fd59434989ea811f1ccfc30205bea7816fa4ea",
    "hex"
  ),
  keyType: PublicKeyType.ED25519,
  masterFingerprint: Buffer.from("6f01ffc8", "hex"),
  label: "Test",
});

// Set size to something where QR codes are easily readable by scanners. This value is very low to simulate larger payloads.
const qrSize = 10;

const encoded = pubKey.toUREncoder(qrSize);

for (let x = 0; x < encoded.fragmentsLength * 2; x++) {
  console.log(encoded.nextPart().toUpperCase());
  // Show all those strings as QR codes
  // Use ".toUpperCase()" for better QR code encoding
  // Do not "repeat" the QR codes, just keep calling "nextPart". The parts after 5/5 are technically not needed, but it contains parts of the previous QR codes and allows transmission to succeed, even if some QRs are lost.
}
```

This is a demo where an offline device is sharing an account and the online device scans the animated QR code to import the account.

> Note: The structure of the QR code is slightly different compared to this standard, but the behaviour is exactly the same.

https://user-images.githubusercontent.com/680814/172479728-56634a88-3bdb-4aa5-96b9-00f36d98383f.mov

## Installing

To install, run:

```bash
yarn add @airgap/ur-registry-xtz
```

```bash
npm install --save @airgap/ur-registry-xtz
```
