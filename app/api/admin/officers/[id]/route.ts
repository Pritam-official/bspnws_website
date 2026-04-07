import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Officer from "@/models/Officer";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const { id } = params;

        const deletedOfficer = await Officer.findByIdAndDelete(id);

        if (!deletedOfficer) {
            return NextResponse.json({ error: "Officer not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Officer deleted successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
