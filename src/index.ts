import { extend } from "@keystonehq/bc-ur-registry";
import { ExtendedRegistryTypes } from "./RegistryType";
const { cbor } = extend;

cbor.patchTags(
  Object.values(ExtendedRegistryTypes)
    .map((rt) => rt.getTag())
    .filter((tag): tag is number => !!tag)
);

export { TezosPublicKey, PublicKeyType } from "./TezosPublicKey";
export { TezosSignRequest, DataType } from "./TezosSignRequest";
export { TezosSignature } from "./TezosSignature";
