import React, { useState, useEffect, useContext } from "react";

const Web3Context = React.createContext();

const useWeb3 = () => useContext(Web3Context);

const useNetwork = () => {
  const web3 = useWeb3();
  const [networkId, setNetworkId] = useState();
  const [networkName, setNetworkName] = useState();

  useEffect(() => {
    const getNetworkId = async () => {
      const id = await web3.eth.net.getId();
      setNetworkId(id);

      let name;
      switch (id) {
        case 1:
          name = "Main";
          break;
        case 3:
          name = "Ropsten";
          break;
        case 4:
          name = "Rinkeby";
          break;
        case 42:
          name = "Kovan";
          break;
        default:
          name = `Unknown network (${id})`;
      }
      setNetworkName(name);
    };
    getNetworkId();
  }, [web3]);

  return [networkId, networkName];
};

const networkPrefixes = {
  1: "",
  3: "ropsten.",
  4: "rinkeby.",
  42: "kovan."
};

const useEtherscan = () => {
  const [networkId] = useNetwork();

  let networkPrefix = networkPrefixes[networkId];
  if (!networkPrefix) {
    return undefined;
  }

  return {
    getTxURL: transactionHash =>
      `https://${networkPrefix}etherscan.io/tx/${transactionHash}`,
    getAddressURL: address =>
      `https://${networkPrefix}etherscan.io/address/${address}`,
    getTokenURL: address =>
      `https://${networkPrefix}etherscan.io/token/${address}`
  };
};

export { Web3Context, useWeb3, useNetwork, useEtherscan };
