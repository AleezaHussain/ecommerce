import { supabase } from "./supabaseClientanon";

// // Fetch all medicines
// export const fetchMedicines = async () => {
//   try {
//     const { data, error } = await supabase
//       .from("medicine")
//       .select("id, medicine_name, medicine_type, medicine_image, status");

//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error("Error fetching medicines:", error.message);
//     return [];
//   }
// };

// // Fetch medicine details
// export const fetchMedicineDetails = async (id) => {
//   try {
//     const { data: medicineData, error: medicineError } = await supabase
//       .from("medicine")
//       .select("medicine_id, medicine_name, certificate_pdf, batch_number, manufacture_date, expiry_date, medicine_type, medicine_image, description, excipients, qr_hash, status")
//       .eq("id", id)
//       .single();

//     if (medicineError) throw medicineError;

//     // Fetch rejection comments if the medicine is rejected
//     let rejectionComments = [];
//     if (medicineData.status === "rejected") {
//       const { data: commentsData, error: commentsError } = await supabase
//         .from("reject_medicine_comments")
//         .select("comments")
//         .eq("id", id);

//       if (commentsError) throw commentsError;
//       rejectionComments = commentsData;
//     }

//     medicineData.rejection_comments = rejectionComments;
//     return medicineData;
//   } catch (error) {
//     console.error("Error fetching medicine details:", error.message);
//     return null;
//   }
// };

// // Accept a medicine by ID
// export const acceptMedicine = async (id) => {
//   try {
//     const { data, error } = await supabase
//       .from("medicine")
//       .update({ status: "accepted" })
//       .eq("id", id)
//       .select();

//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error("Error accepting medicine:", error.message);
//     return null;
//   }
// };

// // Reject a medicine by ID with an optional comment
// export const rejectMedicine = async (id, comment = null) => {
//   try {
//     const { data: medicineData, error: medicineError } = await supabase
//       .from("medicine")
//       .update({ status: "rejected" })
//       .eq("id", id)
//       .select();

//     if (medicineError) throw medicineError;

//     if (comment) {
//       const { data: commentData, error: commentError } = await supabase
//         .from("reject_medicine_comments")
//         .insert([{ id, comments: comment }]);

//       if (commentError) throw commentError;
//     }

//     return medicineData;
//   } catch (error) {
//     console.error("Error rejecting medicine:", error.message);
//     return null;
//   }
// };

export const rejectMedicine = async (medicine_id, rejection_comment) => {
  try {
    // Insert the rejection comment
    const { data, error } = await supabase
      .from('medicine_reject_comments')
      .insert([{ 
        medicine_id: medicine_id, 
        rejection_comments: rejection_comment 
      }]);

    if (error) throw error;
    return data; // Return the inserted comment data
  } catch (error) {
    console.error("Error rejecting medicine:", error.message);
    return null;
  }
};

export const fetchRejectionComments = async (medicine_id) => {
  try {
    const { data, error } = await supabase
      .from('medicine_reject_comments')
      .select('rejection_comments') // Added created_at to show when comment was made
      .eq('medicine_id', medicine_id)

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching rejection comments:", error.message);
    return [];
  }
};