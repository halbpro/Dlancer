const hre = require("hardhat")
const fs = require("fs")
const path = require("path")
const fse = require('fs-extra');

const copyAbiToSrc = (source) => {
  
  try {  
    const directory = source ? source : path.join(__dirname, "../artifacts/contracts/");

    fs.readdir(
      directory,
      { 
        withFileTypes: true 
      }, (err: string, files: any[]) =>  {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        files.forEach((file) => {
          const newPath = path.join(directory, file.name);
          if(file.isDirectory()) {
            copyAbiToSrc(newPath);
          }
          else {          
            const contract = fs.readFileSync(newPath, "utf8");
            const json = JSON.parse(contract);
            const abi = json.abi;
            if(abi) {
              const destDir = path.join(__dirname, `../src/abis/${file.name}`);
              fs.writeFileSync(destDir, JSON.stringify(abi));
              //fse.copySync(newPath, destDir, { overwrite: true })
              console.log(`copying file: ${file.name}`);
            }
          }
        });
    });

  } catch (e) {
    console.log(`e`, e)
  }
}

async function main() {
  const[deployer] = await hre.ethers.getSigners();
  const Dlancer = await hre.ethers.getContractFactory("Dlancer");
  const dlancer = await Dlancer.deploy();
  await dlancer.deployed();

  console.log(`Deployed dlancer Contract at: ${dlancer.address}\n`);
  copyAbiToSrc("");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
