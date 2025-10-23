// utils/db.mjs
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// ดึงค่า environment variable
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// สร้าง Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Optional: helper function เหมือน pg query
export const query = async (table) => {
  const { data, error } = await supabase.from(table).select('*');
  if (error) throw error;
  return data;
};

console.log("✅ Supabase connected successfully");
