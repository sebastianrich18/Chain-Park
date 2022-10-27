/*ChainPark constructor takes [lotMaxCapacities, lotTypes, maxFee, dailyIncome]
  LOT INDEXES ARE AS FOLLOWS (in order of apperance from the table at https://www.buffalo.edu/parking/parking-places.html):
  0: Arena
  1: Alumni A, B, C
  2: Baird A
  3: Baird B
  4: Cooke A, B
  5: Crofts
  6: Fargo
  7: Furnas
  8: Governors A
  9: Governors B, C, D
  10: Governors E
  11: Hochstetter A
  12: Hochstetter B
  13: Jacobs A
  14: Jacobs B, C
  15: Jarvis A
  16: Jarvis B
  17: Ketter
  18: Lake LaSalle
  19: Red Jacket
  20: Richmond A
  21: Richmond B
  22: Special Event Parking
  23: Stadium
  24: Slee A, B
  25: Fronzack
*/
var MyContract = artifacts.require("ChainPark");

module.exports = function(deployer) {
  let lotMaxCap = [100, 324, 211, 432, 54, 23, 543, 234, 62, 23, 123, 431, 213, 321, 321, 123, 123, 321, 1234, 124, 1233, 213, 123, 321, 234, 321]; // we can get a accurate number from the parking office or counting
  // for lot types, 0=Staff, 1=Student, 2=Both

  let lotTypes = [1, 2, 2, 0, 2, 2, 2, 0, 0, 2, 1, 0, 2, 0, 2, 2, 2, 2, 1, 2, 2, 2, 1, 1, 2, 2]
  let maxFee = 10
  let dailyIncome = 5
  deployer.deploy(MyContract, lotMaxCap, lotTypes, maxFee, dailyIncome);
};