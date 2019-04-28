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
import { useSnackbar } from "notistack";
import { useMainframe } from "./MainframeContext";
import { useWeb3 } from "./Web3Context";
import { useQRReader } from "./useQRReader";

const TokenCreationForm = ({ isSubmitting }) => (
  <Form noValidate>
    <Typography variant="h6">
      Fill the information below to create your own ERC20 token
    </Typography>
    <CustomField
      name="tokenName"
      label="Token name"
      helperText="Enter the token name, e.g. Testcoin"
    />
    <CustomField
      name="tokenSymbol"
      label="Token symbol"
      helperText="Enter the token symbol, e.g. TEST"
    />
    <CustomField
      name="initialSupply"
      label="Initial supply"
      helperText="Enter the initial token supply, e.g. 1000"
    />
    <CustomField
      name="initialOwner"
      label="Initial owner"
      helperText="Enter the address to be assigned as the owner of all initial tokens"
      isAddress
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
  </Form>
);

const StyledBox = styled.div`
  margin: 16px 0 8px;
`;

const CustomField = ({ name, isAddress, ...rest }) => {
  let Component = CustomTextField;
  if (isAddress) {
    Component = CustomAddressField;
  }

  return (
    <Field name={name} render={props => <Component {...props} {...rest} />} />
  );
};

const CustomTextField = ({
  field,
  form: { errors, touched, isSubmitting, setFieldValue, setFieldTouched },
  label,
  helperText
}) => (
  <TextField
    {...field}
    label={label}
    error={errors[field.name] && touched[field.name]}
    helperText={errors[field.name] || helperText}
    margin="normal"
    disabled={isSubmitting}
    required
    fullWidth
  />
);

const CustomAddressField = ({
  field,
  form: { errors, touched, isSubmitting, setFieldValue, setFieldTouched },
  label,
  helperText
}) => {
  const web3 = useWeb3();

  const setValue = value => {
    setFieldValue(field.name, value, false);
    setFieldTouched(field.name);
  };
  const [isScanning, toggleScanning, QRReader] = useQRReader(setValue);

  const sdk = useMainframe();
  const { enqueueSnackbar } = useSnackbar();
  const handleSelectContact = async () => {
    const contact = await sdk.contacts.selectContact();
    if (contact) {
      const { ethAddress } = contact.data.profile;
      if (!ethAddress) {
        enqueueSnackbar(
          "The selected contact does not have a public ETH address",
          { autoHideDuration: 5000 }
        );
      } else {
        setValue(ethAddress);
      }
    }
  };

  const handleFillMyAddress = async () => {
    const accounts = await web3.eth.getAccounts();
    const defaultAccount = accounts[0];
    setValue(defaultAccount);
  };

  const inputProps = {
    endAdornment: (
      <InputAdornment position="end">
        <Tooltip title="Select contact">
          <IconButton onClick={handleSelectContact} disabled={isSubmitting}>
            <ImportContacts />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={isScanning ? "Close camera" : "Open camera and scan a QR code"}
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
