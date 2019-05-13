declare module "@mainframe/sdk" {
  import { Web3Provider } from "web3";

  export default class MainframeSDK {
    ethereum: {
      web3Provider: Web3Provider;
    };

    apiVersion: Promise<string>;
    contacts: {
      selectContacts(): Promise<Array<Contact>>;
      selectContact(): Promise<Contact | null>;
    };
  }

  export interface Contact {
    id: string;
    data: {
      profile: {
        name: string;
        avatar?: string;
        ethAddress?: string;
      };
    };
  }
}
