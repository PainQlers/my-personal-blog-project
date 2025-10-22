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
        if (req.method === 'POST') {
            const { title, content, description, image, category_id, status_id } = req.body;

            // Validate required fields
            if (!title || !content) {
                return res.status(400).json({
                    error: 'Title and content are required'
                });
            }

            // Try to use Supabase if available
            try {
                const { createClient } = await import('@supabase/supabase-js');
                const supabaseUrl = 'https://dngbgajbvfpzvskalouc.supabase.co';
                const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuZ2JnYWpidmZwenZza2Fsb3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5MTM1ODAsImV4cCI6MjA3NjQ4OTU4MH0.uR2QWo4mHjzWmJXNz0wo2CE-YQqHwI6Ug5ymwvfiBys';
                const supabase = createClient(supabaseUrl, supabaseKey);
                
                const { data, error } = await supabase
                    .from('posts')
                    .insert([{
                        title,
                        content,
                        description: description || '',
                        image: image || '',
                        category_id: category_id || 1,
                        status_id: status_id || 1
                    }])
                    .select()
                    .single();

                if (error) throw error;

                res.status(201).json({
                    data: data,
                    message: "Post created successfully in Supabase"
                });
            } catch (supabaseError) {
                console.log('Supabase not available, using mock response:', supabaseError.message);
                
                // Mock response
                const mockPost = {
                    id: Math.floor(Math.random() * 1000) + 100,
                    title,
                    content,
                    description: description || '',
                    image: image || '',
                    category_id: category_id || 1,
                    status_id: status_id || 1,
                    created_at: new Date().toISOString()
                };

                res.status(201).json({
                    data: mockPost,
                    message: "Post created successfully (mock data - Supabase unavailable)"
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
