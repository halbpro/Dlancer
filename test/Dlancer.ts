const { ethers } = require ("hardhat");
const { expect } = require("chai")

describe("Initial", function () {
  
  let dlancer;
  beforeEach(async () => {
    const Dlancer = await ethers.getContractFactory("Dlancer");
    dlancer = await Dlancer.deploy();
  });

  it("Should test initial setup", async () => {
    const initialNumber= await dlancer.initialNumber();
    
    expect(initialNumber).to.equal(1);
  });

});
