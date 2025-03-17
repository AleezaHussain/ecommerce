import { supabase } from "../lib/supabaseClientanon";


export const insertMedicine = async (medicineData) => {
  try {
    // ✅ Convert JavaScript camelCase keys to Supabase snake_case keys
    const formattedData = {
      certificate_pdf: medicineData.certificate,
      medicine_name: medicineData.name,
      medicine_id: medicineData.medicineId,
      batch_number: medicineData.batchNumber,  // ✅ FIXED: Matches Supabase column name
      manufacture_date: medicineData.manufactureDate,
      expiry_date: medicineData.expiryDate,
      medicine_type: medicineData.types,
      medicine_image: medicineData.files.length > 0 ? medicineData.files[0] : null, 
      description: medicineData.description,
      wallet_address: medicineData.walletAddress,
      status: medicineData.status,
      // qr_hash: medicineData.qrHash,
      excipients: medicineData.excipients
    };

    const { data, error } = await supabase.from('medicine').insert([formattedData]);

    if (error) {
      console.error('Error inserting medicine:', error.message);
      return { success: false, error: error.message };
    }

    console.log('Medicine inserted successfully:', data);
    return { success: true, data };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { success: false, error: err.message };
  }
};
