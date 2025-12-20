'use client';

import { useState } from 'react';
import InteractiveMap from '@/components/map/InteractiveMap';
import LocationsPage from '@/components/locations/LocationsPage';
import LocationForm from '@/components/forms/LocationForm';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2, Map as MapIcon, Table as TableIcon } from 'lucide-react';

export default function GISDashboard() {
    const [isMapMaximized, setIsMapMaximized] = useState(false);
    const [showTable, setShowTable] = useState(true);

    // Location Form State
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [initialCoordinates, setInitialCoordinates] = useState<{ lat: number; lng: number } | null>(null);

    const handleMapClick = (lat: number, lng: number) => {
        setInitialCoordinates({ lat, lng });
        setEditingId(null);
        setShowAddForm(true);
    };

    const handleAddLocation = () => {
        setInitialCoordinates(null);
        setEditingId(null);
        setShowAddForm(true);
    };

    const handleEditLocation = (id: string) => {
        setInitialCoordinates(null);
        setEditingId(id);
        setShowAddForm(true);
    };

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-180px)] min-h-[700px]">
            {/* Map Section */}
            <div
                className={`transition-all duration-500 ease-in-out relative ${isMapMaximized ? 'h-full' : showTable ? 'h-3/5' : 'h-full'
                    }`}
            >
                <div className="absolute top-4 right-16 z-[1000]">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setIsMapMaximized(!isMapMaximized)}
                        className="bg-white/90 backdrop-blur shadow-md hover:bg-white border"
                    >
                        {isMapMaximized ? (
                            <><Minimize2 className="w-4 h-4 mr-2" /> Restore View</>
                        ) : (
                            <><Maximize2 className="w-4 h-4 mr-2" /> Full Map</>
                        )}
                    </Button>
                </div>

                <InteractiveMap onMapClick={handleMapClick} />
            </div>

            {/* Table Section */}
            {!isMapMaximized && (
                <div
                    className={`transition-all duration-500 ease-in-out ${showTable ? 'h-2/5 overflow-hidden' : 'h-0 opacity-0 pointer-events-none'
                        }`}
                >
                    <div className="h-full overflow-y-auto custom-scrollbar pr-1">
                        <LocationsPage
                            onAddLocation={handleAddLocation}
                            onEditLocation={handleEditLocation}
                        />
                    </div>
                </div>
            )}

            {/* View Toggle (Floating) */}
            <div className="fixed bottom-6 right-6 z-[2000] flex flex-col gap-2">
                {!isMapMaximized && (
                    <Button
                        size="icon"
                        className={`rounded-full shadow-xl ${showTable ? 'bg-blue-600' : 'bg-gray-600'}`}
                        onClick={() => setShowTable(!showTable)}
                        title={showTable ? "Sembunyikan Tabel" : "Tampilkan Tabel"}
                    >
                        {showTable ? <TableIcon className="w-5 h-5" /> : <MapIcon className="w-5 h-5" />}
                    </Button>
                )}
            </div>

            {/* Location Form Modal */}
            <LocationForm
                isOpen={showAddForm}
                onClose={() => setShowAddForm(false)}
                editingId={editingId}
                initialCoordinates={initialCoordinates}
            />
        </div>
    );
}
