import { db } from '@/lib/db';

export class DashboardService {
  // Get comprehensive dashboard statistics
  static async getDashboardStats() {
    const [
      totalLocations,
      totalCategories,
      totalReports,
      totalInfrastructure,
      recentActivities,
      locationByCategory,
      reportsByStatus
    ] = await Promise.all([
      // Total counts
      db.location.count(),
      db.category.count({ where: { isActive: true } }),
      db.publicReport.count(),
      db.infrastructure.count(),
      
      // Recent activities (last 10)
      db.dataLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              fullName: true
            }
          },
          location: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }),
      
      // Locations by category
      db.category.findMany({
        where: { isActive: true },
        include: {
          _count: {
            select: {
              locations: true
            }
          }
        }
      }),
      
      // Reports by status
      db.publicReport.groupBy({
        by: ['status'],
        _count: {
          status: true
        }
      })
    ]);
    
    return {
      totalLocations,
      totalCategories,
      totalReports,
      totalInfrastructure,
      recentActivities,
      locationByCategory: locationByCategory.map(cat => ({
        categoryName: cat.name,
        count: cat._count.locations,
        color: cat.color
      })),
      reportsByStatus: reportsByStatus.map(item => ({
        status: item.status,
        count: item._count.status
      }))
    };
  }
  
  // Get quick statistics for dashboard cards
  static async getQuickStats() {
    const [
      activeLocations,
      openReports,
      totalArea,
      newThisMonth
    ] = await Promise.all([
      db.location.count({
        where: { status: 'ACTIVE' }
      }),
      db.publicReport.count({
        where: { status: 'OPEN' }
      }),
      // This would be calculated from geometry in a real PostGIS setup
      db.landUse.aggregate({
        _sum: {
          areaKm2: true
        }
      }),
      db.location.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      })
    ]);
    
    return {
      activeLocations,
      openReports,
      totalArea: totalArea._sum.areaKm2 || 0,
      newThisMonth
    };
  }
  
  // Get recent activities with more details
  static async getRecentActivities(limit: number = 10) {
    return await db.dataLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true
          }
        },
        location: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  }
  
  // Get chart data for analytics
  static async getChartData() {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date;
    }).reverse();
    
    const monthlyData = await Promise.all(
      last6Months.map(async (date) => {
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const [locations, reports] = await Promise.all([
          db.location.count({
            where: {
              createdAt: {
                gte: startOfMonth,
                lte: endOfMonth
              }
            }
          }),
          db.publicReport.count({
            where: {
              createdAt: {
                gte: startOfMonth,
                lte: endOfMonth
              }
            }
          })
        ]);
        
        return {
          month: date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
          locations,
          reports
        };
      })
    );
    
    return monthlyData;
  }
}