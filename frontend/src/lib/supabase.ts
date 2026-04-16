import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ycldzmqgzrsoxudwfgdy.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljbGR6bXFnenJzb3h1ZHdmZ2R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNzI3MTMsImV4cCI6MjA5MTg0ODcxM30.72dDI-BkmoOY9xh9vZShTehhoi8mXxYUQrEHHNO-9qg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);