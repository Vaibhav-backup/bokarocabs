import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl) {
  throw new Error("Supabase URL is missing. Please set the SUPABASE_URL environment variable for server-side operations.");
}

if (!supabaseServiceKey) {
  throw new Error("Supabase service key is missing. Please set the SUPABASE_SERVICE_ROLE_KEY environment variable for server-side operations.");
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
