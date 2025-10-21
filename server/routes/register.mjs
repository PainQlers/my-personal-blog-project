import { Router } from "express";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dngbgajbvfpzvskalouc.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const registerRouter = Router();

registerRouter.post('/', async (req, res) => {
    try {
      const { username, name, profile_pic, role } = req.body;
  
      if (!username || !name || !profile_pic || !role) 
        return res.status(400).json({ error: 'All fields are required' });
  
      const { data, error } = await supabase
        .from('users')
        .insert([{
            username,
            name,
            profile_pic,
            role
        }])
        .select()
        .single();
  
      if (error) throw error;
  
      res.status(201).json({
          message: "Created user successfully",
          data: data
      });
  
    } catch (err) {
      console.error("POST / error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  export default registerRouter;