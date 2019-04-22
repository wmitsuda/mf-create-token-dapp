import React from "react";
import { Form, Field } from "formik";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import ImportContacts from "@material-ui/icons/ImportContacts";
import QrcodeScan from "mdi-material-ui/QrcodeScan";
import WindowClose from "mdi-material-ui/WindowClose";
import AccountArrowLeftOutline from "mdi-material-ui/AccountArrowLeftOutline";
import styled from "styled-components";
import { useMainframe } from "./MainframeContext";
import { useWeb3 } from "./Web3Context";
import { useQRReader } from "./useQRReader";
import ContractCreationStatus from "./ContractCreationStatus";

const TokenCreationForm = ({
  transactionHash,
  contractAddress,
  step,
  creationError,
  isSubmitting
}) => (
  <Form noValidate>
    <Typography variant="h6">
      Fill the information bellow to create your own ERC20 token
    </Typography>
    <Field
      name="tokenName"
      render={props => (
        <CustomTextField
          {...props}
          label="Token name"
          helperText="Enter the token name, e.g. Testcoin"
        />
      )}
    />
    <Field
      name="tokenSymbol"
      render={props => (
        <CustomTextField
          {...props}
          label="Token symbol"
          helperText="Enter the token symbol, e.g. TEST"
        />
      )}
    />
    <Field
      name="initialSupply"
      render={props => (
        <CustomTextField
          {...props}
          label="Initial supply"
          helperText="Enter the initial token supply, e.g. 1000"
        />
      )}
    />
    <Field
      name="initialOwner"
      render={props => (
        <CustomTextField
          {...props}
          label="Initial owner"
          helperText="Enter the address to be assigned as the owner of all initial tokens"
          isAddress
        />
      )}
    />
    <StyledBox>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isSubmitting}
      >
        Create Token
      </Button>
    </StyledBox>
    <StyledBox>{isSubmitting ? <LinearProgress /> : <Divider />}</StyledBox>
    <StyledBox>
      <ContractCreationStatus
        transactionHash={transactionHash}
        contractAddress={contractAddress}
        step={step}
        creationError={creationError}
      />
    </StyledBox>
  </Form>
);

const StyledBox = styled.div`
  margin: 16px 0 8px;
`;

const CustomTextField = ({
  field,
  form: { errors, touched, isSubmitting, setFieldValue, setFieldTouched },
  label,
  helperText,
  isAddress
}) => {
  const web3 = useWeb3();

  const setValue = value => {
    setFieldValue(field.name, value, false);
    setFieldTouched(field.name);
  };
  const [isScanning, toggleScanning, QRReader] = useQRReader(setValue);

  const sdk = useMainframe();
  const handleSelectContact = async () => {
    const contact = await sdk.contacts.selectContact();
    if (contact) {
      const { ethAddress } = contact.data.profile;
      setValue(ethAddress);
    }
  };

  const handleFillMyAddress = async () => {
    const accounts = await web3.eth.getAccounts();
    const defaultAccount = accounts[0];
    setValue(defaultAccount);
  };

  let inputProps;
  if (isAddress) {
    inputProps = {
      endAdornment: (
        <InputAdornment position="end">
          <Tooltip title="Select contact">
            <IconButton onClick={handleSelectContact} disabled={isSubmitting}>
              <ImportContacts />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={
              isScanning ? "Close camera" : "Open camera and scan a QR code"
            }
          >
            <IconButton onClick={toggleScanning} disabled={isSubmitting}>
              {isScanning ? <WindowClose /> : <QrcodeScan />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Fill with my address">
            <IconButton onClick={handleFillMyAddress} disabled={isSubmitting}>
              <AccountArrowLeftOutline />
            </IconButton>
          </Tooltip>
        </InputAdornment>
      )
    };
  }

  return (
    <>
      <TextField
        {...field}
        label={label}
        error={errors[field.name] && touched[field.name]}
        helperText={errors[field.name] || helperText}
        margin="normal"
        disabled={isSubmitting}
        InputProps={inputProps}
        required
        fullWidth
      />
      <QRReader />
    </>
  );
};

export default TokenCreationForm;
