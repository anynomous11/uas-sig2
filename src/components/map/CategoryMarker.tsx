'use client';

import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import { getCategoryColor, getCategoryIcon } from '@/lib/utils/categoryIcons';
import { Badge } from '@/components/ui/badge';
import type { Location } from '@/lib/stores/useLocationStore';

// Create a custom div icon for Leaflet based on category
// This function is defined here (not in categoryIcons.ts) because it uses Leaflet
// and this component is dynamically imported with ssr: false
function createCategoryIcon(category: string): L.DivIcon {
    const color = getCategoryColor(category);
    const emoji = getCategoryIcon(category);

    return L.divIcon({
        className: 'custom-category-marker',
        html: `
            <div style="
                display: flex;
                align-items: center;
                justify-content: center;
                width: 36px;
                height: 36px;
                background: ${color};
                border: 3px solid white;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                box-shadow: 0 3px 10px rgba(0,0,0,0.3);
            ">
                <span style="
                    transform: rotate(45deg);
                    font-size: 16px;
                    line-height: 1;
                ">${emoji}</span>
            </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36]
    });
}

interface CategoryMarkerProps {
    location: Location;
}

export default function CategoryMarker({ location }: CategoryMarkerProps) {
    const icon = createCategoryIcon(location.category);
    const categoryColor = getCategoryColor(location.category);

    return (
        <Marker
            position={[location.latitude, location.longitude]}
            icon={icon}
        >
            <Popup>
                <div className="p-1 min-w-[150px]">
                    <div className="flex items-center gap-2 mb-1">
                        <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: categoryColor }}
                        />
                        <h4 className="font-bold text-sm leading-none">{location.name}</h4>
                    </div>
                    <Badge
                        variant="secondary"
                        className="text-[10px] py-0 px-1.5 mb-2"
                        style={{
                            backgroundColor: `${categoryColor}20`,
                            color: categoryColor,
                            borderColor: categoryColor
                        }}
                    >
                        {location.category}
                    </Badge>
                    {location.description && (
                        <p className="text-xs text-gray-600 line-clamp-3 bg-gray-50 p-2 rounded">
                            {location.description}
                        </p>
                    )}
                    <div className="mt-2 text-[10px] text-gray-400 border-t pt-1">
                        {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                    </div>
                </div>
            </Popup>
        </Marker>
    );
}
