'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  AlertTriangle,
  Activity,
  CheckCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ReportForm from '@/components/forms/ReportForm';

interface Report {
  id: string;
  title: string;
  description?: string;
  reportType?: string;
  status: string;
  reporterName?: string;
  reporterContact?: string;
  assignee?: {
    id: string;
    username: string;
    fullName?: string;
  };
  createdAt: string;
  updatedAt: string;
}

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

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReport, setEditingReport] = useState<Report | null>(null);

  useEffect(() => {
    fetchReports();
  }, [searchQuery, selectedStatus, selectedType]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      if (selectedType !== 'all') params.append('reportType', selectedType);

      const response = await fetch(`/api/reports?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setReports(data.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/reports/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchReports();
      }
    } catch (error) {
      console.error('Error updating report status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
      try {
        const response = await fetch(`/api/reports/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchReports();
        }
      } catch (error) {
        console.error('Error deleting report:', error);
      }
    }
  };

  const handleEdit = (report: Report) => {
    setEditingReport(report);
    setShowAddForm(true);
  };

  const handleFormSubmit = async (data: ReportFormData) => {
    try {
      const payload = {
        title: data.title,
        description: data.description,
        reportType: data.reportType,
        reporterName: data.reporterName,
        reporterContact: data.reporterContact,
        geometry: {
          type: 'Point',
          coordinates: [parseFloat(data.longitude), parseFloat(data.latitude)]
        }
      };

      const url = editingReport ? `/api/reports/${editingReport.id}` : '/api/reports';
      const method = editingReport ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        fetchReports();
        setEditingReport(null);
      }
    } catch (error) {
      console.error('Error saving report:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-red-100 text-red-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN': return <AlertTriangle className="w-4 h-4" />;
      case 'IN_PROGRESS': return <Activity className="w-4 h-4" />;
      case 'RESOLVED': return <CheckCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const displayReports = reports;

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Laporan Masyarakat</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-red-50 text-red-800">
                8 Open
              </Badge>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-800">
                10 In Progress
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-800">
                5 Resolved
              </Badge>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm" onClick={() => setShowAddForm(true)} data-add-report>
                <Plus className="w-4 h-4 mr-2" />
                Buat Laporan
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
                  placeholder="Cari laporan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Semua Tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tipe</SelectItem>
                <SelectItem value="Infrastruktur">Infrastruktur</SelectItem>
                <SelectItem value="Kebersihan">Kebersihan</SelectItem>
                <SelectItem value="Air Bersih">Air Bersih</SelectItem>
                <SelectItem value="Listrik">Listrik</SelectItem>
                <SelectItem value="Keamanan">Keamanan</SelectItem>
                <SelectItem value="Kesehatan">Kesehatan</SelectItem>
                <SelectItem value="Pendidikan">Pendidikan</SelectItem>
                <SelectItem value="Sosial">Sosial</SelectItem>
                <SelectItem value="Darurat">Darurat</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reports Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul Laporan</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Pelapor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ditugakan Kepada</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="ml-2">Memuat data...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : displayReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-center">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Belum ada laporan
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Mulai dengan membuat laporan pertama
                        </p>
                        <Button onClick={() => setShowAddForm(true)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Buat Laporan Baru
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  displayReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{report.title}</div>
                          {report.description && (
                            <div className="text-sm text-gray-600 line-clamp-2">
                              {report.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {report.reportType || 'Umum'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div>
                          <div className="font-medium">{report.reporterName || 'Anonim'}</div>
                          {report.reporterContact && (
                            <div className="text-gray-600">{report.reporterContact}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(report.status)}
                          <Badge className={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {report.assignee ? (
                          <div>
                            <div className="font-medium">
                              {report.assignee.fullName || report.assignee.username}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500">Belum ditugaskan</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(report.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="z-[3000]">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEdit(report)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Lihat Detail
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(report)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            {report.status === 'OPEN' && (
                              <DropdownMenuItem onClick={() => handleStatusChange(report.id, 'IN_PROGRESS')}>
                                <Activity className="mr-2 h-4 w-4" />
                                Proses
                              </DropdownMenuItem>
                            )}
                            {report.status === 'IN_PROGRESS' && (
                              <DropdownMenuItem onClick={() => handleStatusChange(report.id, 'RESOLVED')}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Selesaikan
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600 focus:bg-red-50"
                              onClick={() => handleDelete(report.id)}
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
        </CardContent>
      </Card>

      {/* Report Form Modal */}
      <ReportForm
        isOpen={showAddForm}
        onClose={() => {
          setShowAddForm(false);
          setEditingReport(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingReport ? {
          title: editingReport.title,
          description: editingReport.description || '',
          reportType: editingReport.reportType || '',
          reporterName: editingReport.reporterName || '',
          reporterContact: editingReport.reporterContact || '',
          latitude: '',
          longitude: '',
          photos: []
        } : undefined}
      />
    </div>
  );
}