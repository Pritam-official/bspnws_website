import { NextRequest, NextResponse } from "next/server";
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
        console.error("Error fetching Nutrition Logic Config:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch logic configuration", error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();

        const {
            boysReference,
            girlsReference,
            muacCutoffs,
            parameterWeights,
            stageThresholds,
        } = body;

        let config = await NutritionLogicConfig.findOne({});

        if (config) {
            if (boysReference) config.boysReference = boysReference;
            if (girlsReference) config.girlsReference = girlsReference;
            if (muacCutoffs) config.muacCutoffs = muacCutoffs;
            if (parameterWeights) config.parameterWeights = parameterWeights;
            if (stageThresholds) config.stageThresholds = stageThresholds;
            await config.save();
        } else {
            config = await NutritionLogicConfig.create({
                boysReference: boysReference || DEFAULT_BOYS_REFERENCE,
                girlsReference: girlsReference || DEFAULT_GIRLS_REFERENCE,
                muacCutoffs: muacCutoffs || DEFAULT_MUAC_CUTOFFS,
                parameterWeights: parameterWeights || DEFAULT_PARAMETER_WEIGHTS,
                stageThresholds: stageThresholds || DEFAULT_STAGE_THRESHOLDS,
            });
        }

        return NextResponse.json({
            success: true,
            message: "Nutrition logic & WHO growth standards updated successfully!",
            data: config,
        });
    } catch (error: any) {
        console.error("Error saving Nutrition Logic Config:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update logic configuration", error: error.message },
            { status: 500 }
        );
    }
}

// Reset to default WHO standards
export async function DELETE() {
    try {
        await connectDB();

        let config = await NutritionLogicConfig.findOne({});

        if (config) {
            config.boysReference = DEFAULT_BOYS_REFERENCE;
            config.girlsReference = DEFAULT_GIRLS_REFERENCE;
            config.muacCutoffs = DEFAULT_MUAC_CUTOFFS;
            config.parameterWeights = DEFAULT_PARAMETER_WEIGHTS;
            config.stageThresholds = DEFAULT_STAGE_THRESHOLDS;
            await config.save();
        } else {
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
            message: "Reset to standard WHO growth references successfully!",
            data: config,
        });
    } catch (error: any) {
        console.error("Error resetting Nutrition Logic Config:", error);
        return NextResponse.json(
            { success: false, message: "Failed to reset logic configuration", error: error.message },
            { status: 500 }
        );
    }
}
