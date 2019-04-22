import React, { useState } from "react";
import MainframeSDK from "@mainframe/sdk";
import Web3 from "web3";
import { Formik } from "formik";
import * as Yup from "yup";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import styled from "styled-components";
import { MainframeContext } from "./MainframeContext";
import { Web3Context } from "./Web3Context";
import { SnackbarProvider } from "notistack";
import TokenCreationForm from "./TokenCreationForm";
import StandardERC20Token from "./contracts/StandardERC20Token.json";

const sdk = new MainframeSDK();

const initialValues = {
  tokenName: "Testcoin",
  tokenSymbol: "TEST",
  initialSupply: "100",
  initialOwner: "0xe3f0D0ECfD7F655F322A05d15C996748Ad945561"
};

const StyledDiv = styled.div`
  margin: 20px;
  padding: 20px;
`;

const web3Options = {
  transactionConfirmationBlocks: 1
};

const web3 = new Web3(sdk.ethereum.web3Provider, null, web3Options);

const validationSchema = Yup.object().shape({
  tokenName: Yup.string()
    .required("Value is required")
    .min(5, "Token name must have a minimum of 5 characters")
    .max(30, "Token name must have a maximum of 30 characters")
    .matches(
      /^\s*\w+[\w\s]*$/,
      "Token name must have at least one alphanumeric character"
    ),
  tokenSymbol: Yup.string()
    .required("Value is required")
    .min(1, "Token symbol must have a minimum of 1 character")
    .max(20, "Token symbol must have a maximum of 20 characters")
    .matches(
      /^[A-Z][A-Z\d]*$/,
      "Token symbol must start with a letter followed by letters or numbers"
    ),
  initialSupply: Yup.number()
    .typeError("Value must be an integer number")
    .integer("Value must be an integer number")
    .required("Value is required")
    .min(1, "Value must be at least 1")
    .max(1000000000, "Value must be less than 1 billion"),
  initialOwner: Yup.string()
    .trim()
    .required("Value is required")
    .test("isAddress", "Value is not an ETH address", value => {
      return web3.utils.isAddress(value);
    })
});

const App = () => {
  const [transactionHash, setTransactionHash] = useState();
  const [contractAddress, setContractAddress] = useState();
  const [step, setStep] = useState();
  const [creationError, setCreationError] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    setCreationError(false);

    const accounts = await web3.eth.getAccounts();
    const defaultAccount = accounts[0];

    const erc20 = new web3.eth.Contract(
      StandardERC20Token.abi,
      null,
      web3Options
    );
    try {
      setStep(0);

      const decimals = 18;
      const contract = await erc20
        .deploy({
          data: StandardERC20Token.bytecode,
          arguments: [
            values.tokenName,
            values.tokenSymbol,
            decimals,
            values.initialOwner.trim(),
            parseInt(values.initialSupply).toString() + "0".repeat(decimals)
          ]
        })
        .send({ from: defaultAccount })
        .on("transactionHash", hash => {
          setStep(2);
          setTransactionHash(hash);
        });
      setStep(4);
      setContractAddress(contract.options.address);
    } catch (err) {
      console.log("Some error occurred or user has cancelled operation");
      console.log(err);
      setCreationError(true);
    }
    setSubmitting(false);
  };

  return (
    <MainframeContext.Provider value={sdk}>
      <Web3Context.Provider value={web3}>
        <SnackbarProvider maxSnack={1} autoHideDuration={1000}>
          <CssBaseline />
          <Paper component={StyledDiv}>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              render={props => (
                <TokenCreationForm
                  transactionHash={transactionHash}
                  contractAddress={contractAddress}
                  step={step}
                  creationError={creationError}
                  {...props}
                />
              )}
            />
          </Paper>
        </SnackbarProvider>
      </Web3Context.Provider>
    </MainframeContext.Provider>
  );
};

export default App;
