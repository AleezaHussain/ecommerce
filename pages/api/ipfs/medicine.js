import axios from "axios";

const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;

// Function to upload a file (PDF, Image) to IPFS
const uploadFileToIPFS = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const options = JSON.stringify({
    cidVersion: 1,
  });
  formData.append("pinataOptions", options);

  try {
    const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "pinata_api_key": PINATA_API_KEY,
        "pinata_secret_api_key": PINATA_SECRET_API_KEY,
      },
    });

    return {
      fileName: file.name,
      ipfsHash: response.data.IpfsHash,
      mimeType: file.type,
    };
  } catch (error) {
    console.error(`Error uploading file (${file.name}) to IPFS:`, error);
    return null;
  }
};

// Function to upload medicine data (JSON) and files (PDF, images) to IPFS
export const storeMedicineOnIPFS = async (medicine) => {
  try {
    let fileUploads = [];

    // Upload all attached files (PDFs, images) to IPFS
    for (const file of medicine.files) {
      const uploadedFile = await uploadFileToIPFS(file);
      if (uploadedFile) {
        fileUploads.push(uploadedFile);
      }
    }

    // Prepare JSON data for medicine, including uploaded file hashes
    const medicineData = {
      name: medicine.name,
      medicineId: medicine.medicineId,
      batchNumber: medicine.batchNumber,
      manufactureDate: medicine.manufactureDate,
      expiryDate: medicine.expiryDate,
      excipients: medicine.excipients,
      types: medicine.types,
      description: medicine.description,
      walletAddress: medicine.walletAddress,
      status: medicine.status,
      uploadedFiles: fileUploads, // Store metadata of uploaded files
    };

    // Upload JSON to IPFS
    const jsonResponse = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", medicineData, {
      headers: {
        "Content-Type": "application/json",
        "pinata_api_key": PINATA_API_KEY,
        "pinata_secret_api_key": PINATA_SECRET_API_KEY,
      },
    });

    console.log("✅ Medicine Data & Files Stored on IPFS:", {
      jsonIpfsHash: jsonResponse.data.IpfsHash,
      fileUploads,
    });

    // Return both JSON and file hashes
    return {
      jsonIpfsHash: jsonResponse.data.IpfsHash,
      fileUploads,
    };
  } catch (error) {
    console.error("❌ Error storing medicine data on IPFS:", error);
    return null;
  }
};
