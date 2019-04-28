import React, { useState, useContext, useRef, useEffect } from "react";
import { Web3Context } from "./Web3Context";
import QrReader from "react-qr-reader";

const useQRReader = setValue => {
  const [isScanning, setScanning] = useState(false);
  const web3 = useContext(Web3Context);

  const onScan = result => {
    if (result === null) {
      return;
    }
    if (web3.utils.isAddress(result)) {
      setScanning(false);
      setValue(result);
    }
  };

  const onError = err => {
    console.log("Error while scanning address: " + err);
    setScanning(false);
  };

  const toggleScanning = () => setScanning(!isScanning);

  const qrRef = useRef();
  const QRReader = () => (
    <>
      <div ref={qrRef} />
      {isScanning && (
        <QrReader
          onScan={onScan}
          onError={onError}
          style={{ maxWidth: "500px" }}
        />
      )}
    </>
  );
  useEffect(() => {
    if (isScanning) {
      window.scrollTo({ behavior: "smooth", top: qrRef.current.offsetTop });
    }
  }, [isScanning]);

  return [isScanning, toggleScanning, QRReader];
};

export { useQRReader };
