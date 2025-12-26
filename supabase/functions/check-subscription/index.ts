import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "npm:stripe@13.10.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Content-Type": "application/json",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    const { userId } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID is required" }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Get customer by metadata
    const customers = await stripe.customers.list({
      limit: 1,
      metadata: { userId },
    });

    if (customers.data.length === 0) {
      return new Response(
        JSON.stringify({ subscription: null }),
        {
          status: 200,
          headers: corsHeaders,
        }
      );
    }

    const customer = customers.data[0];

    // Get subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return new Response(
        JSON.stringify({ subscription: null }),
        {
          status: 200,
          headers: corsHeaders,
        }
      );
    }

    const subscription = subscriptions.data[0];
    
    // Determine tier based on price
    const priceId = subscription.items.data[0].price.id;
    let tier = 'basic';
    
    // Check if this is a premium price ID
    if (priceId.includes('premium')) {
      tier = 'premium';
    }

    return new Response(
      JSON.stringify({
        subscription: {
          id: subscription.id,
          status: subscription.status,
          current_period_end: subscription.current_period_end,
          tier
        }
      }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("Error checking subscription:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});