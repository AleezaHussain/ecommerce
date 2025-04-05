import { supabase } from './supabaseClientanon';

export const addMedicineToSale = async (medicineData) => {
  try {
    const { data, error } = await supabase
      .from('sale_medicine')
      .insert([{
        medicine_id: medicineData.tokenId,
        name: medicineData.name,
        batch_number: medicineData.batchNumber,
        description: medicineData.description,
        excipients: medicineData.excipients,
        expiry_date: medicineData.expiryDate,
        manufacture_date: medicineData.manufactureDate,
        status: 'Accepted', // Default status for sale items
        types: medicineData.types,
        image_url: medicineData.uploadedFiles?.[0]?.ipfsHash 
          ? `https://ipfs.io/ipfs/${medicineData.uploadedFiles[0].ipfsHash}` 
          : null,
        wallet_address: medicineData.walletAddress,
        price: medicineData.price,
        quantity: medicineData.quantity
      }])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error adding medicine to sale:', error);
    throw error;
  }
};

export const updateSaleMedicine = async (medicineId, updates) => {
  try {
    const { data, error } = await supabase
      .from('sale_medicine')
      .update(updates)
      .eq('medicine_id', medicineId)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating sale medicine:', error);
    throw error;
  }
};

export const removeMedicineFromSale = async (medicineId) => {
  try {
    const { error } = await supabase
      .from('sale_medicine')
      .delete()
      .eq('medicine_id', medicineId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing medicine from sale:', error);
    throw error;
  }
};

export const fetchAllSaleMedicines = async () => {
  try {
    const { data, error } = await supabase
      .from('sale_medicine')
      .select('*');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching sale medicines:', error);
    throw error;
  }
};


export const fetchMedicinesByType = async (type) => {
  try {
    const { data, error } = await supabase
      .from('sale_medicine')
      .select('*')
      .contains('types', [type]); // This searches for the type in the types array

    if (error) throw error;
    
    // You might want to add some data transformation here if needed
    return data || [];
  } catch (error) {
    console.error(`Error fetching ${type} medicines:`, error);
    throw error;
  }
};

export const fetchAllMedicineTypes = async () => {
  try {
    const { data, error } = await supabase
      .from('sale_medicine')
      .select('types');

    if (error) throw error;
    
    // Flatten and get unique types
    const allTypes = data.flatMap(item => item.types || []);
    const uniqueTypes = [...new Set(allTypes)];
    return uniqueTypes.filter(Boolean); // Remove any null/undefined values
  } catch (error) {
    console.error('Error fetching medicine types:', error);
    throw error;
  }
};