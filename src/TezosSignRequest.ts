import { extend, DataItem, RegistryItem } from "@keystonehq/bc-ur-registry";
import { ExtendedRegistryTypes } from "./RegistryType";
// import * as uuid from "uuid";
import { PublicKeyType } from "./TezosPublicKey";

const { decodeToDataItem, RegistryTypes } = extend;

enum Keys {
  requestId = 1,
  signData,
  dataType,
  publicKey,
  keyType,
  masterFingerprint,
}

export enum DataType {
  operation = 1, // A forged operation.
}

type signRequestProps = {
  requestId?: Buffer;
  signData: Buffer;
  dataType: DataType;
  publicKey: Buffer;
  keyType: PublicKeyType;
  masterFingerprint?: Buffer;
};

export class TezosSignRequest extends RegistryItem {
  private requestId: Buffer | undefined;
  private signData: Buffer;
  private dataType: DataType;
  private publicKey: Buffer;
  private keyType: PublicKeyType;
  private masterFingerprint: Buffer | undefined;

  getRegistryType = () => ExtendedRegistryTypes.XTZ_SIGN_REQUEST;

  constructor(args: signRequestProps) {
    super();
    this.setupData(args);
  }

  private setupData = (args: signRequestProps) => {
    this.requestId = args.requestId;
    this.signData = args.signData;
    this.dataType = args.dataType;
    this.publicKey = args.publicKey;
    this.keyType = args.keyType;
    this.masterFingerprint = args.masterFingerprint;
  };

  public getRequestId = () => this.requestId;
  public getSignData = () => this.signData;
  public getDataType = () => this.dataType;
  public getPublicKey = () => this.publicKey;
  public getkeyType = () => this.keyType;
  public getMasterFingerprint = () => this.masterFingerprint;

  public toDataItem = () => {
    const map: Record<any /* Keys */, any> = {};
    if (this.requestId) {
      map[Keys.requestId] = new DataItem(
        this.requestId,
        RegistryTypes.UUID.getTag()
      );
    }

    map[Keys.signData] = this.signData;
    map[Keys.dataType] = this.dataType;

    map[Keys.publicKey] = this.publicKey;
    map[Keys.keyType] = this.keyType;

    map[Keys.masterFingerprint] = this.masterFingerprint;

    return new DataItem(map);
  };

  public static fromDataItem = (dataItem: DataItem) => {
    const map = dataItem.getData();

    const signData = map[Keys.signData];
    const dataType = map[Keys.dataType];

    const publicKey = map[Keys.publicKey];
    const keyType = map[Keys.keyType];

    const masterFingerprint = map[Keys.masterFingerprint];

    const requestId = map[Keys.requestId]
      ? map[Keys.requestId].getData()
      : undefined;

    return new TezosSignRequest({
      requestId,
      signData,
      dataType,
      publicKey,
      keyType,
      masterFingerprint,
    });
  };

  public static fromCBOR = (_cborPayload: Buffer) => {
    const dataItem = decodeToDataItem(_cborPayload);
    return TezosSignRequest.fromDataItem(dataItem);
  };

  // TODO: Maybe implement this to make using the lib easier
  // public static constructTezosRequest(
  //   signData: Buffer,
  //   signDataType: DataType,
  //   hdPath: string,
  //   xfp: string,
  //   uuidString?: string,
  //   chainId?: number,
  //   address?: string,
  //   origin?: string
  // ) {
  //   const paths = hdPath.replace(/[m|M]\//, "").split("/");
  //   const hdpathObject = new CryptoKeypath(
  //     paths.map((path) => {
  //       const index = parseInt(path.replace("'", ""));
  //       let isHardened = false;
  //       if (path.endsWith("'")) {
  //         isHardened = true;
  //       }
  //       return new PathComponent({ index, hardened: isHardened });
  //     }),
  //     Buffer.from(xfp, "hex")
  //   );

  //   return new TezosSignRequest({
  //     requestId: uuidString
  //       ? Buffer.from(uuid.parse(uuidString) as Uint8Array)
  //       : undefined,
  //     signData,
  //     dataType: signDataType,
  //     derivationPath: hdpathObject,
  //     chainId,
  //     address: address
  //       ? Buffer.from(address.replace("0x", ""), "hex")
  //       : undefined,
  //     origin: origin || undefined,
  //   });
  // }
}
