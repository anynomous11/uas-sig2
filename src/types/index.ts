export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  id: string;
  name: string;
  description?: string;
  address?: string;
  geometry: string; // JSON string for POINT data
  properties?: string; // JSON string for additional properties
  photos?: string; // JSON string for photo URLs
  status: LocationStatus;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  createdBy: string;
  category?: Category;
  creator?: User;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  parent?: Category;
  children?: Category[];
  locations?: Location[];
}

export interface AdministrativeBoundary {
  id: string;
  name: string;
  type: BoundaryType;
  parentId?: string;
  population?: number;
  areaKm2?: number;
  geometry: string; // JSON string for spatial data
  createdAt: Date;
  updatedAt: Date;
  parent?: AdministrativeBoundary;
  children?: AdministrativeBoundary[];
}

export interface Infrastructure {
  id: string;
  type: InfrastructureType;
  condition?: string;
  lengthKm?: number;
  widthM?: number;
  constructionYear?: number;
  lastMaintenanceYear?: number;
  geometry: string; // JSON string for LINESTRING data
  properties?: string; // JSON string for additional properties
  createdAt: Date;
  updatedAt: Date;
  locationId: string;
  location?: Location;
}

export interface LandUse {
  id: string;
  type: LandUseType;
  areaKm2?: number;
  ownershipStatus?: string;
  productivityLevel?: string;
  geometry: string; // JSON string for POLYGON data
  properties?: string; // JSON string for additional properties
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicReport {
  id: string;
  reporterName?: string;
  reporterContact?: string;
  title: string;
  description?: string;
  reportType?: string;
  geometry: string; // JSON string for POINT data
  photos?: string; // JSON string for photo URLs
  status: ReportStatus;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  assignee?: User;
}

export interface DataLog {
  id: string;
  tableName: string;
  recordId: string;
  action: LogAction;
  oldValues?: string; // JSON string
  newValues?: string; // JSON string
  createdAt: Date;
  userId: string;
  locationId?: string;
  user?: User;
  location?: Location;
}

export interface Setting {
  id: string;
  key: string;
  value?: string;
  description?: string;
  updatedAt: Date;
  updatedBy?: string;
  updater?: User;
}

// Enums
export enum Role {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
  PUBLIC = 'PUBLIC'
}

export enum BoundaryType {
  DESA = 'DESA',
  DUSUN = 'DUSUN',
  RW = 'RW',
  RT = 'RT'
}

export enum LocationStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  UNDER_CONSTRUCTION = 'UNDER_CONSTRUCTION'
}

export enum InfrastructureType {
  JALAN = 'JALAN',
  JEMBATAN = 'JEMBATAN',
  DRAINASE = 'DRAINASE',
  IRIGASI = 'IRIGASI',
  GARDU_LISTRIK = 'GARDU_LISTRIK',
  LAMPU_JALAN = 'LAMPU_JALAN',
  PIPA_AIR = 'PIPA_AIR',
  MENARA_TELEKOMUNIKASI = 'MENARA_TELEKOMUNIKASI'
}

export enum LandUseType {
  PERMUKIMAN = 'PERMUKIMAN',
  PERSAWAHAN = 'PERSAWAHAN',
  KEBUN = 'KEBUN',
  TEGALAN = 'TEGALAN',
  LAHAN_KOSONG = 'LAHAN_KOSONG',
  HUTAN_RAKYAT = 'HUTAN_RAKYAT'
}

export enum ReportStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED'
}

export enum LogAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE'
}

// GIS Types
export interface Point {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface LineString {
  type: 'LineString';
  coordinates: [number, number][];
}

export interface Polygon {
  type: 'Polygon';
  coordinates: [number, number][][];
}

export type Geometry = Point | LineString | Polygon;

// Map Layer Types
export interface MapLayer {
  id: string;
  name: string;
  type: 'boundary' | 'location' | 'infrastructure' | 'landuse' | 'reports';
  visible: boolean;
  opacity: number;
  data: any[];
  style?: {
    color?: string;
    fillColor?: string;
    weight?: number;
    opacity?: number;
    fillOpacity?: number;
  };
}

// Filter Types
export interface LocationFilter {
  categoryId?: string;
  status?: LocationStatus;
  search?: string;
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Dashboard Statistics
export interface DashboardStats {
  totalLocations: number;
  totalCategories: number;
  totalReports: number;
  totalInfrastructure: number;
  recentActivities: DataLog[];
  locationByCategory: Array<{
    categoryName: string;
    count: number;
    color?: string;
  }>;
  reportsByStatus: Array<{
    status: ReportStatus;
    count: number;
  }>;
}

// Form Types
export interface LocationFormData {
  name: string;
  description?: string;
  address?: string;
  categoryId: string;
  geometry: Point;
  properties?: Record<string, any>;
  photos?: string[];
}

export interface ReportFormData {
  reporterName?: string;
  reporterContact?: string;
  title: string;
  description?: string;
  reportType?: string;
  geometry: Point;
  photos?: string[];
}