import express from 'express';
import { supabase } from '../../services/supabase/client';
import { authenticateAdmin } from '../middleware/auth';
import { z } from 'zod';
import WhatsApp from 'whatsapp-cloud-api';

const router = express.Router();

// Zod validation schemas
const bookingDetailsSchema = z.object({
  from: z.string(),
  to: z.string(),
  date: z.string(),
  time: z.string(),
  tripType: z.string(),
  event: z.string().optional(),
});

const leadSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(10),
  address: z.string(),
  vehicleType: z.string(),
  bookingDetails: bookingDetailsSchema,
});

const updateLeadStatusSchema = z.object({
  status: z.enum(['new', 'contacted', 'booked', 'cancelled']),
});

// Lazy initialization of WhatsApp client
let whatsappClient: any = null;
function getWhatsAppClient() {
  if (!whatsappClient) {
    const token = process.env.WHATSAPP_TOKEN;
    const fromPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    if (token && fromPhoneId) {
      const WhatsAppClass = (WhatsApp as any).default || WhatsApp;
      whatsappClient = new WhatsAppClass(fromPhoneId, token);
    } else {
      console.warn("WhatsApp credentials missing. Messages will not be sent.");
    }
  }
  return whatsappClient;
}

// Public route for creating a new lead
router.post("/", async (req, res) => {
  const validation = leadSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: 'Invalid input', details: validation.error.issues });
  }

  const { name, phone, address, vehicleType, bookingDetails } = validation.data;

  const { data: lead, error } = await supabase
    .from('leads')
    .insert([{
      name, phone, address,
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
    } catch (waError) {
      console.error("Error sending WhatsApp notification:", waError);
    }
  }

  res.status(201).json({ success: true, message: "Lead received successfully." });
});

// Admin routes
router.get("/admin", authenticateAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  const mappedLeads = data.map(l => ({
    ...l,
    vehicleType: l.vehicle_type,
    createdAt: l.created_at,
    bookingDetails: l.booking_details
  }));
  res.json(mappedLeads);
});

router.patch("/admin/:id", authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const validation = updateLeadStatusSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: 'Invalid input', details: validation.error.issues });
  }

  const { status } = validation.data;
  const { data, error } = await supabase
    .from('leads')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;