import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SamMamChild from "@/models/SamMamChild";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function GET(
    _req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        await connectDB();

        const child = await SamMamChild.findById(id);
        if (!child) {
            return NextResponse.json(
                { success: false, message: "Child record not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: child });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Failed to fetch child" },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        await connectDB();
        const body = await req.json();

        const updateData: any = { ...body };

        if (body.image) {
            if (body.image.startsWith("data:")) {
                try {
                    const cloudinaryUrl = await uploadToCloudinary(body.image, "sam_mam_children");
                    updateData.image = cloudinaryUrl;
                } catch (err: any) {
                    console.error("Cloudinary upload failed for child update:", err);
                }
            } else {
                updateData.image = body.image;
            }
        }

        if (body.weight !== undefined) updateData.weight = Number(body.weight);
        if (body.height !== undefined) updateData.height = Number(body.height);
        if (body.muac !== undefined) updateData.muac = Number(body.muac);
        if (body.head !== undefined) updateData.head = Number(body.head);
        if (body.chest !== undefined) updateData.chest = Number(body.chest);
        if (body.baselineWeight !== undefined) updateData.baselineWeight = Number(body.baselineWeight);
        if (body.targetWeight !== undefined) updateData.targetWeight = Number(body.targetWeight);
        if (body.baselineMuac !== undefined) updateData.baselineMuac = Number(body.baselineMuac);
        if (body.targetMuac !== undefined) updateData.targetMuac = Number(body.targetMuac);
        if (body.customRecoveryPercentage !== undefined) {
            updateData.customRecoveryPercentage = body.customRecoveryPercentage === "" ? undefined : Number(body.customRecoveryPercentage);
        }

        const updated = await SamMamChild.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updated) {
            return NextResponse.json(
                { success: false, message: "Child record not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Child details updated successfully",
            data: updated,
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Failed to update child" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const searchParams = req.nextUrl.searchParams;
        const monthToDelete = searchParams.get("month");
        const reportIdToDelete = searchParams.get("reportId");

        await connectDB();

        // If deleting a specific month from this child's group
        if (monthToDelete || reportIdToDelete) {
            const child = await SamMamChild.findById(id);
            if (!child) {
                return NextResponse.json(
                    { success: false, message: "Child record not found" },
                    { status: 404 }
                );
            }

            if (Array.isArray(child.monthlyReports)) {
                child.monthlyReports = child.monthlyReports.filter((r: any) => {
                    if (reportIdToDelete && String(r._id) === reportIdToDelete) return false;
                    if (monthToDelete && r.reportMonth.toLowerCase() === monthToDelete.toLowerCase()) return false;
                    return true;
                });

                // Update active metrics to latest remaining report if available
                if (child.monthlyReports.length > 0) {
                    const latest = child.monthlyReports[child.monthlyReports.length - 1];
                    child.reportMonth = latest.reportMonth;
                    child.weight = latest.weight;
                    child.height = latest.height;
                    child.muac = latest.muac;
                    child.head = latest.head;
                    child.chest = latest.chest;
                    child.age = latest.age;
                    child.dateOfEntry = latest.dateOfEntry;
                    child.anthropometricMeasurement = latest.anthropometricMeasurement;
                    child.last14DaysIllness = latest.last14DaysIllness;
                    child.ebf = latest.ebf;
                    child.immunization = latest.immunization;
                    child.remarks = latest.remarks;
                }
                await child.save();
            }

            return NextResponse.json({
                success: true,
                message: `Month record removed successfully`,
                data: child,
            });
        }

        // Deleting the entire child
        const deleted = await SamMamChild.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json(
                { success: false, message: "Child record not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Child record deleted successfully",
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Failed to delete child" },
            { status: 500 }
        );
    }
}
