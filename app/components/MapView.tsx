'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues
const DynamicMap = dynamic(() => import('./MapViewClient'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center rounded-lg">
      <div className="text-center text-gray-600">
        <p className="text-xl font-bold mb-2">📍</p>
        <p className="text-sm">Loading map...</p>
      </div>
    </div>
  ),
});

export default function MapView() {
  return <DynamicMap />;
}
