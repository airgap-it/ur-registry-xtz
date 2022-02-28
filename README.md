# ur-registry-xtz

This repository defines [UR Types](https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-006-urtypes.md) based on [TZIP-25](https://gitlab.com/tezos/tzip/-/merge_requests/174)

The project is still in an early stage, there may still be breaking changes.

## Introduction

This library allows internet connected wallets to connect to offline signers via QR codes. One shortcoming of QR codes is that the data they can contain is limited. The BC UR standard solves this by using fountain codes.

Apps that want to adopt this standard need to be able to show "animated" QR codes, as well as be able to scan multiple QR codes in sequence in order to send or receive larger payloads.

## Examples

> Take a look at `example.ts`. You can run it with `npm run example`

### Reading Public Key

```typescript
// Read part
const qrData =
  "ur:xtz-public-key/oxaohdcxcfbagrbatdjtwpgmadecswuerezchkfxgaldwdlyctcetksraoahrnoslyjloxwdaxadaafyjladzmspahjlfpinjpflhsjocxdpcxfwjlkpjtiaihnemttbmt";

const decoder = new URRegistryDecoder();

decoder.receivePart(qrData);

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
// Read part
const pubKey = new TezosPublicKey({
  publicKey: Buffer.from(
    "190e4b0ed26eec520135c6deb5fd59434989ea811f1ccfc30205bea7816fa4ea",
    "hex"
  ),
  keyType: PublicKeyType.ED25519,
  masterFingerprint: Buffer.from("6f01ffc8", "hex"),
  label: "Test",
});

const qrSize = 10;

const encoded = pubKey.toUREncoder(qrSize);

for (let x = 0; x < encoded.fragmentsLength * 2; x++) {
  console.log(encoded.nextPart().toUpperCase());
  // Show all those strings as QR codes
  // Use ".toUpperCase()" for better QR code encoding
  // Do not "repeat" the QR codes, just keep calling "nextPart". The parts after 5/5 are technically not needed, but it contains parts of the previous QR codes and allows transmission to succeed, even if some QRs are lost.
}
```

## Installing

This package is currently not released on NPM because it's still in beta.

To test it, simply copy the files from the `/src` folder into your own project.

<!--
To install, run:

```bash
yarn add @airgap/ur-registry-tezos
```

```bash
npm install --save @airgap/ur-registry-tezos
``` -->
