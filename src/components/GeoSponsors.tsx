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
    description: 'Partnered with Silver Dollar Speedway, featuring modified, dwarf, winged and wingless sprints. Home of the Paul Hawes Memorial Sprint Spooktacular.',
    image: 'https://cdn.myracepass.com/v1/siteresources/58778/v1/img/logo.png',
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
    description: 'Home of the legendary Gold Cup Race of Champions. Premier sprint car racing facility featuring winged 360 sprint cars and hobby stocks.',
    image: 'https://cdn.myracepass.com/v1/siteresources/35514/v1/img/logo.png',
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
    description: 'Home of the Trophy Cup. Exciting NARC 410 Sprint Car racing and one of California\'s premier dirt racing venues.',
    image: 'https://www.thunderbowlraceway.com/wp-content/uploads/2020/01/Logo.png',
    featured: true,
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

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
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

              <div className="mb-4 h-24 md:h-32 flex items-center justify-center bg-gray-900 rounded-lg overflow-hidden p-4">
                <img
                  src={sponsor.image}
                  alt={sponsor.name}
                  className="w-full h-full object-contain"
                />
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
