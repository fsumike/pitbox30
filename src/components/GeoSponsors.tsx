import React, { useState, useEffect } from 'react';
import { MapPin, ExternalLink, Target, Flag, Loader2 } from 'lucide-react';
import { useLocation } from '../hooks/useLocation';

interface Sponsor {
  id: string;
  name: string;
  location: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  website: string;
  description: string;
  image?: string;
  featured?: boolean;
}

const allSponsors: Sponsor[] = [
  {
    id: 'marysville',
    name: 'Marysville Raceway',
    location: 'Marysville, California',
    city: 'Marysville',
    state: 'CA',
    lat: 39.1457,
    lng: -121.5908,
    website: 'https://www.marysvilleraceway.com',
    description: 'Historic 1/3 mile clay oval featuring exciting Sprint Car, Late Model, and Stock Car racing. A Northern California racing tradition since 1947.',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=200&fit=crop',
    featured: true,
  },
  {
    id: 'silver-dollar',
    name: 'Silver Dollar Speedway',
    location: 'Chico, California',
    city: 'Chico',
    state: 'CA',
    lat: 39.7285,
    lng: -121.8375,
    website: 'https://www.silverdollarspeedway.com',
    description: 'Home of the legendary Gold Cup Race of Champions. Premier sprint car racing facility in Northern California.',
    image: '/logo.png',
    featured: true,
  },
  {
    id: 'thunderbowl',
    name: 'Thunderbowl Raceway',
    location: 'Tulare, California',
    city: 'Tulare',
    state: 'CA',
    lat: 36.2077,
    lng: -119.3473,
    website: 'https://www.thunderbowlraceway.com',
    description: 'Home of the Trophy Cup. Exciting NARC 410 Sprint Car racing in Central California.',
    image: '/image (2).png',
    featured: true,
  },
  {
    id: 'placerville',
    name: 'Placerville Speedway',
    location: 'Placerville, California',
    city: 'Placerville',
    state: 'CA',
    lat: 38.7316,
    lng: -120.7985,
    website: 'https://www.placervillespeedway.com',
    description: 'Historic 1/4 mile red clay oval in the Sierra Nevada foothills. Sprint cars, Limited Late Models, and more.',
    image: 'https://images.unsplash.com/photo-1594345857882-1be16d54a4fb?w=400&h=200&fit=crop',
  },
  {
    id: 'ocean-speedway',
    name: 'Ocean Speedway',
    location: 'Watsonville, California',
    city: 'Watsonville',
    state: 'CA',
    lat: 36.9101,
    lng: -121.7530,
    website: 'https://www.oceanspeedway.com',
    description: 'Fast 1/4 mile dirt oval on the Central Coast featuring 360 Sprint Cars, IMCA Modifieds, and more.',
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=200&fit=crop',
  },
  {
    id: 'keller-auto',
    name: 'Keller Auto Speedway',
    location: 'Hanford, California',
    city: 'Hanford',
    state: 'CA',
    lat: 36.3274,
    lng: -119.6457,
    website: 'https://www.kellerautospeedway.com',
    description: 'Fast 1/3 mile clay oval in the heart of the San Joaquin Valley. Sprint cars, modifieds, and stock cars.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop',
  },
  {
    id: 'petaluma',
    name: 'Petaluma Speedway',
    location: 'Petaluma, California',
    city: 'Petaluma',
    state: 'CA',
    lat: 38.2341,
    lng: -122.6366,
    website: 'https://www.petaluma-speedway.com',
    description: 'The "FASTEST 3/8 Mile Dirt Oval" in Northern California. Sprint Cars, Late Models, and Modifieds.',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=200&fit=crop',
  },
  {
    id: 'delta-speedway',
    name: 'Delta Speedway',
    location: 'Stockton, California',
    city: 'Stockton',
    state: 'CA',
    lat: 37.9577,
    lng: -121.2908,
    website: 'https://www.deltaspeedwaystockton.com',
    description: 'High-banked 1/7 mile oval. Home of exciting micro sprint and go-kart racing action.',
    image: 'https://images.unsplash.com/photo-1535750019702-86f32b4f9a7e?w=400&h=200&fit=crop',
  },
];

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

interface GeoSponsorsProps {
  maxSponsors?: number;
  showDistance?: boolean;
}

export default function GeoSponsors({ maxSponsors = 4, showDistance = true }: GeoSponsorsProps) {
  const { location, loading: locationLoading, error: locationError } = useLocation();
  const [sponsors, setSponsors] = useState<(Sponsor & { distance?: number })[]>([]);

  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      const sponsorsWithDistance = allSponsors.map(sponsor => ({
        ...sponsor,
        distance: calculateDistance(
          location.latitude!,
          location.longitude!,
          sponsor.lat,
          sponsor.lng
        )
      }));

      sponsorsWithDistance.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (a.distance || 0) - (b.distance || 0);
      });

      setSponsors(sponsorsWithDistance.slice(0, maxSponsors));
    } else {
      const featuredFirst = [...allSponsors].sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
      setSponsors(featuredFirst.slice(0, maxSponsors));
    }
  }, [location, maxSponsors]);

  return (
    <div className="glass-panel p-8 bg-gradient-to-br from-brand-gold/5 to-brand-gold-light/5">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Flag className="w-6 h-6 text-brand-gold" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-brand-gold to-brand-gold-light bg-clip-text text-transparent">
            Racing Tracks Near You
          </h2>
        </div>
        <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
          {locationLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Finding tracks near you...</span>
            </>
          ) : location?.latitude ? (
            <>
              <MapPin className="w-4 h-4 text-green-500" />
              <span>Showing tracks based on your location</span>
            </>
          ) : (
            <>
              <Target className="w-4 h-4" />
              <span>Proud partners in California racing</span>
            </>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {sponsors.map((sponsor) => (
          <a
            key={sponsor.id}
            href={sponsor.website}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-panel p-6 hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/10 to-brand-gold-light/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                {sponsor.distance && showDistance && (
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{Math.round(sponsor.distance)} mi away</span>
                  </div>
                )}
                <div className="px-2 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-xs font-semibold ml-auto">
                  {sponsor.featured ? 'FEATURED SPONSOR' : 'SPONSORED'}
                </div>
              </div>

              <div className="mb-4 h-24 md:h-32 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                {sponsor.image?.startsWith('/') ? (
                  <img
                    src={sponsor.image}
                    alt={sponsor.name}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <img
                    src={sponsor.image}
                    alt={sponsor.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <h3 className="text-xl font-bold mb-2">{sponsor.name}</h3>

              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <Target className="w-4 h-4" />
                <span>{sponsor.location}</span>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm line-clamp-2">
                {sponsor.description}
              </p>

              <div className="flex items-center gap-2 text-brand-gold font-semibold group-hover:gap-3 transition-all">
                <span>Visit {sponsor.name}</span>
                <ExternalLink className="w-5 h-5" />
              </div>
            </div>
          </a>
        ))}
      </div>

      {location?.latitude && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Enable location services to see tracks nearest to you
        </p>
      )}
    </div>
  );
}
