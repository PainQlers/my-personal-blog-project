import { Router } from "express";
import { supabase } from "../utils/db.mjs";

const authRouter = Router();

authRouter.post("/register", (req, res) => {
    res.json({ ok: true });
  });

// authRouter.post("/register", async (req, res) => {
  
//     try {
//         const { email, password, username, name } = req.body;

//         // ตรวจสอบว่า username มีในฐานข้อมูลหรือไม่
//         const { data: existingUsers, error: selectError } = await supabase
//             .from('users')
//             .select('id')
//             .eq("username", username)
//             .limit(1);
        
//         if(selectError) throw selectError;

//         if(existingUsers.length > 0) {
//             return res.status(400).json({ error: "This username is already taken"})
//         }

//         const { data: authData, error: authError } = await supabase.auth.signUp({
//             email,
//             password,
//           });
      
//           if (authError) {
//             if (authError.code === "400" || authError.message.includes("already exists")) {
//               return res
//                 .status(400)
//                 .json({ error: "User with this email already exists" });
//             }
//             return res.status(400).json({ error: authError.message });
//           }
      
//           const supabaseUserId = authData.user.id;
      
//           // 3️⃣ เพิ่มข้อมูลผู้ใช้ใน table users ของ Supabase
//           const { data: insertedUser, error: insertError } = await supabase
//             .from("users")
//             .insert([
//               {
//                 id: supabaseUserId, // ใช้ id จาก Auth
//                 username,
//                 name,
//                 role: "user",
//               },
//             ])
//             .select()
//             .single(); // คืนค่า row เดียว
      
//           if (insertError) throw insertError;
      
//           res.status(201).json({
//             message: "User created successfully",
//             user: insertedUser,
//           });
      
//     } catch (error) {
//         console.error("Registration error:", error);
//         res.status(500).json({ error: "An error occurred during registration" });
//     }
//   });

  authRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) {
        if (
          error.code === "400" ||
          error.message.includes("Invalid login credentials")
        ) {
          return res.status(400).json({
            error: "Your password is incorrect or this email doesn't exist",
          });
        }
        return res.status(400).json({ error: error.message });
      }
  
      return res.status(200).json({
        message: "Signed in successfully",
        access_token: data.session.access_token,
        user: data.user,
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ error: "An error occurred during login" });
    }
  });

  export default authRouter;
  
  