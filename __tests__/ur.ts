/// <reference types="jest" />

import {
  TezosSignature,
  PublicKeyType,
  TezosPublicKey,
  TezosSignRequest,
  DataType,
} from "../src/index";
import { URRegistryDecoder } from "@keystonehq/bc-ur-registry";

describe("Decode", () => {
  test("TezosPublicKey", () => {
    const encoded =
      "ur:xtz-public-key/oxaohdcxcfbagrbatdjtwpgmadecswuerezchkfxgaldwdlyctcetksraoahrnoslyjloxwdaxadaafyjladzmspahjlfpinjpflhsjocxdpcxfwjlkpjtiaihnemttbmt";

    const decoded = URRegistryDecoder.decode(encoded);

    const output = TezosPublicKey.fromCBOR(decoded.cbor);

    expect(output.getRegistryType().getType()).toBe("xtz-public-key");
    expect(output.getRequestId()?.toString()).toBe(undefined);
    expect(output.toCBOR().toString("hex")).toBe(
      "a4025820190e4b0ed26eec520135c6deb5fd59434989ea811f1ccfc30205bea7816fa4ea030104446f01ffc8056f416972476170202d20426f756e6365"
    );

    expect(output.getKeyType()).toBe(PublicKeyType.ED25519);
    expect(output.getLabel()?.toString()).toBe("AirGap - Bounce");
    expect(output.getMasterFingerprint()?.toString("hex")).toBe("6f01ffc8");
    expect(output.getPublicKey()?.toString("hex")).toBe(
      "190e4b0ed26eec520135c6deb5fd59434989ea811f1ccfc30205bea7816fa4ea"
    );
  });

  test("TezosSignature", () => {
    const encoded =
      "ur:xtz-signature/otadtpdafeadcnfeioldaohdfzneqzcnwybdcytetepmecnscpttvdmhfdksnscndebwiyfhtltpoycpeehdaydmpdfyykvskgylkiqdrhmspkgslrkbcnaakeaacxaxvlpraatoptplbacwynzcsgpeasaxhdhddyzejnvscwrddljoweaxjtioiyprpdknnycmcpmnjojlflcfpmrnfedslkpygrdrjzaelgsgnscamyjefgkgdmrswytymugylfvdjteytasrwtaxsewlmeaalkbdaemhglaeaelgsgnscamyjefgkgdmrswytymugylfvdjteytasraeensgtyve";

    const decoded = URRegistryDecoder.decode(encoded);

    const output = TezosSignature.fromCBOR(decoded.cbor);

    expect(output.getRegistryType().getType()).toBe("xtz-signature");
    expect(output.getRequestId()?.toString("hex")).toBe("0123456789");
    expect(output.toCBOR().toString("hex")).toBe(
      "a301d8254501234567890258409fb423ee0b1ad3d3ad359c22d1e79048789c232813663fd5d8a1223458082ea844f5e87bf77db3b997aa4c847e23047c042003e3b204cea9ae0e1bf6fdcaaf0903585830fe6de81bba2f70ed036e6766b2a87a9a16228e706f4719adbe45268cab4b2a6c008dca9c1d8f6b467b2ebfeed4935182e76e32d9c3f003c1e991048c0b00904e00008dca9c1d8f6b467b2ebfeed4935182e76e32d9c300"
    );

    expect(output.getPayload()?.toString("hex")).toBe(
      "30fe6de81bba2f70ed036e6766b2a87a9a16228e706f4719adbe45268cab4b2a6c008dca9c1d8f6b467b2ebfeed4935182e76e32d9c3f003c1e991048c0b00904e00008dca9c1d8f6b467b2ebfeed4935182e76e32d9c300"
    );
    expect(output.getSignature()?.toString("hex")).toBe(
      "9fb423ee0b1ad3d3ad359c22d1e79048789c232813663fd5d8a1223458082ea844f5e87bf77db3b997aa4c847e23047c042003e3b204cea9ae0e1bf6fdcaaf09"
    );
  });
});

