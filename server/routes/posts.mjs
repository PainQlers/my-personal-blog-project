import { Router } from "express";
import { validateCreatePost, validateUpdatePost } from "../validation/postsValidation.mjs";
import { supabase, supabaseAdmin } from "../utils/db.mjs";
import multer from "multer";
import protectUser from "../middleware/protectUser.mjs";

const postsRouter = Router();

const multerUpload = multer({ storage: multer.memoryStorage() });

const imageFileUpload = multerUpload.fields([
  { name: "imageFile", maxCount: 1 },
]);

postsRouter.post('/', protectUser, imageFileUpload, async (req, res) => {
    try {
        if (!req.files || !req.files.imageFile || req.files.imageFile.length === 0) {
          return res.status(400).json({ error: "Image file is required" });
        }

        // 1) รับข้อมูลจาก request body และไฟล์ที่อัปโหลด
        const newPost = req.body;
        const file = req.files.imageFile[0];

        // 2) กำหนด bucket และ path ที่จะเก็บไฟล์ใน Supabase
        const bucketName = "my-personal-blog";
        const filePath = `posts/${Date.now()}_${file.originalname}`; // สร้าง path ที่ไม่ซ้ำกัน

        // 3) อัปโหลดไฟล์ไปยัง Supabase Storage
        const { data: imageFile, error: errorFile } = await supabaseAdmin.storage
        .from(bucketName)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false, // ป้องกันการเขียนทับไฟล์เดิม
        });

      if (errorFile) {
        console.error("Storage upload error:", errorFile);
        throw errorFile;
      }

      // 4) ดึง URL สาธารณะของไฟล์ที่อัปโหลด
      const { data: urlData } = supabaseAdmin.storage.from(bucketName).getPublicUrl(imageFile.path);
      const publicUrl = urlData.publicUrl;

      console.log("Uploaded file path:", imageFile.path);
      console.log("Public URL:", publicUrl);

        // Add image URL to req.body before validation
        req.body.image = publicUrl;
        
        // Convert category_id to number if it's a string
        if (req.body.category_id && typeof req.body.category_id === 'string') {
          req.body.category_id = parseInt(req.body.category_id);
        }
        
        // Convert status_id to number if it's a string
        if (typeof req.body.status_id === 'string') {
          req.body.status_id = parseInt(req.body.status_id);
        }

        const { valid, errors } = validateCreatePost(req.body);
        if (!valid) return res.status(400).json({ error: errors });

        const { title, image, category_id, description, content, status_id } = req.body;
  
        const { data: postData, error } = await supabase
            .from('posts')
            .insert([{
                title,
                image: publicUrl,
                category_id,
                description,
                content,
                status_id
            }])
            .select()
            .single();
  
        if (error) throw error;
  
        res.status(201).json({
            message: "Created post successfully",
            data: postData
        });
    } catch (error) {
        console.error("POST / error:", error);
        res.status(500).json({ error: error.message });
    }
})

postsRouter.get("/status", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('statuses')
      .select('*');

    if (error) throw error;

    return res.status(200).json({
        data: data
    });

  } catch (err) {
    console.error("GET / error:", err);
    res.status(500).json({ error: err.message });
  }
});


postsRouter.get('/:postId', async (req, res) => {
    try {
      const postIdFromClient = req.params.postId;

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postIdFromClient)
        .single();
  
      if (error) throw error;
  
      return res.status(200).json({
          data: data
      });
  
    } catch (err) {
      console.error("GET /:postId error:", err);
      res.status(500).json({ error: err.message });
    }
  });

postsRouter.get('/', async (req, res) => {
    try {
      let categoryId = null;
      // Parse status filter if provided
      const statusIdFilter = req.query.status_id ? parseInt(req.query.status_id) : null;
      
      // ถ้ามี category parameter ให้หา category_id ก่อน
      if (req.query.category) {
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('id')
          .eq('name', req.query.category)
          .single();
        
        if (!categoryError && categoryData) {
          categoryId = categoryData.id;
        }
      }

      let query = supabase
        .from('posts')
        .select(`
          *,
          categories (
            id,
            name
          ),
          statuses (
            id,
            status
          )
        `);

      // กรองตาม category_id ถ้ามี
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      // กรองตาม status_id ถ้ามี
      if (statusIdFilter !== null && !Number.isNaN(statusIdFilter)) {
        query = query.eq('status_id', statusIdFilter);
      }

      // Pagination
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to);

      const { data, error } = await query;

      if (error) throw error;

      // นับจำนวน total records
      let countQuery = supabase
        .from('posts')
        .select('*', { count: 'exact', head: true });
      
      if (categoryId) {
        countQuery = countQuery.eq('category_id', categoryId);
      }
      if (statusIdFilter !== null && !Number.isNaN(statusIdFilter)) {
        countQuery = countQuery.eq('status_id', statusIdFilter);
      }
      
      const { count: totalCount } = await countQuery;

      const totalPages = Math.ceil(totalCount / limit);

      return res.status(200).json({
          data: data,
          currentPage: page,
          totalPages: totalPages,
          totalItems: totalCount,
          itemsPerPage: limit
      });
  
    } catch (err) {
      console.error("GET / error:", err);
      res.status(500).json({ error: err.message });
    }
  });

// Toggle like count for a post (increment or decrement)
postsRouter.patch('/:postId/likes', async (req, res) => {
  try {
    const postIdFromClient = req.params.postId;
    const { action } = req.body; // 'like' | 'unlike'

    if (!['like', 'unlike'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action. Use like or unlike.' });
    }

    const { data: existingPost, error: fetchError } = await supabase
      .from('posts')
      .select('id, likes_count')
      .eq('id', postIdFromClient)
      .single();

    if (fetchError) throw fetchError;
    if (!existingPost) return res.status(404).json({ error: 'Post not found' });

    const currentLikes = Number(existingPost.likes_count) || 0;
    const delta = action === 'like' ? 1 : -1;
    const nextLikes = Math.max(0, currentLikes + delta);

    const { data: updatedPost, error: updateError } = await supabase
      .from('posts')
      .update({ likes_count: nextLikes })
      .eq('id', postIdFromClient)
      .select('id, likes_count')
      .single();

    if (updateError) throw updateError;

    return res.status(200).json({
      data: updatedPost
    });
  } catch (err) {
    console.error("PATCH /:postId/likes error:", err);
    res.status(500).json({ error: err.message });
  }
});

postsRouter.put('/:postId', async (req, res) => {
    try {
        const { valid, errors } = validateUpdatePost(req.body);
        if (!valid) return res.status(400).json({ error: errors });

        const postIdFromClient = req.params.postId;
        const { title, image, category_id, description, content, status_id } = req.body;
  
        const { data, error } = await supabase
            .from('posts')
            .update({
                title,
                image,
                category_id,
                description,
                content,
                status_id
            })
            .eq('id', postIdFromClient)
            .select()
            .single();
  
        if (error) throw error;
  
        res.status(200).json({
            message: "Post info has been updated successfully",
            data: data
        });
    } catch (error) {
        console.error("PUT / error:", error);
        res.status(500).json({ error: error.message });
    }
})

postsRouter.delete('/:postId', async (req, res) => {
    try {
      const postIdFromClient = req.params.postId;

      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postIdFromClient);
  
      if (error) throw error;
  
      return res.status(200).json({
          message: "Delete data successfully"
      });
  
    } catch (err) {
      console.error("DELETE / error:", err);
      res.status(500).json({ error: err.message });
    }
  });
export default postsRouter;