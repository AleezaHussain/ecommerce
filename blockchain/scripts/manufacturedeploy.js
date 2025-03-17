const hre = require("hardhat");
const fs = require("fs");

async function main() {
    // Get the contract factory
    const ManufacturerStorage = await hre.ethers.getContractFactory("ManufacturerNFTStorage");


    console.log("🚀 Deploying ManufacturerStorage contract...");

    // Deploy the contract
    const contract = await ManufacturerStorage.deploy();
await contract.waitForDeployment(); // Ensures proper deployment
// This replaces 'deployed()' in Hardhat's new version

    const contractAddress = await contract.getAddress(); // Get contract address properly

    console.log(`✅ Contract deployed successfully at: ${contractAddress}`);

    // Save contract address to a JSON file
    const contractData = {
        contractAddress: contractAddress,
        network: hre.network.name,
        timestamp: new Date().toISOString()
    };

    fs.writeFileSync("deployedAddress.json", JSON.stringify(contractData, null, 2));
    console.log("📄 Contract address saved to `deployedAddress.json`");
}

// Run the script and catch errors
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });
