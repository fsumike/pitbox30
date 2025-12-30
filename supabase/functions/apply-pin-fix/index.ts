import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const sql = `
-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Drop and recreate the function
DROP FUNCTION IF EXISTS set_user_pin_code(uuid, text) CASCADE;

CREATE FUNCTION set_user_pin_code(
  user_id uuid,
  pin_code text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() != user_id THEN
    RAISE EXCEPTION 'Unauthorized: You can only set your own PIN code';
  END IF;

  IF pin_code !~ '^\\d{4,10}$' THEN
    RAISE EXCEPTION 'Invalid PIN: Must be 4-10 digits';
  END IF;

  UPDATE profiles
  SET
    pin_code_hash = crypt(pin_code, gen_salt('bf', 8)),
    pin_code_enabled = true,
    updated_at = now()
  WHERE id = user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION set_user_pin_code(uuid, text) TO authenticated;
COMMENT ON FUNCTION set_user_pin_code IS 'Securely sets a hashed PIN code for quick track-side authentication';
`;

    // Execute the SQL
    const { error } = await supabaseClient.rpc('exec', { sql });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true, message: 'PIN code fix applied successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
