const UBPC = artifacts.require("UBParkingCredits");
const { time } = require('@openzeppelin/test-helpers');


const BLOCKS_PER_DAY = 7167; // will be used to simulate time passing

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("UBParkingCredits", function (accounts) {
  it("shouldn't let non ChainPark addr mint", async function () {
    let ubpcInstance = await UBPC.deployed();
    try {
      await ubpcInstance.mint(accounts[1], 10, { from: accounts[1]});
      0/0
    } catch (error) {
      if (!error.message.includes("revert")) {
        assert.fail("non ChainPark addr minting should have reverted");
      } 
    }
  });
});
