const UBPC = artifacts.require("UBParkingCredits");
const ChainPark = artifacts.require("ChainPark");

const { time, expectRevert } = require('@openzeppelin/test-helpers');


const BLOCKS_PER_DAY = 7167; // will be used to simulate time passing

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("UBParkingCredits", async function (accounts) {
  // before(async () => {
  //   let ubpcInstance = await UBPC.deployed();
  //   let cpInstance = await ChainPark.deployed();
  //   console.log("ChainPark address: " + cpInstance.address);
  //   console.log("Chain address in UBPC: " + await ubpcInstance.CHAIN_PARK());
  //   console.log("UBPC address: " + ubpcInstance.address);
  //   console.log("UBPC address in ChainPark: " + await cpInstance.UBPC_CONTRACT());
  // });

  it("shouldn't let non ChainPark addr mint", async () => {
    let ubpcInstance = await UBPC.deployed();
    expectRevert.assertion(ubpcInstance.mint(accounts[0], 100, { from: accounts[1] }));
  });

  it("inital airdrop claim works", async () => {
    // let cpInstance = await ChainPark.deployed();
    // // let ubpcInstance = await UBPC.deployed();
    // await cpInstance.claim();

  });

});
