import 'dotenv/config';
import express from "express";
import pool from './utils/db.mjs';
import registerRouter from './routes/register.mjs';
import postsRouter from './routes/posts.mjs';
import cors from "cors";

const app = express();
const port = process.env.PORT || 4000;
    
app.use(express.json());
app.use(cors());

// API routes
app.use('/api/register', registerRouter)
app.use('/api/posts', postsRouter)

// Test routes
app.get("/api/test" , (req, res) => {
    return res.json({
        message: `Server is working`,
        env: {
            hasConnectionString: !!process.env.CONNECTION_STRING,
            hasPort: !!process.env.PORT,
            nodeEnv: process.env.NODE_ENV
        }
    });
})

app.get("/api/test1" , async (req, res) => {
    try {
        const { data, error } = await pool.query('SELECT * FROM users');
        if (error) return res.status(500).json({ error: error.message });
        return res.json(data);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
})

// Health check
app.get("/", (req, res) => {
    res.json({ message: "API is running" });
});

// Only start server if not in Vercel environment
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server is running at ${port}`);
    });
}

export default app;