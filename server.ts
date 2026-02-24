import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import WhatsApp from 'whatsapp-cloud-api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// In-memory lead storage (for demo purposes)
const leads: any[] = [];

// In-memory routes storage
let routes = [
  { id: '1', destination: 'Kolkata', time: '6h 19m', distance: '317 km', sedan: 6500, ertiga: 7500 },
  { id: '2', destination: 'Durgapur', time: '3h 10m', distance: '148 km', sedan: 2599, ertiga: 3499 },
  { id: '3', destination: 'Asansol', time: '2h 30m', distance: '108 km', sedan: 2499, ertiga: 2999 },
  { id: '4', destination: 'Ranchi', time: '3h 0m', distance: '112 km', sedan: 1699, ertiga: 2499 },
  { id: '5', destination: 'Jamshedpur', time: '2h 18m', distance: '135 km', sedan: 2499, ertiga: 2999 },
  { id: '6', destination: 'Dhanbad', time: '1h 10m', distance: '38.1 km', sedan: 999, ertiga: 1299 },
  { id: '7', destination: 'Hazaribagh', time: '2h 34m', distance: '129 km', sedan: 2799, ertiga: 3299 },
  { id: '8', destination: 'Ramgarh', time: '2h 3m', distance: '85.3 km', sedan: 1999, ertiga: 2599 },
];

// In-memory cars storage
let cars = [
  { id: '1', name: 'Sedan', models: 'Dzire / Aura', capacity: '4+1', type: 'Sedan' },
  { id: '2', name: 'SUV', models: 'Ertiga / Carens', capacity: '6+1', type: 'SUV' },
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.post("/api/leads", async (req, res) => {
    const lead = {
      ...req.body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    const { name, phone, address, vehicleType, bookingDetails } = lead;
    
    leads.push(lead);
    console.log("New Lead Received:", lead);

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
        // We still return success to the client as the lead was received by the server
      }
    } else {
      console.warn("WhatsApp notification skipped: Client or recipient missing.");
    }
    
    res.json({ 
      success: true, 
      message: "Lead received successfully. We will contact you soon!" 
    });
  });

  app.get("/api/admin/leads", (req, res) => {
    // Simple authentication check (in a real app, use a proper auth middleware)
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== 'gobokaro2024') {
      return res.status(401).json({ error: "Unauthorized" });
    }
    res.json(leads);
  });

  app.patch("/api/admin/leads/:id", (req, res) => {
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== 'gobokaro2024') {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { id } = req.params;
    const { status } = req.body;
    const leadIndex = leads.findIndex(l => l.id === id);
    if (leadIndex !== -1) {
      leads[leadIndex].status = status;
      res.json(leads[leadIndex]);
    } else {
      res.status(404).json({ error: "Lead not found" });
    }
  });

  // Routes Management
  app.get("/api/routes", (req, res) => {
    res.json(routes);
  });

  app.get("/api/admin/routes", (req, res) => {
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== 'gobokaro2024') return res.status(401).json({ error: "Unauthorized" });
    res.json(routes);
  });

  app.post("/api/admin/routes", (req, res) => {
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== 'gobokaro2024') return res.status(401).json({ error: "Unauthorized" });
    const route = req.body;
    if (route.id) {
      const index = routes.findIndex(r => r.id === route.id);
      if (index !== -1) routes[index] = route;
    } else {
      route.id = Date.now().toString();
      routes.push(route);
    }
    res.json(route);
  });

  app.delete("/api/admin/routes/:id", (req, res) => {
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== 'gobokaro2024') return res.status(401).json({ error: "Unauthorized" });
    routes = routes.filter(r => r.id !== req.params.id);
    res.json({ success: true });
  });

  // Cars Management
  app.get("/api/cars", (req, res) => {
    res.json(cars);
  });

  app.get("/api/admin/cars", (req, res) => {
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== 'gobokaro2024') return res.status(401).json({ error: "Unauthorized" });
    res.json(cars);
  });

  app.post("/api/admin/cars", (req, res) => {
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== 'gobokaro2024') return res.status(401).json({ error: "Unauthorized" });
    const car = req.body;
    if (car.id) {
      const index = cars.findIndex(c => c.id === car.id);
      if (index !== -1) cars[index] = car;
    } else {
      car.id = Date.now().toString();
      cars.push(car);
    }
    res.json(car);
  });

  app.delete("/api/admin/cars/:id", (req, res) => {
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== 'gobokaro2024') return res.status(401).json({ error: "Unauthorized" });
    cars = cars.filter(c => c.id !== req.params.id);
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
