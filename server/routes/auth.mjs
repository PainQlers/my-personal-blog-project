import { Router } from "express";
import { supabase, supabaseAdmin } from "../utils/db.mjs";
import multer from "multer";
import protectUser from "../middleware/protectUser.mjs";

const authRouter = Router();

const multerUpload = multer({ storage: multer.memoryStorage() });

const imageFileUpload = multerUpload.fields([
  { name: "profilePicFile", maxCount: 1 },
]);

authRouter.post("/register", async (req, res) => {
  
    try {
        const { email, password, username, name } = req.body;

        // ตรวจสอบ input
        if (!email || !password || !username || !name) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // ตรวจสอบว่า username มีในฐานข้อมูลหรือไม่
        const { data: existingUsers, error: selectError } = await supabase
            .from('users')
            .select('id')
            .eq("username", username)
            .limit(1);
        
        if(selectError) throw selectError;

        if(existingUsers.length > 0) {
            return res.status(400).json({ error: "This username is already taken"})
        }

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
          });
      
          if (authError) {
            if (authError.code === "400" || authError.message.includes("already exists")) {
              return res
                .status(400)
                .json({ error: "User with this email already exists" });
            }
            console.log(authError.message);
            return res.status(400).json({ error: authError.message });
          }
      
          const supabaseUserId = authData.user.id;
      
          // 3️⃣ เพิ่มข้อมูลผู้ใช้ใน table users ของ Supabase
          const { data: insertedUser, error: insertError } = await supabase
            .from("users")
            .insert([
              {
                id: supabaseUserId, // ใช้ id จาก Auth
                username,
                name,
                role: "user",
              },
            ])
            .select()
            .single(); // คืนค่า row เดียว
      
          if (insertError) throw insertError;
      
          res.status(201).json({
            message: "User created successfully",
            user: insertedUser,
          });
      
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "An error occurred during registration" });
    }
  });

authRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    // ตรวจสอบ input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
  
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
        token: data.session.access_token, // เปลี่ยนจาก access_token เป็น token
        user: data.user,
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ error: "An error occurred during login" });
    }
  });

