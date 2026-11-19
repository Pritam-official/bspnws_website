export interface IGrowthMilestone {
    ageLabel: string; // e.g. "Birth", "1 year", "2 years", "3 years", "4 years", "5 years"
    ageMonths: number; // 0, 12, 24, 36, 48, 60
    height: number; // cm
    weight: number; // kg
    headCircumference: number; // cm
    chestCircumference: number; // cm
}

export interface INutritionLogicConfigData {
    _id?: string;
    boysReference: IGrowthMilestone[];
    girlsReference: IGrowthMilestone[];
    muacCutoffs: {
        samBelow: number; // 11.5
        mamBelow: number; // 12.5
        healthyAbove: number; // 12.5
    };
    parameterWeights: {
        weightWeight: number; // e.g. 30%
        muacWeight: number;   // e.g. 35%
        heightWeight: number; // e.g. 15%
        headWeight: number;   // e.g. 10%
        chestWeight: number;  // e.g. 10%
    };
    stageThresholds: {
        samThreshold: number; // e.g. 40%
        mamThreshold: number; // e.g. 70%
        transitionThreshold: number; // e.g. 85%
    };
    updatedAt?: string | Date;
}

export const DEFAULT_BOYS_REFERENCE: IGrowthMilestone[] = [
    { ageLabel: "Birth", ageMonths: 0, height: 49.9, weight: 3.3, headCircumference: 34.5, chestCircumference: 33.0 },
    { ageLabel: "1 year", ageMonths: 12, height: 75.7, weight: 9.6, headCircumference: 46.1, chestCircumference: 46.0 },
    { ageLabel: "2 years", ageMonths: 24, height: 87.1, weight: 12.2, headCircumference: 48.3, chestCircumference: 49.0 },
    { ageLabel: "3 years", ageMonths: 36, height: 96.1, weight: 14.3, headCircumference: 49.5, chestCircumference: 51.0 },
    { ageLabel: "4 years", ageMonths: 48, height: 103.3, weight: 16.3, headCircumference: 50.2, chestCircumference: 52.5 },
    { ageLabel: "5 years", ageMonths: 60, height: 110.0, weight: 18.3, headCircumference: 50.7, chestCircumference: 54.0 },
];

export const DEFAULT_GIRLS_REFERENCE: IGrowthMilestone[] = [
    { ageLabel: "Birth", ageMonths: 0, height: 49.1, weight: 3.2, headCircumference: 33.9, chestCircumference: 32.5 },
    { ageLabel: "1 year", ageMonths: 12, height: 74.0, weight: 8.9, headCircumference: 44.9, chestCircumference: 45.0 },
    { ageLabel: "2 years", ageMonths: 24, height: 85.7, weight: 11.5, headCircumference: 47.2, chestCircumference: 48.0 },
    { ageLabel: "3 years", ageMonths: 36, height: 95.1, weight: 13.9, headCircumference: 48.5, chestCircumference: 50.0 },
    { ageLabel: "4 years", ageMonths: 48, height: 102.7, weight: 16.1, headCircumference: 49.4, chestCircumference: 51.8 },
    { ageLabel: "5 years", ageMonths: 60, height: 109.4, weight: 18.2, headCircumference: 49.9, chestCircumference: 53.0 },
];

export const DEFAULT_MUAC_CUTOFFS = {
    samBelow: 11.5,
    mamBelow: 12.5,
    healthyAbove: 12.5,
};

export const DEFAULT_PARAMETER_WEIGHTS = {
    weightWeight: 30, // 30%
    muacWeight: 35,   // 35%
    heightWeight: 15, // 15%
    headWeight: 10,   // 10%
    chestWeight: 10,  // 10%
};

export const DEFAULT_STAGE_THRESHOLDS = {
    samThreshold: 40,
    mamThreshold: 70,
    transitionThreshold: 85,
};
