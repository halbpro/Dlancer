const { ethers } = require ("hardhat");
const { expect } = require("chai")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Dlancer", function () {
  const[TITLE, DESC] = ["offer 1","offer 1 desc"]
  const [BUDGET, CATEGORY, EXP] = [tokens(1), 2, 100];
  const [NAME, EMAIL, IMAGE] = ["Joe", "joe@email.com", "Image1"];

  let dlancer;
  let owner, client, executor;
  beforeEach(async () => {
    [owner, client, executor] = await ethers.getSigners();

    const Dlancer = await ethers.getContractFactory("Dlancer");
    dlancer = await Dlancer.deploy();
  });
  
  describe("Deployment", () => {
    it("Sets the owner", async () => {
      expect(await dlancer.owner()).to.equal(owner.address)
    })
  })

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
      await expect( dlancer.connect(client).publishOffer(
        TITLE,
        DESC, 
        BUDGET,
        CATEGORY,
        EXP)).to.be.revertedWith('Must deposit budget to contact')
    })

    it("Should emit publish event",async () => {
      expect(transaction).to.emit(dlancer, "NewOffer")
    })
  })

  describe("Worker registration", () => {
    it("Should be able to register", async() =>{
      await dlancer.connect(client).register(NAME, EMAIL, IMAGE);
      const registration = await dlancer.registrations(client.address);      
      expect(registration.name).to.equal(NAME);
      expect(registration.email).to.equal(EMAIL);
    })

    it("Should revert empty name", async() =>{
      await expect(dlancer.connect(client).register("", EMAIL, IMAGE)).to.be.revertedWith("Name must not be empty");
    })

    it("Should revert empty email", async() =>{
      await expect(dlancer.connect(client).register(NAME, "", IMAGE)).to.be.revertedWith("Email must not be empty");
    })

    it("Should revert duplicate registration", async() =>{
      await dlancer.connect(client).register(NAME, EMAIL, IMAGE);      
      await expect(dlancer.connect(client).register(NAME, EMAIL, IMAGE)).to.be.revertedWith("Registration already submitted");
    })

    it("Should emit event new regitration",async () => {
      let transaction = await dlancer.connect(executor).register(NAME, EMAIL, IMAGE);
      expect(transaction).to.emit(dlancer, "NewRegistration")
    })
  })

  describe("Worker registration handling", () => {
    beforeEach(async() => {
      let transaction = await dlancer.connect(executor).register(NAME, EMAIL, IMAGE);
      await transaction.wait();
    })

    it("Should approve user",async () => {
      await dlancer.connect(owner).approveWorker(executor.address, 1);
      const worker = await dlancer.workers(executor.address);
      const registration = await dlancer.registrations(executor.address);
      expect(worker.name).to.equal(NAME);
      expect(registration.status).to.equal(2);
    })

    it("Should revert non owner approve",async () => {      
      await expect(dlancer.connect(client).approveWorker(executor.address, 1)).to.be.revertedWith("Caller must be an owner");
    })

    it("Should emit event worker approved",async () => {
      let transaction = await dlancer.connect(owner).approveWorker(executor.address, 1)
      expect(transaction).to.emit(dlancer, "WorkerApproved")
    })
    
    it("Should reject user",async () => {
      await dlancer.connect(owner).rejectWorker(executor.address, "suspicious dude");
      const registration = await dlancer.registrations(executor.address);
      expect(registration.status).to.equal(3);
    })

    it("Should revert non owner reject",async () => {      
      await expect(dlancer.connect(client).rejectWorker(executor.address, "suspicious dude")).to.be.revertedWith("Caller must be an owner");
    })

    it("Should emit event worker rejected",async () => {
      let transaction = await dlancer.connect(owner).rejectWorker(executor.address, "suspicious dude")
      expect(transaction).to.emit(dlancer, "WorkerRejected")
    })

    it("Should ban user for bad behaviour",async () => {
      await dlancer.connect(owner).approveWorker(executor.address, 1);
      let worker = await dlancer.workers(executor.address);
      expect(worker.badActor).to.equal(false);
      await dlancer.connect(owner).banWorker(executor.address);
      worker = await dlancer.workers(executor.address);
      expect(worker.badActor).to.equal(true);
      const registration = await dlancer.registrations(executor.address);
      expect(registration.status).to.equal(3);
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
      const balanceBefore = await ethers.provider.getBalance(client.address);
      await dlancer.connect(client).cancelOffer(1);
      const balanceAfter = await ethers.provider.getBalance(client.address);
      const offer = await dlancer.offers(1);
      expect(offer.valid).to.equal(false);      
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });
    
    it("Other account cannot cancel", async () => {
      await expect( dlancer.connect(executor).cancelOffer(1)).to.be.revertedWith('Only task owner can cancel offer');
    });

    it("Cannot cancel offer in execution", async () => {
      transaction = await dlancer.connect(executor).acceptOffer(1);
      await expect( dlancer.connect(client).cancelOffer(1)).to.be.revertedWith('Cannot cancel offer in execution');
    });
  })

  describe("Job workflow", () => {
    let transaction;
    let jobId;
    beforeEach(async() => {
      transaction = await dlancer.connect(client).publishOffer(
        TITLE,
        DESC, 
        BUDGET,
        CATEGORY,
        EXP, { value: BUDGET });
      await transaction.wait();
      
      transaction = await dlancer.connect(executor).acceptOffer(1);
      await transaction.wait();
    })

    it("Should create a job", async () => {      
      const job = await dlancer.jobs(1);
      expect(job.workerAddress).to.equal(executor.address);
    })

    it("Should emit offer accepted", async () => {   
      expect(transaction).to.emit(dlancer, "OfferAccepted")
    })

    it("Should complete a job",async () => {
      await dlancer.connect(executor).jobCompleted(1);
      const job = await dlancer.jobs(1);
      expect(job.status).to.equal(1);
    })

    it("Should emit job completed",async () => {
      await dlancer.connect(executor).jobCompleted(1);
      expect(transaction).to.emit(dlancer, "JobCompleted")
    })

    it("Should set to fail job ",async () => {      
      await expect( dlancer.connect(client).cancelOffer(1)).to.be.revertedWith('Cannot cancel offer in execution');
      await dlancer.connect(executor).jobFailed(1);      
      await dlancer.connect(client).cancelOffer(1);      
      const offer = await dlancer.offers(1);
      await expect( offer.valid).to.equal(false);
    })

    it("Should revert confirm job done non client", async() => {
      await dlancer.connect(executor).jobCompleted(1);
      await expect( dlancer.connect(executor).confirmJobCompleted(1)).to.be.revertedWith('Only client can confirm job done');
      //await dlancer.connect(executor).confirmJobCompleted(1);
    })

    it("Should transfer fund after confirm job done", async() => {
      await dlancer.connect(executor).jobCompleted(1);
      const balanceBefore = await ethers.provider.getBalance(executor.address);
      await dlancer.connect(client).confirmJobCompleted(1);
      const balanceAfter = await ethers.provider.getBalance(executor.address);
      //console.log({balanceBefore: balanceBefore, balanceAfter: balanceAfter, budget: BUDGET});
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    })
  })
});
