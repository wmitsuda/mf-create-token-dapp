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

const ContractCreationStatus = ({
  transactionHash,
  contractAddress,
  step,
  creationError
}) => {
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
          <StepLabel>Broadcast tx to ethereum network</StepLabel>
          <StepContent />
        </Step>
        <Step>
          <StepLabel error={creationError && step === 2}>
            Waiting for transaction confirmation on the blockchain
          </StepLabel>
          <StepContent>
            <Grid alignItems="center" spacing={8} container>
              <Grid item>
                <Typography variant="subtitle2">
                  txhash: {transactionHash}
                </Typography>
              </Grid>
              <Grid item>
                <CopyToClipboard
                  text={transactionHash}
                  onCopy={() => enqueueSnackbar("TxHash copied to clipboard")}
                >
                  <Button color="secondary">Copy to Clipboard</Button>
                </CopyToClipboard>
              </Grid>
            </Grid>
          </StepContent>
        </Step>
        <Step active={step === 4}>
          <StepLabel>ERC20 contract created 🎉🎉🎉</StepLabel>
          <StepContent>
            <Grid alignItems="center" spacing={8} container>
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
                  <Button color="secondary">Copy to Clipboard</Button>
                </CopyToClipboard>
              </Grid>
            </Grid>
          </StepContent>
        </Step>
      </Stepper>
    </>
  );
};

export default ContractCreationStatus;
