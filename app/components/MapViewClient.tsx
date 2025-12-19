'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Next.js
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

// Component to center map on user location
function MapCenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [map, center]);
  return null;
}

// Restaurant locations (you can expand this with more locations)
const restaurantLocations = [
  {
    id: 1,
    name: 'Stonefire Pizza - Market Street',
    address: '1234 Market Street, San Francisco, CA 94103',
    position: [37.7749, -122.4194] as [number, number], // San Francisco coordinates
  },
  // Add more restaurant locations here
];

interface UserLocation {
  lat: number;
  lng: number;
}

export default function MapViewClient() {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError('Unable to get your location. Please enable location services.');
          // Default to San Francisco if location access is denied
          setUserLocation({
            lat: 37.7749,
            lng: -122.4194,
          });
          setIsLoading(false);
        }
      );
    } else {
      // Handle geolocation not supported asynchronously to avoid synchronous setState
      const handleUnsupported = () => {
        setLocationError('Geolocation is not supported by your browser.');
        // Default to San Francisco
        setUserLocation({
          lat: 37.7749,
          lng: -122.4194,
        });
        setIsLoading(false);
      };
      // Use setTimeout to make this asynchronous
      setTimeout(handleUnsupported, 0);
    }
  }, []);

  if (isLoading || !userLocation) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center rounded-lg">
        <div className="text-center text-gray-600">
          <p className="text-xl font-bold mb-2">📍</p>
          <p className="text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      {locationError && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 text-xs mb-2">
          {locationError}
        </div>
      )}
      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapCenter center={[userLocation.lat, userLocation.lng]} />
        
        {/* User location marker */}
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={L.divIcon({
            className: 'custom-user-marker',
            html: '<div style="background-color: #8B0000; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          })}
        >
          <Popup>Your Location</Popup>
        </Marker>

        {/* Restaurant location markers */}
        {restaurantLocations.map((restaurant) => (
          <Marker
            key={restaurant.id}
            position={restaurant.position}
            icon={L.icon({
              iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
              iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
            })}
          >
            <Popup>
              <div>
                <strong>{restaurant.name}</strong>
                <br />
                {restaurant.address}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

