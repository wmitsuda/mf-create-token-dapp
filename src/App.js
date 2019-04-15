// @flow

import React, { useState } from "react";
import MainframeSDK from "@mainframe/sdk";
import Web3 from "web3";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import Divider from "@material-ui/core/Divider";
import styled from "styled-components";
import ContractCreationStatus from "./ContractCreationStatus";
import StandardERC20Token from "./contracts/StandardERC20Token.json";

import "@morpheus-ui/fonts";

const sdk = new MainframeSDK();

const initialValues = {
  tokenName: "Testcoin",
  tokenSymbol: "TEST",
  initialSupply: "100",
  initialOwner: "0xe3f0D0ECfD7F655F322A05d15C996748Ad945561"
};

const validationSchema = Yup.object().shape({
  tokenName: Yup.string().required("Value is required"),
  tokenSymbol: Yup.string().required("Value is required"),
  initialSupply: Yup.string().required("Value is required"),
  initialOwner: Yup.string().required("Value is required")
});

const StyledDiv = styled.div`
  margin: 20px;
  padding: 20px;
`;

const web3Options = {
  trnasactionConfirmationBlocks: 1
};

export default function App() {
  const [transactionHash, setTransactionHash] = useState();
  const [contractAddress, setContractAddress] = useState();

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log(values);
    console.log(sdk.ethereum.web3Provider);
    const web3 = new Web3(sdk.ethereum.web3Provider, null, web3Options);
    const accounts = await web3.eth.getAccounts();

    const erc20 = new web3.eth.Contract(
      StandardERC20Token.abi,
      null,
      web3Options
    );
    const contract = await erc20
      .deploy({
        data: StandardERC20Token.bytecode,
        arguments: [
          values.tokenName,
          values.tokenSymbol,
          18,
          values.initialOwner,
          values.initialSupply.toString() + "0".repeat(18)
        ]
      })
      .send({ from: accounts[0] })
      .on("transactionHash", hash => {
        setTransactionHash(hash);
        console.log(`Transaction hash: ${hash}`);
      });
    console.log("Transaction confirmed!!!");
    console.log(contract);
    setContractAddress(contract.options.address);
    setSubmitting(false);
  };

  return (
    <>
      <CssBaseline />
      <Paper component={StyledDiv}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          render={({ isSubmitting }) => (
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
              <StyledBox>
                {isSubmitting ? <LinearProgress /> : <Divider />}
              </StyledBox>
              <StyledBox>
                <ContractCreationStatus
                  transactionHash={transactionHash}
                  contractAddress={contractAddress}
                />
              </StyledBox>
            </Form>
          )}
        />
      </Paper>
    </>
  );
}

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
