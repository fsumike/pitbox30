import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  FileText, 
  Lock,
  Info
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

function TermsOfService() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hasAccepted, setHasAccepted] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [signature, setSignature] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const TERMS_VERSION = '1.0.0'; // Update this when terms change
  
  useEffect(() => {
    if (user) {
      checkAcceptance();
    } else {
      setLoading(false);
    }
  }, [user]);
  
  const checkAcceptance = async () => {
    try {
      const { data, error } = await supabase
        .from('terms_acceptance')
        .select('*')
        .eq('user_id', user?.id)
        .eq('terms_version', TERMS_VERSION)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      setHasAccepted(!!data);
    } catch (err) {
      console.error('Error checking terms acceptance:', err);
      setError('Failed to check terms acceptance status');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be signed in to accept the terms');
      return;
    }
    
    if (!isChecked) {
      setError('You must check the box to accept the terms');
      return;
    }
    
    if (!signature.trim()) {
      setError('Please provide your signature');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      // Get IP address (this is a simple approach - in production you might use a server-side solution)
      let ipAddress = '';
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        ipAddress = ipData.ip;
      } catch (ipErr) {
        }
      
      const { error: insertError } = await supabase
        .from('terms_acceptance')
        .insert({
          user_id: user.id,
          accepted_at: new Date().toISOString(),
          signature: signature.trim(),
          ip_address: ipAddress,
          terms_version: TERMS_VERSION
        });
        
      if (insertError) throw insertError;
      
      setSuccess(true);
      setHasAccepted(true);
      
      // Redirect after successful acceptance
      setTimeout(() => {
        navigate('/home');
      }, 2000);
      
    } catch (err) {
      console.error('Error accepting terms:', err);
      setError('Failed to record your acceptance. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-brand-gold transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>
      
      <div className="glass-panel p-8">
        <div className="flex items-center gap-4 mb-6">
          <Shield className="w-10 h-10 text-brand-gold" />
          <h1 className="text-3xl font-bold">Terms of Service</h1>
        </div>
        
        {hasAccepted ? (
          <div className="bg-green-100 dark:bg-green-900/30 p-6 rounded-lg flex items-center gap-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-green-700 dark:text-green-300">Terms Accepted</h2>
              <p className="text-green-700 dark:text-green-300">
                You have already accepted the Terms of Service for PIT-BOX.COM.
              </p>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-6 p-4 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                Terms accepted successfully! Redirecting...
              </div>
            )}
            
            <div className="mb-8">
              <p className="text-lg mb-4 text-gray-900 dark:text-gray-100">
                Please read and accept the following Terms of Service to continue using PIT-BOX.COM.
              </p>
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-4 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                <Info className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">
                  By accepting these terms, you acknowledge that you have read, understood, and agree to be bound by all the provisions outlined below.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg mb-8 max-h-[400px] overflow-y-auto border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
              <h2 className="text-xl font-bold mb-4">PIT-BOX.COM Terms of Service</h2>

              <h3 className="text-lg font-semibold mt-6 mb-2">1. Acceptance of Terms</h3>
              <p className="mb-4">
                By accessing or using PIT-BOX.COM ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, you must not access or use the Service.
              </p>
              
              <h3 className="text-lg font-semibold mt-6 mb-2">2. Description of Service</h3>
              <p className="mb-4">
                PIT-BOX.COM provides tools and resources for racing setup management, community interaction, and related services. The Service is provided "as is" and "as available" without warranties of any kind.
              </p>
              
              <h3 className="text-lg font-semibold mt-6 mb-2">3. User Accounts</h3>
              <p className="mb-4">
                You are responsible for maintaining the security of your account and password. The company cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.
              </p>
              
              <h3 className="text-lg font-semibold mt-6 mb-2">4. User Content</h3>
              <p className="mb-4">
                You retain ownership of any content you submit to the Service. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, copy, reproduce, process, adapt, modify, publish, transmit, display, and distribute such content.
              </p>
              
              <h3 className="text-lg font-semibold mt-6 mb-2">5. Acceptable Use</h3>
              <p className="mb-4">
                You agree not to use the Service for any illegal or unauthorized purpose. You must not transmit worms, viruses, or any code of a destructive nature. Harassment, abuse, or threatening behavior toward other users is prohibited.
              </p>
              
              <h3 className="text-lg font-semibold mt-6 mb-2">6. Disclaimer of Warranties</h3>
              <p className="mb-4">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE EXPLICITLY DISCLAIM ALL WARRANTIES, INCLUDING ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, QUIET ENJOYMENT, OR NON-INFRINGEMENT.
              </p>
              
              <h3 className="text-lg font-semibold mt-6 mb-2">7. Limitation of Liability</h3>
              <p className="mb-4">
                IN NO EVENT SHALL PIT-BOX.COM, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF OR IN ANY WAY CONNECTED WITH THE USE OF THE SERVICE, WHETHER BASED ON CONTRACT, TORT, STRICT LIABILITY, OR OTHERWISE.
              </p>
              
              <h3 className="text-lg font-semibold mt-6 mb-2">8. Racing Safety Disclaimer</h3>
              <p className="mb-4">
                PIT-BOX.COM provides tools for racing setup management, but we are not responsible for the safety or performance of any vehicle. Users are solely responsible for ensuring their vehicles meet all safety requirements and are properly maintained. Racing is inherently dangerous, and users participate at their own risk.
              </p>
              
              <h3 className="text-lg font-semibold mt-6 mb-2">9. No Professional Advice</h3>
              <p className="mb-4">
                The information provided through the Service is for general informational purposes only and should not be considered professional advice. Users should consult with qualified professionals regarding specific racing, mechanical, or safety concerns.
              </p>
              
              <h3 className="text-lg font-semibold mt-6 mb-2">10. Indemnification</h3>
              <p className="mb-4">
                You agree to indemnify and hold harmless PIT-BOX.COM, its contractors, licensors, and their respective directors, officers, employees, and agents from and against any and all claims and expenses, including attorneys' fees, arising out of your use of the Service.
              </p>
              
              <h3 className="text-lg font-semibold mt-6 mb-2">11. Termination</h3>
              <p className="mb-4">
                We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
              
              <h3 className="text-lg font-semibold mt-6 mb-2">12. Changes to Terms</h3>
              <p className="mb-4">
                We reserve the right to modify or replace these Terms at any time. It is your responsibility to check the Terms periodically for changes. Your continued use of the Service following the posting of any changes constitutes acceptance of those changes.
              </p>
              
              <h3 className="text-lg font-semibold mt-6 mb-2">13. Governing Law</h3>
              <p className="mb-4">
                These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.
              </p>
              
              <h3 className="text-lg font-semibold mt-6 mb-2">14. Contact Information</h3>
              <p className="mb-4">
                For any questions about these Terms, please contact us at pit-box.com@mail.com.
              </p>
              
              <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                Last updated: May 22, 2025
              </p>
            </div>
            
            <form onSubmit={handleAccept} className="space-y-6">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="accept-terms"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  className="mt-1"
                />
                <label htmlFor="accept-terms" className="text-lg text-gray-900 dark:text-gray-100">
                  I have read, understood, and agree to the Terms of Service. I understand that by using PIT-BOX.COM, I do so at my own risk.
                </label>
              </div>
              
              <div>
                <label htmlFor="signature" className="block text-lg font-medium mb-2 text-gray-900 dark:text-white">
                  Electronic Signature (Type your full name)
                </label>
                <input
                  type="text"
                  id="signature"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  className="w-full p-3 rounded-lg"
                  placeholder="Your full name"
                  required
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  By typing your name above, you are signing this agreement electronically.
                </p>
              </div>
              
              <button
                type="submit"
                disabled={submitting || !isChecked || !signature.trim()}
                className="w-full btn-primary py-3 text-lg font-semibold flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    I Accept the Terms of Service
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default TermsOfService;