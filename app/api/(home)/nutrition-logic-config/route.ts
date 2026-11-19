import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import NutritionLogicConfig, {
    DEFAULT_BOYS_REFERENCE,
    DEFAULT_GIRLS_REFERENCE,
    DEFAULT_MUAC_CUTOFFS,
    DEFAULT_PARAMETER_WEIGHTS,
    DEFAULT_STAGE_THRESHOLDS,
} from "@/models/NutritionLogicConfig";

export async function GET() {
    try {
        await connectDB();

        let config = await NutritionLogicConfig.findOne({});

        if (!config) {
            config = await NutritionLogicConfig.create({
                boysReference: DEFAULT_BOYS_REFERENCE,
                girlsReference: DEFAULT_GIRLS_REFERENCE,
                muacCutoffs: DEFAULT_MUAC_CUTOFFS,
                parameterWeights: DEFAULT_PARAMETER_WEIGHTS,
                stageThresholds: DEFAULT_STAGE_THRESHOLDS,
            });
        }

        return NextResponse.json({
            success: true,
            data: config,
        });
    } catch (error: any) {
        console.error("Error fetching public Nutrition Logic Config:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch logic configuration", error: error.message },
            { status: 500 }
        );
    }
}
