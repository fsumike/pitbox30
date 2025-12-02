import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "npm:stripe@13.10.0";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new Response(JSON.stringify({ error: "Missing stripe-signature header" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, endpointSecret);

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionCancelled(event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return new Response(JSON.stringify({ error: `Webhook Error: ${err.message}` }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
});

async function handleSubscriptionChange(subscription) {
  // Get the customer
  const customer = await stripe.customers.retrieve(subscription.customer);
  const userId = customer.metadata.userId;

  if (!userId) {
    console.error("No userId found in customer metadata");
    return;
  }

  // Determine subscription tier
  const priceId = subscription.items.data[0].price.id;
  let tier = 'basic';
  
  // Check if this is a premium price ID
  if (priceId.includes('premium')) {
    tier = 'premium';
  }

  // Update user's subscription status in database
  const { error } = await supabase
    .from('user_subscriptions')
    .upsert({
      user_id: userId,
      subscription_id: subscription.id,
      status: subscription.status,
      tier: tier,
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
    });

  if (error) {
    console.error("Error updating subscription in database:", error);
  }
}

async function handleSubscriptionCancelled(subscription) {
  // Get the customer
  const customer = await stripe.customers.retrieve(subscription.customer);
  const userId = customer.metadata.userId;

  if (!userId) {
    console.error("No userId found in customer metadata");
    return;
  }

  // Update user's subscription status in database
  const { error } = await supabase
    .from('user_subscriptions')
    .update({
      status: 'cancelled',
      cancel_at_period_end: true,
    })
    .eq('subscription_id', subscription.id);

  if (error) {
    console.error("Error updating subscription in database:", error);
  }
}