import { extend, DataItem, RegistryItem } from "@keystonehq/bc-ur-registry";
import { ExtendedRegistryTypes } from "./RegistryType";

const { RegistryTypes, decodeToDataItem } = extend;

enum Keys {
  requestId = 1,
  publicKey,
  keyType,
  masterFingerprint,
  label,
}

export enum PublicKeyType {
  ED25519 = 1,
  SECP256K1 = 2,
  NISTP256r1 = 3,
  SAPLING = 4,
}

type PublicKeyProps = {
  requestId?: Buffer;
  publicKey: Buffer;
  keyType: PublicKeyType;
  masterFingerprint?: Buffer;
  label?: string;
};

export class TezosPublicKey extends RegistryItem {
  private requestId: Buffer | undefined;
  private publicKey: Buffer;
  private keyType: PublicKeyType;
  private masterFingerprint: Buffer | undefined;
  private label: string | undefined;

  getRegistryType = () => ExtendedRegistryTypes.XTZ_PUBLIC_KEY;

  constructor(args: PublicKeyProps) {
    super();
    this.requestId = args.requestId;
    this.publicKey = args.publicKey;
    this.keyType = args.keyType;
    this.masterFingerprint = args.masterFingerprint;
    this.label = args.label;
  }

  public getRequestId = () => this.requestId;
  public getPublicKey = () => this.publicKey;
  public getKeyType = () => this.keyType;
  public getMasterFingerprint = () => this.masterFingerprint;
  public getLabel = () => this.label;

  public toDataItem = () => {
    const map: Record<any /* Keys */, any> = {};
    if (this.requestId) {
      map[Keys.requestId] = new DataItem(
        this.requestId,
        RegistryTypes.UUID.getTag()
      );
    }
    map[Keys.publicKey] = this.publicKey;
    map[Keys.keyType] = this.keyType;
    map[Keys.masterFingerprint] = this.masterFingerprint;
    map[Keys.label] = this.label;
    return new DataItem(map);
  };

  public static fromDataItem = (dataItem: DataItem) => {
    const map = dataItem.getData();
    const publicKey = map[Keys.publicKey];
    const keyType = map[Keys.keyType];
    const masterFingerprint = map[Keys.masterFingerprint];
    const label = map[Keys.label];
    const requestId = map[Keys.requestId]
      ? map[Keys.requestId].getData()
      : undefined;

    return new TezosPublicKey({
      publicKey,
      keyType,
      masterFingerprint,
      label,
      requestId,
    });
  };

  public static fromCBOR = (cborPayload: Buffer) => {
    const dataItem = decodeToDataItem(cborPayload);
    return TezosPublicKey.fromDataItem(dataItem);
  };
}
