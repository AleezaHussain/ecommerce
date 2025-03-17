const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log(`🚀 Deploying contracts with account: ${deployer.address}`);

    // ✅ Deploy the MedicineNFT contract
    const MedicineNFT = await hre.ethers.getContractFactory("MedicineNFT");
    const contract = await MedicineNFT.deploy();

    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();

    console.log(`✅ MedicineNFT deployed at: ${contractAddress}`);

    // ✅ Save contract address to the correct location
    saveContractData(contractAddress);
}

// ✅ Function to save contract address (Fix file path issue)
function saveContractData(contractAddress) {
    const deploymentPath = path.join(__dirname, "../deployedAddress.json"); // ✅ Fix file path

    const data = JSON.stringify({ contractAddress }, null, 2);
    fs.writeFileSync(deploymentPath, data);

    console.log(`📄 Contract address saved to deployedAddress.json at ${deploymentPath}`);
}

// ✅ Run the script and handle errors
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });
