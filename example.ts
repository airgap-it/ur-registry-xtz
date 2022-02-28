import { PublicKeyType, TezosPublicKey } from "./src";
import { URRegistryDecoder } from "@keystonehq/bc-ur-registry";

// Watch-only wallet
// Read Public Key
{
  // Read part
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
}

// Signer
// Share Account
{
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
}
