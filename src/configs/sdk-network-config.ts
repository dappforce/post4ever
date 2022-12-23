export interface CustomNetworkConfig {
  substrateNodeUrl: string;
  ipfsNodeUrl: string;
}

// for connecting to mainnet
export const mainnetConfig: CustomNetworkConfig = {
  substrateNodeUrl: "wss://para.f3joule.space",
  ipfsNodeUrl: "https://gw.crustfiles.app",
};

// for connecting to testnet
export const testnetConfig: CustomNetworkConfig = {
  substrateNodeUrl: "wss://rco-para.subsocial.network",
  ipfsNodeUrl: "https://crustwebsites.net",
};

// Additional: Subsocial IPFS node url
export const SUB_IPFS_NODE_URL = "https://ipfs.subsocial.network/ipfs";

// for tx query on custom JS explorer (page on tx details)
export const explorerUrl: string = `https://polkadot.js.org/apps/?${mainnetConfig.substrateNodeUrl}#/explorer/query/`;

// for writing to Crust IPFS
export const CRUST_TEST_AUTH_HEADER =
  "c3ViLTVGQTluUURWZzI2N0RFZDhtMVp5cFhMQm52TjdTRnhZd1Y3bmRxU1lHaU45VFRwdToweDEwMmQ3ZmJhYWQwZGUwNzFjNDFmM2NjYzQzYmQ0NzIxNzFkZGFiYWM0MzEzZTc5YTY3ZWExOWM0OWFlNjgyZjY0YWUxMmRlY2YyNzhjNTEwZGY4YzZjZTZhYzdlZTEwNzY2N2YzYTBjZjM5OGUxN2VhMzAyMmRkNmEyYjc1OTBi";
