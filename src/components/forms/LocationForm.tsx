'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, MapPin } from 'lucide-react';
import { useLocationStore } from '@/lib/stores/useLocationStore';
import { useToast } from "@/hooks/use-toast";

interface LocationFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingId?: string | null;
  initialCoordinates?: { lat: number; lng: number } | null;
}

export default function LocationForm({ isOpen, onClose, editingId, initialCoordinates }: LocationFormProps) {
  const { categories, addLocation, updateLocation, locations } = useLocationStore();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    latitude: '',
    longitude: '',
    description: ''
  });

  useEffect(() => {
    if (editingId) {
      const location = locations.find(loc => loc.id === editingId);
      if (location) {
        setFormData({
          name: location.name,
          category: location.category,
          latitude: location.latitude.toString(),
          longitude: location.longitude.toString(),
          description: location.description || ''
        });
      }
    } else if (initialCoordinates) {
      setFormData({
        name: '',
        category: '',
        latitude: initialCoordinates.lat.toFixed(6),
        longitude: initialCoordinates.lng.toFixed(6),
        description: ''
      });
    } else {
      setFormData({
        name: '',
        category: '',
        latitude: '',
        longitude: '',
        description: ''
      });
    }
  }, [editingId, locations, isOpen, initialCoordinates]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const lat = parseFloat(formData.latitude);
      const lng = parseFloat(formData.longitude);

      if (isNaN(lat) || isNaN(lng)) {
        toast({
          title: "Koordinat Invalid",
          description: "Latitude dan Longitude harus berupa angka.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        toast({
          title: "Koordinat Invalid",
          description: "Latitude harus antara -90 dan 90, Longitude harus antara -180 dan 180.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      const locationData = {
        name: formData.name,
        category: formData.category,
        latitude: lat,
        longitude: lng,
        description: formData.description
      };

      if (editingId) {
        updateLocation(editingId, locationData);
        toast({
          title: "Berhasil",
          description: "Data lokasi berhasil diperbarui.",
        });
      } else {
        addLocation(locationData);
        toast({
          title: "Berhasil",
          description: "Lokasi baru berhasil ditambahkan.",
        });
      }

      onClose();
    } catch (error) {
      console.error('Error saving location:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6)
          }));
          toast({
            title: "Lokasi Ditemukan",
            description: "Koordinat berhasil diambil dari perangkat.",
          });
        },
        () => {
          toast({
            title: "Gagal",
            description: "Tidak dapat mendapatkan lokasi saat ini.",
            variant: "destructive"
          });
        }
      );
    } else {
      toast({
        title: "Tidak Didukung",
        description: "Geolocation tidak didukung oleh browser ini.",
        variant: "destructive"
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[2000] p-4">
      <Card className="w-full max-w-lg shadow-2xl border-none">
        <CardHeader className="bg-blue-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">
              {editingId ? 'Edit Lokasi' : 'Tambah Lokasi Baru'}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-blue-700 p-0 h-8 w-8">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-bold">Nama Lokasi</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Contoh: Balai Desa Banyuputih"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-bold">Kategori</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori lokasi" />
                </SelectTrigger>
                <SelectContent className="z-[3000]">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude" className="text-sm font-bold">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                  placeholder="-6.715..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude" className="text-sm font-bold">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                  placeholder="110.73..."
                  required
                />
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={getCurrentLocation}
              className="w-full text-xs h-8 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              <MapPin className="w-3 h-3 mr-2" />
              Gunakan Lokasi Perangkat
            </Button>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-bold">Keterangan (Opsional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Tambahkan informasi tambahan jika ada..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
                Batal
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 min-w-[100px]" disabled={loading}>
                {loading ? 'Menyimpan...' : (editingId ? 'Update' : 'Simpan Lokasi')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}