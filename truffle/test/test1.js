const ChainPark = artifacts.require("ChainPark");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("ChainPark", function (accounts) {
  console.log("found " + accounts.length + " accounts");
  // assert.isAtLeast(accounts.length, 100, "You need to run ganache-cli in another terminal with at least 100 accounts");

  const STAFF_ONLY_LOT_INDEXES = [4, 8, 9, 12, 14]




  it("should not let you park at lot 0", async function () {
    const cpInstance = await ChainPark.deployed();
    try {
      await cpInstance.park(0, { from: accounts[0]});
      0/0
    } catch (error) {
      if (!error.message.includes("revert")) {
        await cpInstance.leave({ from: accounts[0] });
        assert.fail("parking at lot 0 should have failed");
      } 
    }
  }),

    it("should not let you park if already parked", async function () {
      const cpInstance = await ChainPark.deployed();
      try {
        await cpInstance.park(1, { from: accounts[0], value: await cpInstance.getFee(1)});
        await cpInstance.park(3, { from: accounts[0], value: await cpInstance.getFee(3)});
        assert.fail("parking while already parked should have failed");
      } catch (error) {
        assert(error.message.includes("revert"), "parking at lot 0 should have failed");
      } finally {
        await cpInstance.leave({ from: accounts[0] });
      }
    }),

    it("should not let you leave if not parked", async function () {

      const cpInstance = await ChainPark.deployed();
      try {
        await cpInstance.leave({ from: accounts[0] });
        assert.fail("leaving while not parked should have failed");
      } catch (error) {
        assert(error.message.includes("revert"), "leaving while not parked should have failed");
      }
    }),


    it("should not let you park at a lot that is full", async function () {
      const cpInstance = await ChainPark.deployed();
      for (let i=0; i<8; i++) {
        await cpInstance.park(1, { from: accounts[i], value: await cpInstance.getFee(1)});
      }
      try {
        await cpInstance.park(1, { from: accounts[5], value: await cpInstance.getFee(1)});
        assert.fail("parking at a full lot should have failed");
      } catch (error) {
        assert(error.message.includes("revert"), "parking at a full lot should have failed");
      }
      for (let i=0; i<8; i++) {
        await cpInstance.leave({ from: accounts[i]});
      }


    }),



    it("should be able to park at same lot again after leaving", async function () {
      const cpInstance = await ChainPark.deployed();
      await cpInstance.park(1, { from: accounts[0], value: await cpInstance.getFee(1)});
      await cpInstance.leave({ from: accounts[0] });
      await cpInstance.park(1, { from: accounts[0], value: await cpInstance.getFee(1)});
      await cpInstance.leave({ from: accounts[0] });

    }),


    it("should be able to park at different lot again after leaving", async function () {
      const cpInstance = await ChainPark.deployed();
      await cpInstance.park(1, { from: accounts[0], value: await cpInstance.getFee(1) });
      await cpInstance.leave({ from: accounts[0] });
      await cpInstance.park(2, { from: accounts[0], value: await cpInstance.getFee(2) })
      await cpInstance.leave({ from: accounts[0] }); // user leaves
    }),


    it("should update currentlyParked mapping when users park and leave", async function () {
      const cpInstance = await ChainPark.deployed();
      assert.equal(await cpInstance.currentlyParked(accounts[0]), 0, "user should not be parked on deployment");
      await cpInstance.park(2, { from: accounts[0], value: await cpInstance.getFee(2)}); // park in lot 1
      assert.equal(await cpInstance.currentlyParked(accounts[0]), 2, "User should be parked in lot 1"); // check that user is parked in lot 1
      await cpInstance.leave({ from: accounts[0] }); // user leaves
      assert.equal(await cpInstance.currentlyParked(accounts[0]), 0, "User should not be parked after leaving"); // check that user is not parked
    }),


    it("every lot should incriment on park and decrement on leave with one account", async function () {
      const cpInstance = await ChainPark.deployed();
      for (let i = 1; i < 27; i++) {
        if (STAFF_ONLY_LOT_INDEXES.includes(i)) {
          continue
        }
        await cpInstance.park(i, { from: accounts[0], value: await cpInstance.getFee(i)});
        assert.equal(await cpInstance.lotCurrentCapacities(i), 1, `lot ${i} should have 1 car after park`);
        await cpInstance.leave({ from: accounts[0] });
        assert.equal(await cpInstance.lotCurrentCapacities(i), 0, `lot ${i} should have 0 cars after leave`);
      }
    }),



    it("every lot should incriment on park and decrement on leave with many accounts", async function () {
      const cpInstance = await ChainPark.deployed();
      for (let lot = 1; lot < 27; lot++) {
        if (STAFF_ONLY_LOT_INDEXES.includes(lot)) {
          continue
        }
        for (let account = 0; account < 5; account++) {
          await cpInstance.park(lot, { from: accounts[account], value: await cpInstance.getFee(lot) });
        }
        assert.equal(await cpInstance.lotCurrentCapacities(lot), 5, `lot ${lot} should have 5 cars after 5 parks`);
        for (let j = 0; j < 5; j++) {
          await cpInstance.leave({ from: accounts[j] });
        }
        assert.equal(await cpInstance.lotCurrentCapacities(lot), 0, `lot ${lot} should have 0 cars after 5 leaves`);
      }
    });
});
