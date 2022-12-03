// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract UBParkingCredits is ERC20 {
  address admin;
  address CHAIN_PARK;

  modifier onlyAdmin() {
    require(msg.sender == admin, "Only admin can call this function.");
    _;
  }

  modifier onlyChainPark() {
    require(msg.sender == CHAIN_PARK, "Only ChainPark can call this function.");
    _;
  }

  constructor(uint256 initalSupply, address _chainParkAddr) ERC20("UB Parking Credit", "UBPC") {
    admin = msg.sender;
    _mint(msg.sender, initalSupply);
    CHAIN_PARK = _chainParkAddr;
  }

  function mint(address account, uint256 amount) public onlyChainPark {
    _mint(account, amount);
  }


  function setChainPark(address _chainParkAddr) public onlyAdmin {
    CHAIN_PARK = _chainParkAddr;
  }

}
