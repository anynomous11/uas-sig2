import { NextRequest, NextResponse } from 'next/server';
import { ReportService } from '@/lib/services/report.service';

// GET single report by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const report = await ReportService.getReportById(id);

        if (!report) {
            return NextResponse.json(
                { success: false, error: 'Report not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: report
        });
    } catch (error) {
        console.error('Error fetching report:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch report' },
            { status: 500 }
        );
    }
}

// PUT - Full update report
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const updateData: any = {};

        if (body.title) updateData.title = body.title;
        if (body.description !== undefined) updateData.description = body.description;
        if (body.reportType !== undefined) updateData.reportType = body.reportType;
        if (body.reporterName !== undefined) updateData.reporterName = body.reporterName;
        if (body.reporterContact !== undefined) updateData.reporterContact = body.reporterContact;
        if (body.status) updateData.status = body.status;
        if (body.assignedTo !== undefined) updateData.assignedTo = body.assignedTo;

        if (body.geometry) {
            updateData.geometry = typeof body.geometry === 'string'
                ? body.geometry
                : JSON.stringify(body.geometry);
        }

        if (body.photos !== undefined) {
            updateData.photos = typeof body.photos === 'string'
                ? body.photos
                : JSON.stringify(body.photos);
        }

        const report = await ReportService.updateReport(id, updateData);

        return NextResponse.json({
            success: true,
            data: report,
            message: 'Report updated successfully'
        });
    } catch (error) {
        console.error('Error updating report:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update report' },
            { status: 500 }
        );
    }
}

// PATCH - Partial update (status change)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const updateData: any = {};

        if (body.status) updateData.status = body.status;
        if (body.assignedTo !== undefined) updateData.assignedTo = body.assignedTo;

        const report = await ReportService.updateReport(id, updateData);

        return NextResponse.json({
            success: true,
            data: report,
            message: 'Report status updated successfully'
        });
    } catch (error) {
        console.error('Error updating report status:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update report status' },
            { status: 500 }
        );
    }
}

// DELETE - Delete report
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const { db } = await import('@/lib/db');
        await db.publicReport.delete({
            where: { id }
        });

        return NextResponse.json({
            success: true,
            message: 'Report deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting report:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete report' },
            { status: 500 }
        );
    }
}
