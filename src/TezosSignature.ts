import { extend, DataItem, RegistryItem } from "@keystonehq/bc-ur-registry";
import { ExtendedRegistryTypes } from "./RegistryType";

const { RegistryTypes, decodeToDataItem } = extend;

enum Keys {
  requestId = 1,
  signature,
  payload,
}

type SignatureProps = {
  requestId?: Buffer;
  signature: Buffer;
  payload?: Buffer;
};

export class TezosSignature extends RegistryItem {
  private requestId: Buffer;
  private signature: Buffer;
  private payload: Buffer | undefined;

  getRegistryType = () => ExtendedRegistryTypes.XTZ_SIGNATAURE;

  constructor(args: SignatureProps) {
    super();
    this.signature = args.signature;
    this.requestId = args.requestId;
    this.payload = args.payload;
  }

  public getRequestId = () => this.requestId;
  public getSignature = () => this.signature;
  public getPayload = () => this.payload;

  public toDataItem = () => {
    const map: Record<any /* Keys */, any> = {};
    if (this.requestId) {
      map[Keys.requestId] = new DataItem(
        this.requestId,
        RegistryTypes.UUID.getTag()
      );
    }
    map[Keys.signature] = this.signature;
    map[Keys.payload] = this.payload;
    return new DataItem(map);
  };

  public static fromDataItem = (dataItem: DataItem) => {
    const map = dataItem.getData();
    const signature = map[Keys.signature];
    const payload = map[Keys.payload];
    const requestId = map[Keys.requestId]
      ? map[Keys.requestId].getData()
      : undefined;

    return new TezosSignature({ signature, payload, requestId });
  };

  public static fromCBOR = (_cborPayload: Buffer) => {
    const dataItem = decodeToDataItem(_cborPayload);
    return TezosSignature.fromDataItem(dataItem);
  };
}
