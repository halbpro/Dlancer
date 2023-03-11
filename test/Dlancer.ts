const { ethers } = require ("hardhat");
const { expect } = require("chai")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Dlancer", function () {
  const[TITLE, DESC] = ["offer 1","offer 1 desc"]
  const [BUDGET, CATEGORY, EXP] = [tokens(1), 2, 100];

  let dlancer;
  let client, executor;
  beforeEach(async () => {
    [client, executor] = await ethers.getSigners();

    const Dlancer = await ethers.getContractFactory("Dlancer");
    dlancer = await Dlancer.deploy();
  });
  describe("Publish offer", () => {
    let transaction;
    beforeEach(async() => {
      transaction = await dlancer.connect(client).publishOffer(
        TITLE,
        DESC, 
        BUDGET,
        CATEGORY,
        EXP, { value: BUDGET });
      await transaction.wait();
    })
    
    it("Should publish offer", async () => {
      const offer = await dlancer.offers(1);
      expect(offer.title).to.equal(TITLE);
      expect(offer.description).to.equal(DESC);
      expect(offer.budget).to.equal(BUDGET);
      expect(offer.category).to.equal(CATEGORY);
      expect(offer.expirationTime).to.equal(EXP);
      expect(offer.valid).to.equal(true);
    });

    it("Cannot publish without sending funds", async() => {

    })

    it("Should emit publish event",async () => {
      expect(transaction).to.emit(dlancer, "NewOffer")
    })
  })

  describe("Cancel offer", () => {
    let transaction;
    beforeEach(async() => {
      transaction = await dlancer.connect(client).publishOffer(
        TITLE,
        DESC, 
        BUDGET,
        CATEGORY,
        EXP, { value: BUDGET });
      await transaction.wait();
    })
    
    it("Should cancel offer", async () => {
      await dlancer.connect(client).cancelOffer(1);
      const offer = await dlancer.offers(1);
      expect(offer.valid).to.equal(false);
    });
    
    it("Other account cannot cancel", async () => {
      await expect( dlancer.connect(executor).cancelOffer(1)).to.be.revertedWith('Only task owner can cancel offer');
    });

    it("Cannot cancel offer in execution", async () => {
      transaction = await dlancer.connect(executor).acceptOffer(1);
      await expect( dlancer.connect(client).cancelOffer(1)).to.be.revertedWith('Cannot cancel offer in execution');
    });

  })
});