describe("Encode and decode", () => {
  test("TezosPublicKey", () => {
    const input = new TezosPublicKey({
      publicKey: Buffer.from("00", "hex"),
      keyType: PublicKeyType.ED25519,
      masterFingerprint: Buffer.from("00112233", "hex"),
      label: "Test",
    });

    const encoded = input.toUREncoder(1000).nextPart().toUpperCase();

    expect(encoded).toBe(
      "UR:XTZ-PUBLIC-KEY/OXAOFPAEAXADAAFYAEBYCPEOAHIEGHIHJKJYWFSEUEUO"
    );

    const decoded = URRegistryDecoder.decode(encoded);

    const output = TezosPublicKey.fromCBOR(decoded.cbor);

    expect(output.getRegistryType()).toBe(input.getRegistryType());
    expect(output.getRequestId()?.toString()).toBe(
      input.getRequestId()?.toString()
    );
    expect(output.toCBOR()?.toString()).toBe(input.toCBOR()?.toString());

    expect(output.getKeyType()?.toString()).toBe(
      input.getKeyType()?.toString()
    );
    expect(output.getLabel()?.toString()).toBe(input.getLabel()?.toString());
    expect(output.getMasterFingerprint()?.toString()).toBe(
      input.getMasterFingerprint()?.toString()
    );
    expect(output.getPublicKey()?.toString()).toBe(
      input.getPublicKey()?.toString()
    );
  });

  test("TezosSignRequest", () => {
    const input = new TezosSignRequest({
      requestId: Buffer.from("0123456789", "hex"),
      masterFingerprint: Buffer.from("6f01ffc8", "hex"),
      signData: Buffer.from(
        "30fe6de81bba2f70ed036e6766b2a87a9a16228e706f4719adbe45268cab4b2a6c008dca9c1d8f6b467b2ebfeed4935182e76e32d9c3f003c1e991048c0b00904e00008dca9c1d8f6b467b2ebfeed4935182e76e32d9c300",
        "hex"
      ),
      dataType: DataType.operation,
      publicKey: Buffer.from(
        "190e4b0ed26eec520135c6deb5fd59434989ea811f1ccfc30205bea7816fa4ea",
        "hex"
      ),
      keyType: PublicKeyType.ED25519,
    });

    const encoded = input.toUREncoder(1000).nextPart().toUpperCase();

    expect(encoded).toBe(
      "UR:XTZ-SIGN-REQUEST/OLADTPDAFEADCNFEIOLDAOHDHDDYZEJNVSCWRDDLJOWEAXJTIOIYPRPDKNNYCMCPMNJOJLFLCFPMRNFEDSLKPYGRDRJZAELGSGNSCAMYJEFGKGDMRSWYTYMUGYLFVDJTEYTASRWTAXSEWLMEAALKBDAEMHGLAEAELGSGNSCAMYJEFGKGDMRSWYTYMUGYLFVDJTEYTASRAEAXADAAHDCXCFBAGRBATDJTWPGMADECSWUEREZCHKFXGALDWDLYCTCETKSRAOAHRNOSLYJLOXWDAHADAMFYJLADZMSPMWCEKEOL"
    );

    const decoded = URRegistryDecoder.decode(encoded);

    const output = TezosSignRequest.fromCBOR(decoded.cbor);

    expect(output.getRegistryType()).toBe(input.getRegistryType());
    expect(output.getRequestId()?.toString()).toBe(
      input.getRequestId()?.toString()
    );
    expect(output.toCBOR()?.toString()).toBe(input.toCBOR()?.toString());

    expect(output.getMasterFingerprint()?.toString()).toBe(
      input.getMasterFingerprint()?.toString()
    );
    expect(output.getPublicKey()?.toString()).toBe(
      input.getPublicKey()?.toString()
    );
    expect(output.getSignData()?.toString()).toBe(
      input.getSignData()?.toString()
    );
  });

  test("TezosSignature", () => {
    const input = new TezosSignature({
      requestId: Buffer.from("00", "hex"),
      signature: Buffer.from("11", "hex"),
    });

    const encoded = input.toUREncoder(1000).nextPart().toUpperCase();

    expect(encoded).toBe("UR:XTZ-SIGNATURE/OTADTPDAFPAEAOFPBYAXYLHHMSIYFG");

    const decoded = URRegistryDecoder.decode(encoded);

    const output = TezosSignature.fromCBOR(decoded.cbor);

    expect(output.getRegistryType()).toBe(input.getRegistryType());
    expect(output.getRequestId()?.toString()).toBe(
      input.getRequestId()?.toString()
    );
    expect(output.toCBOR()?.toString()).toBe(input.toCBOR()?.toString());

    expect(output.getPayload()?.toString()).toBe(
      input.getPayload()?.toString()
    );
    expect(output.getSignature()?.toString()).toBe(
      input.getSignature()?.toString()
    );
  });
});
