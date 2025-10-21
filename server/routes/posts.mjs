import { Router } from "express";
import pool from "../utils/db.mjs";
import { validateCreatePost, validateUpdatePost } from "../validation/postsValidation.mjs";

const postsRouter = Router();

postsRouter.post('/', async (req, res) => {
    try {
        const { valid, errors } = validateCreatePost(req.body);
        if (!valid) return res.status(400).json({ error: errors });

        const { title, image, category_id, description, content, status_id } = req.body;
  
      const query = `
        INSERT INTO posts (title, image, category_id, description, content, status_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        `;

        const values = [title, image, category_id, description, content, status_id];

        const result = await pool.query(query, values)
  
  
        res.status(201).json({
            message: "Created post sucessfully",
            data : result.rows[0]
        });
    } catch (error) {
        console.error("POST / error:", error);
        res.status(500).json({ error: error.message });
    }
})

postsRouter.get('/:postId', async (req, res) => {
    try {
      const postIdFromClient = req.params.postId;

      const results = await pool.query(`
        SELECT * FROM posts
        WHERE id=$1
        `,[postIdFromClient])
  
  
        return res.status(200).json({
            data : results.rows[0]
        });
  
    } catch (err) {
      console.error("POST / error:", err);
      res.status(500).json({ error: err.message });
    }
  });

postsRouter.get('/', async (req, res) => {
    try {

      const results = await pool.query(`
        SELECT * FROM posts
        `)
  
        return res.status(200).json({
            data : results.rows
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
  
      const query = `
        UPDATE posts
        SET title=$1, image=$2, category_id=$3, description=$4, content=$5, status_id=$6
        WHERE id = $7
        RETURNING *
        `;

        const values = [title, image, category_id, description, content, status_id, postIdFromClient];

        const result = await pool.query(query, values)
  
  
        res.status(201).json({
            message: "Post info has been updated sucessfully",
            data : result.rows[0]
        });
    } catch (error) {
        console.error("PUT / error:", error);
        res.status(500).json({ error: error.message });
    }
})

postsRouter.delete('/:postId', async (req, res) => {
    try {
      const postIdFromClient = req.params.postId;

      const results = await pool.query(`
        DELETE FROM posts
        WHERE id=$1
        `,[postIdFromClient])
  
  
        return res.status(200).json({
            message : "Delete data successfully"
        });
  
    } catch (err) {
      console.error("DELETE / error:", err);
      res.status(500).json({ error: err.message });
    }
  });

export default postsRouter;