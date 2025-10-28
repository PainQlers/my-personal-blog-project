import express from 'express';
import { supabase } from '../utils/db.mjs';
import protectUser from '../middleware/protectUser.mjs';

const commentsRouter = express.Router();

// GET /api/comments?post_id=...
commentsRouter.get('/', async (req, res) => {
  try {
    const postId = req.query.post_id;
    if (!postId) {
      return res.status(400).json({ error: 'post_id is required' });
    }

    const { data: commentRows, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // join users in a second query (works even without FK metadata)
    const userIds = Array.from(new Set((commentRows || []).map((c) => c.user_id).filter(Boolean)));
    let userMap = {};
    if (userIds.length > 0) {
      const { data: users, error: userErr } = await supabase
        .from('users')
        .select('id, username, name, profile_pic')
        .in('id', userIds);
      if (userErr) throw userErr;
      userMap = (users || []).reduce((acc, u) => {
        acc[u.id] = u;
        return acc;
      }, {});
    }

    const data = (commentRows || []).map((c) => ({
      ...c,
      user: userMap[c.user_id] || null,
    }));

    return res.status(200).json({ data });
  } catch (err) {
    console.error('GET /comments error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/comments
commentsRouter.post('/', protectUser, async (req, res) => {
  try {
    const { post_id, comment_text } = req.body || {};
    if (!post_id || !comment_text) {
      return res.status(400).json({ error: 'post_id and comment_text are required' });
    }

    const userId = req.user?.id; // from protectUser
    const payload = {
      post_id,
      user_id: userId,
      comment_text,
      created_at: new Date().toISOString(),
    };

    const { data: inserted, error } = await supabase
      .from('comments')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    // enrich with user info
    let user = null;
    if (payload.user_id) {
      const { data: userRow } = await supabase
        .from('users')
        .select('id, username, name, profile_pic')
        .eq('id', payload.user_id)
        .single();
      user = userRow || null;
    }

    return res.status(201).json({ data: { ...inserted, user } });
  } catch (err) {
    console.error('POST /comments error:', err);
    return res.status(500).json({ error: err.message });
  }
});

export default commentsRouter;


