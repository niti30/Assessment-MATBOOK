import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

// This file is automatically generated. Do not edit it directly.
// import { createClient } from '@supabase/supabase-js';
// import type { Database } from './types';

// const SUPABASE_URL = "https://iuleqjwrqvknkmatpjlb.supabase.co";
// const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1bGVxandycXZrbmttYXRwamxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyNjk3NDIsImV4cCI6MjA1ODg0NTc0Mn0.Acs58ONkV5zKG1n6_9_FlOSN-A19JeQ_q9PfMRmyr_M";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

// export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
