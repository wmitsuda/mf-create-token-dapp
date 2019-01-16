import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MainframeSDK from '@mainframe/sdk'
import Web3 from 'web3'

class App extends Component {

  sdk: MainframeSDK
  web3: Web3

  state = {
    sdkWorking: false,
    account: "",
    ethBalance: 0
  }

  constructor(props) {
    super(props);
    this.sdk = new MainframeSDK()
    this.web3 = new Web3(this.sdk.blockchain.getWeb3Provider())
    console.log(this.web3.eth.accounts[0])

  }

  componentDidMount() {
    if (this.sdk.blockchain.getWeb3Provider() !== null) {
      this.setState({sdkWorking: true})
    }
    this.fetchState()
  }

  async fetchState() {
    const accounts = await this.web3.eth.getAccounts()
    if (accounts.length) {
      const account = accounts[0]
      const weiBalance = await this.web3.eth.getBalance(account)
      const ethBalance = this.web3.utils.fromWei(weiBalance)
      this.setState({
        account,
        ethBalance,
      })
    }
  }

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <h1>MainframeSDK is { this.state.sdkWorking ? "" : "NOT" } working!</h1>
          <h1>{ this.state.account ? this.state.account : "" } </h1>
          <img src={this.state.sdkWorking ? "https://mainframe.com/static/monetization.f3c95d77.svg" : logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://mainframe.com/developers"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn to build on Mainframe.
          </a>
        </header>
      </div>
    );
  }
}

export default App;
