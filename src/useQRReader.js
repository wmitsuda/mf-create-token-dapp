import React, { useState, useContext } from "react";
import { Web3Context } from "./Web3Context";
import QrReader from "react-qr-reader";

const useQRReader = setValue => {
  const [isScanning, setScanning] = useState(false);
  const web3 = useContext(Web3Context);

  const onScan = result => {
    if (web3.utils.isAddress(result)) {
      setValue(result);
      setScanning(false);
    }
  };

  const onError = err => {
    console.log("Error while scanning address: " + err);
    setScanning(false);
  };

  const toggleScanning = () => setScanning(!isScanning);

  const QRReader = () => (
    <>{isScanning && <QrReader onScan={onScan} onError={onError} />}</>
  );

  return [isScanning, toggleScanning, QRReader];
};

export { useQRReader };
