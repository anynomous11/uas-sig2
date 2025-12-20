'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  MapPin,
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  Map as MapIcon
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useLocationStore } from '@/lib/stores/useLocationStore';

interface LocationsPageProps {
  onAddLocation?: () => void;
  onEditLocation?: (id: string) => void;
}

export default function LocationsPage({ onAddLocation, onEditLocation }: LocationsPageProps) {
  const { locations, deleteLocation, categories } = useLocationStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredLocations = locations.filter(loc => {
    const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (loc.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesCategory = selectedCategory === 'all' || loc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus lokasi ini?')) {
      deleteLocation(id);
    }
  };

  const handleEdit = (id: string) => {
    if (onEditLocation) {
      onEditLocation(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <Card className="border-none shadow-sm bg-white/50 backdrop-blur-md">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-blue-900">Manajemen Fasilitas Desa</CardTitle>
              <p className="text-sm text-blue-600/70">Kelola data lokasi dan fasilitas Desa Banyuputih</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  if (onAddLocation) onAddLocation();
                }}
                className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
                data-add-location
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Lokasi
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari nama lokasi atau keterangan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-blue-100 focus:border-blue-300 bg-white"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-56 border-blue-100 bg-white">
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Locations Table */}
          <div className="rounded-xl border border-blue-50 overflow-hidden bg-white shadow-sm">
            <Table>
              <TableHeader className="bg-blue-50/50">
                <TableRow className="hover:bg-transparent border-blue-50">
                  <TableHead className="font-bold text-blue-900">Nama Lokasi</TableHead>
                  <TableHead className="font-bold text-blue-900">Kategori</TableHead>
                  <TableHead className="font-bold text-blue-900">Koordinat (Lat, Lng)</TableHead>
                  <TableHead className="font-bold text-blue-900">Keterangan</TableHead>
                  <TableHead className="text-right font-bold text-blue-900">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLocations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-20">
                      <div className="flex flex-col items-center justify-center opacity-40">
                        <MapPin className="w-16 h-16 text-blue-200 mb-4" />
                        <h3 className="text-lg font-semibold text-blue-900">Belum ada lokasi</h3>
                        <p className="text-sm">Mulai dengan menambahkan fasilitas baru</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLocations.map((location) => (
                    <TableRow key={location.id} className="hover:bg-blue-50/30 transition-colors border-blue-50">
                      <TableCell className="font-medium text-blue-900">
                        {location.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none px-3 py-0.5">
                          {location.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-mono text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapIcon className="w-3 h-3 text-blue-400" />
                          {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <p className="text-sm text-gray-500 truncate" title={location.description}>
                          {location.description || '-'}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-blue-100 text-blue-600">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuLabel>Opsi Data</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEdit(location.id)} className="cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Data
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                              onClick={() => handleDelete(location.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 text-[10px] text-blue-400/60 text-center">
            Data tersimpan secara lokal di browser Anda
          </div>
        </CardContent>
      </Card>
    </div>
  );
}