import React, { useState } from "react";
import MainframeSDK from "@mainframe/sdk";
import Web3 from "web3";
import { Formik } from "formik";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import styled from "styled-components";
import { MainframeContext } from "./MainframeContext";
import { Web3Context } from "./Web3Context";
import { SnackbarProvider } from "notistack";
import { initialValues, createValidationSchema } from "./validationSchema";
import TokenCreationForm from "./TokenCreationForm";
import StandardERC20Token from "./contracts/StandardERC20Token.json";

const sdk = new MainframeSDK();

const web3Options = {
  transactionConfirmationBlocks: 1
};

const web3 = new Web3(sdk.ethereum.web3Provider, null, web3Options);

const validationSchema = createValidationSchema(web3);

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

const StyledDiv = styled.div`
  margin: 20px;
  padding: 20px;
`;

export default App;
