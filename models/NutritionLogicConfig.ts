import mongoose, { Schema, Document, Model } from "mongoose";
import {
    IGrowthMilestone,
    INutritionLogicConfigData,
    DEFAULT_BOYS_REFERENCE,
    DEFAULT_GIRLS_REFERENCE,
    DEFAULT_MUAC_CUTOFFS,
    DEFAULT_PARAMETER_WEIGHTS,
    DEFAULT_STAGE_THRESHOLDS,
} from "@/lib/nutritionLogicTypes";

export type { IGrowthMilestone, INutritionLogicConfigData };
export {
    DEFAULT_BOYS_REFERENCE,
    DEFAULT_GIRLS_REFERENCE,
    DEFAULT_MUAC_CUTOFFS,
    DEFAULT_PARAMETER_WEIGHTS,
    DEFAULT_STAGE_THRESHOLDS,
};

export interface INutritionLogicConfig extends Document {
    boysReference: IGrowthMilestone[];
    girlsReference: IGrowthMilestone[];
    muacCutoffs: {
        samBelow: number;
        mamBelow: number;
        healthyAbove: number;
    };
    parameterWeights: {
        weightWeight: number;
        muacWeight: number;
        heightWeight: number;
        headWeight: number;
        chestWeight: number;
    };
    stageThresholds: {
        samThreshold: number;
        mamThreshold: number;
        transitionThreshold: number;
    };
    updatedAt: Date;
}

const GrowthMilestoneSchema = new Schema<IGrowthMilestone>(
    {
        ageLabel: { type: String, required: true },
        ageMonths: { type: Number, required: true },
        height: { type: Number, required: true },
        weight: { type: Number, required: true },
        headCircumference: { type: Number, required: true },
        chestCircumference: { type: Number, required: true },
    },
    { _id: false }
);

const NutritionLogicConfigSchema = new Schema<INutritionLogicConfig>(
    {
        boysReference: { type: [GrowthMilestoneSchema], default: DEFAULT_BOYS_REFERENCE },
        girlsReference: { type: [GrowthMilestoneSchema], default: DEFAULT_GIRLS_REFERENCE },
        muacCutoffs: {
            samBelow: { type: Number, default: 11.5 },
            mamBelow: { type: Number, default: 12.5 },
            healthyAbove: { type: Number, default: 12.5 },
        },
        parameterWeights: {
            weightWeight: { type: Number, default: 30 },
            muacWeight: { type: Number, default: 35 },
            heightWeight: { type: Number, default: 15 },
            headWeight: { type: Number, default: 10 },
            chestWeight: { type: Number, default: 10 },
        },
        stageThresholds: {
            samThreshold: { type: Number, default: 40 },
            mamThreshold: { type: Number, default: 70 },
            transitionThreshold: { type: Number, default: 85 },
        },
    },
    { timestamps: true }
);

const NutritionLogicConfig: Model<INutritionLogicConfig> =
    mongoose.models.NutritionLogicConfig ||
    mongoose.model<INutritionLogicConfig>("NutritionLogicConfig", NutritionLogicConfigSchema);

export default NutritionLogicConfig;
