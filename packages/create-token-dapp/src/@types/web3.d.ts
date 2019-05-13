declare module "web3" {
  export interface Web3Provider {}

  export interface Eth {
    Contract: new (
      jsonInterface: any,
      address: string,
      options: any
    ) => Contract;

    net: Net;
    getAccounts(): Promise<Array<string>>;
  }

  export interface Contract {
    deploy(options: Object);
  }

  export interface Net {
    getId(): Promise<number>;
  }

  export interface Utils {
    isAddress(address: string, chainId?: number);
  }

  export default class Web3 {
    constructor(provider: Web3Provider, network: any, options: any);
    eth: Eth;
    utils: Utils;
  }
}
