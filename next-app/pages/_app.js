import '../styles/globals.css'
import { Web3Modal } from '@web3modal/react'
import { chains, providers } from '@web3modal/ethereum'

const config = {
  projectId: '21951b1cdb76de6c32fb1283cd60d8f8',
  theme: 'dark',
  accentColor: 'default',
  ethereum: {
    appName: 'ChainPark',
    chains: [chains.goerli, chains.sepolia],
    providers: [providers.walletConnectProvider({projectId: '21951b1cdb76de6c32fb1283cd60d8f8'})]
  },
  autoConnect: false
}
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Web3Modal config={config} />
    </>
  )
}

export default MyApp
