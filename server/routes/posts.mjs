import { Router } from "express";
import { createClient } from '@supabase/supabase-js';
import { validateCreatePost, validateUpdatePost } from "../validation/postsValidation.mjs";

const supabaseUrl = 'https://dngbgajbvfpzvskalouc.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const postsRouter = Router();

postsRouter.post('/', async (req, res) => {
    try {
        const { valid, errors } = validateCreatePost(req.body);
        if (!valid) return res.status(400).json({ error: errors });

        const { title, image, category_id, description, content, status_id } = req.body;
  
        const { data, error } = await supabase
            .from('posts')
            .insert([{
                title,
                image,
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
            data: data
        });
    } catch (error) {
        console.error("POST / error:", error);
        res.status(500).json({ error: error.message });
    }
})

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
      const { data, error } = await supabase
        .from('posts')
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