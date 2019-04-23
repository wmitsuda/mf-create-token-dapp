import React from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Identicon } from "ethereum-react-components";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useSnackbar } from "notistack";
import styled from "styled-components";
import { useEtherscan } from "./Web3Context";

const ContractCreationStatus = ({
  transactionHash,
  contractAddress,
  step,
  creationError
}) => {
  const etherscan = useEtherscan();
  const { enqueueSnackbar } = useSnackbar();
  if (step === undefined) {
    return null;
  }

  return (
    <>
      <Stepper activeStep={step} orientation="vertical">
        <Step>
          <StepLabel error={creationError && step === 0}>
            Confirm contract creation transaction signing
          </StepLabel>
          <StepContent />
        </Step>
        <Step>
          <StepLabel>Broadcast transaction to ethereum network</StepLabel>
          <StepContent />
        </Step>
        <Step>
          <StepLabel error={creationError && step === 2}>
            Waiting for transaction confirmation on the blockchain
          </StepLabel>
          <StepContent>
            <Grid alignItems="center" spacing={8} container>
              <Grid item>
                <Typography>Transaction: {transactionHash}</Typography>
              </Grid>
              <Grid item>
                <CopyToClipboard
                  text={transactionHash}
                  onCopy={() =>
                    enqueueSnackbar("Transaction hash copied to clipboard")
                  }
                >
                  <Button color="secondary">Copy TxHash</Button>
                </CopyToClipboard>
              </Grid>
            </Grid>
          </StepContent>
        </Step>
        <Step>
          <StepLabel>ERC20 contract created</StepLabel>
        </Step>
      </Stepper>
      {step === 4 && (
        <StyledDiv>
          <Grid direction="column" spacing={8} container>
            <Grid item>
              <Typography variant="subtitle1">
                🎉🎉🎉 Contract creation transaction confirmed on the
                blockchain! 🎉🎉🎉
              </Typography>
            </Grid>
            <Grid alignItems="center" spacing={8} container item>
              <Grid item>
                <Identicon address={contractAddress} size="small" />
              </Grid>
              <Grid item>
                <Typography variant="subtitle2">{contractAddress}</Typography>
              </Grid>
              <Grid item>
                <CopyToClipboard
                  text={contractAddress}
                  onCopy={() => enqueueSnackbar("Address copied to clipboard")}
                >
                  <Button color="secondary">Copy Address</Button>
                </CopyToClipboard>
              </Grid>
              <Grid item>
                <CopyToClipboard
                  text={etherscan.getTokenURL(contractAddress)}
                  onCopy={() =>
                    enqueueSnackbar("Etherscan token URL copied to clipboard")
                  }
                >
                  <Button color="secondary">Copy Etherscan Token URL</Button>
                </CopyToClipboard>
              </Grid>
            </Grid>
          </Grid>
        </StyledDiv>
      )}
    </>
  );
};

const StyledDiv = styled.div`
  padding: 24px;
`;

export default ContractCreationStatus;
