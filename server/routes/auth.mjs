import { Router } from "express";

const authRouter = Router();

authRouter.post("/register", async (req, res) => {
    const { email, password, username, name } = req.body;
  
    try {
      // ตรวจสอบว่า username มีในฐานข้อมูลหรือไม่
      const usernameCheckQuery = `
                                  SELECT * FROM users 
                                  WHERE username = $1
                                 `;
      const usernameCheckValues = [username];
      const { rows: existingUser } = await connectionPool.query(
        usernameCheckQuery,
        usernameCheckValues
      );
  
      if (existingUser.length > 0) {
        return res.status(400).json({ error: "This username is already taken" });
      }
  
      // สร้างผู้ใช้ใหม่ผ่าน Supabase Auth
      const { data, error: supabaseError } = await supabase.auth.signUp({
        email,
        password,
      });
  
      // ตรวจสอบ error จาก Supabase
      if (supabaseError) {
        if (supabaseError.code === "user_already_exists") {
          return res
            .status(400)
            .json({ error: "User with this email already exists" });
        }
        // จัดการกับ error อื่นๆ จาก Supabase
        return res
          .status(400)
          .json({ error: "Failed to create user. Please try again." });
      }
  
      const supabaseUserId = data.user.id;
  
      // เพิ่มข้อมูลผู้ใช้ในฐานข้อมูล PostgreSQL
      const query = `
          INSERT INTO users (id, username, name, role)
          VALUES ($1, $2, $3, $4)
          RETURNING *;
        `;
  
      const values = [supabaseUserId, username, name, "user"];
  
      const { rows } = await connectionPool.query(query, values);
      res.status(201).json({
        message: "User created successfully",
        user: rows[0],
      });
    } catch (error) {
      res.status(500).json({ error: "An error occurred during registration" });
    }
  });
  
  