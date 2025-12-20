'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MapPin,
  Users,
  BarChart3,
  Settings,
  Search,
  Filter,
  Download,
  Smartphone,
  Database,
  Shield,
  TrendingUp,
  Building,
  TreePine,
  Route,
  AlertTriangle,
  MessageSquare,
  FileText,
  Lock,
  Globe,
  Layers,
  Navigation
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Desa Digital Map</h1>
                <p className="text-sm text-gray-600">SIG Desa Banyuputih, Kalinyamatan, Jepara</p>
              </div>
            </div>
            <Link href="/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Masuk ke Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">
            Sistem Informasi Geografis
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Desa Digital Map – SIG Desa Banyuputih
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Platform digital komprehensif untuk pengelolaan data spasial dan informasi geografis
            Desa Banyuputih. Meningkatkan efisiensi tata kelola pemerintahan desa melalui
            teknologi GIS modern.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Globe className="w-5 h-5 mr-2" />
                Masuk ke Dashboard
              </Button>
            </Link>
            <Link href="/dashboard?tab=map">
              <Button size="lg" variant="outline">
                <MapPin className="w-5 h-5 mr-2" />
                Jelajahi Peta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Fitur</TabsTrigger>
            <TabsTrigger value="mapping">Pemetaan</TabsTrigger>
            <TabsTrigger value="benefits">Manfaat</TabsTrigger>
            <TabsTrigger value="users">Pengguna</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    Tujuan Aplikasi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Digitalisasi data geografis dan administratif desa</li>
                    <li>• Meningkatkan efisiensi tata kelola pemerintahan desa</li>
                    <li>• Memfasilitasi perencanaan pembangunan berbasis data spasial</li>
                    <li>• Meningkatkan partisipasi masyarakat dalam pengawasan pembangunan</li>
                    <li>• Menyediakan akses informasi desa yang transparan dan akurat</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    Masalah yang Diselesaikan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Data desa yang tersebar dan tidak terintegrasi</li>
                    <li>• Sulitnya tracking lokasi infrastruktur dan fasilitas</li>
                    <li>• Kurangnya transparansi informasi pembangunan</li>
                    <li>• Proses perencanaan yang manual dan tidak berbasis data</li>
                    <li>• Minimnya partisipasi masyarakat dalam pengawasan</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Manfaat untuk Desa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Database className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold">Data Terintegrasi</h4>
                    <p className="text-sm text-gray-600">Semua data desa dalam satu platform terpadu</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold">Transparansi</h4>
                    <p className="text-sm text-gray-600">Informasi pembangunan yang terbuka untuk masyarakat</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Smartphone className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-semibold">Akses Mudah</h4>
                    <p className="text-sm text-gray-600">Informasi desa dapat diakses kapan saja dan dimana saja</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <Layers className="w-8 h-8 text-blue-600 mb-2" />
                  <h4 className="font-semibold">Peta Interaktif Multilayer</h4>
                  <p className="text-sm text-gray-600">Peta digital dengan berbagai layer informasi</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <Search className="w-8 h-8 text-green-600 mb-2" />
                  <h4 className="font-semibold">Filter & Pencarian</h4>
                  <p className="text-sm text-gray-600">Pencarian lokasi dan filter data yang canggih</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <Settings className="w-8 h-8 text-purple-600 mb-2" />
                  <h4 className="font-semibold">CRUD Data Lokasi</h4>
                  <p className="text-sm text-gray-600">Kelola data lokasi dengan mudah</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <BarChart3 className="w-8 h-8 text-orange-600 mb-2" />
                  <h4 className="font-semibold">Dashboard Statistik</h4>
                  <p className="text-sm text-gray-600">Visualisasi data desa yang informatif</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <Download className="w-8 h-8 text-red-600 mb-2" />
                  <h4 className="font-semibold">Export Laporan</h4>
                  <p className="text-sm text-gray-600">Generate laporan dalam berbagai format</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <Navigation className="w-8 h-8 text-teal-600 mb-2" />
                  <h4 className="font-semibold">GPS Survey Lapangan</h4>
                  <p className="text-sm text-gray-600">Survey lokasi langsung dari lapangan</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Fitur Tambahan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-gray-600" />
                    <div>
                      <h5 className="font-semibold">Mode Offline</h5>
                      <p className="text-sm text-gray-600">Akses data tanpa koneksi internet</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-gray-600" />
                    <div>
                      <h5 className="font-semibold">Sistem Aduan Masyarakat</h5>
                      <p className="text-sm text-gray-600">Laporkan masalah berbasis lokasi</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mapping Tab */}
          <TabsContent value="mapping" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Struktur Pemetaan Wilayah</CardTitle>
                <CardDescription>Hierarki pemetaan dari tingkat desa hingga RT</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="font-semibold">Batas Desa</span>
                    <span className="text-gray-600">- Wilayah administratif Desa Banyuputih</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                    <span className="font-semibold">Batas Dusun</span>
                    <span className="text-gray-600">- Pembagian wilayah dusun dalam desa</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="font-semibold">Batas RW</span>
                    <span className="text-gray-600">- Rukun Warga sebagai unit administratif</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="font-semibold">Batas RT</span>
                    <span className="text-gray-600">- Rukun Tetangga sebagai unit terkecil</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Poin Lokasi Penting</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>• Kantor Desa</div>
                    <div>• Sekolah</div>
                    <div>• Masjid</div>
                    <div>• Posyandu</div>
                    <div>• Puskesmas</div>
                    <div>• UMKM</div>
                    <div>• Lapangan</div>
                    <div>• Makam</div>
                    <div>• Balai Desa</div>
                    <div>• BUMDes</div>
                    <div>• Fasilitas Olahraga</div>
                    <div>• Toko</div>
                    <div>• Tempat Ibadah</div>
                    <div>• Area Wisata</div>
                    <div>• Sentra Kerajinan</div>
                    <div>• Titik Rawan Banjir</div>
                    <div>• Pos Keamanan</div>
                    <div>• Area Publik</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Infrastruktur & Penggunaan Lahan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-semibold text-sm mb-1">Infrastruktur:</h5>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>• Jalan (aspal, paving, tanah)</div>
                        <div>• Jembatan, Drainase, Irigasi</div>
                        <div>• Gardu listrik, Lampu jalan</div>
                        <div>• Pipa air, Menara telekomunikasi</div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-semibold text-sm mb-1">Penggunaan Lahan:</h5>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>• Permukiman, Persawahan</div>
                        <div>• Kebun, Tegalan</div>
                        <div>• Lahan kosong, Hutan rakyat</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Benefits Tab */}
          <TabsContent value="benefits" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-blue-600" />
                    Manfaat untuk Aparatur Desa
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Akses cepat ke data spasial desa</li>
                    <li>• Perencanaan pembangunan berbasis data</li>
                    <li>• Monitoring infrastruktur secara real-time</li>
                    <li>• Pembuatan laporan yang otomatis</li>
                    <li>• Pengambilan keputusan yang lebih baik</li>
                    <li>• Efisiensi waktu dan biaya operasional</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-600" />
                    Manfaat untuk Masyarakat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Informasi desa yang transparan</li>
                    <li>• Akses fasilitas publik yang mudah</li>
                    <li>• Partisipasi dalam pengawasan pembangunan</li>
                    <li>• Pelaporan masalah secara langsung</li>
                    <li>• Mengetahui potensi desa</li>
                    <li>• Peningkatan keterlibatan dalam pembangunan</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Dampak Positif untuk Pembangunan Desa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">85%</div>
                    <p className="text-sm text-gray-600">Efisiensi Pengelolaan Data</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">70%</div>
                    <p className="text-sm text-gray-600">Peningkatan Transparansi</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">60%</div>
                    <p className="text-sm text-gray-600">Percepatan Pengambilan Keputusan</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">90%</div>
                    <p className="text-sm text-gray-600">Kepuasan Masyarakat</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Aparatur Desa
                  </CardTitle>
                  <CardDescription>Pengguna dengan hak akses penuh</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-red-100 text-red-800">Admin</Badge>
                      <span className="text-sm">Kepala Desa, Sekretaris Desa</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-blue-100 text-blue-800">Operator</Badge>
                      <span className="text-sm">Staff Desa, Operator GIS</span>
                    </div>
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h5 className="font-semibold text-sm mb-2">Hak Akses:</h5>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>✓ Kelola data lokasi dan infrastruktur</li>
                        <li>✓ Generate laporan dan statistik</li>
                        <li>✓ Verifikasi data masuk</li>
                        <li>✓ Konfigurasi sistem</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-600" />
                    Masyarakat Umum
                  </CardTitle>
                  <CardDescription>Pengguna dengan hak akses terbatas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-green-100 text-green-800">Public</Badge>
                      <span className="text-sm">Warga Desa Banyuputih</span>
                    </div>
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h5 className="font-semibold text-sm mb-2">Hak Akses:</h5>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>✓ Lihat peta dan informasi lokasi</li>
                        <li>✓ Cari fasilitas publik</li>
                        <li>✓ Laporkan masalah/kerusakan</li>
                        <li>✓ Lihat status pengaduan</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Alur Kerja Pengguna</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                    <div>
                      <h5 className="font-semibold">Registrasi & Login</h5>
                      <p className="text-sm text-gray-600">Pengguna mendaftar dan login ke sistem</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                    <div>
                      <h5 className="font-semibold">Akses Dashboard</h5>
                      <p className="text-sm text-gray-600">Menu sesuai dengan peran dan hak akses</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                    <div>
                      <h5 className="font-semibold">Interaksi dengan Peta</h5>
                      <p className="text-sm text-gray-600">Jelajahi peta dan akses informasi lokasi</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">4</div>
                    <div>
                      <h5 className="font-semibold">Laporan & Feedback</h5>
                      <p className="text-sm text-gray-600">Buat laporan atau berikan feedback</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Desa Digital Map</h3>
              <p className="text-gray-400 text-sm">
                Sistem Informasi Geografis untuk Desa Banyuputih, Kecamatan Kalinyamatan, Kabupaten Jepara, Provinsi Jawa Tengah
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Kontak</h3>
              <p className="text-gray-400 text-sm">
                Kantor Desa Banyuputih<br />
                Kecamatan Kalinyamatan<br />
                Kabupaten Jepara, Jawa Tengah
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Tentang</h3>
              <p className="text-gray-400 text-sm">
                Platform ini dikembangkan untuk mendukung digitalisasi desa dan meningkatkan transparansi pemerintahan desa.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2024 Desa Digital Map - SIG Desa Banyuputih. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

// Target icon for the hero section
function Target({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  );
}