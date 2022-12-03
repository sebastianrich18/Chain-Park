import Head from 'next/head'
import Image from 'next/image'
import { ethers } from "ethers"
import styles from '../styles/Home.module.css'
import { useAccount, Web3Button, useSigner, useProvider } from "@web3modal/react"
import { Nav, Navbar, NavDropdown, Container, Table, Button } from 'react-bootstrap'
import ChainPark from '../../truffle/build/contracts/ChainPark.json'
import useGetLotInfo from '../hooks/useGetLotInfo'
import useGetCurrentLot from '../hooks/useGetCurrentLot'
import useAlert from '../hooks/useAlert'
import { useEffect, useState } from 'react'


/*
TODOS:
 if you are parked, only show leave and claim
 if you are not parked, dont show leave
 call chainpark contract to get lot fee
 refresh icon to refresh capacities
*/


const NETWORK_ID = 5

const Home = () => {
  const [renderAlert, setShow, setIsError, setMessage] = useAlert()
  const [ currentLot, setCurrentLot, lotLoading ] = useGetCurrentLot();
  const { account } = useAccount();
  const { provider, isReady } = useProvider();
  const { data: signer, error, isLoading } = useSigner();
  const [currentCapacities, maxCapacities, lotFees, setCurrentCapacities] = useGetLotInfo();

  const chainParkContract = new ethers.Contract(
    ChainPark.networks[NETWORK_ID].address,
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

  const handleParkButtonClick = async (index) => {
    let tx = await chainParkContract.park(index, {value: lotFees[index]})
    let res = await tx.wait()
    console.log(tx)
    console.log(res)
    if (res.status == 1) {
      setCurrentCapacities(currentCapacities.map((x, i) => i == currentLot ? x + 1 : x))
      setCurrentLot(index)
      setShow(true)
      setIsError(false)
      setMessage("Successfully parked in lot " + LOT_LIST[index])
    }
  }

  const handleLeaveButtonClick = async () => {
    let tx = await chainParkContract.leave()
    let res = await tx.wait()
    console.log(tx)
    console.log(res)
    if (res.status == 1) {
      setCurrentCapacities(currentCapacities.map((x, i) => i == currentLot ? x - 1 : x))
      setCurrentLot(0)
      setShow(true)
      setIsError(false)
      setMessage("Successfully left lot " + LOT_LIST[currentLot])
    } else {
      setShow(true)
      setIsError(true)
      setMessage("Error leaving lot " + LOT_LIST[currentLot])
    }
  }

  const renderCapacities = () => {
    // console.log(maxCapacities)
    if (!account.isConnected) {
      return (
        <div>
          <p>Connect your wallet to view parking lot capacities</p>
        </div>
      )
    }

    // if (currentLot > 0) {
    //   return (
    //     <div>
    //       <p>You are currently parked at {LOT_LIST[currentLot]}</p>
    //       <Button variant="danger" onClick={() => handleLeaveButtonClick()}>Leave {LOT_LIST[currentLot]}</Button>
    //     </div>
    //   )
    // }

    let items = []
    console.log(lotFees)
    maxCapacities.forEach((capacity, index) => {
      if (index < LOT_LIST.length) {
        items.push(
          <tr key={index}>
            <th>{LOT_LIST[index]}</th>
            <th>{currentCapacities[index]}</th>
            <th>{capacity}</th>
            <th>{lotFees[index] ? ethers.utils.formatEther(lotFees[index]): 0.0} UBPC</th>
            <th><Button variant="outline-success" size="sm" onClick={() => handleParkButtonClick(index)}>Park at {LOT_LIST[index]}</Button></th>
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
              <Nav.Link href="#leave">Leave</Nav.Link>
              <Nav.Link href="#claim">Claim</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <Web3Button />
        </Container>
      </Navbar>
      {renderAlert()}

      <Container id="find">
        <h1>Find A Spot</h1>
        {renderCapacities()}
      </Container>

      <Container id="leave">
        <h1>Leave</h1>
        <Button variant="danger" onClick={() => handleLeaveButtonClick()}>Leave {LOT_LIST[currentLot]}</Button>
      </Container>

      <Container id="claim">
        <h1>Claim</h1>
        <p>Coming Soon!</p>
      </Container>
    </div>
  )
}
export default Home
