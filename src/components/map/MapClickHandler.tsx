'use client';

import { useMapEvents } from 'react-leaflet';

interface MapClickHandlerProps {
    onMapClick?: (lat: number, lng: number) => void;
}

const MapClickHandler = ({ onMapClick }: MapClickHandlerProps) => {
    useMapEvents({
        click: (e) => {
            if (onMapClick) {
                onMapClick(e.latlng.lat, e.latlng.lng);
            }
        },
    });
    return null;
};

export default MapClickHandler;
