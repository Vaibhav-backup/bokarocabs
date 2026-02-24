import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import multer from 'multer';
import { supabase } from "./src/services/supabase/client.ts";
import { authenticateAdmin } from './src/server/middleware/auth';

// Import routers
import authRouter from './src/server/routes/auth';
import leadsRouter from './src/server/routes/leads';
import routesRouter from './src/server/routes/routes';
import carsRouter from './src/server/routes/cars';
import toursRouter from './src/server/routes/tours';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Register API routers
  app.use('/api/admin', authRouter);
  app.use('/api/leads', leadsRouter);
  app.use('/api/routes', routesRouter);
  app.use('/api/cars', carsRouter);
  app.use('/api/tour-packages', toursRouter);

  // Special route for image uploads
  app.post("/api/admin/upload-image", authenticateAdmin, upload.single('image'), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });

      const file = req.file;
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `tour-packages/${fileName}`;

      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      res.json({ url: publicUrl });
    } catch (error: any) {
      console.error("Upload error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
