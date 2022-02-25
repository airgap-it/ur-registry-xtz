import { extend } from "@keystonehq/bc-ur-registry";
const { RegistryType } = extend;

export const ExtendedRegistryTypes = {
  XTZ_PUBLIC_KEY: new RegistryType("xtz-public-key", 500), // TODO: tag?
  XTZ_SIGN_REQUEST: new RegistryType("xtz-sign-request", 501), // TODO: tag?
  XTZ_SIGNATAURE: new RegistryType("xtz-signature", 502), // TODO: tag?
};
