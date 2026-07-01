import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { uploadToCloudinary } from "@/lib/cloudinary";

const CORE_PROJECTS = [
    {
        name: "ANNAPRASHANA",
        description: "Initiative Portfolio: Providing weaning food/first solid food program to infants, spreading nutrition awareness for nursing mothers."
    },
    {
        name: "SOMPARKER BANDHAN",
        description: "Initiative Portfolio: Spreading joy, establishing social bonds, and creating a strong support network in the community."
    },
    {
        name: "KUTUMBA",
        description: "Initiative Portfolio: Helping people through charity, community support, clothes distribution, and overall family welfare."
    },
    {
        name: "AANANDAM",
        description: "Initiative Portfolio: Creating moments of joy, picnics, recreation, and community celebrations for individuals."
    },
    {
        name: "UTSAHO",
        description: "Initiative Portfolio: Encouraging, motivating, and supporting children and youth in their educational and career journeys."
    },
    {
        name: "SWASTHYA VIKAS",
        description: "Initiative Portfolio: Direct health camps, nutrition awareness, distribution of health utilities, and healthcare support."
    },
    {
        name: "SHYAMALIMA",
        description: "Initiative Portfolio: Environmental initiatives, tree plantation drives, and raising environmental consciousness."
    },
    {
        name: "BARISTHA VANDANA",
        description: "Initiative Portfolio: Honouring, serving, and caring for the elderly members of our community with nutrition and healthcare."
    }
];

// GET all projects
export async function GET() {
    try {
        await connectDB();
        
        let projects = await Project.find({}).sort({ createdAt: -1 });

        // Auto-seed missing core projects
        let seededNew = false;
        for (const core of CORE_PROJECTS) {
            const normalizedCoreName = core.name.toLowerCase().replace(/[^a-z0-9]/g, '');
            const exists = projects.some(p => {
                const normalizedDbName = p.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                // Handle spelling variants of SAMPARKER BANDHAN / SOMPARKER BANDHAN
                if (normalizedCoreName.includes("bandhan") && normalizedDbName.includes("bandhan")) return true;
                return normalizedDbName === normalizedCoreName;
            });

            if (!exists) {
                await Project.create({
                    name: core.name,
                    description: core.description,
                    images: [],
                    pdf: null
                });
                seededNew = true;
            }
        }

        if (seededNew) {
            // Re-fetch sorted projects
            projects = await Project.find({}).sort({ createdAt: -1 });
        }

        return NextResponse.json(projects, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST new project
export async function POST(req: Request) {
    try {
        await connectDB();
        const data = await req.json();

        if (!data.name || !data.description) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Upload images to Cloudinary if they are base64
        const uploadedImages = [];
        if (data.images && Array.isArray(data.images)) {
            for (const img of data.images) {
                if (img.startsWith("data:")) {
                    try {
                        const url = await uploadToCloudinary(img, "projects");
                        uploadedImages.push(url);
                    } catch (err: any) {
                        console.error("Cloudinary upload failed for project image. Storing base64 fallback.", err);
                        uploadedImages.push(img);
                    }
                } else {
                    uploadedImages.push(img);
                }
            }
        }

        const newProject = await Project.create({
            name: data.name,
            description: data.description,
            images: uploadedImages,
            pdf: data.pdf || null
        });

        return NextResponse.json(newProject, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

