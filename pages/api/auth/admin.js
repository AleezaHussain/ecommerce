// pages/api/auth/admin.js

import { supabase } from "../../../lib/supabaseClientservice";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    try {
      const { data, error } = await supabase
        .from("users")
        .select("email, role")
        .eq("email", email)
        .eq("role", "admin")
        .single();

      if (error || !data) {
        return res.status(404).json({ message: "Admin not found" });
      }

      return res.status(200).json({
        email: data.email,
        role: data.role,
      });
    } catch (error) {
      console.error("Admin GET error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    try {
      const { data, error } = await supabase
        .from("users")
        .select("email, password, role")
        .eq("email", email)
        .eq("role", "admin")
        .single();

      if (error || !data) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Example password check (plaintext — replace with hashed check in real app)
      if (data.password !== password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      return res.status(200).json({ message: "Login successful", email: data.email, role: data.role });
    } catch (error) {
      console.error("Admin POST error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
