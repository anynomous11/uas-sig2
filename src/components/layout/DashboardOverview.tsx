'use client';

import { useLocationStore } from '@/lib/stores/useLocationStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  MapPin,
  FileText,
  TrendingUp,
  BarChart3,
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface DashboardStats {
  totalLocations: number;
  totalCategories: number;
  totalReports: number;
  totalInfrastructure: number;
  recentActivities: any[];
  locationByCategory: Array<{
    categoryName: string;
    count: number;
    color?: string;
  }>;
  reportsByStatus: Array<{
    status: string;
    count: number;
  }>;
}

interface DashboardOverviewProps {
  stats?: DashboardStats;
  onTabChange?: (tab: string) => void;
}

export default function DashboardOverview({ stats, onTabChange }: DashboardOverviewProps) {
  const { locations, categories } = useLocationStore();

  // Calculate stats from store
  const totalLocations = locations.length;
  const totalCategories = categories.length;

  // Calculate location counts by category
  const locationByCategory = categories.map(category => {
    const count = locations.filter(l => l.category === category).length;
    // Assign colors based on category (simplified mapping)
    const colors: Record<string, string> = {
      'Kantor Pemerintahan': '#3b82f6',
      'Pendidikan': '#10b981',
      'Kesehatan': '#ef4444',
      'Tempat Ibadah': '#8b5cf6',
      'Fasilitas Umum': '#f59e0b',
      'UMKM': '#ec4899',
      'Pertanian': '#22c55e',
      'Infrastruktur': '#0ea5e9',
      'Wisata': '#14b8a6',
      'Pemakaman': '#6b7280'
    };
    return {
      categoryName: category,
      count,
      color: colors[category] || '#94a3b8'
    };
  }).sort((a, b) => b.count - a.count); // Sort by count descending

  // For reports and activities, we'll use the passed stats or empty values for now
  // to avoid showing fake data.
  const totalReports = stats?.totalReports || 0;
  const totalInfrastructure = locations.filter(l => l.category === 'Infrastruktur' || l.category === 'Fasilitas Umum').length;

  const recentActivities = stats?.recentActivities || [];
  const reportsByStatus = stats?.reportsByStatus || [
    { status: 'OPEN', count: 0 },
    { status: 'IN_PROGRESS', count: 0 },
    { status: 'RESOLVED', count: 0 }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'IN_PROGRESS': return <Activity className="w-4 h-4 text-yellow-500" />;
      case 'RESOLVED': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-red-100 text-red-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'UPDATE': return <Activity className="w-4 h-4 text-blue-500" />;
      case 'DELETE': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lokasi</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLocations}</div>
            <p className="text-xs text-muted-foreground">
              Terdaftar dalam sistem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kategori</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
            <p className="text-xs text-muted-foreground">
              Jenis kategori tersedia
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Laporan</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReports}</div>
            <p className="text-xs text-muted-foreground">
              Laporan masyarakat
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Infrastruktur</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInfrastructure}</div>
            <p className="text-xs text-muted-foreground">
              Fasilitas & Infrastruktur
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Locations by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Lokasi per Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {locationByCategory.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">Belum ada data lokasi</p>
              ) : (
                locationByCategory.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm">{category.categoryName}</span>
                    </div>
                    <Badge variant="secondary">{category.count}</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Reports by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Laporan per Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reportsByStatus.every(r => r.count === 0) ? (
                <p className="text-sm text-gray-500 text-center py-4">Belum ada data laporan</p>
              ) : (
                reportsByStatus.map((report, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(report.status)}
                      <span className="text-sm">{report.status}</span>
                    </div>
                    <Badge className={getStatusBadgeClass(report.status)}>
                      {report.count}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terkini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">Belum ada aktivitas</p>
              ) : (
                recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-2 rounded-lg bg-gray-50">
                    {getActionIcon(activity.action)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {activity.user?.fullName || 'Unknown User'}
                      </p>
                      <p className="text-xs text-gray-600">
                        {activity.action} {activity.tableName}
                      </p>
                      {activity.location && (
                        <p className="text-xs text-gray-500 truncate">
                          {activity.location.name}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        {new Date(activity.createdAt).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              className="h-20 flex-col gap-2"
              onClick={() => {
                onTabChange?.('gis');
                setTimeout(() => {
                  const addBtn = document.querySelector('[data-add-location]') as HTMLButtonElement;
                  if (addBtn) addBtn.click();
                }, 100);
              }}
            >
              <MapPin className="w-6 h-6" />
              <span className="text-sm">Tambah Lokasi</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => {
                onTabChange?.('reports');
                setTimeout(() => {
                  const addBtn = document.querySelector('[data-add-report]') as HTMLButtonElement;
                  if (addBtn) addBtn.click();
                }, 100);
              }}
            >
              <FileText className="w-6 h-6" />
              <span className="text-sm">Buat Laporan</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => onTabChange?.('gis')}
            >
              <BarChart3 className="w-6 h-6" />
              <span className="text-sm">Lihat Peta</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => onTabChange?.('data')}
            >
              <Users className="w-6 h-6" />
              <span className="text-sm">Kelola Data</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}