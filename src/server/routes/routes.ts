import express from 'express';
import { supabase } from '../../services/supabase/client';
import { authenticateAdmin } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();

// Zod validation schemas
const routeSchema = z.object({
  destination: z.string().min(1),
  time: z.string().min(1),
  distance: z.string().min(1),
  sedan: z.number().positive(),
  ertiga: z.number().positive(),
});

// Public route
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from('routes').select('*').order('destination');
  if (error) {
    console.error('Error fetching routes from Supabase:', error);
    return res.status(500).json({ error: 'Failed to fetch routes' });
  }
  res.json(data);
});

// Admin routes
router.get("/admin", authenticateAdmin, async (req, res) => {
  const { data, error } = await supabase.from('routes').select('*').order('destination');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post("/admin", authenticateAdmin, async (req, res) => {
  const validation = routeSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: 'Invalid input', details: validation.error.issues });
  }

  const { data, error } = await supabase
    .from('routes')
    .insert([validation.data])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

router.put("/admin/:id", authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const validation = routeSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: 'Invalid input', details: validation.error.issues });
  }

  const { data, error } = await supabase
    .from('routes')
    .update(validation.data)
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.delete("/admin/:id", authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('routes').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

export default router;