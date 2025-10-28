import { Router } from "express";
import { supabase, supabaseAdmin } from "../utils/db.mjs";
import protectUser from "../middleware/protectUser.mjs";

const categoryRouter = Router();

// Create category
categoryRouter.post("/category", async (req, res) => {
    try {
      const { name } = req.body;

      if (!name || String(name).trim() === "") {
        return res.status(400).json({ error: "Category name is required" });
      }

      // Optional: prevent duplicates by name (case-insensitive)
      const { data: existing, error: existingError } = await supabase
        .from('categories')
        .select('*')
        .ilike('name', name.trim())
        .maybeSingle();

      if (existingError) throw existingError;
      if (existing) {
        return res.status(409).json({ error: "Category name already exists" });
      }

      const { data, error } = await supabase
        .from('categories')
        .insert({ name: name.trim() })
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json({
          message: "Category created successfully",
          data
      });

    } catch (err) {
      console.error("POST /category error:", err);
      res.status(500).json({ error: err.message });
    }
});

categoryRouter.get("/category", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('id', { ascending: true });
  
      if (error) throw error;
  
      return res.status(200).json({
          data: data
      });
  
    } catch (err) {
      console.error("GET / error:", err);
      res.status(500).json({ error: err.message });
    }
});

// Get single category by ID
categoryRouter.get("/category/:categoryId", async (req, res) => {
    try {
      const categoryId = req.params.categoryId;
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .single();
  
      if (error) throw error;
  
      return res.status(200).json({
          data: data
      });
  
    } catch (err) {
      console.error("GET /category/:categoryId error:", err);
      res.status(500).json({ error: err.message });
    }
});

// Update category
categoryRouter.put("/category/:categoryId", async (req, res) => {
    try {
      const categoryId = req.params.categoryId;
      const { name } = req.body;
  
      if (!name) {
        return res.status(400).json({ error: "Category name is required" });
      }
  
      const { data, error } = await supabase
        .from('categories')
        .update({ name })
        .eq('id', categoryId)
        .select()
        .single();
  
      if (error) throw error;
  
      return res.status(200).json({
          message: "Category updated successfully",
          data: data
      });
  
    } catch (err) {
      console.error("PUT /category/:categoryId error:", err);
      res.status(500).json({ error: err.message });
    }
});

// Delete category
categoryRouter.delete("/category/:categoryId", async (req, res) => {
    try {
      const categoryId = req.params.categoryId;
  
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);
  
      if (error) throw error;
  
      return res.status(200).json({
          message: "Category deleted successfully"
      });
  
    } catch (err) {
      console.error("DELETE /category/:categoryId error:", err);
      res.status(500).json({ error: err.message });
    }
});

export default categoryRouter;