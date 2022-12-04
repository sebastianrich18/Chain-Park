/*ChainPark constructor takes [lotMaxCapacities, lotTypes, maxFee, dailyIncome]
  LOT INDEXES ARE AS FOLLOWS (in order of apperance from the table at https://www.buffalo.edu/parking/parking-places.html):
  0: NONE / NULL
  1: Arena
  2: Alumni A, B, C
  3: Baird A
  4: Baird B
  5: Cooke A, B
  6: Crofts
  7: Fargo
  8: Furnas
  9: Governors A
  10: Governors B, C, D
  11: Governors E
  12: Hochstetter A
  13: Hochstetter B
  14: Jacobs A
  15: Jacobs B, C
  16: Jarvis A
  17: Jarvis B
  18: Ketter
  19: Lake LaSalle
  20: Red Jacket
  21: Richmond A
  22: Richmond B
  23: Special Event Parking
  24: Stadium
  25: Slee A, B
  26: Fronzack
*/
var ethers = require("ethers");
var ChainPark = artifacts.require("ChainPark");
var UBPC = artifacts.require("UBParkingCredits");


module.exports = async function (deployer) {
  let lotMaxCap = [9999, 8, 5, 211, 432, 54, 28, 543, 234, 62, 54, 123, 431, 213, 321, 321, 123, 123, 321, 1234, 124, 1233, 213, 123, 321, 234, 321]; // we can get a accurate number from the parking office or counting
  // for lot types, 0=Staff, 1=Student, 2=Both

  // let lotTypes = [2, 1, 2, 2, 0, 2, 2, 2, 0, 0, 2, 1, 0, 2, 0, 2, 2, 2, 2, 1, 2, 2, 2, 1, 1, 2, 2]
  let maxFee = ethers.utils.parseEther("10");
  let dailyIncome = ethers.utils.parseEther("20");
  
  let initalSupply = 0

  await deployer.deploy(UBPC, initalSupply, { overwrite: true }) // deploy the UBPC token
  let ubpc = await UBPC.deployed();
  
  await deployer.deploy(ChainPark, lotMaxCap, ubpc.address, maxFee, dailyIncome, { overwrite: true })  // after UBPC is deployed, deploy ChainPark with ubpc's address
  let chain_park = await ChainPark.deployed();
  
  await ubpc.setChainPark(chain_park.address); // once ChainPark is deployed, set ChainPark address in UBPC

};

// Command to deploy and verify: truffle migrate --network goerli && truffle run verify --network goerli ChainPark UBParkingCredits
