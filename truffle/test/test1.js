const ChainPark = artifacts.require("ChainPark");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("ChainPark", function (accounts) {
  console.log(assert);
  console.log("found " + accounts.length + " accounts");
  assert.isAtLeast(accounts.length, 100, "You need to run ganache-cli in another terminal with at least 100 accounts");


  it("should not let you park at lot 0", async function () {
    const cpInstance = await ChainPark.deployed();
    try {
      await cpInstance.park(0, {from: accounts[0]});
    } catch (error) {
      assert(error.message.includes("revert"), "parking at lot 0 should have failed");
    } 
  }),

  it("should be able to park again after leaving", async function () {
    const cpInstance = await ChainPark.deployed();
  }),

  it("every lot should incriment on park and decrement on leave", async function () {
    const cpInstance = await ChainPark.deployed();

    await cpInstance.park(5, { from: accounts[0] });
    assert.equal(await cpInstance.lotCurrentCapacities(5), 1, "lot 5 should have 1 car after 1 parks");
    for (let i=0; i<9; i++) {
      await cpInstance.park(5, { from: accounts[i+1] });
    }
    assert.equal(await cpInstance.lotCurrentCapacities(5), 10, "lot 5 should have 10 cars after 10 parks");

    await cpInstance.leave({ from: accounts[0] });
    assert.equal(await cpInstance.lotCurrentCapacities(5), 9, "lot 5 should have 9 cars after 1 leaves");
    for (let i=1; i<9; i++) {
      await cpInstance.leave({ from: accounts[i+1] });
    } 
    assert.equal(await cpInstance.lotCurrentCapacities(5), 0, "lot 5 should have 0 cars after 10 leaves");
    for (let i=0; i<27; i++) {
      for (let j=0; j<50; j++) {
        await cpInstance.park(i, { from: accounts[j] });
      }
    }
    for (let i=0; i<27; i++) {
      assert.equal(await cpInstance.lotCurrentCapacities(i), 50, `lot ${i} should have 50 cars after 50 parks`);
    }

    for (let i=0; i<27; i++) {
      for (let j=0; j<50; j++) {
        await cpInstance.leave({ from: accounts[j] });
      }
    }
    for (let i=0; i<27; i++) {
      assert.equal(await cpInstance.lotCurrentCapacities(i), 0, `lot ${i} should have 0 cars after 50 leaves`);
    }
  });
});
