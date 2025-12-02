import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { name, email, subject, message }: ContactRequest = await req.json();

    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { createClient } = await import("npm:@supabase/supabase-js@2");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { error: dbError } = await supabase.from("contact_messages").insert({
      name,
      email,
      subject,
      message,
      created_at: new Date().toISOString(),
    });

    if (dbError) {
      console.error("Database error:", dbError);
    }

    try {
      const gmailResponse = await fetch("https://api.smtp2go.com/v3/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: Deno.env.get("SMTP2GO_API_KEY") || "api-PLACEHOLDER",
          to: ["pitboxcom@gmail.com"],
          sender: "noreply@pit-box.com",
          subject: `[PIT-BOX Contact] ${subject}`,
          text_body: `New contact form message from ${name} (${email}):\n\n${message}`,
          html_body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #D4AF37;">New Contact Form Message</h2>
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>From:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Subject:</strong> ${subject}</p>
              </div>
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #D4AF37;">
                <h3>Message:</h3>
                <p style="white-space: pre-wrap;">${message}</p>
              </div>
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
                <p>This message was sent via the PIT-BOX.COM contact form.</p>
                <p><a href="mailto:${email}" style="color: #D4AF37;">Reply to ${email}</a></p>
              </div>
            </div>
          `,
        }),
      });

      if (gmailResponse.ok) {
        console.log("Email notification sent successfully");
      } else {
        console.error("Failed to send email notification:", await gmailResponse.text());
      }
    } catch (emailError) {
      console.error("Email notification error:", emailError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Message sent successfully! We'll get back to you within 2-3 business days."
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending contact email:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to send message. Please try again or email us directly at pitboxcom@gmail.com" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});