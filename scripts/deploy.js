const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying NudeFi contracts to the Base Sepolia testnet...");
  
  // Get the signers (deployer account)
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);
  
  // Zora Factory contract address on Base Sepolia is the same as on Base Mainnet
  const zoraFactoryAddress = "0x777777751622c0d3258f214F9DF38E35BF45baF3";
  
  // Deploy NudeFiMarketplace
  console.log("Deploying NudeFiMarketplace...");
  const NudeFiMarketplace = await ethers.getContractFactory("NudeFiMarketplace");
  const marketplace = await NudeFiMarketplace.deploy();
  await marketplace.deployed();
  console.log(`NudeFiMarketplace deployed to: ${marketplace.address}`);
  
  // Deploy NudeFiGovernance
  console.log("Deploying NudeFiGovernance...");
  const NudeFiGovernance = await ethers.getContractFactory("NudeFiGovernance");
  const governance = await NudeFiGovernance.deploy();
  await governance.deployed();
  console.log(`NudeFiGovernance deployed to: ${governance.address}`);
  
  // Create deployment info file
  const deploymentInfo = {
    network: network.name,
    marketplace: {
      address: marketplace.address,
      version: "1.0.0",
    },
    governance: {
      address: governance.address,
      version: "1.0.0",
    },
    zoraFactory: zoraFactoryAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };
  
  // Write deployment info to a file
  const deploymentDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir);
  }
  
  fs.writeFileSync(
    path.join(deploymentDir, `${network.name}-deployment.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  // Also update the chain config file
  try {
    const chainConfigPath = path.join(__dirname, "../config/chains.js");
    // Read the file as text
    let chainConfigContent = fs.readFileSync(chainConfigPath, 'utf8');
    
    // Update the contract addresses
    chainConfigContent = chainConfigContent.replace(
      /marketplace: ".*"/,
      `marketplace: "${marketplace.address}"`
    );
    chainConfigContent = chainConfigContent.replace(
      /governance: ".*"/,
      `governance: "${governance.address}"`
    );
    
    // Write the updated file
    fs.writeFileSync(chainConfigPath, chainConfigContent);
    console.log("Updated config/chains.js with new contract addresses");
  } catch (error) {
    console.warn("Could not update chain config file:", error);
  }
  
  console.log("Contracts deployed successfully!");
  console.log("Deployment information saved to:", path.join(deploymentDir, `${network.name}-deployment.json`));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
