import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Web3Modal } from '@web3modal/react'
import { chains, providers } from '@web3modal/ethereum'
import { SSRProvider } from 'react-bootstrap'

const config = {
  projectId: '21951b1cdb76de6c32fb1283cd60d8f8',
  theme: 'dark',
  accentColor: 'blue',
  ethereum: {
    appName: 'ChainPark',
    chains: [chains.goerli],
    providers: [providers.infuraProvider({ apiKey: "7967861d9f614657b268b967b155dadb"})]
  },
  autoConnect: false
}
function MyApp({ Component, pageProps }) {
  return (
    <>
      <SSRProvider>
        <Component {...pageProps} />
        <Web3Modal config={config} />
      </SSRProvider>
    </>
  )
}

export default MyApp
