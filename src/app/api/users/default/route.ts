import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Get default user for CRUD operations
export async function GET() {
    try {
        // Try to find the admin user first
        let user = await db.user.findFirst({
            where: {
                OR: [
                    { username: 'admin' },
                    { role: 'ADMIN' }
                ]
            },
            select: {
                id: true,
                username: true,
                fullName: true,
                role: true
            }
        });

        // If no admin found, get any user
        if (!user) {
            user = await db.user.findFirst({
                select: {
                    id: true,
                    username: true,
                    fullName: true,
                    role: true
                }
            });
        }

        if (!user) {
            return NextResponse.json({
                success: false,
                error: 'No users found in database. Please run db:seed first.'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error fetching default user:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch default user' },
            { status: 500 }
        );
    }
}
