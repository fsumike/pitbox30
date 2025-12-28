import React, { useState } from 'react';
import { Mail, MapPin, MessageSquare, Clock, Users, Heart, Globe, Award, Trophy, CheckCircle, Loader2, AlertCircle, Shield, Lock, Phone, FileText, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('general');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSending(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name,
          email,
          subject,
          message,
        },
      });

      if (functionError) throw functionError;

      setSuccess(true);
      setName('');
      setEmail('');
      setSubject('general');
      setMessage('');

      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err?.message || 'Failed to send message. Please try emailing us directly at pitboxcom@gmail.com');
      console.error('Contact form error:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="carbon-fiber-panel p-8 bg-gradient-to-br from-brand-gold/25 to-brand-gold-dark/20">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-brand-gold to-brand-gold-light bg-clip-text text-transparent">
              We're Here For You
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              At PIT-BOX.COM, our commitment to your success extends far beyond the track. 
              We're dedicated to providing an exceptional experience that helps you achieve 
              your racing goals.
            </p>
          </div>
          <div className="flex-shrink-0">
            <img 
              src="/android-icon-192-192.png" 
              alt="PIT-BOX.COM Logo" 
              className="w-48 h-auto drop-shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Legal & Privacy Section */}
      <div className="carbon-fiber-panel p-8">
        <div className="text-center mb-8">
          <Shield className="w-12 h-12 text-brand-gold mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Legal & Privacy</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your privacy and security are our top priorities
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <Link
            to="/privacy"
            className="glass-panel p-6 text-center hover:scale-105 transition-transform"
          >
            <FileText className="w-8 h-8 text-brand-gold mx-auto mb-2" />
            <h3 className="font-semibold mb-2">Privacy Policy</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              How we protect your data
            </p>
          </Link>
          <Link
            to="/terms"
            className="glass-panel p-6 text-center hover:scale-105 transition-transform"
          >
            <FileText className="w-8 h-8 text-brand-gold mx-auto mb-2" />
            <h3 className="font-semibold mb-2">Terms of Service</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              User agreement & rules
            </p>
          </Link>
          <button
            onClick={() => {
              setSubject('Data Deletion Request');
              window.scrollTo({ top: document.getElementById('contact-form')?.offsetTop, behavior: 'smooth' });
            }}
            className="glass-panel p-6 text-center hover:scale-105 transition-transform"
          >
            <Lock className="w-8 h-8 text-brand-gold mx-auto mb-2" />
            <h3 className="font-semibold mb-2">Delete My Data</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Request account deletion
            </p>
          </button>
        </div>
        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg max-w-3xl mx-auto">
          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Your Data is Secure
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                All data is encrypted in transit (HTTPS/TLS) and at rest (AES-256).
                We use industry-standard security measures and never sell your data to third parties.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div id="contact-form" className="carbon-fiber-panel p-8">
        <div className="max-w-2xl mx-auto text-center">
          <MessageSquare className="w-12 h-12 text-brand-gold mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            We typically respond within 2-3 business days
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              Message sent successfully! We'll get back to you soon.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject *</label>
              <select
                id="subject"
                name="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                required
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Account Help">Account Help</option>
                <option value="Privacy Question">Privacy Question</option>
                <option value="Data Deletion Request">Data Deletion Request</option>
                <option value="Billing Question">Billing Question</option>
                <option value="Bug Report">Bug Report</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Partnership Inquiry">Partnership Inquiry</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">Message *</label>
              <textarea
                id="message"
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                rows={6}
                placeholder={subject === 'Data Deletion Request' ? 'Please include your account email and confirm you want to delete all your data. This action cannot be undone.' : 'Write your message here...'}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full btn-primary flex items-center justify-center gap-2"
              disabled={sending}
            >
              {sending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="carbon-fiber-panel p-8">
        <div className="text-center mb-8">
          <MessageSquare className="w-12 h-12 text-brand-gold mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Find quick answers to common questions
          </p>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            {
              q: 'How do I delete my account?',
              a: 'Click "Delete My Data" above or contact us with subject "Data Deletion Request". We\'ll remove all your data within 45 days, except transaction records kept for legal compliance (7 years).'
            },
            {
              q: 'How do I reset my password?',
              a: 'On the sign-in page, click "Forgot Password" and enter your email. You\'ll receive a password reset link within minutes.'
            },
            {
              q: 'Is my data secure?',
              a: 'Yes! All data is encrypted in transit (HTTPS/TLS) and at rest (AES-256). We use Row Level Security so only you can access your private setups. We never sell your data.'
            },
            {
              q: 'Who can see my setups?',
              a: 'Only you can see your private setups. You control sharing - setups are private by default. You can choose to share specific setups with friends, your team, or make them public.'
            },
            {
              q: 'How do I cancel my subscription?',
              a: 'Go to Profile → Subscription → Manage Subscription. You can cancel anytime and will retain access until your billing period ends.'
            },
            {
              q: 'What age do I need to be to use PIT-BOX?',
              a: 'You must be at least 13 years old. Users under 16 may need parental consent depending on your location (GDPR requirements).'
            },
            {
              q: 'How long does it take to get support?',
              a: 'We typically respond within 2-3 business days (Monday-Friday, 9AM-5PM Pacific). Urgent technical issues are prioritized.'
            },
            {
              q: 'Can I export my data?',
              a: 'Yes! Go to Profile → Settings → Export Data. You\'ll receive a download of all your setups, posts, and data in JSON format.'
            }
          ].map((faq, index) => (
            <div key={index} className="glass-panel p-4">
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full flex items-center justify-between text-left"
              >
                <h3 className="font-semibold">{faq.q}</h3>
                <ChevronDown
                  className={`w-5 h-5 text-brand-gold transition-transform ${
                    expandedFaq === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedFaq === index && (
                <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Info */}
      <div className="glass-panel p-8 bg-white/80 dark:bg-gray-800/50">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-brand-gold" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Email</h3>
            <a href="mailto:pitboxcom@gmail.com" className="text-gray-600 dark:text-gray-400 hover:text-brand-gold">
              pitboxcom@gmail.com
            </a>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-brand-gold" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Phone</h3>
            <a href="tel:+12792450737" className="text-gray-600 dark:text-gray-400 hover:text-brand-gold">
              (279) 245-0737
            </a>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-brand-gold" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Address</h3>
            <p className="text-gray-600 dark:text-gray-400">
              8 Densmore Way<br />
              Folsom, CA 95630<br />
              United States
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-brand-gold" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Support Hours</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Monday - Friday<br />
              9AM - 5PM PST
            </p>
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="glass-panel p-8 text-center bg-white/80 dark:bg-gray-800/50">
        <Globe className="w-12 h-12 text-brand-gold mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Follow Us</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Stay connected with the PIT-BOX community
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a
            href="https://www.tiktok.com/@pitbox2025"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary px-6 py-3"
          >
            TikTok @pitbox2025
          </a>
          <a
            href="https://instagram.com/pitbox25"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary px-6 py-3"
          >
            Instagram @pitbox25
          </a>
          <a
            href="https://facebook.com/pitbox25"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary px-6 py-3"
          >
            Facebook @pitbox25
          </a>
          <a
            href="https://www.threads.net/@pitbox25"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary px-6 py-3"
          >
            Threads @pitbox25
          </a>
          <a
            href="https://x.com/PitBox2025"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary px-6 py-3"
          >
            X @PitBox2025
          </a>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 text-center transform hover:scale-105 transition-all duration-300 bg-white/80 dark:bg-gray-800/50">
          <Trophy className="w-8 h-8 text-brand-gold mx-auto mb-2" />
          <div className="text-lg font-semibold">Racing Excellence</div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Professional-grade setup tools for peak performance
          </p>
        </div>

        <div className="glass-panel p-6 text-center transform hover:scale-105 transition-all duration-300 bg-white/80 dark:bg-gray-800/50">
          <Users className="w-8 h-8 text-brand-gold mx-auto mb-2" />
          <div className="text-lg font-semibold">Community</div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Connect with fellow racers and share experiences
          </p>
        </div>

        <div className="glass-panel p-6 text-center transform hover:scale-105 transition-all duration-300 bg-white/80 dark:bg-gray-800/50">
          <Globe className="w-8 h-8 text-brand-gold mx-auto mb-2" />
          <div className="text-lg font-semibold">Global Access</div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Access your setups from anywhere, anytime
          </p>
        </div>

        <div className="glass-panel p-6 text-center transform hover:scale-105 transition-all duration-300 bg-white/80 dark:bg-gray-800/50">
          <Award className="w-8 h-8 text-brand-gold mx-auto mb-2" />
          <div className="text-lg font-semibold">Expert Support</div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Dedicated team to help you achieve victory
          </p>
        </div>
      </div>

      {/* Thank You Section */}
      <div className="glass-panel p-8 text-center bg-white/80 dark:bg-gray-800/50">
        <div className="max-w-3xl mx-auto">
          <Heart className="w-16 h-16 text-brand-gold mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-brand-gold to-brand-gold-light bg-clip-text text-transparent">
            With Gratitude
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Thank you for being part of the PIT-BOX.COM community. Together, we're changing the future of racing.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Contact;