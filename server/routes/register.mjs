import { Router } from "express";
import pool from "../utils/db.mjs";

const registerRouter = Router();

registerRouter.post('/', async (req, res) => {
    try {
      const { username, name, profile_pic, role } = req.body;
  
      if (!username || !name || !profile_pic || !role) 
        return res.status(400).json({ error: 'All fields are required' });
  
      const query = `
        INSERT INTO users (username, name, profile_pic, role)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `;

        const values = [username, name, profile_pic, role];

        const result = await pool.query(query, values)
  
  
        res.status(201).json({
            message: "Created post sucessfully",
            data : result.rows[0]
        });
  
    } catch (err) {
      console.error("POST / error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  export default registerRouter;