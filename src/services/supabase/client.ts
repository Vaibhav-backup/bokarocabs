import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl) {
  throw new Error("Supabase URL is missing. Please set the SUPABASE_URL environment variable.");
}
if (!supabaseKey) {
  throw new Error("Supabase service key is missing. Please set the SUPABASE_SERVICE_ROLE_KEY environment variable.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
