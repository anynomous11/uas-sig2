'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, MapPin, Upload, Camera, AlertTriangle } from 'lucide-react';

interface ReportFormData {
  title: string;
  description: string;
  reportType: string;
  reporterName: string;
  reporterContact: string;
  latitude: string;
  longitude: string;
  photos: string[];
}

interface ReportFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReportFormData) => void;
  initialData?: ReportFormData;
}

const reportTypes = [
  'Infrastruktur',
  'Kebersihan',
  'Air Bersih',
  'Listrik',
  'Keamanan',
  'Kesehatan',
  'Pendidikan',
  'Sosial',
  'Darurat',
  'Lainnya'
];

export default function ReportForm({ isOpen, onClose, onSubmit, initialData }: ReportFormProps) {
  const [formData, setFormData] = useState<ReportFormData>({
    title: '',
    description: '',
    reportType: '',
    reporterName: '',
    reporterContact: '',
    latitude: '',
    longitude: '',
    photos: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.reportType) {
        alert('Judul dan tipe laporan harus diisi');
        return;
      }

      // Validate coordinates if provided
      if (formData.latitude && formData.longitude) {
        const lat = parseFloat(formData.latitude);
        const lng = parseFloat(formData.longitude);

        if (isNaN(lat) || isNaN(lng)) {
          alert('Koordinat tidak valid');
          return;
        }

        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
          alert('Koordinat di luar rentang yang valid');
          return;
        }
      }

      await onSubmit(formData);
      onClose();

      // Reset form
      setFormData({
        title: '',
        description: '',
        reportType: '',
        reporterName: '',
        reporterContact: '',
        latitude: '',
        longitude: '',
        photos: []
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Terjadi kesalahan saat mengirim laporan');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ReportFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Tidak dapat mendapatkan lokasi saat ini');
        }
      );
    } else {
      alert('Geolocation tidak didukung browser ini');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In a real implementation, you would upload these files to a server
      // For now, we'll just store the file names
      const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos]
      }));
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {initialData ? 'Edit Laporan' : 'Buat Laporan Baru'}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Report Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informasi Laporan</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Judul Laporan *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Masukkan judul laporan"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="reportType">Tipe Laporan *</Label>
                  <Select
                    value={formData.reportType}
                    onValueChange={(value) => handleInputChange('reportType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe laporan" />
                    </SelectTrigger>
                    <SelectContent className="z-[3000]">
                      {reportTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Deskripsi Laporan</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Jelaskan masalah yang dilaporkan secara detail"
                  rows={4}
                />
              </div>
            </div>

            {/* Reporter Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informasi Pelapor</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reporterName">Nama Lengkap</Label>
                  <Input
                    id="reporterName"
                    value={formData.reporterName}
                    onChange={(e) => handleInputChange('reporterName', e.target.value)}
                    placeholder="Masukkan nama lengkap (opsional)"
                  />
                </div>

                <div>
                  <Label htmlFor="reporterContact">Kontak</Label>
                  <Input
                    id="reporterContact"
                    value={formData.reporterContact}
                    onChange={(e) => handleInputChange('reporterContact', e.target.value)}
                    placeholder="No. HP atau email (opsional)"
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Lokasi Kejadian</h3>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      Lokasi sangat penting
                    </p>
                    <p className="text-sm text-yellow-700">
                      Koordinat lokasi akan membantu tim kami menemukan dan menangani masalah lebih cepat.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => handleInputChange('latitude', e.target.value)}
                    placeholder="Contoh: -6.7089"
                  />
                </div>

                <div>
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => handleInputChange('longitude', e.target.value)}
                    placeholder="Contoh: 110.7428"
                  />
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={getCurrentLocation}
                className="w-full"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Gunakan Lokasi Saat Ini
              </Button>
            </div>

            {/* Photos */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Foto Bukti</h3>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload foto bukti untuk memperkuat laporan
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('photo-upload')?.click()}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Pilih Foto
                  </Button>
                </div>
              </div>

              {formData.photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removePhoto(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Mengirim...' : (initialData ? 'Update' : 'Kirim Laporan')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}