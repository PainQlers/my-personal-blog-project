import { Router } from "express";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dngbgajbvfpzvskalouc.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuZ2JnYWpidmZwenZza2Fsb3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5MTM1ODAsImV4cCI6MjA3NjQ4OTU4MH0.uR2QWo4mHjzWmJXNz0wo2CE-YQqHwI6Ug5ymwvfiBys';
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