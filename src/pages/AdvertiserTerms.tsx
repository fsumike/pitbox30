import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ShieldCheck, XCircle, AlertCircle, DollarSign, Calendar, CheckCircle } from 'lucide-react';

function AdvertiserTerms() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="glass-panel p-8 bg-gradient-to-br from-brand-gold/10 to-brand-gold-dark/10">
        <div className="flex items-center gap-4 mb-6">
          <FileText className="w-12 h-12 text-brand-gold" />
          <div>
            <h1 className="text-4xl font-bold">Advertiser Terms & Guidelines</h1>
            <p className="text-gray-600 dark:text-gray-400">Last Updated: November 15, 2025</p>
          </div>
        </div>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Welcome to PIT-BOX.COM's advertising program. These terms govern all advertising and affiliate partnerships on our platform.
        </p>
      </div>

      <div className="glass-panel p-8">
        <h2 className="text-2xl font-bold mb-4">1. Overview</h2>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>
            PIT-BOX.COM ("we," "us," or "our") offers advertising opportunities to businesses and organizations
            in the motorsports industry. By participating in our advertising program, you ("Advertiser" or "you")
            agree to these Advertiser Terms.
          </p>
          <p>
            <strong>Operator:</strong> Michael Glover DBA PIT-BOX.COM<br />
            <strong>Contact:</strong> pitboxcom@gmail.com | (279) 245-0737
          </p>
        </div>
      </div>

      <div className="glass-panel p-8">
        <h2 className="text-2xl font-bold mb-4">2. Advertising Placements</h2>
        <div className="space-y-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Available Placements
            </h3>
            <ul className="text-sm text-green-800 dark:text-green-200 space-y-1 list-disc list-inside ml-2">
              <li>Featured sponsor cards on Affiliates page</li>
              <li>Banner placements in app feeds</li>
              <li>Sponsored content integration</li>
              <li>Event sponsorships</li>
              <li>Social media promotion</li>
            </ul>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            Specific placement locations and visibility are determined by your advertising tier and availability.
            We reserve the right to determine optimal placement for all advertising content.
          </p>
        </div>
      </div>

      <div className="glass-panel p-8">
        <h2 className="text-2xl font-bold mb-4">3. Content Guidelines</h2>
        <div className="space-y-4">
          <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">✅ Acceptable Content</h3>
            <ul className="text-sm text-green-800 dark:text-green-200 space-y-1 list-disc list-inside ml-2">
              <li>Racing parts, equipment, and services</li>
              <li>Racing venues and tracks</li>
              <li>Automotive products related to racing</li>
              <li>Professional racing services</li>
              <li>Racing events and competitions</li>
              <li>Racing media and entertainment</li>
            </ul>
          </div>
          <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20">
            <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2 flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              Prohibited Content
            </h3>
            <ul className="text-sm text-red-800 dark:text-red-200 space-y-1 list-disc list-inside ml-2">
              <li>Illegal products or services</li>
              <li>Adult or explicit content</li>
              <li>Gambling or betting services</li>
              <li>Tobacco or vaping products</li>
              <li>Misleading or false advertising claims</li>
              <li>Counterfeit or stolen goods</li>
              <li>Political campaigns</li>
              <li>Cryptocurrency or financial schemes</li>
              <li>Content that violates intellectual property rights</li>
              <li>Hate speech or discriminatory content</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="glass-panel p-8">
        <h2 className="text-2xl font-bold mb-4">4. Advertiser Responsibilities</h2>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p><strong>You agree to:</strong></p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Provide accurate, truthful information in all advertising materials</li>
            <li>Ensure all products/services comply with applicable laws</li>
            <li>Honor all advertised prices, terms, and promotions</li>
            <li>Maintain active website links and contact information</li>
            <li>Respond to customer inquiries in a timely manner</li>
            <li>Not make claims that could mislead users</li>
            <li>Provide high-quality logos and images (minimum 1000px width)</li>
            <li>Notify us immediately of any changes to your business</li>
          </ul>
        </div>
      </div>

      <div className="glass-panel p-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-brand-gold" />
          5. Payment Terms
        </h2>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p><strong>Billing:</strong></p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Advertising fees are billed monthly in advance</li>
            <li>Payment is due within 7 days of invoice date</li>
            <li>Late payments may result in suspension of placement</li>
            <li>All fees are non-refundable once campaign begins</li>
            <li>We accept payment via Stripe (credit card, ACH)</li>
          </ul>
          <p><strong>Pricing:</strong></p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Pricing is based on placement tier and duration</li>
            <li>Custom packages available for long-term partnerships</li>
            <li>Prices subject to change with 30 days notice</li>
            <li>Current rates available upon request</li>
          </ul>
        </div>
      </div>

      <div className="glass-panel p-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-brand-gold" />
          6. Campaign Terms
        </h2>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p><strong>Duration:</strong></p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Minimum campaign period: 30 days</li>
            <li>Campaigns auto-renew unless cancelled 7 days before end date</li>
            <li>Early termination requires 30 days written notice</li>
            <li>No refunds for early termination</li>
          </ul>
          <p><strong>Changes:</strong></p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>You may update ad content once per month at no charge</li>
            <li>Additional changes may incur fees</li>
            <li>Major changes require our approval</li>
            <li>Changes take 2-3 business days to implement</li>
          </ul>
        </div>
      </div>

      <div className="glass-panel p-8">
        <h2 className="text-2xl font-bold mb-4">7. Performance & Analytics</h2>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p><strong>We provide:</strong></p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Monthly impression counts</li>
            <li>Click-through rates</li>
            <li>Geographic data (country/region level)</li>
            <li>Basic user engagement metrics</li>
          </ul>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
            <strong>No Guarantees:</strong> We do not guarantee specific impression counts, click rates, or conversions.
            Performance varies based on user engagement, content quality, and market factors.
          </p>
        </div>
      </div>

      <div className="glass-panel p-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-brand-gold" />
          8. Our Rights & Responsibilities
        </h2>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p><strong>PIT-BOX.COM reserves the right to:</strong></p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Approve or reject any advertising content</li>
            <li>Remove advertising that violates these terms</li>
            <li>Modify placement locations for platform optimization</li>
            <li>Suspend or terminate campaigns for guideline violations</li>
            <li>Change advertising policies with 30 days notice</li>
            <li>Refuse service to any advertiser</li>
          </ul>
          <p className="mt-4">
            <strong>We are NOT responsible for:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Sales, conversions, or business results from advertising</li>
            <li>Technical issues that temporarily affect ad display</li>
            <li>User complaints about advertised products/services</li>
            <li>Competitor advertising on our platform</li>
          </ul>
        </div>
      </div>

      <div className="glass-panel p-8">
        <h2 className="text-2xl font-bold mb-4">9. Intellectual Property</h2>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p><strong>Your Content:</strong></p>
          <p>
            You retain all ownership rights to your logos, trademarks, and advertising content. By submitting
            content, you grant PIT-BOX.COM a non-exclusive, worldwide license to display, reproduce, and
            distribute your content solely for advertising purposes on our platform.
          </p>
          <p><strong>Our Content:</strong></p>
          <p>
            You may not use PIT-BOX.COM's name, logo, or trademarks without written permission. You may state
            that you advertise on PIT-BOX.COM but may not imply endorsement or partnership beyond what exists.
          </p>
        </div>
      </div>

      <div className="glass-panel p-8">
        <h2 className="text-2xl font-bold mb-4">10. Liability & Disclaimers</h2>
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg mb-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800 dark:text-yellow-200 space-y-2">
              <p><strong>IMPORTANT LEGAL NOTICE:</strong></p>
              <p>
                Advertising is provided "AS IS" without warranties. PIT-BOX.COM's total liability for any
                advertising-related claims shall not exceed the amount paid by you in the past 3 months.
              </p>
              <p>
                We are not liable for: lost profits, indirect damages, user actions, technical failures,
                force majeure events, or third-party issues.
              </p>
            </div>
          </div>
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          <strong>Indemnification:</strong> You agree to defend and hold harmless PIT-BOX.COM from any claims
          arising from your advertising content, products, services, or violation of these terms.
        </p>
      </div>

      <div className="glass-panel p-8">
        <h2 className="text-2xl font-bold mb-4">11. Termination</h2>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p><strong>By You:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Provide 30 days written notice</li>
            <li>Pay for full current billing period</li>
            <li>No refunds for unused time</li>
          </ul>
          <p className="mt-3"><strong>By Us:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Immediate termination for guideline violations</li>
            <li>30 days notice for convenience</li>
            <li>Pro-rated refund for prepaid unused time (our discretion)</li>
          </ul>
        </div>
      </div>

      <div className="glass-panel p-8">
        <h2 className="text-2xl font-bold mb-4">12. FTC Compliance</h2>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>
            All advertising and sponsored content will be clearly labeled as "Sponsored," "Ad," or "Affiliate"
            in compliance with FTC guidelines. We provide disclosure notices on relevant pages.
          </p>
          <p>
            Advertisers must ensure their own marketing materials comply with FTC truth-in-advertising rules
            and disclosure requirements.
          </p>
        </div>
      </div>

      <div className="glass-panel p-8">
        <h2 className="text-2xl font-bold mb-4">13. Miscellaneous</h2>
        <div className="space-y-3 text-gray-700 dark:text-gray-300 text-sm">
          <p><strong>Governing Law:</strong> California, USA</p>
          <p><strong>Entire Agreement:</strong> These terms, along with our main <Link to="/terms" className="text-brand-gold hover:underline">Terms of Service</Link>, constitute the entire agreement.</p>
          <p><strong>Modifications:</strong> We may update these terms with 30 days notice to active advertisers.</p>
          <p><strong>No Partnership:</strong> This is an advertising relationship only. No partnership, joint venture, or agency relationship is created.</p>
          <p><strong>Force Majeure:</strong> Neither party is liable for delays due to circumstances beyond reasonable control.</p>
        </div>
      </div>

      <div className="glass-panel p-8 bg-gradient-to-br from-brand-gold/10 to-brand-gold-dark/10">
        <h2 className="text-2xl font-bold mb-4">Questions About Advertising?</h2>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>Ready to partner with PIT-BOX.COM?</p>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
            <p><strong>Email:</strong> <a href="mailto:pitboxcom@gmail.com" className="text-brand-gold hover:underline">pitboxcom@gmail.com</a></p>
            <p><strong>Phone:</strong> <a href="tel:+12792450737" className="text-brand-gold hover:underline">(279) 245-0737</a></p>
            <p><strong>Subject Line:</strong> "Advertising Inquiry - [Your Company Name]"</p>
          </div>
          <div className="flex gap-4 justify-center mt-6">
            <Link to="/partner-with-us" className="btn-primary">
              Apply Now
            </Link>
            <Link to="/affiliates" className="btn-secondary">
              View Current Sponsors
            </Link>
          </div>
        </div>
      </div>

      <div className="text-center py-8">
        <Link to="/affiliates" className="text-brand-gold hover:underline">
          ← Back to Affiliates
        </Link>
      </div>
    </div>
  );
}

export default AdvertiserTerms;
