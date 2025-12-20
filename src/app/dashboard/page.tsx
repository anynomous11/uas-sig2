'use client';

import { useState, useEffect } from 'react';
import DashboardOverview from '@/components/layout/DashboardOverview';
import GISDashboard from '@/components/gis/GISDashboard';
import ReportsPage from '@/components/reports/ReportsPage';
import LocationsPage from '@/components/locations/LocationsPage';
import LocationForm from '@/components/forms/LocationForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MapPin,
  Settings,
  Plus,
  LayoutDashboard,
  Map as MapIcon,
  MessageSquare,
  Database
} from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<any>(undefined);

  // State for standalone LocationForm in 'data' tab
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch dashboard stats (still using API for overview stats)
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.data);
        }
      })
      .catch(error => {
        console.error('Error fetching dashboard stats:', error);
      });
  }, []);

  const handleAddLocation = () => {
    setEditingId(null);
    setShowAddForm(true);
  };

  const handleEditLocation = (id: string) => {
    setEditingId(id);
    setShowAddForm(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-[100] border-b border-blue-100 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 leading-tight">SIG Desa Banyuputih</h1>
                <p className="text-[10px] uppercase tracking-wider text-blue-600 font-semibold">Web GIS Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setActiveTab('gis')} className="border-blue-100 text-blue-700 hover:bg-blue-50">
                <MapIcon className="w-4 h-4 mr-2" />
                Peta Interaktif
              </Button>
              <Button size="sm" onClick={() => {
                // If we are in 'data' tab, open local form. Otherwise switch to GIS and open its form.
                if (activeTab === 'data') {
                  handleAddLocation();
                } else {
                  setActiveTab('gis');
                  setTimeout(() => {
                    const addBtn = document.querySelector('[data-add-location]') as HTMLButtonElement;
                    if (addBtn) addBtn.click();
                  }, 200);
                }
              }} className="bg-blue-600 hover:bg-blue-700 shadow-md">
                <Plus className="w-4 h-4 mr-2" />
                Lokasi Baru
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-1 sm:px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white border p-1 rounded-xl shadow-sm mb-6 flex overflow-x-auto">
            <TabsTrigger value="overview" className="flex-1 rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Ikhtisar</span>
            </TabsTrigger>
            <TabsTrigger value="gis" className="flex-1 rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <MapIcon className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">GIS Dashboard</span>
              <span className="sm:hidden">GIS</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex-1 rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <Database className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Kelola Data</span>
              <span className="sm:hidden">Data</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex-1 rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <MessageSquare className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Laporan</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="focus-visible:outline-none">
            <DashboardOverview stats={stats} onTabChange={setActiveTab} />
          </TabsContent>

          {/* GIS Tab (Combined Map + Locations) */}
          <TabsContent value="gis" className="focus-visible:outline-none">
            <GISDashboard />
          </TabsContent>

          {/* Data Management Tab */}
          <TabsContent value="data" className="focus-visible:outline-none">
            <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
              <LocationsPage
                onAddLocation={handleAddLocation}
                onEditLocation={handleEditLocation}
              />
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="focus-visible:outline-none">
            <ReportsPage />
          </TabsContent>
        </Tabs>
      </main>

      {/* Global Location Form for Data Tab */}
      <LocationForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        editingId={editingId}
      />
    </div>
  );
}