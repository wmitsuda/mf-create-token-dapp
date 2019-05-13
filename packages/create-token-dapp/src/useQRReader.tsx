import React, { useState, useContext, useRef, useEffect } from "react";
import { Web3Context } from "./Web3Context";
import QrReader from "react-qr-reader";

type ValueSetter = (value: string) => void;

const useQRReader = (
  setValue: ValueSetter
): [boolean, () => void, () => JSX.Element] => {
  const [isScanning, setScanning] = useState(false);
  const web3 = useContext(Web3Context);

  const onScan = (result: string) => {
    if (result === null) {
      return;
    }
    if (web3.utils.isAddress(result)) {
      setScanning(false);
      setValue(result);
    }
  };

  const onError = (err: string) => {
    console.log("Error while scanning address: " + err);
    setScanning(false);
  };

  const toggleScanning = () => setScanning(!isScanning);

  const qrRef = useRef<HTMLDivElement>();
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
