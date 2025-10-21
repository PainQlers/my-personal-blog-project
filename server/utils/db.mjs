import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dngbgajbvfpzvskalouc.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Create a query function that mimics pg pool.query
const query = async (sql, params = []) => {
    try {
        // For simple SELECT queries, use Supabase client
        if (sql.trim().toUpperCase().startsWith('SELECT')) {
            const tableMatch = sql.match(/FROM\s+(\w+)/i);
            if (tableMatch) {
                const table = tableMatch[1];
                const { data, error } = await supabase.from(table).select('*');
                if (error) throw error;
                return { rows: data };
            }
        }
        
        // For other queries, use RPC or direct SQL
        const { data, error } = await supabase.rpc('execute_sql', { 
            sql_query: sql, 
            params: params 
        });
        
        if (error) throw error;
        return { rows: data || [] };
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};

export default { query };

console.log("✅ Supabase connected successfully");
