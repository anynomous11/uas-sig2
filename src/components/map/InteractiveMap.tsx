'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useLocationStore } from '@/lib/stores/useLocationStore';
import { categoryColors } from '@/lib/utils/categoryIcons';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  EyeOff
} from 'lucide-react';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const GeoJSON = dynamic(
  () => import('react-leaflet').then((mod) => mod.GeoJSON),
  { ssr: false }
);

const MapClickHandler = dynamic(
  () => import('./MapClickHandler'),
  { ssr: false }
);

const CategoryMarker = dynamic(
  () => import('./CategoryMarker'),
  { ssr: false }
);

interface InteractiveMapProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
  onMapClick?: (lat: number, lng: number) => void;
}

export default function InteractiveMap({
  center = [-6.715, 110.732], // Centered on Desa Banyuputih
  zoom = 15,
  className = "",
  onMapClick
}: InteractiveMapProps) {
  const [map, setMap] = useState<any>(null);
  const { locations } = useLocationStore();
  const [boundaryData, setBoundaryData] = useState<any>(null);
  const [showBoundary, setShowBoundary] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);
  const [showLayerPanel, setShowLayerPanel] = useState(true);

  useEffect(() => {
    // Load village boundary GeoJSON
    fetch('/geojson/banyuputih-boundary.json')
      .then(res => res.json())
      .then(data => setBoundaryData(data))
      .catch(err => console.error('Error loading boundary:', err));
  }, []);

  const zoomIn = () => map?.zoomIn();
  const zoomOut = () => map?.zoomOut();
  const resetView = () => map?.setView(center, zoom);

  return (
    <div className={`relative h-full ${className} border rounded-lg overflow-hidden shadow-md`}>
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <div className="bg-white rounded-lg shadow-lg p-1 flex flex-col gap-1 border">
          <Button size="sm" variant="ghost" onClick={zoomIn} className="h-8 w-8 p-0">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={zoomOut} className="h-8 w-8 p-0">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={resetView} className="h-8 w-8 p-0 border-t rounded-none">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Layer Panel */}
      <div className={`absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-3 transition-all duration-300 border ${showLayerPanel ? 'w-64 max-h-[70vh] overflow-y-auto custom-scrollbar' : 'w-10 overflow-hidden'
        }`}>
        <div className="flex items-center justify-between mb-3">
          {showLayerPanel && <h3 className="font-bold text-sm flex items-center gap-2"><Layers className="w-4 h-4" /> Layers & Legenda</h3>}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowLayerPanel(!showLayerPanel)}
            className="h-6 w-6 p-0 ml-auto"
          >
            {showLayerPanel ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          </Button>
        </div>

        {showLayerPanel && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-xs font-medium">Batas Desa</span>
              <Switch
                checked={showBoundary}
                onCheckedChange={setShowBoundary}
                className="scale-75"
              />
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-xs font-medium">Titik Lokasi</span>
              <Switch
                checked={showMarkers}
                onCheckedChange={setShowMarkers}
                className="scale-75"
              />
            </div>

            {/* Category Legend */}
            <div className="pt-1">
              <h4 className="text-xs font-semibold text-gray-600 mb-2">Legenda Kategori</h4>
              <div className="space-y-1.5">
                {Object.entries(categoryColors).map(([category, { color, icon }]) => (
                  <div key={category} className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-sm border-2 border-white"
                      style={{ backgroundColor: color }}
                    >
                      {icon}
                    </div>
                    <span className="text-[11px] text-gray-700">{category}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className="h-full w-full">
        {typeof window !== 'undefined' && (
          <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: '100%', width: '100%' }}
            ref={setMap}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapClickHandler onMapClick={onMapClick} />

            {/* Village Boundary Layer */}
            {showBoundary && boundaryData && (
              <GeoJSON
                data={boundaryData}
                style={{
                  color: '#2563eb', // Blue border
                  weight: 2,
                  opacity: 1,
                  fillColor: '#3b82f6', // Lighter blue fill
                  fillOpacity: 0.1 // Transparent fill
                }}
              />
            )}

            {/* Dynamic Location Markers */}
            {showMarkers && locations.map((location) => (
              <CategoryMarker key={location.id} location={location} />
            ))}
          </MapContainer>
        )}
      </div>

      {/* Map Info Overlay */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/80 backdrop-blur-sm rounded px-2 py-1 border text-[10px] text-gray-500 shadow-sm">
        SIG Desa Banyuputih | Total: {locations.length} Lokasi
      </div>
    </div>
  );
}