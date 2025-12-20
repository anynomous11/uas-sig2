import { NextRequest, NextResponse } from 'next/server';
import { LocationService } from '@/lib/services/location.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const result = await LocationService.getLocations({
      categoryId: categoryId || undefined,
      status: status || undefined,
      search: search || undefined,
      page,
      limit
    });

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.categoryId || !body.geometry || !body.createdBy) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const location = await LocationService.createLocation({
      name: body.name,
      description: body.description,
      address: body.address,
      geometry: JSON.stringify(body.geometry),
      properties: body.properties ? JSON.stringify(body.properties) : undefined,
      photos: body.photos ? JSON.stringify(body.photos) : undefined,
      categoryId: body.categoryId,
      createdBy: body.createdBy
    });

    return NextResponse.json({
      success: true,
      data: location
    });
  } catch (error) {
    console.error('Error creating location:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create location' },
      { status: 500 }
    );
  }
}