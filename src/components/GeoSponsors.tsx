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
    <div className="p-8 transform hover:scale-[1.02] transition-all duration-500 relative overflow-hidden rounded-2xl group">
      {/* Lighter Base Layer for Visible Carbon */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#1a1410] via-[#1c1612] to-[#181410]"></div>

      {/* Enhanced Visible Carbon Fiber Texture */}
      <div className="absolute inset-0 rounded-2xl" style={{
        background: `
          repeating-linear-gradient(0deg, #3a2d1a 0px, #261d10 1px, #3a2d1a 2px, #2e2414 3px),
          repeating-linear-gradient(90deg, #3a2d1a 0px, #2a1f12 1px, #3a2d1a 2px, #322618 3px)
        `,
        backgroundSize: '6px 6px',
        opacity: 0.95,
      }}></div>

      {/* Carbon Fiber Weave Highlights */}
      <div className="absolute inset-0 rounded-2xl" style={{
        background: `
          repeating-linear-gradient(45deg, transparent 0px, transparent 2px, rgba(251, 191, 36, 0.08) 2px, rgba(251, 191, 36, 0.08) 4px),
          repeating-linear-gradient(-45deg, transparent 0px, transparent 2px, rgba(217, 119, 6, 0.06) 2px, rgba(217, 119, 6, 0.06) 4px)
        `,
        backgroundSize: '8px 8px',
        opacity: 0.4,
      }}></div>

      {/* Glossy Carbon Shine Effect */}
      <div className="absolute inset-0 rounded-2xl opacity-20" style={{
        background: `linear-gradient(135deg,
          transparent 0%,
          rgba(251, 191, 36, 0.15) 30%,
          transparent 50%,
          rgba(245, 158, 11, 0.1) 70%,
          transparent 100%
        )`,
      }}></div>

      {/* Golden Racing Stripe - Top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"
        style={{
          boxShadow: '0 0 20px rgba(251, 191, 36, 0.8), 0 0 40px rgba(245, 158, 11, 0.5)',
        }}
      ></div>

      {/* Glowing Gold Border on Hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(145deg, #fbbf24, #f59e0b, #d97706, #fbbf24)',
          backgroundSize: '200% 200%',
          padding: '2px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          animation: 'shimmer 3s infinite linear',
        }}
      ></div>

      <div className="relative z-10">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Flag className="w-6 h-6 text-amber-400" style={{
              filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.7))'
            }} />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-300 bg-clip-text text-transparent" style={{
              textShadow: '0 0 30px rgba(251, 191, 36, 0.6), 0 0 60px rgba(245, 158, 11, 0.4)',
              filter: 'drop-shadow(0 0 12px rgba(251, 191, 36, 0.8))'
            }}>
              Racing Tracks Near You
            </h2>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-300 drop-shadow-lg">
            {locationLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Finding tracks near you...</span>
              </>
            ) : location?.latitude ? (
              <>
                <MapPin className="w-4 h-4 text-green-400" />
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
          <p className="text-center text-sm text-gray-300 mt-6 drop-shadow-lg">
            Enable location services to see tracks nearest to you
          </p>
        )}
      </div>
    </div>
  );
}
