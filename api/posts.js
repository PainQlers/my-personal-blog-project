module.exports = async function handler(req, res) {
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
            // Mock data for testing
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
                message: "Posts retrieved successfully (mock data)"
            });
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: error.message });
    }
}
