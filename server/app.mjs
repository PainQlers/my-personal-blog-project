import 'dotenv/config';
import express from "express";
import postsRouter from './routes/posts.mjs';
import cors from "cors";
import authRouter from "./routes/auth.mjs";
import { supabase } from './utils/db.mjs';
import categoryRouter from './routes/category.mjs';
import commentsRouter from './routes/comments.mjs';


const app = express();
const port = process.env.PORT || 4000;
    
app.use(express.json());
app.use(cors());

// API routes
app.use('/api/posts', postsRouter)
app.use('/api/auth', authRouter)
app.use('/api/category', categoryRouter)
app.use('/api/comments', commentsRouter)

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
        const { data, error } = await supabase.from('users').select('*');
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