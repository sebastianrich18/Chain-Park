import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useAccount, Web3Button } from "@web3modal/react"



export default function Home() {
  const { account } = useAccount()

  return (
    <div>
      {account.isConnected ? <h1>Connected to {account.address}</h1> : null}
      <Web3Button />
    </div>
  )
}
