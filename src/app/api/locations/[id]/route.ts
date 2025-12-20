import { NextRequest, NextResponse } from 'next/server';
import { LocationService } from '@/lib/services/location.service';

// GET single location by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const location = await LocationService.getLocationById(id);

        if (!location) {
            return NextResponse.json(
                { success: false, error: 'Location not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: location
        });
    } catch (error) {
        console.error('Error fetching location:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch location' },
            { status: 500 }
        );
    }
}

// PUT - Update location
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Get userId from body or use default
        const userId = body.userId || 'admin';

        // Prepare update data
        const updateData: any = {};

        if (body.name) updateData.name = body.name;
        if (body.description !== undefined) updateData.description = body.description;
        if (body.address !== undefined) updateData.address = body.address;
        if (body.categoryId) updateData.categoryId = body.categoryId;
        if (body.status) updateData.status = body.status;

        // Handle geometry update
        if (body.geometry) {
            updateData.geometry = typeof body.geometry === 'string'
                ? body.geometry
                : JSON.stringify(body.geometry);
        }

        // Handle photos update
        if (body.photos !== undefined) {
            updateData.photos = typeof body.photos === 'string'
                ? body.photos
                : JSON.stringify(body.photos);
        }

        // Handle properties update
        if (body.properties !== undefined) {
            updateData.properties = typeof body.properties === 'string'
                ? body.properties
                : JSON.stringify(body.properties);
        }

        const location = await LocationService.updateLocation(id, updateData, userId);

        return NextResponse.json({
            success: true,
            data: location,
            message: 'Location updated successfully'
        });
    } catch (error) {
        console.error('Error updating location:', error);

        if (error instanceof Error && error.message === 'Location not found') {
            return NextResponse.json(
                { success: false, error: 'Location not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: false, error: 'Failed to update location' },
            { status: 500 }
        );
    }
}

// DELETE - Delete location
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Get userId from query params or use default
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId') || 'admin';

        await LocationService.deleteLocation(id, userId);

        return NextResponse.json({
            success: true,
            message: 'Location deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting location:', error);

        if (error instanceof Error && error.message === 'Location not found') {
            return NextResponse.json(
                { success: false, error: 'Location not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: false, error: 'Failed to delete location' },
            { status: 500 }
        );
    }
}
