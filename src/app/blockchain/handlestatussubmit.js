import { getManufacturerStatus } from "../../../lib/check-status";
import { checkManufacturerStatus } from "../blockchain/checkapprovedstatus"; // Importing blockchain check

export async function handleSubmit(inputValue, setErrorMessage, setStatus, setStatusColor, setStatusModalOpen) {
    if (!inputValue) {
        setErrorMessage("Please enter a valid wallet address.");
        return;
    }
    setErrorMessage(""); // Clear error if input is valid

    setStatus("Processing...");
    setStatusColor("#FFC107");

    try {
        console.log("🔍 Fetching manufacturer status for wallet:", inputValue);
        const status = await getManufacturerStatus(inputValue);
        console.log("🟢 Database returned status:", status);

        // ✅ If "accepted", return immediately (no need to check blockchain)
        if (status === "accepted") {
            console.log("🟢 Manufacturer is accepted (DB), no blockchain check needed.");
            setStatus(status);
            setStatusColor("#4CAF50"); // Green
            setStatusModalOpen(true);
            return;
        }

        let statusColor = "#FFC107"; // Default color for pending
        let finalStatus = status;  // Store status for UI update

        if (status === "rejected") {
            statusColor = "#F44336"; // Red for rejected
        } else if (status === "pending") {
            statusColor = "#FFC107"; // Yellow for pending
        } else {
            console.log("🔴 Wallet address not found in DB. Checking blockchain...");

            // 🔹 Now check blockchain using login function
            const blockchainResult = await checkManufacturerStatus(inputValue); // Ensure walletAddress is provided

                if (blockchainResult.success) {
                    console.log("🟢 Manufacturer found on Blockchain!");

                    // ✅ Fix: Ensure UI updates correctly
                    finalStatus = "Accepted!";
                    statusColor = "#238520"; // Green color
                } else {
                    console.log("🔴 Manufacturer not found anywhere.");
                    setErrorMessage("Wallet address not found in database or blockchain.");
                    setStatus("");
                    return;
                }
                        }

        setTimeout(() => {
            console.log(`✅ Updating UI: Status = ${finalStatus}, Color = ${statusColor}`);
            setStatus(finalStatus);
            setStatusColor(statusColor);
            setStatusModalOpen(true);
        }, 1500);
    } catch (error) {
        console.error("❌ Error fetching manufacturer status:", error);
        setErrorMessage("An error occurred while checking the status.");
        setStatus("");
    }
}
