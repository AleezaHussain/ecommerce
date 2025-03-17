import { supabase } from "../lib/supabaseClientanon";

export async function getManufacturerStatus(walletAddress) {
    try {
        console.log("🔍 Querying Supabase for wallet address:", walletAddress);

        const { data, error } = await supabase
            .from("manufacturers") // Ensure table name is correct
            .select("status")
            .eq("wallet_address", walletAddress)
            .single(); // Expect only one record

        if (error && error.code !== "PGRST116") { 
            // 🔴 If it's not a "no data found" error, log it
            console.error("❌ Supabase error:", error);
            return "Error occurred";
        }

        // ✅ If found in DB, return the status
        if (data && data.status) {
            console.log("🟢 Manufacturer found in DB:", data.status);
            return data.status;
        }

        // ✅ If not found in DB, return "not_found" without treating it as an error
        console.log("🔴 Manufacturer not found in DB.");
        return "not_found";
    } catch (error) {
        console.error("❌ Unexpected error fetching manufacturer status:", error);
        return "Error occurred";
    }
}
