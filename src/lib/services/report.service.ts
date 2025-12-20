import { db } from '@/lib/db';

export class ReportService {
  // Get all reports with optional filtering
  static async getReports(filter?: {
    status?: string;
    reportType?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { status, reportType, search, page = 1, limit = 50 } = filter || {};
    
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (reportType) {
      where.reportType = reportType;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { reporterName: { contains: search } }
      ];
    }
    
    const [reports, total] = await Promise.all([
      db.publicReport.findMany({
        where,
        include: {
          assignee: {
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
      db.publicReport.count({ where })
    ]);
    
    return {
      data: reports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
  
  // Get report by ID
  static async getReportById(id: string) {
    return await db.publicReport.findUnique({
      where: { id },
      include: {
        assignee: {
          select: {
            id: true,
            username: true,
            fullName: true
          }
        }
      }
    });
  }
  
  // Create new report
  static async createReport(data: {
    reporterName?: string;
    reporterContact?: string;
    title: string;
    description?: string;
    reportType?: string;
    geometry: string;
    photos?: string;
  }) {
    return await db.publicReport.create({
      data,
      include: {
        assignee: {
          select: {
            id: true,
            username: true,
            fullName: true
          }
        }
      }
    });
  }
  
  // Update report
  static async updateReport(id: string, data: any) {
    return await db.publicReport.update({
      where: { id },
      data,
      include: {
        assignee: {
          select: {
            id: true,
            username: true,
            fullName: true
          }
        }
      }
    });
  }
  
  // Assign report to user
  static async assignReport(id: string, assignedTo: string) {
    return await db.publicReport.update({
      where: { id },
      data: {
        assignedTo,
        status: 'IN_PROGRESS'
      },
      include: {
        assignee: {
          select: {
            id: true,
            username: true,
            fullName: true
          }
        }
      }
    });
  }
  
  // Resolve report
  static async resolveReport(id: string) {
    return await db.publicReport.update({
      where: { id },
      data: {
        status: 'RESOLVED'
      },
      include: {
        assignee: {
          select: {
            id: true,
            username: true,
            fullName: true
          }
        }
      }
    });
  }
  
  // Get reports statistics
  static async getReportStats() {
    const [total, open, inProgress, resolved] = await Promise.all([
      db.publicReport.count(),
      db.publicReport.count({ where: { status: 'OPEN' } }),
      db.publicReport.count({ where: { status: 'IN_PROGRESS' } }),
      db.publicReport.count({ where: { status: 'RESOLVED' } })
    ]);
    
    return {
      total,
      open,
      inProgress,
      resolved
    };
  }
}