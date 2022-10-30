import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useAccount, Web3Button } from "@web3modal/react"
import { Nav, Navbar, NavDropdown, Container } from 'react-bootstrap'



export default function Home() {
  const { account } = useAccount()

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
    </div>
  )
}
