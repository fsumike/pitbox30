import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Trophy, Target, Zap, Globe, Users, TrendingUp,
  BarChart, Share2, ShieldCheck, Award, MessageSquare, DollarSign,
  Mail, Phone, CheckCircle, Loader2, AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';

function PartnerWithUs() {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    message: '',
    interestLevel: 'Interested'
  });
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: dbError } = await supabase
        .from('partnership_inquiries')
        .insert([{
          company_name: formData.companyName,
          contact_name: formData.contactName,
          email: formData.email,
          phone: formData.phone || null,
          website: formData.website || null,
          interest_level: formData.interestLevel,
          message: formData.message,
          status: 'pending'
        }]);

      if (dbError) throw dbError;

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      try {
        await fetch(`${supabaseUrl}/functions/v1/send-contact-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`
          },
          body: JSON.stringify({
            type: 'partnership',
            name: formData.contactName,
            email: formData.email,
            phone: formData.phone,
            subject: `Partnership Inquiry from ${formData.companyName}`,
            message: `Company: ${formData.companyName}\nContact: ${formData.contactName}\nEmail: ${formData.email}\nPhone: ${formData.phone || 'Not provided'}\nWebsite: ${formData.website || 'Not provided'}\nInterest Level: ${formData.interestLevel}\n\nMessage:\n${formData.message}`
          })
        });
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
      }

      setSuccess(true);
      setFormData({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        website: '',
        message: '',
        interestLevel: 'Interested'
      });

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('Failed to submit your partnership request. Please try again later.');
      console.error('Error submitting form:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="glass-panel p-8 bg-gradient-to-br from-brand-gold/10 to-brand-gold-dark/10">
        <button
          onClick={() => navigate('/affiliates')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-brand-gold transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Affiliates
        </button>

        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-brand-gold to-brand-gold-light bg-clip-text text-transparent">
            Become a PIT-BOX.COM Partner
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
            Join the revolution that's transforming motorsports. Partner with PIT-BOX.COM and position your brand 
            at the forefront of racing technology innovation. Together, we'll drive the future of racing.
          </p>
        </div>
      </div>

      {/* Partnership Benefits */}
      <div className="glass-panel p-8">
        <h2 className="text-3xl font-bold text-center mb-12">Why Partner With PIT-BOX.COM?</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center">
              <Target className="w-8 h-8 text-brand-gold" />
            </div>
            <h3 className="text-xl font-bold">Targeted Audience</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Connect directly with a highly engaged audience of racing professionals, teams, and enthusiasts who are actively seeking products and services in the motorsports industry.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-brand-gold" />
            </div>
            <h3 className="text-xl font-bold">Explosive Growth</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Join us during our rapid expansion phase. Our user base is growing exponentially across all racing categories, providing increasing exposure for your brand.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-brand-gold" />
            </div>
            <h3 className="text-xl font-bold">Industry Leadership</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Position your brand alongside the most innovative racing technology platform of 2025. We're not following trends - we're setting them.
            </p>
          </div>
        </div>
      </div>

      {/* Partnership Opportunities */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass-panel p-8 bg-gradient-to-br from-blue-500/10 to-indigo-500/10">
          <h2 className="text-2xl font-bold mb-6">Premium Advertising</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Globe className="w-6 h-6 text-blue-500" />
              <span>Featured placement across the platform</span>
            </div>
            <div className="flex items-center gap-4">
              <Users className="w-6 h-6 text-blue-500" />
              <span>Direct access to racing professionals</span>
            </div>
            <div className="flex items-center gap-4">
              <BarChart className="w-6 h-6 text-blue-500" />
              <span>Detailed analytics and performance metrics</span>
            </div>
            <div className="flex items-center gap-4">
              <Share2 className="w-6 h-6 text-blue-500" />
              <span>Social media cross-promotion</span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
          <h2 className="text-2xl font-bold mb-6">Strategic Partnerships</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <ShieldCheck className="w-6 h-6 text-purple-500" />
              <span>Verified partner status and badging</span>
            </div>
            <div className="flex items-center gap-4">
              <Award className="w-6 h-6 text-purple-500" />
              <span>Co-branded content and features</span>
            </div>
            <div className="flex items-center gap-4">
              <MessageSquare className="w-6 h-6 text-purple-500" />
              <span>Direct engagement with our user community</span>
            </div>
            <div className="flex items-center gap-4">
              <DollarSign className="w-6 h-6 text-purple-500" />
              <span>Revenue sharing opportunities</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="glass-panel p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Partner Success Stories</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <img 
                src="https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=80&q=80" 
                alt="Racing Parts Inc." 
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-bold">Racing 101.</h3>
                <p className="text-gray-600 dark:text-gray-400"> ( YOUR ) Parts Manufacturer</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 italic">
              "Partnering with PIT-BOX.COM can transformed your digital marketing strategy. And can increase qualified leads and boost your online sales buy becoming a featured partner."
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <img 
                src="https://images.unsplash.com/photo-1560264280-88b68371db39?ixlib=rb-1.2.1&auto=format&fit=crop&w=80&q=80" 
                alt="SpeedTech Solutions" 
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-bold">Your company.</h3>
                <p className="text-gray-600 dark:text-gray-400">Racing 101.</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 italic">
              "The targeted exposure gained through your PIT-BOX.COM partnership can be invaluable. The platform connects you directly with the racing industry through traditional channels."
            </p>
          </div>
        </div>
      </div>

      {/* Partnership Inquiry Form */}
      <div className="glass-panel p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Start the Conversation</h2>
        
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 flex items-center gap-2 max-w-2xl mx-auto">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 flex items-center gap-2 max-w-2xl mx-auto">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            Thank you for your interest in partnering with PIT-BOX.COM! Our team will review your information and contact you shortly.
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium mb-2">Company Name</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full p-3 rounded-lg"
                placeholder="Your company name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="contactName" className="block text-sm font-medium mb-2">Contact Name</label>
              <input
                type="text"
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                className="w-full p-3 rounded-lg"
                placeholder="Your full name"
                required
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 rounded-lg"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 rounded-lg"
                placeholder="(123) 456-7890"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="website" className="block text-sm font-medium mb-2">Website</label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full p-3 rounded-lg"
              placeholder="https://yourcompany.com"
            />
          </div>
          
          <div>
            <label htmlFor="interestLevel" className="block text-sm font-medium mb-2">Interest Level</label>
            <select
              id="interestLevel"
              name="interestLevel"
              value={formData.interestLevel}
              onChange={handleChange}
              className="w-full p-3 rounded-lg"
              required
            >
              <option value="Just exploring">Just exploring options</option>
              <option value="Interested">Interested in learning more</option>
              <option value="Very interested">Very interested in partnering</option>
              <option value="Ready to partner">Ready to partner immediately</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 rounded-lg"
              rows={4}
              placeholder="Tell us about your company and partnership goals"
              required
            ></textarea>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 text-lg font-semibold flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Partnership Inquiry'
            )}
          </button>
          
          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            By submitting this form, you agree to be contacted by our partnership team.
          </p>
        </form>
      </div>

      {/* Call to Action */}
      <div className="glass-panel p-8 bg-gradient-to-br from-brand-gold/10 to-brand-gold-dark/10 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Racing Together?</h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
            Don't miss your opportunity to be part of racing's digital revolution. Join PIT-BOX.COM and help 
            shape the future of motorsports technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:pitboxcom@gmail.com" className="btn-primary flex items-center justify-center gap-2 px-6 py-3">
              <Mail className="w-5 h-5" />
              Email Our Partnership Team
            </a>
            <a href="tel:+12792450737" className="btn-secondary flex items-center justify-center gap-2 px-6 py-3">
              <Phone className="w-5 h-5" />
              Call (279) 245-0737
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PartnerWithUs;