import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl) {
  throw new Error("Supabase URL is missing. Please set the NEXT_PUBLIC_SUPABASE_URL environment variable.");
}
if (!supabaseKey) {
  throw new Error("Supabase anon key is missing. Please set the NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
