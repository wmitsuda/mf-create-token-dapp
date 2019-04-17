import React from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ContentCopy from "mdi-material-ui/ContentCopy";
import { useSnackbar } from "notistack";

const ContractCreationStatus = ({
  transactionHash,
  contractAddress,
  step,
  creationError
}) => {
  const { enqueueSnackbar } = useSnackbar();
  if (step === 0) {
    return null;
  }

  return (
    <>
      <Stepper activeStep={step} orientation="vertical">
        <Step>
          <StepLabel>Confirm contract creation transaction signing</StepLabel>
        </Step>
        <Step>
          <StepLabel error={creationError && step === 1}>
            Broadcast tx to ethereum network
          </StepLabel>
        </Step>
        <Step>
          <StepLabel error={creationError && step === 2}>
            Waiting for transaction confirmation on the blockchain
          </StepLabel>
          <StepContent>
            <Typography>txhash: {transactionHash}</Typography>
            <CopyToClipboard
              text={transactionHash}
              onCopy={() => enqueueSnackbar("TxHash copied to clipboard")}
            >
              <Button color="secondary">Copy to Clipboard</Button>
            </CopyToClipboard>
          </StepContent>
        </Step>
        <Step>
          <StepLabel>ERC20 contract created</StepLabel>
          <StepContent>
            <Typography>Contract address: {contractAddress}</Typography>
            <CopyToClipboard
              text={contractAddress}
              onCopy={() => enqueueSnackbar("Address copied to clipboard")}
            >
              <Button color="secondary">Copy to Clipboard</Button>
            </CopyToClipboard>
          </StepContent>
        </Step>
      </Stepper>
      {transactionHash && (
        <Grid container>
          <Grid item>
            <Typography variant="subtitle1">
              Contract creation broadcast: txhash={transactionHash}
            </Typography>
          </Grid>
          <Grid item>
            <CopyToClipboard
              text={transactionHash}
              onCopy={() => enqueueSnackbar("TxHash copied to clipboard")}
            >
              <Tooltip title="Copy to clipboard">
                <IconButton>
                  <ContentCopy />
                </IconButton>
              </Tooltip>
            </CopyToClipboard>
          </Grid>
        </Grid>
      )}
      {contractAddress && (
        <Typography variant="subtitle1">
          ERC20 contract created: address={contractAddress}
        </Typography>
      )}
    </>
  );
};

export default ContractCreationStatus;
