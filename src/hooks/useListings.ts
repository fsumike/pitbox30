import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { getStorageItem, setStorageItem } from '../utils/capacitor';
import { calculateDistance } from '../utils/distance';

export interface Listing {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
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
  vehicle_type?: string;
  view_count?: number;
  is_featured?: boolean;
  condition?: 'new' | 'like-new' | 'good' | 'fair' | 'parts';
  is_negotiable?: boolean;
  distance_miles?: number;
}

export interface ListingImage {
  id: string;
  listing_id: string;
  url: string;
  order: number;
  created_at: string;
}

export function useListings() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [savedListings, setSavedListings] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (user) {
      loadSavedListings();
    }
  }, [user]);

  const loadSavedListings = async () => {
    if (!user) return;
    
    try {
      // Load from storage
      const savedKey = `saved_listings_${user.id}`;
      const saved = await getStorageItem(savedKey);
      if (saved) {
        setSavedListings(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Error loading saved listings:', err);
    }
  };

  const uploadImageToStorage = async (base64Image: string, listingId: string, index: number): Promise<string | null> => {
    try {
      const base64Data = base64Image.split(',')[1];
      if (!base64Data) {
        console.error('Invalid base64 image format');
        return null;
      }

      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      let mimeType = 'image/jpeg';
      if (base64Image.includes('data:image/png')) {
        mimeType = 'image/png';
      } else if (base64Image.includes('data:image/webp')) {
        mimeType = 'image/webp';
      } else if (base64Image.includes('data:image/gif')) {
        mimeType = 'image/gif';
      }

      const ext = mimeType.split('/')[1];
      const fileName = `listings/${user!.id}/${listingId}/${Date.now()}_${index}.${ext}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('posts')
        .upload(fileName, byteArray, {
          contentType: mimeType,
          upsert: false
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from('posts')
        .getPublicUrl(uploadData.path);

      return urlData.publicUrl;
    } catch (err) {
      console.error('Error uploading image:', err);
      return null;
    }
  };

  const createListing = async (
    data: {
      title: string;
      description: string;
      price: number;
      category: string;
      location: string;
      latitude?: number;
      longitude?: number;
      contact_phone?: string;
      contact_email?: string;
      preferred_contact?: 'phone' | 'email';
      vehicle_type?: string;
      condition?: string;
      is_negotiable?: boolean;
    },
    images: string[]
  ) => {
    if (!user) {
      setError('You must be signed in to create a listing');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: listing, error: listingError } = await supabase
        .from('listings')
        .insert([{
          user_id: user.id,
          ...data,
          status: 'active'
        }])
        .select()
        .single();

      if (listingError) throw listingError;

      if (images.length > 0) {
        const imagesToAdd = images.slice(0, 4);
        const uploadedUrls: string[] = [];

        for (let i = 0; i < imagesToAdd.length; i++) {
          try {
            const uploadedUrl = await uploadImageToStorage(imagesToAdd[i], listing.id, i);
            if (uploadedUrl) {
              uploadedUrls.push(uploadedUrl);
            }
          } catch (uploadErr) {
            console.error(`Failed to upload image ${i + 1}:`, uploadErr);
          }
        }

        if (uploadedUrls.length > 0) {
          const imageRecords = uploadedUrls.map((url, index) => ({
            listing_id: listing.id,
            url,
            order: index + 1
          }));

          const { error: imageError } = await supabase
            .from('listing_images')
            .insert(imageRecords);

          if (imageError) {
            console.error('Failed to save image records:', imageError);
          }
        } else if (imagesToAdd.length > 0) {
          console.warn('No images were successfully uploaded');
        }
      }

      return listing;
    } catch (err) {
      console.error('Error creating listing:', err);
      setError('Failed to create listing');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getListings = async (filters?: {
    category?: string;
    distance?: number;
    latitude?: number;
    longitude?: number;
    search?: string;
    tab?: 'all' | 'favorites' | 'mine' | 'saved';
    vehicleType?: string;
    page?: number;
    limit?: number;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const page = filters?.page || 0;
      const limit = filters?.limit || 20;
      const offset = page * limit;

      let query = supabase
        .from('listings')
        .select(`
          *,
          listing_images (
            id,
            url,
            order
          ),
          profiles!listings_user_id_fkey (
            id,
            username,
            avatar_url,
            full_name
          ),
          listing_likes (
            id,
            user_id
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      // Apply category filter
      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      // Apply vehicle type filter
      if (filters?.vehicleType && filters.vehicleType !== 'all') {
        query = query.eq('vehicle_type', filters.vehicleType);
      }
      // Apply search filter
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      // Apply tab filter
      if (filters?.tab && user) {
        if (filters.tab === 'mine') {
          query = query.eq('user_id', user.id);
        } else if (filters.tab === 'favorites') {
          // Get listings that the user has liked
          const { data: likes } = await supabase
            .from('listing_likes')
            .select('listing_id')
            .eq('user_id', user.id);

          if (likes && likes.length > 0) {
            const likedIds = likes.map(like => like.listing_id);
            query = query.in('id', likedIds);
          } else {
            // If no likes, return empty array
            return [];
          }
        } else if (filters.tab === 'saved') {
          // Filter by saved listings from localStorage
          if (savedListings.length > 0) {
            query = query.in('id', savedListings);
          } else {
            // If no saved listings, return empty array
            return [];
          }
        }
      }

      let data;
      let error;

      if (filters?.distance && filters?.latitude && filters?.longitude) {
        const { data: distanceData, error: distanceError } = await supabase
          .rpc('get_listings_within_distance', {
            user_lat: filters.latitude,
            user_lng: filters.longitude,
            radius_miles: filters.distance
          });

        data = distanceData;
        error = distanceError;

        if (data) {
          const listingIds = data.map((l: any) => l.id);

          const { data: enrichedData } = await supabase
            .from('listings')
            .select(`
              *,
              listing_images (
                id,
                url,
                order
              ),
              profiles!listings_user_id_fkey (
                id,
                username,
                avatar_url,
                full_name
              ),
              listing_likes (
                id,
                user_id
              )
            `)
            .in('id', listingIds);

          const enrichedMap = new Map(enrichedData?.map(item => [item.id, item]));
          data = data.map((listing: any) => ({
            ...enrichedMap.get(listing.id),
            distance_miles: listing.distance_miles
          }));
        }
      } else {
        const result = await query;
        data = result.data;
        error = result.error;
      }

      if (error) throw error;

      let transformedData = (data || []).map(listing => ({
        ...listing,
        images: listing.listing_images || [],
        likes: (listing.listing_likes || []).length,
        liked_by_user: user ? (listing.listing_likes || []).some((like: any) => like.user_id === user.id) : false,
        saved: savedListings.includes(listing.id),
        seller: listing.profiles
      }));

      if (!filters?.distance && filters?.latitude && filters?.longitude) {
        transformedData = transformedData
          .map(listing => {
            if (listing.latitude && listing.longitude) {
              const distance = calculateDistance(
                filters.latitude!,
                filters.longitude!,
                listing.latitude,
                listing.longitude
              );
              return { ...listing, distance_miles: Math.round(distance * 10) / 10 };
            }
            return listing;
          })
          .sort((a, b) => {
            if (a.distance_miles === undefined) return 1;
            if (b.distance_miles === undefined) return -1;
            return a.distance_miles - b.distance_miles;
          });
      }

      // Check if we have more results
      setHasMore(transformedData.length === limit);

      return transformedData;
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError('Failed to fetch listings');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (listingId: string) => {
    if (!user) {
      setError('You must be signed in to like listings');
      return false;
    }

    try {
      const { data: existingLike } = await supabase
        .from('listing_likes')
        .select()
        .eq('listing_id', listingId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Unlike
        const { error } = await supabase
          .from('listing_likes')
          .delete()
          .eq('listing_id', listingId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from('listing_likes')
          .insert([{
            listing_id: listingId,
            user_id: user.id
          }]);

        if (error) throw error;
      }

      return true;
    } catch (err) {
      console.error('Error toggling like:', err);
      setError('Failed to update like');
      return false;
    }
  };

  const toggleSave = async (listingId: string) => {
    if (!user) {
      setError('You must be signed in to save listings');
      return false;
    }

    try {
      let updatedSavedListings: string[];
      
      if (savedListings.includes(listingId)) {
        // Remove from saved
        updatedSavedListings = savedListings.filter(id => id !== listingId);
      } else {
        // Add to saved
        updatedSavedListings = [...savedListings, listingId];
      }
      
      // Update state
      setSavedListings(updatedSavedListings);
      
      // Save to storage
      const savedKey = `saved_listings_${user.id}`;
      await setStorageItem(savedKey, JSON.stringify(updatedSavedListings));
      
      return true;
    } catch (err) {
      console.error('Error toggling save:', err);
      setError('Failed to update saved listings');
      return false;
    }
  };

  const deleteListing = async (listingId: string) => {
    if (!user) {
      setError('You must be signed in to delete listings');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // First check if the listing has images to delete
      const { data: images } = await supabase
        .from('listing_images')
        .select('id, url')
        .eq('listing_id', listingId);

      // Delete the listing
      const { error: deleteError } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      return true;
    } catch (err) {
      console.error('Error deleting listing:', err);
      setError('Failed to delete listing');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createListing,
    getListings,
    toggleLike,
    toggleSave,
    deleteListing,
    savedListings,
    loading,
    error,
    hasMore,
    currentPage,
    setCurrentPage
  };
}