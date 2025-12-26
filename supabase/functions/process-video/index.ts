import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { postId, rawFilePath } = await req.json();

    if (!postId || !rawFilePath) {
      throw new Error('Missing required parameters');
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Download raw video
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('videos')
      .download(rawFilePath);

    if (downloadError) {
      throw new Error(`Failed to download video: ${downloadError.message}`);
    }

    // Process video (simplified for now - in reality you'd use FFmpeg here)
    // For now, we'll just move the file to the processed folder
    const processedFileName = rawFilePath.replace('raw/', 'processed/');
    
    const { error: uploadError } = await supabase
      .storage
      .from('videos')
      .upload(processedFileName, fileData);

    if (uploadError) {
      throw new Error(`Failed to upload processed video: ${uploadError.message}`);
    }

    // Get public URL for processed video
    const { data: { publicUrl } } = supabase
      .storage
      .from('videos')
      .getPublicUrl(processedFileName);

    // Update post with processed video URL
    const { error: updateError } = await supabase
      .from('posts')
      .update({
        video_url: publicUrl,
        status: 'published'
      })
      .eq('id', postId);

    if (updateError) {
      throw new Error(`Failed to update post: ${updateError.message}`);
    }

    // Clean up raw video
    await supabase
      .storage
      .from('videos')
      .remove([rawFilePath]);

    return new Response(
      JSON.stringify({ success: true, url: publicUrl }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});