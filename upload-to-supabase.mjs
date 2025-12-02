import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabase = createClient(
  'https://pbfdzlkdlxbwijwwysaf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBiZmR6bGtkbHhid2lqd3d5c2FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0NjMzNjIsImV4cCI6MjA1NjAzOTM2Mn0.HNGtEg5Tc5iAILr33HDMzbqKaV3tvpgoVr4Dv85wjEk'
);

async function uploadFile() {
  try {
    // Check if bucket exists, if not create it
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.name === 'downloads');

    if (!bucketExists) {
      const { error: createError } = await supabase.storage.createBucket('downloads', {
        public: true,
        fileSizeLimit: 52428800 // 50MB
      });
      if (createError) {
        console.error('Error creating bucket:', createError);
        return;
      }
      console.log('Created downloads bucket');
    }

    // Read and upload the file
    const fileBuffer = readFileSync('android-studio-project.tar.gz');

    const { data, error } = await supabase.storage
      .from('downloads')
      .upload('PitBox-Android-Studio.tar.gz', fileBuffer, {
        contentType: 'application/gzip',
        upsert: true
      });

    if (error) {
      console.error('Upload error:', error);
      return;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('downloads')
      .getPublicUrl('PitBox-Android-Studio.tar.gz');

    console.log('\n✅ SUCCESS! Download your file here:');
    console.log(urlData.publicUrl);
    console.log('\n');
  } catch (err) {
    console.error('Error:', err);
  }
}

uploadFile();
