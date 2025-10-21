import 'dotenv/config';
import express from "express";
import pool from './utils/db.mjs';
import registerRouter from './routes/register.mjs';
import postsRouter from './routes/posts.mjs';
import cors from "cors";
import { createServer } from "@vercel/node";

const app = express();
const port = process.env.PORT || 4000;
const router = express.Router();
    
app.use(express.json());
app.use(cors());

app.use('/register', registerRouter)
app.use('/posts', postsRouter)

app.get("/test" , (req, res) => {
    return res.json({message : `Server is working`});
})

app.get("/test1" , async (req, res) => {
    const { data, error } = await pool.query('SELECT * FROM users');
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
})

app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});

export default createServer(app);