import React from "react";
import { Form, Field } from "formik";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import styled from "styled-components";
import ContractCreationStatus from "./ContractCreationStatus";

const TokenCreationForm = ({
  transactionHash,
  contractAddress,
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
      />
    </StyledBox>
  </Form>
);

const StyledBox = styled.div`
  margin: 16px 0 8px;
`;

const CustomTextField = ({
  field,
  form: { errors, touched, isSubmitting },
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
export default TokenCreationForm;
