import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import WhatsApp from 'whatsapp-cloud-api';
import jwt from 'jsonwebtoken';
import { supabase } from "./src/services/supabase/client.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'gobokaro_secret_2024_premium';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'gobokaro2024';

// Lazy initialization of WhatsApp client
let whatsappClient: any = null;

function getWhatsAppClient() {
  if (!whatsappClient) {
    const token = process.env.WHATSAPP_TOKEN;
    const fromPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    
    if (!token || !fromPhoneId) {
      console.warn("WhatsApp Cloud API credentials missing. Messages will not be sent.");
      return null;
    }
    
    try {
      // Handle potential ESM/CJS interop issues
      const WhatsAppClass = (WhatsApp as any).default || WhatsApp;
      whatsappClient = new WhatsAppClass(fromPhoneId, token);
    } catch (error) {
      console.error("Failed to initialize WhatsApp client:", error);
      return null;
    }
  }
  return whatsappClient;
}

// JWT Middleware
const authenticateAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).admin = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token." });
  }
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Admin Login
  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
      const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ success: true, token });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  });

  // API routes
  app.post("/api/leads", async (req, res) => {
    const { name, phone, address, vehicleType, bookingDetails } = req.body;
    
    const { data: lead, error } = await supabase
      .from('leads')
      .insert([{
        name,
        phone,
        address,
        vehicle_type: vehicleType,
        status: 'new',
        booking_details: bookingDetails
      }])
      .select()
      .single();

    if (error) {
      console.error("Error saving lead to Supabase:", error);
      return res.status(500).json({ error: "Failed to save lead" });
    }

    console.log("New Lead Saved to Supabase:", lead);

    const wa = getWhatsAppClient();
    const recipient = process.env.WHATSAPP_RECIPIENT_PHONE;

    if (wa && recipient) {
      try {
        const message = `🚀 *New Booking Inquiry - Go Bokaro Cabs*\n\n` +
          `👤 *Name:* ${name}\n` +
          `📞 *Phone:* ${phone}\n` +
          `📍 *Address:* ${address}\n` +
          `🚗 *Vehicle:* ${vehicleType}\n\n` +
          `🗺️ *Route:* ${bookingDetails.from} to ${bookingDetails.to}\n` +
          `📅 *Date:* ${bookingDetails.date}\n` +
          `⏰ *Time:* ${bookingDetails.time}\n` +
          `🏷️ *Type:* ${bookingDetails.tripType}${bookingDetails.event ? ` (${bookingDetails.event})` : ''}\n\n` +
          `Please contact the customer immediately.`;

        await wa.sendText(recipient, message);
        console.log("WhatsApp notification sent successfully.");
      } catch (error) {
        console.error("Error sending WhatsApp notification:", error);
      }
    }
    
    res.json({ 
      success: true, 
      message: "Lead received successfully. We will contact you soon!" 
    });
  });

  app.get("/api/admin/leads", authenticateAdmin, async (req, res) => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    
    // Map database fields back to frontend expected fields
    const mappedLeads = data.map(l => ({
      ...l,
      vehicleType: l.vehicle_type,
      createdAt: l.created_at,
      bookingDetails: l.booking_details
    }));

    res.json(mappedLeads);
  });

  app.patch("/api/admin/leads/:id", authenticateAdmin, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    const { data, error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  // Routes Management
  app.get("/api/routes", async (req, res) => {
    const { data, error } = await supabase.from('routes').select('*').order('destination');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.get("/api/admin/routes", authenticateAdmin, async (req, res) => {
    const { data, error } = await supabase.from('routes').select('*').order('destination');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.post("/api/admin/routes", authenticateAdmin, async (req, res) => {
    const route = req.body;
    
    if (route.id) {
      const { data, error } = await supabase
        .from('routes')
        .update(route)
        .eq('id', route.id)
        .select()
        .single();
      if (error) return res.status(500).json({ error: error.message });
      res.json(data);
    } else {
      const { data, error } = await supabase
        .from('routes')
        .insert([route])
        .select()
        .single();
      if (error) return res.status(500).json({ error: error.message });
      res.json(data);
    }
  });

  app.delete("/api/admin/routes/:id", authenticateAdmin, async (req, res) => {
    const { error } = await supabase.from('routes').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  // Cars Management
  app.get("/api/cars", async (req, res) => {
    const { data, error } = await supabase.from('cars').select('*').order('name');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.get("/api/admin/cars", authenticateAdmin, async (req, res) => {
    const { data, error } = await supabase.from('cars').select('*').order('name');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.post("/api/admin/cars", authenticateAdmin, async (req, res) => {
    const car = req.body;
    
    if (car.id) {
      const { data, error } = await supabase
        .from('cars')
        .update(car)
        .eq('id', car.id)
        .select()
        .single();
      if (error) return res.status(500).json({ error: error.message });
      res.json(data);
    } else {
      const { data, error } = await supabase
        .from('cars')
        .insert([car])
        .select()
        .single();
      if (error) return res.status(500).json({ error: error.message });
      res.json(data);
    }
  });

  app.delete("/api/admin/cars/:id", authenticateAdmin, async (req, res) => {
    const { error } = await supabase.from('cars').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
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
