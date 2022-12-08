// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract UBParkingCredits is ERC20, ERC20Burnable {
  uint public constant AIRDROP_AMOUNT = 100 ether;
  address admin;
  address public CHAIN_PARK;
  mapping(address=>bool) claimed_airdrop;

  modifier onlyAdmin() {
    require(msg.sender == admin, "Only admin can call this function.");
    _;
  }

  modifier onlyChainPark() {
    require(msg.sender == CHAIN_PARK, "Only ChainPark can call this function.");
    _;
  }

  constructor(uint256 initalSupply) ERC20("UB Parking Credit", "UBPC") {
    admin = msg.sender;
    _mint(msg.sender, initalSupply);
  }

  function mint(address account, uint256 amount) public onlyChainPark {
    approve(CHAIN_PARK, amount);
    _mint(account, amount);
  }

  function claim_airdrop() public {
    require(!claimed_airdrop[msg.sender], "You have already claimed your airdrop.");
    approve(CHAIN_PARK, AIRDROP_AMOUNT);
    claimed_airdrop[msg.sender] = true;
    _mint(msg.sender, AIRDROP_AMOUNT);
  }


  function setChainPark(address _chainParkAddr) public onlyAdmin {
    CHAIN_PARK = _chainParkAddr;
  }

}
