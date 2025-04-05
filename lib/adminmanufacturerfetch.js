// // src/lib/manufacturerService.js
import { supabase } from "./supabaseClientanon";

// // Fetch all manufacturers (only ID, Name, and Status)
// export const fetchManufacturers = async () => {
//   try {
//     const { data, error } = await supabase
//       .from("manufacturers")
//       .select("manufacturer_id, name, status"); // Ensure manufacturer_id is included

//     if (error) throw error;
//     console.log("📌 Raw Data from Database:", data);
//     return data;
//   } catch (error) {
//     console.error("❌ Error fetching manufacturers:", error.message);
//     return [];
//   }
// };

// // Fetch full manufacturer details by ID
// export const fetchManufacturerDetails = async (id) => {
//   try {
//     // Fetch manufacturer details
//     const { data: manufacturerData, error: manufacturerError } = await supabase
//       .from("manufacturers")
//       .select(
//         "manufacturer_id, name, physical_address, phone, licence_no, email, wallet_address, certification_url, certification_no, website_url, date_of_issue, reg_date, status"
//       )
//       .eq("manufacturer_id", id)
//       .single();

//     if (manufacturerError) throw manufacturerError;

//     // Format the reg_date to remove the timestamp
//     if (manufacturerData && manufacturerData.reg_date) {
//       manufacturerData.reg_date = new Date(manufacturerData.reg_date).toISOString().split('T')[0];
//     }

//     // Fetch rejection comments if the manufacturer is rejected
//     let rejectionComments = [];
//     if (manufacturerData.status === "rejected") {
//       const { data: commentsData, error: commentsError } = await supabase
//         .from("rejection_comments")
//         .select("comments")
//         .eq("manufacturer_id", id);

//       if (commentsError) throw commentsError;
//       rejectionComments = commentsData;
//     }

//     // Add rejection comments to the manufacturer data
//     manufacturerData.rejection_comments = rejectionComments;

//     return manufacturerData;
//   } catch (error) {
//     console.error("❌ Error fetching manufacturer details:", error.message);
//     return null;
//   }
// };


// export const acceptManufacturer = async (id) => {
//   try {
//     console.log("🚧 Starting DB deletion for manufacturer:", id); // Log received ID

//     const { data, error } = await supabase
//       .from('manufacturers') // Ensure table name is correct
//       .delete() // Delete the row instead of updating
//       .eq("manufacturer_id", id) // Use 'id' to find the correct row
//       .select(); // Optional: Retrieve deleted data for logging

//     if (error) {
//       throw error;
//     }

//     console.log("✅ Manufacturer deleted successfully:", data);
//     return true; // Explicitly return true on success

//   } catch (error) {
//     console.error("❌ Error deleting manufacturer:", error.message);
//     return null;
//   }
// };


// export const rejectManufacturer = async (manufacturer_id, comment = null) => {
//   try {
//     // Update the manufacturer status to 'rejected'
//     const { data: manufacturerData, error: manufacturerError } = await supabase
//       .from("manufacturers")
//       .update({ status: "rejected" })
//       .eq("manufacturer_id", manufacturer_id)
//       .select();

//     if (manufacturerError) throw manufacturerError;

//     // If a comment is provided, insert it into the rejection_comments table
//     if (comment) {
//       const { data: commentData, error: commentError } = await supabase
//         .from("rejection_comments")
//         .insert([{ manufacturer_id, comments: comment }]);

//       if (commentError) throw commentError;
//     }

//     return manufacturerData;
//   } catch (error) {
//     console.error("❌ Error rejecting manufacturer:", error.message);
//     return null;
//   }
// };






// export const getAdminDetails = async (email) => {
//   try {
//     const { data, error } = await supabase
//       .from("users")
//       .select("*")
//       .eq("email", email)
//       .eq("role", "admin")
//       .single();

//     if (error) {
//       throw error;
//     }

//     if (!data) {
//       throw new Error("Admin not found");
//     }

//     return data;
//   } catch (error) {
//     console.error("Error fetching admin details:", error);
//     return null;
//   }
// };







// In adminmanufacturerfetch.js
export const rejectManufacturer = async (wallet_address, comment) => {
  try {
    const { data, error } = await supabase
      .from('manufacture_reject_comments')
      .insert([{ 
        wallet_address: wallet_address,
        rejection_comments: comment // Using the parameter name 'comment'
      }])
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving rejection comment:', error);
    throw error; // Re-throw to handle in calling function
  }
};

export const fetchRejectionComments = async (walletAddress) => {
  try {
    const { data, error } = await supabase
      .from('manufacture_reject_comments')
      .select('rejection_comments')
      .eq('wallet_address', walletAddress)
      .single(); // Assuming one rejection comment per manufacturer

    if (error) throw error;
    return data?.rejection_comments || "No comments provided";
  } catch (error) {
    console.error("Error fetching rejection comments:", error.message);
    return "Error loading rejection comments";
  }
};