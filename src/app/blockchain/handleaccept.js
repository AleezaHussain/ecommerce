import { getManufacturerById } from "../../../lib/getmanufacturer";
import { uploadJSONToPinata, uploadPDFFromURLToPinata } from "../../../pages/api/ipfs/uploadToIPFS";
import { storeManufacturerData } from "../blockchain/blockchain";
// import { acceptManufacturer } from "../../../lib/admindatafetch";

const handleAccept = async (id, setAcceptedManufacturers, setPendingManufacturers) => {
  try {
    console.log(`🔍 Fetching manufacturer data for ID: ${id}`);

    const manufacturer = await getManufacturerById(id);

    if (!manufacturer || !manufacturer.wallet_address) {
      console.error("❌ Manufacturer data not found or missing wallet address.");
      return;
    }

    console.log("✅ Manufacturer Data Fetched:", manufacturer);

    console.log("🚀 Uploading Manufacturer JSON to Pinata...");
    const jsonCID = await uploadJSONToPinata(manufacturer);
    console.log("✅ JSON Uploaded to Pinata. IPFS Hash:", jsonCID);

    let pdfCID = null;
    if (manufacturer.certification_url) {
      console.log("📂 Fetching and Uploading PDF from URL...");
      pdfCID = await uploadPDFFromURLToPinata(manufacturer.certification_url);
      console.log("✅ PDF Uploaded to Pinata. IPFS Hash:", pdfCID);
    } else {
      console.log("ℹ️ No certification URL provided.");
    }

    console.log("🔗 Storing Manufacturer Data on Blockchain...");
    const txn = await storeManufacturerData(manufacturer.wallet_address, jsonCID, pdfCID);

    console.log("Blockchain transaction receipt (txn):", txn);
    console.log("Transaction status explicitly:", txn?.status, typeof txn.status);

    if (txn && txn.status === 1) {
      console.log("✅ Manufacturer Data Stored on Blockchain!");

      console.log("📌 Updating Manufacturer Status in Database...");
      const dbUpdate = await acceptManufacturer(id);
      console.log("DB Update Result:", dbUpdate);

      if (dbUpdate) {
        console.log("✅ Manufacturer status updated in DB!");

        setAcceptedManufacturers((prev) => [
          ...prev,
          { ...manufacturer, status: "accepted", jsonCID, pdfCID }
        ]);
        setPendingManufacturers((prev) => prev.filter((m) => m.manufacturer_id !== id));

        console.log("🎉 Manufacturer accepted, data stored on IPFS & Blockchain!");
      } else {
        console.error("❌ Failed to update manufacturer status in DB.");
      }
    } else {
      console.error("❌ Blockchain transaction failed.");
    }
  } catch (error) {
    console.error("❌ Error processing manufacturer acceptance:", error);
  }
};

export default handleAccept;
