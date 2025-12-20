import { db } from '@/lib/db';

export class LocationService {
  // Get all locations with optional filtering
  static async getLocations(filter?: {
    categoryId?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { categoryId, status, search, page = 1, limit = 50 } = filter || {};
    
    const where: any = {};
    
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { address: { contains: search } }
      ];
    }
    
    const [locations, total] = await Promise.all([
      db.location.findMany({
        where,
        include: {
          category: true,
          creator: {
            select: {
              id: true,
              username: true,
              fullName: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      db.location.count({ where })
    ]);
    
    return {
      data: locations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
  
  // Get location by ID
  static async getLocationById(id: string) {
    return await db.location.findUnique({
      where: { id },
      include: {
        category: true,
        creator: {
          select: {
            id: true,
            username: true,
            fullName: true
          }
        },
        infrastructure: true,
        dataLogs: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                fullName: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });
  }
  
  // Create new location
  static async createLocation(data: {
    name: string;
    description?: string;
    address?: string;
    geometry: string;
    properties?: string;
    photos?: string;
    categoryId: string;
    createdBy: string;
  }) {
    const location = await db.location.create({
      data,
      include: {
        category: true,
        creator: {
          select: {
            id: true,
            username: true,
            fullName: true
          }
        }
      }
    });
    
    // Log the creation
    await db.dataLog.create({
      data: {
        tableName: 'Location',
        recordId: location.id,
        action: 'CREATE',
        newValues: JSON.stringify(data),
        userId: data.createdBy,
        locationId: location.id
      }
    });
    
    return location;
  }
  
  // Update location
  static async updateLocation(id: string, data: any, userId: string) {
    const oldLocation = await db.location.findUnique({
      where: { id }
    });
    
    if (!oldLocation) {
      throw new Error('Location not found');
    }
    
    const updatedLocation = await db.location.update({
      where: { id },
      data,
      include: {
        category: true,
        creator: {
          select: {
            id: true,
            username: true,
            fullName: true
          }
        }
      }
    });
    
    // Log the update
    await db.dataLog.create({
      data: {
        tableName: 'Location',
        recordId: id,
        action: 'UPDATE',
        oldValues: JSON.stringify(oldLocation),
        newValues: JSON.stringify(data),
        userId,
        locationId: id
      }
    });
    
    return updatedLocation;
  }
  
  // Delete location
  static async deleteLocation(id: string, userId: string) {
    const oldLocation = await db.location.findUnique({
      where: { id }
    });
    
    if (!oldLocation) {
      throw new Error('Location not found');
    }
    
    await db.location.delete({
      where: { id }
    });
    
    // Log the deletion
    await db.dataLog.create({
      data: {
        tableName: 'Location',
        recordId: id,
        action: 'DELETE',
        oldValues: JSON.stringify(oldLocation),
        userId
      }
    });
    
    return true;
  }
  
  // Get locations within bounds
  static async getLocationsInBounds(bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }) {
    // For SQLite, we'll need to parse the geometry JSON and filter manually
    // In a real PostGIS setup, this would use spatial queries
    const locations = await db.location.findMany({
      include: {
        category: true
      }
    });
    
    // Filter locations within bounds (simplified approach)
    const filteredLocations = locations.filter(location => {
      try {
        const geometry = JSON.parse(location.geometry);
        if (geometry.type === 'Point') {
          const [lng, lat] = geometry.coordinates;
          return lat <= bounds.north && lat >= bounds.south && 
                 lng <= bounds.east && lng >= bounds.west;
        }
      } catch (error) {
        console.error('Error parsing geometry:', error);
      }
      return false;
    });
    
    return filteredLocations;
  }
}