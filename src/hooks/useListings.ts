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

  useEffect(() => {
    if (user) {
      loadSavedListings();
    }
  }, [user]);

  const loadSavedListings = async () => {
    if (!user) return;

    try {
      const savedKey = `saved_listings_${user.id}`;
      const saved = await getStorageItem(savedKey);
      if (saved) {
        setSavedListings(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Error loading saved listings:', err);
    }
  };

  const uploadImagesToStorage = async (images: string[], listingId: string): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (let i = 0; i < images.length; i++) {
      const imageData = images[i];

      try {
        const base64Data = imageData.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);

        for (let j = 0; j < byteCharacters.length; j++) {
          byteNumbers[j] = byteCharacters.charCodeAt(j);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });

        const fileName = `${listingId}_${i}_${Date.now()}.jpg`;
        const filePath = `listings/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('listing-images')
          .upload(filePath, blob, {
            contentType: 'image/jpeg',
            upsert: false
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('listing-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      } catch (err) {
        console.error(`Failed to upload image ${i}:`, err);
        throw new Error(`Failed to upload image ${i + 1}`);
      }
    }

    return uploadedUrls;
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
      condition?: 'new' | 'like-new' | 'good' | 'fair' | 'parts';
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
        const imagesToUpload = images.slice(0, 4);

        let uploadedUrls: string[];
        try {
          uploadedUrls = await uploadImagesToStorage(imagesToUpload, listing.id);
        } catch (uploadErr) {
          console.error('Image upload failed:', uploadErr);
          await supabase.from('listings').delete().eq('id', listing.id);
          throw new Error('Failed to upload images. Please try again.');
        }

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
          await supabase.from('listings').delete().eq('id', listing.id);
          throw new Error('Failed to save images. Please try again.');
        }
      }

      return listing;
    } catch (err: any) {
      console.error('Error creating listing:', err);
      setError(err?.message || 'Failed to create listing');
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

      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      if (filters?.vehicleType && filters.vehicleType !== 'all') {
        query = query.eq('vehicle_type', filters.vehicleType);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters?.tab && user) {
        if (filters.tab === 'mine') {
          query = query.eq('user_id', user.id);
        } else if (filters.tab === 'favorites') {
          const { data: likes } = await supabase
            .from('listing_likes')
            .select('listing_id')
            .eq('user_id', user.id);

          if (likes && likes.length > 0) {
            const likedIds = likes.map(like => like.listing_id);
            query = query.in('id', likedIds);
          } else {
            setLoading(false);
            return [];
          }
        } else if (filters.tab === 'saved') {
          if (savedListings.length > 0) {
            query = query.in('id', savedListings);
          } else {
            setLoading(false);
            return [];
          }
        }
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      let transformedData = (data || []).map(listing => ({
        ...listing,
        images: (listing.listing_images || []).sort((a: any, b: any) => a.order - b.order),
        likes: (listing.listing_likes || []).length,
        liked_by_user: user ? (listing.listing_likes || []).some((like: any) => like.user_id === user.id) : false,
        saved: savedListings.includes(listing.id),
        seller: listing.profiles
      }));

      if (filters?.latitude && filters?.longitude) {
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

      return transformedData;
    } catch (err: any) {
      console.error('Error fetching listings:', err);
      setError(err?.message || 'Failed to fetch listings');
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
        .maybeSingle();

      if (existingLike) {
        const { error } = await supabase
          .from('listing_likes')
          .delete()
          .eq('listing_id', listingId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
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
        updatedSavedListings = savedListings.filter(id => id !== listingId);
      } else {
        updatedSavedListings = [...savedListings, listingId];
      }

      setSavedListings(updatedSavedListings);

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
      const { data: images } = await supabase
        .from('listing_images')
        .select('id, url')
        .eq('listing_id', listingId);

      if (images && images.length > 0) {
        for (const image of images) {
          const path = image.url.split('/listing-images/')[1];
          if (path) {
            await supabase.storage.from('listing-images').remove([path]);
          }
        }
      }

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
    setError
  };
}
