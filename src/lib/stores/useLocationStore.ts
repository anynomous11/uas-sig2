import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface Location {
    id: string;
    name: string;
    category: string;
    latitude: number;
    longitude: number;
    description?: string;
    createdAt: string;
}

interface LocationState {
    locations: Location[];
    categories: string[];
    addLocation: (location: Omit<Location, 'id' | 'createdAt'>) => void;
    updateLocation: (id: string, updatedLocation: Partial<Omit<Location, 'id' | 'createdAt'>>) => void;
    deleteLocation: (id: string) => void;
}

export const useLocationStore = create<LocationState>()(
    persist(
        (set) => ({
            locations: [],
            categories: [
                'Kantor Pemerintahan',
                'Pendidikan',
                'Kesehatan',
                'Tempat Ibadah',
                'Fasilitas Umum',
                'UMKM',
                'Pertanian',
                'Infrastruktur',
                'Wisata',
                'Pemakaman'
            ],
            addLocation: (locationData) => set((state) => ({
                locations: [
                    ...state.locations,
                    {
                        ...locationData,
                        id: uuidv4(),
                        createdAt: new Date().toISOString(),
                    }
                ]
            })),
            updateLocation: (id, updatedData) => set((state) => ({
                locations: state.locations.map((loc) =>
                    loc.id === id ? { ...loc, ...updatedData } : loc
                )
            })),
            deleteLocation: (id) => set((state) => ({
                locations: state.locations.filter((loc) => loc.id !== id)
            })),
        }),
        {
            name: 'banyuputih-gis-storage',
            storage: createJSONStorage(() => localStorage),
            version: 2, // Increment version to force migration
            migrate: (persistedState: unknown, version: number) => {
                const state = persistedState as LocationState;
                // Force update categories on version change
                if (version < 2) {
                    return {
                        ...state,
                        categories: [
                            'Kantor Pemerintahan',
                            'Pendidikan',
                            'Kesehatan',
                            'Tempat Ibadah',
                            'Fasilitas Umum',
                            'UMKM',
                            'Pertanian',
                            'Infrastruktur',
                            'Wisata',
                            'Pemakaman'
                        ]
                    };
                }
                return state;
            },
        }
    )
);
