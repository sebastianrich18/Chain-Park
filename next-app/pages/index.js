import Head from 'next/head'
import Image from 'next/image'
import { ethers } from "ethers"
import styles from '../styles/Home.module.css'
import { useAccount, Web3Button, useSigner, useProvider } from "@web3modal/react"
import { Nav, Navbar, NavDropdown, Container, Table, Button } from 'react-bootstrap'
import ChainPark from '../../truffle/build/contracts/ChainPark.json'
import useGetLotInfo from '../hooks/useGetLotInfo'


/*
TODOS:
 if you are parked, only show leave and claim
 if you are not parked, dont show leave
 call chainpark contract to get lot fee
 refresh icon to refresh capacities
*/


const NETWORK_ID = 5

const Home = () => {
  const { account } = useAccount()
  const { provider, isReady } = useProvider()
  const { data: signer, error, isLoading } = useSigner()
  const [currentCapacities, maxCapacities, lotFees] = useGetLotInfo()

  const chainParkContract = new ethers.Contract(
    ChainPark.networks[5].address,
    ChainPark.abi,
    isLoading ? provider : signer
  )

  const LOT_LIST = [
    "NONE",
    "Arena",
    "Alumni A, B, C",
    "Baird A",
    "Baird B",
    "Cooke A, B",
    "Crofts",
    "Fargo",
    "Furnas",
    "Governors A",
    "Governors B, C, D",
    "Governors E",
    "Hochstetter A",
    "Hochstetter B",
    "Jacobs A",
    "Jacobs B, C",
    "Jarvis A",
    "Jarvis B",
    "Ketter",
    "Lake LaSalle",
    "Red Jacket",
    "Richmond A",
    "Richmond B",
    "Special Event Parking",
    "Stadium",
    "Slee A, B",
    "Fronzack"
  ]


  const handleParkButtonClick = (index) => {
      let tx = chainParkContract.park(index)
      tx.then((tx) => {
        console.log(tx)
      })

  }


  const renderCapacities = () => {
    // console.log(maxCapacities)
    let items = []
    maxCapacities.forEach((capacity, index) => {
      if (index < LOT_LIST.length) {
        items.push(
          <tr key={index}>
            <th>{LOT_LIST[index]}</th>
            <th>{currentCapacities[index]}</th>
            <th>{capacity}</th>
            <th>{lotFees[index]} UBPC</th>
            <th><Button variant="outline-success" size="sm" onClick={() =>handleParkButtonClick(index)}>Park at {LOT_LIST[index]}</Button></th>
          </tr>
        )
      }
    })

    // console.log(items)
    return (
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Parking Lot</th>
            <th>Current Capacity</th>
            <th>Max Capacity</th>
            <th>Current Fee</th>
            <th>Park Here</th>
          </tr>
        </thead>
        <tbody>
          {items.slice(1)}
        </tbody>
      </Table>
    )
  }


  return (
    <div>
      <Head>
        <title>ChainPark</title>
        <meta name="description" content="ChainPark" />
      </Head>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">UB Chain-Park</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#find">Find A Spot</Nav.Link>
              <Nav.Link href="#park">Park</Nav.Link>
              <Nav.Link href="#leave">Leave</Nav.Link>
              <Nav.Link href="#claim">Claim</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <Web3Button />
        </Container>
      </Navbar>

      <Container id="find">
        <h1>Find A Spot</h1>
        {renderCapacities()}
      </Container>

      <Container id="park">
        <h1>Park</h1>
      </Container>

      <Container id="leave">
        <h1>Leave</h1>
      </Container>

      <Container id="claim">
        <h1>Claim</h1>
      </Container>
    </div>
  )
}
export default Home
