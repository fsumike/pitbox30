import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://pbfdzlkdlxbwijwwysaf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBiZmR6bGtkbHhid2lqd3d5c2FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0NjMzNjIsImV4cCI6MjA1NjAzOTM2Mn0.HNGtEg5Tc5iAILr33HDMzbqKaV3tvpgoVr4Dv85wjEk'
);

const { data: buckets, error } = await supabase.storage.listBuckets();
console.log('Buckets:', buckets);
console.log('Error:', error);
