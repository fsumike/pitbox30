import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, MapPin, Globe, FileText, Camera, Loader2, CheckCircle, AlertCircle, Upload, Gift, Check, Share2, Copy, Download, Car, Trophy, Briefcase, Heart, GraduationCap, Home, Wrench, Shield, Eye, EyeOff, X, Calendar, Users, Crown, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { supabase } from '../lib/supabase';
import ChatButton from '../components/ChatButton';
import { usePromoCode } from '../hooks/usePromoCode';
import SubscriptionStatus from '../components/SubscriptionStatus';
import BlockedUsersPanel from '../components/BlockedUsersPanel';
import { QRCodeSVG } from 'qrcode.react';
import type { Profile } from '../types';

function ProfilePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { startChat } = useChat();
  const { validatePromoCode, applyPromoCode } = usePromoCode();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoValid, setPromoValid] = useState<boolean | null>(null);
  const [promoUsed, setPromoUsed] = useState(false);
  const [applyingPromo, setApplyingPromo] = useState(false);
  const [promoSuccess, setPromoSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'racing' | 'career' | 'personal' | 'privacy' | 'security' | 'blocked'>('basic');
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState<Partial<Profile>>({
    username: '',
    full_name: '',
    avatar_url: '',
    bio: '',
    location: '',
    website: '',
    phone: '',
    promo_code: '',
    has_premium: false,
    car_number: '',
    car_numbers: [],
    primary_racing_class: '',
    racing_role: '',
    years_racing_since: undefined,
    home_tracks: [],
    championships: [],
    notable_wins: '',
    current_team: '',
    previous_teams: [],
    birthday: undefined,
    relationship_status: '',
    education: '',
    day_job: '',
    hometown: '',
    mechanical_skills: [],
    racing_interests: [],
    looking_for: [],
    favorite_drivers: [],
    music_preference: '',
    privacy_racing_info: 'public',
    privacy_career_info: 'public',
    privacy_personal_info: 'friends',
    privacy_contact_info: 'private'
  });

  const appUrl = 'https://pit-box.com';

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading profile:', error);
        setError('Failed to load profile. Please try again.');
        return;
      }

      if (data) {
        setIsAdmin(data.is_admin || false);
        setProfile({
          username: data.username || '',
          full_name: data.full_name || '',
          avatar_url: data.avatar_url || '',
          bio: data.bio || '',
          location: data.location || '',
          website: data.website || '',
          phone: data.phone || '',
          promo_code: data.promo_code || '',
          has_premium: data.has_premium || false,
          car_number: data.car_number || '',
          car_numbers: data.car_numbers || [],
          primary_racing_class: data.primary_racing_class || '',
          racing_role: data.racing_role || '',
          years_racing_since: data.years_racing_since || undefined,
          home_tracks: data.home_tracks || [],
          championships: data.championships || [],
          notable_wins: data.notable_wins || '',
          current_team: data.current_team || '',
          previous_teams: data.previous_teams || [],
          birthday: data.birthday || undefined,
          relationship_status: data.relationship_status || '',
          education: data.education || '',
          day_job: data.day_job || '',
          hometown: data.hometown || '',
          mechanical_skills: data.mechanical_skills || [],
          racing_interests: data.racing_interests || [],
          looking_for: data.looking_for || [],
          favorite_drivers: data.favorite_drivers || [],
          music_preference: data.music_preference || '',
          privacy_racing_info: data.privacy_racing_info || 'public',
          privacy_career_info: data.privacy_career_info || 'public',
          privacy_personal_info: data.privacy_personal_info || 'friends',
          privacy_contact_info: data.privacy_contact_info || 'private'
        });
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setUploadingAvatar(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setError('Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!profile.username?.trim()) {
      setError('Username is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profile,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value || '' }));
  };

  const handleArrayAdd = (field: keyof Profile, value: string) => {
    if (!value.trim()) return;
    const currentArray = (profile[field] as string[]) || [];
    setProfile(prev => ({
      ...prev,
      [field]: [...currentArray, value.trim()]
    }));
  };

  const handleArrayRemove = (field: keyof Profile, index: number) => {
    const currentArray = (profile[field] as string[]) || [];
    setProfile(prev => ({
      ...prev,
      [field]: currentArray.filter((_, i) => i !== index)
    }));
  };

  const handlePromoCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setPromoCode(code);
    setPromoValid(validatePromoCode(code));
    setPromoUsed(false);

    if (validatePromoCode(code)) {
      checkPromoCodeUsed(code);
    }
  };

  const checkPromoCodeUsed = async (code: string) => {
    try {
      const normalizedCode = code.toLowerCase();
      const capitalizedCode = normalizedCode.charAt(0).toUpperCase() + normalizedCode.slice(1);

      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('promo_code', capitalizedCode)
        .limit(1);

      if (error) throw error;

      const isUsed = data && data.length > 0;
      setPromoUsed(isUsed);

      if (isUsed) {
        setPromoValid(false);
      }

      return isUsed;
    } catch (err) {
      console.error('Error checking if promo code is used:', err);
      return false;
    }
  };

  const handleApplyPromoCode = async () => {
    if (!promoValid || promoUsed) return;

    setApplyingPromo(true);
    try {
      const success = await applyPromoCode(promoCode);
      if (success) {
        setPromoSuccess(true);
        setProfile(prev => ({ ...prev, promo_code: promoCode, has_premium: true }));
        setTimeout(() => {
          setPromoCode('');
          setPromoSuccess(false);
        }, 3000);
      }
    } catch (err) {
      console.error('Error applying promo code:', err);
    } finally {
      setApplyingPromo(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownloadQR = () => {
    navigate('/qr-download');
  };

  const ArrayInput = ({
    label,
    field,
    placeholder,
    icon: Icon
  }: {
    label: string;
    field: keyof Profile;
    placeholder: string;
    icon: any;
  }) => {
    const [inputValue, setInputValue] = useState('');
    const items = (profile[field] as string[]) || [];

    return (
      <div>
        <label className="block text-sm font-medium mb-1">{label}</label>
        <div className="flex gap-2 mb-2">
          <div className="relative flex-1">
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleArrayAdd(field, inputValue);
                  setInputValue('');
                }
              }}
              className="w-full pl-10 pr-4 py-2 rounded-lg"
              placeholder={placeholder}
            />
          </div>
          <button
            type="button"
            onClick={() => {
              handleArrayAdd(field, inputValue);
              setInputValue('');
            }}
            className="px-4 py-2 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark transition-colors"
          >
            Add
          </button>
        </div>
        {items.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {items.map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-brand-gold/10 text-brand-gold rounded-full text-sm"
              >
                {item}
                <button
                  type="button"
                  onClick={() => handleArrayRemove(field, index)}
                  className="hover:text-brand-gold-dark"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      <div className="glass-panel p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            Profile updated successfully!
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'basic'
                ? 'border-b-2 border-brand-gold text-brand-gold'
                : 'text-gray-600 dark:text-gray-400 hover:text-brand-gold'
            }`}
          >
            Basic Info
          </button>
          <button
            onClick={() => setActiveTab('racing')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'racing'
                ? 'border-b-2 border-brand-gold text-brand-gold'
                : 'text-gray-600 dark:text-gray-400 hover:text-brand-gold'
            }`}
          >
            Racing Background
          </button>
          <button
            onClick={() => setActiveTab('career')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'career'
                ? 'border-b-2 border-brand-gold text-brand-gold'
                : 'text-gray-600 dark:text-gray-400 hover:text-brand-gold'
            }`}
          >
            Career & Achievements
          </button>
          <button
            onClick={() => setActiveTab('personal')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'personal'
                ? 'border-b-2 border-brand-gold text-brand-gold'
                : 'text-gray-600 dark:text-gray-400 hover:text-brand-gold'
            }`}
          >
            Personal Info
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'privacy'
                ? 'border-b-2 border-brand-gold text-brand-gold'
                : 'text-gray-600 dark:text-gray-400 hover:text-brand-gold'
            }`}
          >
            Privacy
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'security'
                ? 'border-b-2 border-brand-gold text-brand-gold'
                : 'text-gray-600 dark:text-gray-400 hover:text-brand-gold'
            }`}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab('blocked')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'blocked'
                ? 'border-b-2 border-brand-gold text-brand-gold'
                : 'text-gray-600 dark:text-gray-400 hover:text-brand-gold'
            }`}
          >
            Blocked Users
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-brand-gold/10 flex items-center justify-center overflow-hidden">
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-brand-gold" />
                    )}
                    {uploadingAvatar && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="absolute bottom-0 right-0 p-2 rounded-full bg-brand-gold text-white hover:bg-brand-gold-dark transition-colors disabled:opacity-50"
                    title="Upload avatar"
                  >
                    {uploadingAvatar ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{profile.full_name || 'Set Your Name'}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {user?.email}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    {isAdmin && (
                      <div className="flex items-center gap-2 text-red-500">
                        <Crown className="w-4 h-4" />
                        <span className="text-sm font-medium">Admin</span>
                      </div>
                    )}
                    {profile.has_premium && (
                      <div className="flex items-center gap-2 text-brand-gold">
                        <Gift className="w-4 h-4" />
                        <span className="text-sm font-medium">Premium Access</span>
                      </div>
                    )}
                    {profile.promo_code && (
                      <div className="flex items-center gap-2 text-green-500">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Code: {profile.promo_code}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Required Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="username"
                      value={profile.username}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg"
                      placeholder="Choose a username"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="full_name"
                      value={profile.full_name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Optional Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="location"
                      value={profile.location}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg"
                      placeholder="Your location"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="url"
                      name="website"
                      value={profile.website}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg"
                      placeholder="Your website"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Bio
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-gray-400" />
                    <textarea
                      name="bio"
                      value={profile.bio}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg"
                      placeholder="Tell us about yourself"
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              {/* Promo Code Section */}
              {!profile.has_premium && (
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Gift className="w-5 h-5 text-brand-gold" />
                    Premium Access
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Enter a valid promo code to unlock premium features.
                  </p>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={handlePromoCodeChange}
                        className={`w-full p-2 rounded-lg ${
                          promoValid === true && !promoUsed
                            ? 'border-green-500'
                            : promoValid === false || promoUsed
                            ? 'border-red-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="Enter promo code"
                      />
                      {promoValid === true && !promoUsed && (
                        <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyPromoCode}
                      disabled={!promoValid || promoUsed || applyingPromo || promoSuccess}
                      className="px-4 py-2 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {applyingPromo ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : promoSuccess ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Gift className="w-4 h-4" />
                      )}
                      {applyingPromo ? 'Applying...' : promoSuccess ? 'Applied!' : 'Apply'}
                    </button>
                  </div>

                  {promoValid === false && promoCode && !promoUsed && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      Invalid promo code.
                    </p>
                  )}

                  {promoUsed && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      This promo code has already been used.
                    </p>
                  )}

                  {promoSuccess && (
                    <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                      Promo code applied successfully! You now have premium access.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Racing Background Tab */}
          {activeTab === 'racing' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Car className="w-6 h-6 text-brand-gold" />
                <h2 className="text-xl font-bold">Racing Background</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Primary Car Number
                  </label>
                  <div className="relative">
                    <Car className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="car_number"
                      value={profile.car_number}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg"
                      placeholder="e.g., 24"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Racing Role
                  </label>
                  <select
                    name="racing_role"
                    value={profile.racing_role}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg"
                  >
                    <option value="">Select role</option>
                    <option value="Driver">Driver</option>
                    <option value="Crew Chief">Crew Chief</option>
                    <option value="Mechanic">Mechanic</option>
                    <option value="Owner">Owner</option>
                    <option value="Spotter">Spotter</option>
                    <option value="Fan">Fan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Primary Racing Class
                  </label>
                  <input
                    type="text"
                    name="primary_racing_class"
                    value={profile.primary_racing_class}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg"
                    placeholder="e.g., 410 Sprints"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Racing Since (Year)
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      name="years_racing_since"
                      value={profile.years_racing_since || ''}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg"
                      placeholder="e.g., 2015"
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  </div>
                </div>
              </div>

              <ArrayInput
                label="All Car Numbers Used"
                field="car_numbers"
                placeholder="Enter a car number"
                icon={Car}
              />

              <ArrayInput
                label="Home Tracks"
                field="home_tracks"
                placeholder="Enter a track name"
                icon={MapPin}
              />

              <div>
                <label className="block text-sm font-medium mb-1">
                  Current Team
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="current_team"
                    value={profile.current_team}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 rounded-lg"
                    placeholder="Your current racing team"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Career & Achievements Tab */}
          {activeTab === 'career' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-6 h-6 text-brand-gold" />
                <h2 className="text-xl font-bold">Career & Achievements</h2>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Notable Wins & Achievements
                </label>
                <textarea
                  name="notable_wins"
                  value={profile.notable_wins}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg"
                  placeholder="Describe your racing achievements, wins, and milestones..."
                  rows={4}
                />
              </div>

              <ArrayInput
                label="Previous Teams"
                field="previous_teams"
                placeholder="Enter a team name"
                icon={Users}
              />
            </div>
          )}

          {/* Personal Information Tab */}
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-6 h-6 text-brand-gold" />
                <h2 className="text-xl font-bold">Personal Information</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Birthday
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      name="birthday"
                      value={profile.birthday || ''}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Relationship Status
                  </label>
                  <select
                    name="relationship_status"
                    value={profile.relationship_status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg"
                  >
                    <option value="">Select status</option>
                    <option value="Single">Single</option>
                    <option value="In a relationship">In a relationship</option>
                    <option value="Engaged">Engaged</option>
                    <option value="Married">Married</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Hometown
                  </label>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="hometown"
                      value={profile.hometown}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg"
                      placeholder="Where you're from"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Day Job
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="day_job"
                      value={profile.day_job}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg"
                      placeholder="Your profession"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Education
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="education"
                    value={profile.education}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 rounded-lg"
                    placeholder="Your education background"
                  />
                </div>
              </div>

              <ArrayInput
                label="Mechanical Skills"
                field="mechanical_skills"
                placeholder="e.g., Engine Building, Suspension Setup"
                icon={Wrench}
              />

              <ArrayInput
                label="Racing Interests"
                field="racing_interests"
                placeholder="e.g., Sprint Cars, Late Models"
                icon={Car}
              />

              <ArrayInput
                label="Looking For"
                field="looking_for"
                placeholder="e.g., Crew Members, Sponsors"
                icon={Users}
              />

              <ArrayInput
                label="Favorite Drivers"
                field="favorite_drivers"
                placeholder="Enter a driver name"
                icon={Trophy}
              />
            </div>
          )}

          {/* Privacy Settings Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-brand-gold" />
                <h2 className="text-xl font-bold">Privacy Settings</h2>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                Control who can see different sections of your profile.
              </p>

              <div className="space-y-4">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <label className="block text-sm font-medium mb-2">
                    Racing Information
                  </label>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Car number, class, role, teams, home tracks
                  </p>
                  <select
                    name="privacy_racing_info"
                    value={profile.privacy_racing_info}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg"
                  >
                    <option value="public">Public - Everyone can see</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private - Only you</option>
                  </select>
                </div>

                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <label className="block text-sm font-medium mb-2">
                    Career & Achievements
                  </label>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Championships, wins, career highlights
                  </p>
                  <select
                    name="privacy_career_info"
                    value={profile.privacy_career_info}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg"
                  >
                    <option value="public">Public - Everyone can see</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private - Only you</option>
                  </select>
                </div>

                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <label className="block text-sm font-medium mb-2">
                    Personal Information
                  </label>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Birthday, hometown, day job, education, interests
                  </p>
                  <select
                    name="privacy_personal_info"
                    value={profile.privacy_personal_info}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg"
                  >
                    <option value="public">Public - Everyone can see</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private - Only you</option>
                  </select>
                </div>

                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <label className="block text-sm font-medium mb-2">
                    Contact Information
                  </label>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Phone number, email
                  </p>
                  <select
                    name="privacy_contact_info"
                    value={profile.privacy_contact_info}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg"
                  >
                    <option value="public">Public - Everyone can see</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private - Only you</option>
                  </select>
                </div>
              </div>

              <div className="bg-brand-gold/10 rounded-lg p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Note:</strong> Your posts and marketplace listings visibility is controlled
                  separately and follows their own privacy settings.
                </p>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-brand-gold" />
                <h2 className="text-xl font-bold">Security Settings</h2>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage your account security and authentication methods.
              </p>

              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-3">Account Security</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Your account is secured with your email and password. For best security practices:
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-disc list-inside">
                  <li>Use a strong, unique password</li>
                  <li>Never share your password with anyone</li>
                  <li>Sign out when using shared devices</li>
                  <li>Keep your email address up to date</li>
                </ul>
              </div>

              <div className="bg-brand-gold/10 rounded-lg p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Email:</strong> {user?.email}
                </p>
              </div>
            </div>
          )}

          {/* Blocked Users Tab */}
          {activeTab === 'blocked' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-brand-gold" />
                <h2 className="text-xl font-bold">Blocked Users</h2>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage users you've blocked. Blocked users cannot see your profile, posts, or contact you.
              </p>

              <BlockedUsersPanel />
            </div>
          )}

          {/* Save Button - Show on all tabs except blocked and security */}
          {activeTab !== 'blocked' && activeTab !== 'security' && (
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Subscription Status */}
      <div className="glass-panel p-6">
        <h2 className="text-xl font-bold mb-4">Subscription</h2>
        <SubscriptionStatus />
      </div>

      {/* Share Pit-Box.com Section */}
      <div className="glass-panel p-8 bg-gradient-to-br from-brand-gold/5 to-brand-gold-light/5">
        <div className="flex items-center gap-3 mb-6">
          <Share2 className="w-6 h-6 text-brand-gold" />
          <h2 className="text-2xl font-bold">Share Pit-Box.com</h2>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Help grow the racing community by sharing Pit-Box.com with your crew, friends, and fellow racers.
        </p>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg mb-4">
              <QRCodeSVG
                value={appUrl}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Scan to visit Pit-Box.com
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Website URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={appUrl}
                  readOnly
                  className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark transition-colors flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={handleDownloadQR}
              className="w-full px-6 py-3 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Download className="w-5 h-5" />
              Download QR Codes (All Sizes)
            </button>

            <div className="bg-brand-gold/10 rounded-lg p-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Pro Tip:</strong> Download high-resolution QR codes for business cards,
                flyers, vehicle decals, and more. Perfect for promoting Pit-Box.com at the track!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
