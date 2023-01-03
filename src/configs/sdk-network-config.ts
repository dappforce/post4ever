export interface CustomNetworkConfig {
  substrateNodeUrl: string;
  ipfsNodeUrl: string;
}

export const networkConfig: CustomNetworkConfig = {
  substrateNodeUrl:
    process.env.NEXT_PUBLIC_SUBSOCIAL_NODE_URL ?? "wss://rco-para.subsocial.network",
  ipfsNodeUrl: process.env.NEXT_PUBLIC_IPFS_URL ?? "https://gw.crustfiles.app",
};

// Additional: Subsocial IPFS node url
export const SUB_IPFS_NODE_URL = "https://ipfs.subsocial.network/ipfs";

// for tx query on custom JS explorer (page on tx details)
export const explorerUrl: string = `https://polkadot.js.org/apps/?${networkConfig.substrateNodeUrl}#/explorer/query/`;

// for writing to Crust IPFS
export const CRUST_TEST_AUTH_HEADER =
  "c3ViLTVGQTluUURWZzI2N0RFZDhtMVp5cFhMQm52TjdTRnhZd1Y3bmRxU1lHaU45VFRwdToweDEwMmQ3ZmJhYWQwZGUwNzFjNDFmM2NjYzQzYmQ0NzIxNzFkZGFiYWM0MzEzZTc5YTY3ZWExOWM0OWFlNjgyZjY0YWUxMmRlY2YyNzhjNTEwZGY4YzZjZTZhYzdlZTEwNzY2N2YzYTBjZjM5OGUxN2VhMzAyMmRkNmEyYjc1OTBi";
