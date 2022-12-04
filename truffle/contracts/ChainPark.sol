// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

// import IERC20 from openzeppelin
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

abstract contract IUBPC is IERC20 {
  function mint(address account, uint256 amount) public virtual;
  function claim_airdrop() public virtual;
  function setChainPark(address _chainParkAddr) public virtual;
}



contract ChainPark  {
  address admin;
  address public UBPC_CONTRACT;
  uint256 public maxFee; // the cost to park if you are the last person to park
  uint dailyIncome; // the amount you will earn if you do not park for a day
  uint staffLot; // lotIndex for lot that is reserved for staff
  //uint constant NOT_PARKED = 2**256 - 1; // use max uint to represent not parked
  mapping(address=>bool) staff;
  mapping(address=>uint) lastClaimed; // timestamp
  mapping(address=>uint) parksSinceClaim;
  mapping(address=>uint) public currentlyParked; // NOT_PARKED if not parked, otherwise lotIndex
  uint[] public lotMaxCapacities; // index 0 is not used. Lots are 1-indexed so that 0 can be used to represent not parked
  uint[] public lotCurrentCapacities;
  // enum lotType {Staff, Student, Both}
  // lotType[] lotTypes;


  event Parked(address indexed user, uint lotIndex);
  event Left(address indexed user, uint lotIndex);
  event Claimed(address indexed user, uint amount);

  modifier onlyAdmin() {
    require(msg.sender == admin, "Only admin can call this function.");
    _;
  }

  // modifier onlyStaff() {
  //   require(staff[msg.sender], "Only staff can call this function.");
  //   _;
  // }

  modifier notFull(uint lotIndex) {
    require(lotCurrentCapacities[lotIndex] < lotMaxCapacities[lotIndex], "Lot is full.");
    _;
  }

  constructor(uint[] memory _lotMaxCapacities, address _ubpcContractAddr, uint256 _maxFee, uint _dailyIncome, uint _staffLot) {
    admin = msg.sender;
    lotMaxCapacities = _lotMaxCapacities;
    lotCurrentCapacities = new uint[](_lotMaxCapacities.length);
    UBPC_CONTRACT = _ubpcContractAddr;
    maxFee = _maxFee;
    dailyIncome = _dailyIncome;
    staffLot = _staffLot;
  }


  function getFee(uint lotIndex) public view returns (uint) {
    if (lotCurrentCapacities[lotIndex] == 0) {
      return 0;
    }
    return maxFee * (lotCurrentCapacities[lotIndex] + 1) / lotMaxCapacities[lotIndex];
  }

  function park(uint lotIndex) public notFull(lotIndex) {
    require(checkUBPCBalance(msg.sender) >= getFee(lotIndex), "Insufficient UBPC.");
    require(lotIndex != 0, "Lot index cannot be 0.");
    require(currentlyParked[msg.sender] == 0, "You are already parked.");

    if (lotIndex == staffLot) {
      require(staff[msg.sender], "Only staff can park in the staff lot.");
    }

    IUBPC(UBPC_CONTRACT).transferFrom(msg.sender, address(this), getFee(lotIndex));

    lotCurrentCapacities[lotIndex]++;
    currentlyParked[msg.sender] = lotIndex;
    emit Parked(msg.sender, lotIndex);
  }

  function checkUBPCBalance(address user) public view returns (uint) {
    return IUBPC(UBPC_CONTRACT).balanceOf(user);
  }

  function mint(address account, uint256 amount) internal {
    IUBPC(UBPC_CONTRACT).mint(account, amount);
  }

  function leave() public {
    require(currentlyParked[msg.sender] != 0, "You are not parked.");
    uint lotIndex = uint(currentlyParked[msg.sender]);
    lotCurrentCapacities[lotIndex]--;
    currentlyParked[msg.sender] = 0;
    emit Left(msg.sender, lotIndex);
  }

  function claim() public {
    uint daysSinceClaim = (block.timestamp - lastClaimed[msg.sender]) / 1 days;
    require(daysSinceClaim > parksSinceClaim[msg.sender], "You have not parked for a day.");
    uint amount = (daysSinceClaim - parksSinceClaim[msg.sender]) * dailyIncome; // you will not get paid for the days you parked
    lastClaimed[msg.sender] = block.timestamp;
    parksSinceClaim[msg.sender] = 0;
    mint(msg.sender, amount);
    emit Claimed(msg.sender, amount);
  }

  function withdraw() public onlyAdmin {
    payable(msg.sender).transfer(address(this).balance);
  }

  function getLotMaxCapacities() public view returns (uint[] memory) {
    return lotMaxCapacities;
  }

  function getLotCurrentCapacities() public view returns (uint[] memory) {
    return lotCurrentCapacities;
  }

  function setMaxCapacities(uint[] memory _lotMaxCapacities) public onlyAdmin {
    lotMaxCapacities = _lotMaxCapacities;
  }

  function setMaxFee(uint256 _maxFee) public onlyAdmin {
    maxFee = _maxFee;
  }

  function setDailyIncome(uint _dailyIncome) public onlyAdmin {
    dailyIncome = _dailyIncome;
  }

  function setStaff(address _staffAddr) public onlyAdmin {
    staff[_staffAddr] = true;
  }

  function setAdmin(address newAdmin) public onlyAdmin {
    admin = newAdmin;
  }
}
