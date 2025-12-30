import { User } from '@supabase/supabase-js';

// User related types
export interface Profile {
  id?: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  website?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
  promo_code?: string;
  has_premium?: boolean;
  is_admin?: boolean;

  // Racing Background
  car_number?: string;
  car_numbers?: string[];
  primary_racing_class?: string;
  racing_role?: string;
  years_racing_since?: number;
  home_tracks?: string[];

  // Career & Achievements
  championships?: Array<{
    title: string;
    year: number;
    series?: string;
  }>;
  notable_wins?: string;
  current_team?: string;
  previous_teams?: Array<{
    name: string;
    role?: string;
    start_year?: number;
    end_year?: number;
  }>;

  // Personal Information
  birthday?: string;
  relationship_status?: string;
  education?: string;
  day_job?: string;
  hometown?: string;

  // Interests & Skills
  mechanical_skills?: string[];
  racing_interests?: string[];
  looking_for?: string[];
  favorite_drivers?: string[];
  music_preference?: string;

  // Privacy Settings
  privacy_racing_info?: 'public' | 'friends' | 'private';
  privacy_career_info?: 'public' | 'friends' | 'private';
  privacy_personal_info?: 'public' | 'friends' | 'private';
  privacy_contact_info?: 'public' | 'friends' | 'private';

  // Profile Stats
  profile_views?: number;
  last_active?: string;
  seller_rating?: number;
  total_sales?: number;
  follower_count?: number;
  following_count?: number;
  is_verified?: boolean;
  verification_type?: string;
}

// Setup related types
export interface SetupValue {
  feature: string;
  comment?: string;
}

export type RaceType = 'hot_laps' | 'qualifying' | 'heat_race' | 'd_main' | 'c_main' | 'b_main' | 'a_main';

export const RACE_TYPE_OPTIONS: { value: RaceType; label: string }[] = [
  { value: 'hot_laps', label: 'Hot Laps' },
  { value: 'qualifying', label: 'Qualifying' },
  { value: 'heat_race', label: 'Heat Race' },
  { value: 'd_main', label: 'D Main' },
  { value: 'c_main', label: 'C Main' },
  { value: 'b_main', label: 'B Main' },
  { value: 'a_main', label: 'A Main' },
];

export interface Setup {
  id: string;
  user_id: string;
  car_type: string;
  car_number: string | null;
  track_name: string | null;
  race_type?: RaceType | null;
  track_conditions: {
    weather?: string;
    surface?: string;
    date?: string;
    location?: {
      latitude: number;
      longitude: number;
    };
  };
  setup_data: Record<string, SetupValue>;
  custom_fields?: Record<string, any>;
  best_lap_time?: number | null;
  created_at: string;
  updated_at: string;
}

export interface DynoImage {
  id: string;
  user_id: string;
  setup_id?: string;
  type: 'motor' | 'shock';
  url: string;
  created_at: string;
}

// Listing related types
export interface Listing {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  latitude?: number;
  longitude?: number;
  status: 'active' | 'sold' | 'expired';
  created_at: string;
  updated_at: string;
  images: ListingImage[];
  likes: number;
  liked_by_user: boolean;
  saved?: boolean;
  seller?: {
    username: string;
    avatar_url: string | null;
    full_name?: string;
  };
  contact_phone?: string;
  contact_email?: string;
  preferred_contact?: 'phone' | 'email';
}

export interface ListingImage {
  id: string;
  listing_id: string;
  url: string;
  order: number;
  created_at: string;
}

// Post related types
export interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  video_url?: string;
  is_pinned?: boolean;
  latitude?: number;
  longitude?: number;
  location?: string;
  visibility: 'public' | 'friends' | 'private';
  created_at: string;
  updated_at: string;
  is_edited?: boolean;
  edited_at?: string;
  view_count?: number;
  share_count?: number;
  profiles?: Profile;
  post_likes?: PostLike[];
  post_reactions?: PostReaction[];
  post_comments?: PostComment[];
  bookmarked?: boolean;
}

export interface PostLike {
  id: string;
  reaction_type: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  parent_comment_id?: string;
  reply_count?: number;
  reaction_count?: number;
  media_url?: string;
  media_type?: string;
  profiles?: Profile;
}

export interface PostReaction {
  id: string;
  post_id: string;
  user_id: string;
  reaction_type: string;
  created_at: string;
}

export interface PostBookmark {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'like' | 'comment' | 'friend_request' | 'mention' | 'system';
  content: string;
  related_user_id?: string;
  post_id?: string;
  read: boolean;
  created_at: string;
  related_user?: Profile;
}

export interface Advertisement {
  id: string;
  business_name: string;
  contact_email: string;
  contact_phone?: string;
  ad_content: string;
  image_url?: string;
  target_location?: { lat: number; lng: number };
  target_radius_miles?: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  clicks: number;
  impressions: number;
  created_at: string;
  updated_at: string;
}

// Component prop types
export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresPremium?: boolean;
}

// Add Message type
export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  sender?: Profile;
}

// Blocked Users
export interface BlockedUser {
  id: string;
  blocker_id: string;
  blocked_id: string;
  reason?: string;
  created_at: string;
  blocked_profile?: Profile;
}

// User Reports
export interface UserReport {
  id: string;
  reporter_id: string;
  reported_id: string;
  report_type: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
}

// Profile Invites
export interface ProfileInvite {
  id: string;
  inviter_id: string;
  invitee_email: string;
  invitee_phone?: string;
  invite_code: string;
  status: 'pending' | 'accepted' | 'expired';
  accepted_by?: string;
  created_at: string;
  accepted_at?: string;
}

// Friend Request
export interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  sender?: Profile;
  receiver?: Profile;
}

// Friendship
export interface Friendship {
  id: string;
  user_id1: string;
  user_id2: string;
  created_at: string;
  friend?: Profile;
}