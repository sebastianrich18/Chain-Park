const UBPC = artifacts.require("UBParkingCredits");
const ChainPark = artifacts.require("ChainPark");

const { time, expectRevert } = require('@openzeppelin/test-helpers');


const BLOCKS_PER_DAY = 7167; // will be used to simulate time passing

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("UBParkingCredits", function (accounts) {
  it("shouldn't let non ChainPark addr mint", async () => {
    let ubpcInstance = await UBPC.deployed();
    expectRevert.assertion(ubpcInstance.mint(accounts[0], 100, { from: accounts[1] }));
  }),

  it("inital airdrop claim works", async () => {
    let ubpcInstance = await UBPC.deployed();
    let cpInstance = await ChainPark.deployed();
    await cpInstance.claim({from : accounts[0]});
    // let balance = await ubpcInstance.balanceOf(accounts[0]);
    // assert.equal(balance, 100);
  })

});
