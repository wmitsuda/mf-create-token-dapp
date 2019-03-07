// @flow

import React, { useState, useEffect } from 'react'
import MainframeSDK from '@mainframe/sdk'
import Web3 from 'web3'

import { Text, Row, Column, ThemeProvider } from '@morpheus-ui/core'
import styled from 'styled-components/native'

import '@morpheus-ui/fonts'
import './App.css'

import LogoImg from './logo.svg'

import Theme from './theme'

const Container = styled.View`
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 100vw;
  height: 100vh;
  overflow: auto;
`

const Account = styled.View`
  align-items: center;
  justify-content: center;
  margin: 20px;
  border-color: grey;
  border-width: 1px;
`

const Logo = styled.Image``

const sdk = new MainframeSDK()
const web3 = new Web3(sdk.ethereum.web3Provider)

const MainframeLogo = React.memo(() => (
  <Text variant="center">
    <Logo
      defaultSource={{
        uri: LogoImg,
        width: 200,
        height: 60,
      }}
      resizeMode="contain"
    />
  </Text>
))

const MainframeHeader = React.memo(({ sdkWorking }) => (
  <Text variant={['h2', 'center']}>
    MainframeSDK is {sdkWorking ? '' : 'NOT'} working!
  </Text>
))

const AccountData = React.memo(({ account, ethBalance }) => (
  <Account>
    <Row size={2}>
      <Column>
        <Text bold>Wallet address</Text>
      </Column>
      <Column>
        <Text variant="ellipsis">{account}</Text>
      </Column>
    </Row>
    <Row size={2}>
      <Column>
        <Text bold>ETH balance</Text>
      </Column>
      <Column>
        <Text>{parseFloat(ethBalance).toFixed(8)}</Text>
      </Column>
    </Row>
  </Account>
))

export default function App() {
  const [sdkWorking, setSdkWorking] = useState(false)
  const [account, setAccount] = useState('')
  const [ethBalance, setEthBalance] = useState(0)

  useEffect(() => {
    if (sdk.ethereum.web3Provider !== null) {
      setSdkWorking(true)
      sdk.ethereum.on('accountsChanged', fetchState)
      sdk.ethereum.on('networkChanged', fetchState)
    }
    fetchState()

    return () => {
      sdk.ethereum.removeListener('accountsChanged', fetchState)
      sdk.ethereum.removeListener('networkChanged', fetchState)
    }
  }, [])

  const fetchState = async () => {
    const accounts = await web3.eth.getAccounts()
    if (accounts.length) {
      const account = accounts[0]
      const weiBalance = await web3.eth.getBalance(account)
      const ethBalance = web3.utils.fromWei(weiBalance)
      setAccount(account)
      setEthBalance(ethBalance)
    }
  }

  return (
    <ThemeProvider theme={Theme}>
      <Container>
        <Row size={1}>
          <Column>
            <MainframeLogo />
          </Column>
          <Column>
            <MainframeHeader sdkWorking={sdkWorking} />
          </Column>
        </Row>
        {sdkWorking && account ? (
          <AccountData account={account} ethBalance={ethBalance} />
        ) : null}
        <Row size={1}>
          <Column>
            <Text variant="center">
              Edit <Text variant="code">src/App.js</Text> and save to reload.
            </Text>
          </Column>
        </Row>
        <Row size={1}>
          <Column>
            <Text variant="center">
              Access <Text variant="code">mainframe.com/developers</Text> and
              learn to build on Mainframe.
            </Text>
          </Column>
        </Row>
      </Container>
    </ThemeProvider>
  )
}
