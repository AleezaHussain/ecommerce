// lib/saleMedicineDb.js
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
        excipients: medicineData.excipients || medicineData.ingredients || [],
        expiry_date: medicineData.expiryDate,
        manufacture_date: medicineData.manufactureDate,
        status: 'Accepted',
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

export const updateSaleMedicine = async (medicineId, updates, walletAddress) => {
  try {
    const { data, error } = await supabase
      .from('sale_medicine')
      .update(updates)
      .eq('medicine_id', medicineId)
      .eq('wallet_address', walletAddress)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating sale medicine:', error);
    throw error;
  }
};

export const removeMedicineFromSale = async (medicineId, walletAddress) => {
  try {
    const { error } = await supabase
      .from('sale_medicine')
      .delete()
      .eq('medicine_id', medicineId)
      .eq('wallet_address', walletAddress);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing medicine from sale:', error);
    throw error;
  }
};

export const fetchSaleMedicinesByWallet = async (walletAddress) => {
  try {
    const { data, error } = await supabase
      .from('sale_medicine')
      .select('*')
      .eq('wallet_address', walletAddress);

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
      .contains('types', [type]); // Use array containment operator

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Full error details:', error);
    throw new Error(`Failed to fetch medicines: ${error.message}`);
  }
};
// lib/saleMedicineDb.js
// Add this new function to fetch all medicines
export const fetchAllMedicines = async () => {
  try {
    const { data, error } = await supabase
      .from('sale_medicine')
      .select('*');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching all medicines:', error);
    throw error;
  }
};

export const decrementMedicineQuantity = async (medicineId, quantityToDecrement, walletAddress) => {
  try {
    // First get current quantity - remove .single() and handle possible multiple rows
    const { data: currentData, error: fetchError } = await supabase
      .from('sale_medicine')
      .select('quantity')
      .eq('medicine_id', medicineId)

    if (fetchError) throw fetchError;
    if (!currentData || currentData.length === 0) {
      throw new Error('Medicine not found');
    }
    if (currentData.length > 1) {
      throw new Error('Multiple medicines found with same ID and wallet');
    }

    const currentQuantity = currentData[0].quantity;
    
    // Validate we have enough stock
    if (currentQuantity < quantityToDecrement) {
      throw new Error('Insufficient stock available');
    }

    const newQuantity = currentQuantity - quantityToDecrement;

    // Update the quantity
    const { data, error } = await supabase
      .from('sale_medicine')
      .update({ quantity: newQuantity })
      .eq('medicine_id', medicineId)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error('Update failed - no rows affected');
    }
    
    return {
      success: true,
      newQuantity: newQuantity,
      medicineId: medicineId
    };
    
  } catch (error) {
    console.error('Error decrementing medicine quantity:', error);
    throw error;
  }
};

// New function to decrement quantities for multiple medicines
export const batchDecrementQuantities = async (items) => {
  try {
    const results = [];
    
    for (const item of items) {
      try {
        const result = await decrementMedicineQuantity(
          item.medicine_id, 
          item.quantity, 
          item.wallet_address
        );
        results.push(result);
      } catch (error) {
        console.error(`Error decrementing quantity for medicine ${item.medicine_id}:`, error);
        results.push({
          success: false,
          medicineId: item.medicine_id,
          error: error.message
        });
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error in batch decrement:', error);
    throw error;
  }
};


export const validateCartItems = async (items) => {
  const validationResults = [];
  
  for (const item of items) {
    try {
      if (!item.medicine_id) {
        validationResults.push({
          medicineId: 'unknown',
          name: item.name || 'Unknown item',
          valid: false,
          error: 'Missing medicine_id'
        });
        continue;
      }

      const { data, error } = await supabase
        .from('sale_medicine')
        .select('quantity, name')
        .eq('medicine_id', item.medicine_id)
        .single();

      if (error) {
        console.error('Supabase query error for item:', item.medicine_id, error);
        throw error;
      }
      
      if (!data) {
        validationResults.push({
          medicineId: item.medicine_id,
          name: item.name,
          valid: false,
          error: 'No longer available'
        });
      } else if (data.quantity < item.quantity) {
        validationResults.push({
          medicineId: item.medicine_id,
          name: data.name || item.name,
          valid: false,
          error: `Only ${data.quantity} remaining (you requested ${item.quantity})`
        });
      } else {
        validationResults.push({
          medicineId: item.medicine_id,
          name: data.name || item.name,
          valid: true
        });
      }
    } catch (error) {
      console.error('Validation error for item:', item.medicine_id, error);
      validationResults.push({
        medicineId: item.medicine_id,
        name: item.name,
        valid: false,
        error: 'Validation failed - please try again'
      });
    }
  }
  
  return validationResults;
};