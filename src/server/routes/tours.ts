import express from 'express';
import { supabase } from '../../services/supabase/client';
import { authenticateAdmin } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();

// Zod validation schemas
const tourPackageSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  duration: z.string().min(1),
  image_url: z.string().url().optional(),
});

// Public routes
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from('tour_packages').select('*').order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching tour packages from Supabase:', error);
    return res.status(500).json({ error: 'Failed to fetch tour packages' });
  }
  res.json(data);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('tour_packages')
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    console.error(`Error fetching tour package ${id} from Supabase:`, error);
    return res.status(404).json({ error: "Package not found" });
  }
  res.json(data);
});

// Admin routes
router.get("/admin", authenticateAdmin, async (req, res) => {
  const { data, error } = await supabase.from('tour_packages').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post("/admin", authenticateAdmin, async (req, res) => {
  const validation = tourPackageSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: 'Invalid input', details: validation.error.issues });
  }

  const { data, error } = await supabase.from('tour_packages').insert([validation.data]).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

router.put("/admin/:id", authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const validation = tourPackageSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: 'Invalid input', details: validation.error.issues });
  }

  const { data, error } = await supabase
    .from('tour_packages')
    .update(validation.data)
    .eq('id', id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.delete("/admin/:id", authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('tour_packages').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

export default router;