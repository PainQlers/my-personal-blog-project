import { supabase } from "../utils/db.mjs";

// 🧱 Middleware ตรวจสอบ JWT token และสิทธิ์ Admin
const protectAdmin = async (req, res, next) => {
    try {
      // 1️⃣ ดึง token จาก Authorization header
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ error: "Unauthorized: Token missing" });
      }
  
      // 2️⃣ ตรวจสอบ token กับ Supabase Auth
      const { data, error } = await supabase.auth.getUser(token);
      if (error || !data?.user) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
      }
  
      const supabaseUserId = data.user.id;
  
      // 3️⃣ ดึง role จาก Supabase Table "users"
      const { data: userData, error: roleError } = await supabase
        .from("users")
        .select("role")
        .eq("id", supabaseUserId)
        .single();
  
      if (roleError || !userData) {
        return res.status(404).json({ error: "User role not found" });
      }
  
      // 4️⃣ แนบข้อมูล user + role ให้ request object
      req.user = { ...data.user, role: userData.role };
  
      // 5️⃣ ตรวจสอบสิทธิ์ admin
      if (req.user.role !== "admin") {
        return res
          .status(403)
          .json({ error: "Forbidden: You do not have admin access" });
      }
  
      // 6️⃣ ผ่านเงื่อนไข → ไปต่อ
      next();
    } catch (err) {
      console.error("protectAdmin error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  export default protectAdmin;