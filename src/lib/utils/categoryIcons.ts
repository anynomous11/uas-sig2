// Category color mapping - each category gets a unique color
// This file should NOT import Leaflet to avoid SSR issues

export const categoryColors: Record<string, { color: string; icon: string }> = {
    'Kantor Pemerintahan': { color: '#dc2626', icon: '🏛️' }, // Red
    'Pendidikan': { color: '#2563eb', icon: '🎓' }, // Blue
    'Kesehatan': { color: '#16a34a', icon: '🏥' }, // Green
    'Tempat Ibadah': { color: '#7c3aed', icon: '🕌' }, // Purple
    'Fasilitas Umum': { color: '#0891b2', icon: '🏢' }, // Cyan
    'UMKM': { color: '#ea580c', icon: '🏪' }, // Orange
    'Pertanian': { color: '#65a30d', icon: '🌾' }, // Lime
    'Infrastruktur': { color: '#64748b', icon: '🌉' }, // Slate
    'Wisata': { color: '#db2777', icon: '🏖️' }, // Pink
    'Pemakaman': { color: '#525252', icon: '🪦' }, // Gray
};

// Get color for a category (with fallback)
export function getCategoryColor(category: string): string {
    return categoryColors[category]?.color || '#6b7280';
}

// Get icon emoji for a category (with fallback)
export function getCategoryIcon(category: string): string {
    return categoryColors[category]?.icon || '📍';
}