authRouter.get("/get-user", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
  
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token missing" });
    }
  
    try {
      // ✅ ตรวจสอบ token และดึงข้อมูลผู้ใช้จาก Supabase Auth
      const { data, error } = await supabase.auth.getUser(token);
  
      if (error || !data.user) {
        return res.status(401).json({ error: "Unauthorized or token expired" });
      }
  
      const supabaseUserId = data.user.id;
  
      // ✅ ใช้ Supabase Query แทนการ query ด้วย SQL ตรง ๆ
      const { data: userRows, error: userError } = await supabase
        .from("users")
        .select("id, username, name, role, profile_pic, bio")
        .eq("id", supabaseUserId)
        .single();

      if (userError) {
        console.error("Supabase query error:", userError);
        // ถ้า error เกี่ยวกับ bio column ที่ไม่มีอยู่ ให้ลอง query โดยไม่ select bio
        if (userError.message && userError.message.includes('bio')) {
          const { data: userRowsFallback, error: userErrorFallback } = await supabase
            .from("users")
            .select("id, username, name, role, profile_pic")
            .eq("id", supabaseUserId)
            .single();

          if (userErrorFallback) {
            return res.status(400).json({ error: "Failed to fetch user details" });
          }

          return res.status(200).json({
            id: data.user.id,
            email: data.user.email,
            username: userRowsFallback.username,
            name: userRowsFallback.name,
            role: userRowsFallback.role,
            profilePic: userRowsFallback.profile_pic,
            bio: "",
          });
        }
        return res.status(400).json({ error: "Failed to fetch user details" });
      }

      // ✅ รวมข้อมูลจาก Auth และ Table users
      res.status(200).json({
        id: data.user.id,
        email: data.user.email,
        username: userRows.username,
        name: userRows.name,
        role: userRows.role,
        profilePic: userRows.profile_pic,
        bio: userRows.bio || "",
      });
    } catch (err) {
      console.error("Internal error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

// 🧩 Reset Password API
authRouter.put("/reset-password", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { oldPassword, newPassword } = req.body;

  // ตรวจสอบ token และข้อมูลที่จำเป็น
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: "Old and new password required" });
  }

  try {
    // 1️⃣ ตรวจสอบ token -> เอา user ออกมา
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData?.user) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    const email = userData.user.email;

    // 2️⃣ ตรวจสอบรหัสผ่านเดิมโดยพยายาม Sign in อีกครั้ง
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password: oldPassword,
    });

    if (loginError || !loginData?.session) {
      return res.status(400).json({ error: "Invalid old password" });
    }

    // 3️⃣ อัปเดตรหัสผ่านใหม่ (ใช้ session ปัจจุบัน)
    const { data: updateData, error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      return res.status(400).json({ error: updateError.message });
    }

    res.status(200).json({
      message: "Password updated successfully",
      user: updateData.user,
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update profile endpoint
authRouter.put("/update-profile", protectUser, imageFileUpload, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token missing" });
    }

    // Get user from token
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData?.user) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    const supabaseUserId = userData.user.id;
    const { name, username, bio } = req.body;

    // Check required fields
    if (!name || !username) {
      return res.status(400).json({ error: "Name and username are required" });
    }

    let profilePicUrl = null;

    // Handle file upload if present
    if (req.files && req.files.profilePicFile && req.files.profilePicFile.length > 0) {
      const file = req.files.profilePicFile[0];
      const bucketName = "my-personal-blog";
      const filePath = `profiles/${supabaseUserId}_${Date.now()}_${file.originalname}`;

      // Upload to Supabase Storage
      const { data: imageFile, error: errorFile } = await supabaseAdmin.storage
        .from(bucketName)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (errorFile) {
        console.error("Storage upload error:", errorFile);
        throw errorFile;
      }

      // Get public URL
      const { data: urlData } = supabaseAdmin.storage.from(bucketName).getPublicUrl(imageFile.path);
      profilePicUrl = urlData.publicUrl;
    }

    // Prepare update data
    const updateData = { name, username };
    if (bio !== undefined) {
      updateData.bio = bio;
    }
    if (profilePicUrl) {
      updateData.profile_pic = profilePicUrl;
    }

    // Update user in database
    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", supabaseUserId)
      .select();

    if (error) {
      // ถ้า error เกี่ยวกับ bio column ที่ไม่มี ให้ลอง update โดยไม่รวม bio
      if (error.message && error.message.includes('bio')) {
        const { bio: bioValue, ...updateDataWithoutBio } = updateData;
        const { data: fallbackData, error: fallbackError } = await supabase
          .from("users")
          .update(updateDataWithoutBio)
          .eq("id", supabaseUserId)
          .select();

        if (fallbackError) throw fallbackError;
        
        return res.status(200).json({
          message: "Profile updated successfully (bio column not available)",
          user: fallbackData[0],
        });
      }
      throw error;
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: data[0],
    });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
});

authRouter.put("/update-user", async (req, res) => {
  try {
    const { id, name, username } = req.body;

    // ตรวจสอบ input
    if (!id || !name || !username) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ====== ตัวอย่างถ้าใช้ Supabase ======
    const { data, error } = await supabase
      .from("users")
      .update({ name, username })
      .eq("id", id)
      .select();

    if (error) throw error;

    return res.status(200).json({
      message: "User updated successfully",
      user: data[0],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});
  
  
  
// Get site author (first admin user) for display on homepage
authRouter.get("/get-site-author", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("name, bio, profile_pic")
      .eq("role", "admin")
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching author:", error);
      // ถ้า error เกี่ยวกับ bio column ให้ลอง query โดยไม่ select bio
      if (error.message && error.message.includes('bio')) {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from("users")
          .select("name, profile_pic")
          .eq("role", "admin")
          .limit(1)
          .single();

        if (fallbackError) {
          return res.status(400).json({ error: "Failed to fetch author info" });
        }

        return res.status(200).json({ ...fallbackData, bio: "" });
      }
      return res.status(400).json({ error: "Failed to fetch author info" });
    }

    res.status(200).json(data || null);
  } catch (err) {
    console.error("Get author error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default authRouter;
  
  