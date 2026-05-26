import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import BoardMember from "@/models/BoardMember";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;

        const deletedMember = await BoardMember.findByIdAndDelete(id);

        if (!deletedMember) {
            return NextResponse.json({ error: "Board member not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Board member deleted successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
