import { db } from '@/lib/db';

export class CategoryService {
  // Get all categories
  static async getCategories() {
    return await db.category.findMany({
      where: {
        isActive: true
      },
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            locations: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
  }
  
  // Get category by ID
  static async getCategoryById(id: string) {
    return await db.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        locations: {
          include: {
            creator: {
              select: {
                id: true,
                username: true,
                fullName: true
              }
            }
          }
        }
      }
    });
  }
  
  // Create new category
  static async createCategory(data: {
    name: string;
    icon?: string;
    color?: string;
    description?: string;
    parentId?: string;
  }) {
    return await db.category.create({
      data,
      include: {
        parent: true,
        children: true
      }
    });
  }
  
  // Update category
  static async updateCategory(id: string, data: any) {
    return await db.category.update({
      where: { id },
      data,
      include: {
        parent: true,
        children: true
      }
    });
  }
  
  // Delete category (soft delete by setting isActive to false)
  static async deleteCategory(id: string) {
    return await db.category.update({
      where: { id },
      data: {
        isActive: false
      }
    });
  }
  
  // Get root categories (no parent)
  static async getRootCategories() {
    return await db.category.findMany({
      where: {
        parentId: null,
        isActive: true
      },
      include: {
        children: {
          where: {
            isActive: true
          }
        },
        _count: {
          select: {
            locations: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
  }
}