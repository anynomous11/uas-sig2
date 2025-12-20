import { NextRequest, NextResponse } from 'next/server';
import { ReportService } from '@/lib/services/report.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const reportType = searchParams.get('reportType');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const result = await ReportService.getReports({
      status: status || undefined,
      reportType: reportType || undefined,
      search: search || undefined,
      page,
      limit
    });

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.title || !body.geometry) {
      return NextResponse.json(
        { success: false, error: 'Title and geometry are required' },
        { status: 400 }
      );
    }

    const report = await ReportService.createReport({
      reporterName: body.reporterName,
      reporterContact: body.reporterContact,
      title: body.title,
      description: body.description,
      reportType: body.reportType,
      geometry: JSON.stringify(body.geometry),
      photos: body.photos ? JSON.stringify(body.photos) : undefined
    });

    return NextResponse.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create report' },
      { status: 500 }
    );
  }
}