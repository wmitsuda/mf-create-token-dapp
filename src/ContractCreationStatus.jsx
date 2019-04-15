import React from "react";
import Typography from "@material-ui/core/Typography";

const ContractCreationStatus = ({ transactionHash, contractAddress }) => (
  <>
    {transactionHash && (
      <Typography variant="subtitle2">
        Contract creation broadcast: txhash={transactionHash}
      </Typography>
    )}
    {contractAddress && (
      <Typography variant="subtitle2">
        ERC20 contract created: address={contractAddress}
      </Typography>
    )}
  </>
);

export default ContractCreationStatus;
