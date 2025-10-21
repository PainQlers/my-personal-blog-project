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
        res.status(200).json({
            message: "Server is working",
            env: {
                hasConnectionString: !!process.env.CONNECTION_STRING,
                hasPort: !!process.env.PORT,
                hasSupabaseKey: !!process.env.SUPABASE_ANON_KEY,
                nodeEnv: process.env.NODE_ENV
            }
        });
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: error.message });
    }
}
