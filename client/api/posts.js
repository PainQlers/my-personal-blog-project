export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        if (req.method === 'GET') {
            // Try to use Supabase if available
            try {
                const { createClient } = await import('@supabase/supabase-js');
                const supabaseUrl = 'https://dngbgajbvfpzvskalouc.supabase.co';
                const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuZ2JnYWpidmZwenZza2Fsb3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5MTM1ODAsImV4cCI6MjA3NjQ4OTU4MH0.uR2QWo4mHjzWmJXNz0wo2CE-YQqHwI6Ug5ymwvfiBys';
                const supabase = createClient(supabaseUrl, supabaseKey);
                
                const { data, error } = await supabase
                    .from('posts')
                    .select('*');

                if (error) throw error;

                res.status(200).json({
                    data: data,
                    message: "Posts retrieved successfully from Supabase"
                });
            } catch (supabaseError) {
                console.log('Supabase not available, using mock data:', supabaseError.message);
                
                // Fallback to mock data
                const mockPosts = [
                    {
                        id: 1,
                        title: "Test Post 1",
                        content: "This is a test post",
                        created_at: new Date().toISOString()
                    },
                    {
                        id: 2,
                        title: "Test Post 2", 
                        content: "This is another test post",
                        created_at: new Date().toISOString()
                    }
                ];

                res.status(200).json({
                    data: mockPosts,
                    message: "Posts retrieved successfully (mock data - Supabase unavailable)"
                });
            }
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: error.message });
    }
}
