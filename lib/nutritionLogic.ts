/**
 * WHO Child Growth & Nutrition Logic Engine
 * Dynamically compares every child's month-wise anthropometric measurements:
 * 1. Height (cm) vs WHO reference (Boys & Girls from Birth to 5 Years)
 * 2. Weight (kg) vs WHO reference (Boys & Girls from Birth to 5 Years)
 * 3. Head circumference (cm) vs WHO reference (Boys & Girls from Birth to 5 Years)
 * 4. Chest circumference (cm) vs WHO standard norms
 * 5. MUAC (cm) vs WHO clinical cutoffs (SAM < 11.5, MAM 11.5–12.4, Normal >= 12.5)
 * 
 * Computes individual parameter progress percentages and composite live recovery dashboard score.
 * Fully configurable via the Admin Panel.
 */

import {
    DEFAULT_BOYS_REFERENCE,
    DEFAULT_GIRLS_REFERENCE,
    DEFAULT_MUAC_CUTOFFS,
    DEFAULT_PARAMETER_WEIGHTS,
    DEFAULT_STAGE_THRESHOLDS,
    IGrowthMilestone,
    INutritionLogicConfigData,
} from "@/lib/nutritionLogicTypes";

export interface ChildDataInput {
    weight: number;
    height: number;
    muac: number; // in cm
    head?: number; // in cm
    chest?: number; // in cm
    sex?: string; // "Male" | "Female"
    age?: string; // e.g. "2year11 months", "1 Year 8 Months", "4y 3 m"
    dateOfBirth?: string;
    dateOfEntry?: string;
    anthropometricMeasurement?: string;
    last14DaysIllness?: string;
    ebf?: string;
    immunization?: string;
    baselineWeight?: number;
    targetWeight?: number;
    baselineMuac?: number;
    targetMuac?: number;
    customRecoveryPercentage?: number;
    previousMonthData?: {
        weight?: number;
        height?: number;
        muac?: number;
        head?: number;
        chest?: number;
        reportMonth?: string;
    };
}

export type NutritionStage = "SAM" | "MAM" | "Nutritional Transition" | "Healthy / Nourished";

export interface ParameterComparison {
    actual: number;
    expected: number;
    ratioPercentage: number; // e.g. 98.5%
    score: number; // Score achieved out of max allocated points
    maxScore: number;
    status: "Deficit" | "Borderline" | "Adequate" | "Optimal";
    delta?: number | null; // Month-over-month change if previous month provided
}

export interface ChildNutritionAnalysis {
    percentage: number; // Overall composite recovery score (0 - 100%)
    stage: NutritionStage;
    stageColor: {
        bg: string;
        text: string;
        border: string;
        accent: string;
    };
    muacStatus: {
        label: string;
        color: string;
        badgeColor: string;
    };
    weightGainKg: number | null;
    statusSummary: string;
    recommendation: string;
    ageMonths: number;
    sex: "Male" | "Female";
    // 5-Parameter detailed WHO comparisons
    parameters: {
        height: ParameterComparison;
        weight: ParameterComparison;
        head: ParameterComparison;
        chest: ParameterComparison;
        muac: ParameterComparison;
    };
    breakdown: {
        muacScore: number;
        weightScore: number;
        heightScore: number;
        headScore: number;
        chestScore: number;
        healthBonus?: number;
    };
}

export interface LogicConfigInput {
    boysReference?: IGrowthMilestone[];
    girlsReference?: IGrowthMilestone[];
    muacCutoffs?: {
        samBelow: number;
        mamBelow: number;
        healthyAbove: number;
    };
    parameterWeights?: {
        weightWeight: number;
        muacWeight: number;
        heightWeight: number;
        headWeight: number;
        chestWeight: number;
    };
    stageThresholds?: {
        samThreshold: number;
        mamThreshold: number;
        transitionThreshold: number;
    };
}

/**
 * Parses age string into numeric months (0 to 72)
 * Handles: "2year11 months", "1 Year 8 Months", "4y 3 m", "2 Years", "6 months", "Birth"
 */
export function parseAgeInMonths(ageStr?: string, dob?: string, entryDate?: string): number {
    if (dob && entryDate) {
        try {
            const birth = new Date(dob);
            const entry = new Date(entryDate);
            if (!isNaN(birth.getTime()) && !isNaN(entry.getTime())) {
                const diffTime = Math.max(0, entry.getTime() - birth.getTime());
                const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30.4375);
                if (diffMonths >= 0 && diffMonths <= 120) {
                    return Math.round(diffMonths);
                }
            }
        } catch {
            // fallback to regex parsing
        }
    }

    if (!ageStr) return 24; // Default to 2 years if unknown

    const str = ageStr.toLowerCase().trim();
    if (str.includes("birth")) return 0;

    let totalMonths = 0;
    let found = false;

    // Match years: e.g. "2year", "2 year", "2y", "2 yrs"
    const yearMatch = str.match(/(\d+)\s*(?:year|yr|y)/);
    if (yearMatch) {
        totalMonths += parseInt(yearMatch[1], 10) * 12;
        found = true;
    }

    // Match months: e.g. "11 months", "11 month", "11m", "11 mo"
    const monthMatch = str.match(/(\d+)\s*(?:month|mo|m)(?!.*year)/);
    if (monthMatch) {
        totalMonths += parseInt(monthMatch[1], 10);
        found = true;
    }

    // If pure number like "24"
    if (!found) {
        const num = parseFloat(str);
        if (!isNaN(num)) {
            return num <= 10 ? Math.round(num * 12) : Math.round(num);
        }
        return 24;
    }

    return Math.min(72, Math.max(0, totalMonths));
}

/**
 * Linear interpolation between WHO growth reference milestones
 */
export function interpolateMilestone(
    ageMonths: number,
    referenceTable: IGrowthMilestone[]
): IGrowthMilestone {
    if (!referenceTable || referenceTable.length === 0) {
        return DEFAULT_BOYS_REFERENCE[2]; // Fallback to 2-year boy
    }

    // If age is less than or equal to first milestone (Birth)
    if (ageMonths <= referenceTable[0].ageMonths) {
        return referenceTable[0];
    }

    // If age is greater than or equal to last milestone (5 years / 60 months)
    const last = referenceTable[referenceTable.length - 1];
    if (ageMonths >= last.ageMonths) {
        return last;
    }

    // Find the bounding milestones
    for (let i = 0; i < referenceTable.length - 1; i++) {
        const curr = referenceTable[i];
        const next = referenceTable[i + 1];

        if (ageMonths >= curr.ageMonths && ageMonths <= next.ageMonths) {
            const span = next.ageMonths - curr.ageMonths;
            const t = span > 0 ? (ageMonths - curr.ageMonths) / span : 0;

            return {
                ageLabel: `${Math.round(ageMonths)} months`,
                ageMonths,
                height: Number((curr.height + t * (next.height - curr.height)).toFixed(1)),
                weight: Number((curr.weight + t * (next.weight - curr.weight)).toFixed(2)),
                headCircumference: Number((curr.headCircumference + t * (next.headCircumference - curr.headCircumference)).toFixed(1)),
                chestCircumference: Number((curr.chestCircumference + t * (next.chestCircumference - curr.chestCircumference)).toFixed(1)),
            };
        }
    }

    return last;
}

/**
 * Main Calculation Engine:
 * Compares actual child parameters against WHO reference standards and calculates
 * the real-time recovery % and stage.
 */
export function calculateChildNutritionStatus(
    data: ChildDataInput,
    config?: LogicConfigInput
): ChildNutritionAnalysis {
    const boysRef = config?.boysReference && config.boysReference.length > 0 ? config.boysReference : DEFAULT_BOYS_REFERENCE;
    const girlsRef = config?.girlsReference && config.girlsReference.length > 0 ? config.girlsReference : DEFAULT_GIRLS_REFERENCE;
    const muacCutoffs = config?.muacCutoffs || DEFAULT_MUAC_CUTOFFS;
    const weights = config?.parameterWeights || DEFAULT_PARAMETER_WEIGHTS;
    const thresholds = config?.stageThresholds || DEFAULT_STAGE_THRESHOLDS;

    const sex: "Male" | "Female" = (data.sex || "").toLowerCase().startsWith("f") ? "Female" : "Male";
    const refTable = sex === "Female" ? girlsRef : boysRef;

    const ageMonths = parseAgeInMonths(data.age, data.dateOfBirth, data.dateOfEntry);
    const expected = interpolateMilestone(ageMonths, refTable);

    const actualWeight = Number(data.weight) || 0;
    const actualHeight = Number(data.height) || 0;
    const actualMuac = Number(data.muac) || 0;
    const actualHead = Number(data.head) || 0;
    const actualChest = Number(data.chest) || 0;

    // Previous month tracking
    const prev = data.previousMonthData;
    const deltaWeight = prev?.weight != null && actualWeight > 0 ? Number((actualWeight - prev.weight).toFixed(2)) : null;
    const deltaHeight = prev?.height != null && actualHeight > 0 ? Number((actualHeight - prev.height).toFixed(1)) : null;
    const deltaMuac = prev?.muac != null && actualMuac > 0 ? Number((actualMuac - prev.muac).toFixed(1)) : null;
    const deltaHead = prev?.head != null && actualHead > 0 ? Number((actualHead - prev.head).toFixed(1)) : null;
    const deltaChest = prev?.chest != null && actualChest > 0 ? Number((actualChest - prev.chest).toFixed(1)) : null;

    // 1. HEIGHT EVALUATION (Max: weights.heightWeight, default 15 pts)
    const expectedHeight = expected.height > 0 ? expected.height : 80;
    const heightRatio = actualHeight > 0 ? Number(((actualHeight / expectedHeight) * 100).toFixed(1)) : 80;
    // Normal height for age is 95-105% of WHO median
    let heightScoreFraction = 0;
    if (heightRatio >= 95) heightScoreFraction = 1.0;
    else if (heightRatio >= 90) heightScoreFraction = 0.85;
    else if (heightRatio >= 85) heightScoreFraction = 0.65;
    else heightScoreFraction = Math.max(0.2, heightRatio / 100);
    const heightScore = Number((heightScoreFraction * weights.heightWeight).toFixed(1));

    // 2. WEIGHT EVALUATION (Max: weights.weightWeight, default 30 pts)
    const expectedWeight = expected.weight > 0 ? expected.weight : 11;
    const weightRatio = actualWeight > 0 ? Number(((actualWeight / expectedWeight) * 100).toFixed(1)) : 65;
    // Normal weight for age is >= 90% of WHO median. Moderate deficit: 75-89%, Severe: < 75%
    let weightScoreFraction = 0;
    if (weightRatio >= 90) weightScoreFraction = 1.0;
    else if (weightRatio >= 80) weightScoreFraction = 0.75 + ((weightRatio - 80) / 10) * 0.25;
    else if (weightRatio >= 65) weightScoreFraction = 0.40 + ((weightRatio - 65) / 15) * 0.35;
    else weightScoreFraction = Math.max(0.1, (weightRatio / 65) * 0.40);
    const weightScore = Number((weightScoreFraction * weights.weightWeight).toFixed(1));

    // 3. MUAC EVALUATION (Max: weights.muacWeight, default 35 pts)
    let muacScore = 0;
    let muacRatio = 0;
    if (actualMuac < muacCutoffs.samBelow) {
        // Severe Acute Malnutrition (below 11.5 cm)
        const progress = Math.max(0, (actualMuac - 8.5) / (muacCutoffs.samBelow - 8.5));
        muacScore = progress * (weights.muacWeight * 0.40); // 0 to ~14 pts
        muacRatio = Number(((actualMuac / muacCutoffs.healthyAbove) * 100).toFixed(1));
    } else if (actualMuac < muacCutoffs.mamBelow) {
        // Moderate Acute Malnutrition (11.5 to 12.4 cm)
        const progress = (actualMuac - muacCutoffs.samBelow) / (muacCutoffs.mamBelow - muacCutoffs.samBelow);
        muacScore = (weights.muacWeight * 0.40) + progress * (weights.muacWeight * 0.45); // ~14 to ~29 pts
        muacRatio = Number(((actualMuac / muacCutoffs.healthyAbove) * 100).toFixed(1));
    } else {
        // Normal / Recovered (>= 12.5 cm)
        const bonus = Math.min(1, (actualMuac - muacCutoffs.healthyAbove) / 2.0);
        muacScore = (weights.muacWeight * 0.85) + bonus * (weights.muacWeight * 0.15); // ~30 to 35 pts
        muacRatio = Number(((actualMuac / muacCutoffs.healthyAbove) * 100).toFixed(1));
    }
    muacScore = Number(muacScore.toFixed(1));

    // 4. HEAD CIRCUMFERENCE EVALUATION (Max: weights.headWeight, default 10 pts)
    const expectedHead = expected.headCircumference > 0 ? expected.headCircumference : 47;
    const headRatio = actualHead > 0 ? Number(((actualHead / expectedHead) * 100).toFixed(1)) : 95;
    let headScoreFraction = 0;
    if (headRatio >= 95 && headRatio <= 105) headScoreFraction = 1.0;
    else if (headRatio >= 90) headScoreFraction = 0.8;
    else headScoreFraction = Math.max(0.3, headRatio / 100);
    const headScore = Number((headScoreFraction * weights.headWeight).toFixed(1));

    // 5. CHEST CIRCUMFERENCE EVALUATION (Max: weights.chestWeight, default 10 pts)
    const expectedChest = expected.chestCircumference > 0 ? expected.chestCircumference : 48;
    const chestRatio = actualChest > 0 ? Number(((actualChest / expectedChest) * 100).toFixed(1)) : 95;
    let chestScoreFraction = 0;
    if (chestRatio >= 93) chestScoreFraction = 1.0;
    else if (chestRatio >= 85) chestScoreFraction = 0.75;
    else chestScoreFraction = Math.max(0.3, chestRatio / 100);
    const chestScore = Number((chestScoreFraction * weights.chestWeight).toFixed(1));

    // Composite Recovery Score (%)
    const totalScore = Number((weightScore + muacScore + heightScore + headScore + chestScore).toFixed(0));

    // Allow manual admin override if present
    const percentage = (typeof data.customRecoveryPercentage === "number" && data.customRecoveryPercentage >= 0 && data.customRecoveryPercentage <= 100)
        ? data.customRecoveryPercentage
        : Math.min(100, Math.max(5, totalScore));

    // Nutritional Stage Classification
    let stage: NutritionStage;
    let stageColor: ChildNutritionAnalysis["stageColor"];

    if (percentage < thresholds.samThreshold || actualMuac < muacCutoffs.samBelow) {
        stage = "SAM";
        stageColor = {
            bg: "bg-red-50",
            text: "text-red-700",
            border: "border-red-300",
            accent: "#EF4444",
        };
    } else if (percentage < thresholds.mamThreshold || actualMuac < muacCutoffs.mamBelow) {
        stage = "MAM";
        stageColor = {
            bg: "bg-amber-50",
            text: "text-amber-800",
            border: "border-amber-300",
            accent: "#F59E0B",
        };
    } else if (percentage < thresholds.transitionThreshold) {
        stage = "Nutritional Transition";
        stageColor = {
            bg: "bg-blue-50",
            text: "text-blue-800",
            border: "border-blue-300",
            accent: "#3B82F6",
        };
    } else {
        stage = "Healthy / Nourished";
        stageColor = {
            bg: "bg-emerald-50",
            text: "text-emerald-800",
            border: "border-emerald-300",
            accent: "#10B981",
        };
    }

    // MUAC Status Label & Colors
    let muacStatus: ChildNutritionAnalysis["muacStatus"];
    if (actualMuac < muacCutoffs.samBelow) {
        muacStatus = {
            label: `SAM (<${muacCutoffs.samBelow} cm) - Severe Acute Malnutrition`,
            color: "text-red-600",
            badgeColor: "bg-red-100 text-red-700 border-red-200",
        };
    } else if (actualMuac < muacCutoffs.mamBelow) {
        muacStatus = {
            label: `MAM (${muacCutoffs.samBelow}-${muacCutoffs.mamBelow - 0.1} cm) - Moderate Malnutrition`,
            color: "text-amber-600",
            badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
        };
    } else {
        muacStatus = {
            label: `Normal (≥${muacCutoffs.healthyAbove} cm) - Healthy Growth`,
            color: "text-emerald-600",
            badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
        };
    }

    // Status Summary & Recommendations
    let statusSummary = "";
    let recommendation = "";

    if (stage === "SAM") {
        statusSummary = "Severe Acute Malnutrition (Requires Intensive Therapeutic Protocol)";
        recommendation = "Provide therapeutic ready-to-use food (RUTF), hydration monitoring, weekly MUAC and weight tracking.";
    } else if (stage === "MAM") {
        statusSummary = "Moderate Acute Malnutrition (Progressing Towards Clinical Recovery)";
        recommendation = "Maintain protein-dense supplementary khichdi, eggs, weekly anthropometric evaluation, and maternal counselling.";
    } else if (stage === "Nutritional Transition") {
        statusSummary = "Nutritional Transition (Steady Physical & Anthropometric Gain)";
        recommendation = "Maintain diversified family diet, micronutrient supplements, and bi-weekly community health check-ups.";
    } else {
        statusSummary = "Nutritionally Healthy & Stabilized";
        recommendation = "Growth benchmarks successfully achieved against WHO median. Continue balanced diet and health monitoring.";
    }

    const determineStatus = (ratio: number): "Deficit" | "Borderline" | "Adequate" | "Optimal" => {
        if (ratio >= 95) return "Optimal";
        if (ratio >= 88) return "Adequate";
        if (ratio >= 78) return "Borderline";
        return "Deficit";
    };

    return {
        percentage,
        stage,
        stageColor,
        muacStatus,
        weightGainKg: deltaWeight,
        statusSummary,
        recommendation,
        ageMonths,
        sex,
        parameters: {
            height: {
                actual: actualHeight,
                expected: expected.height,
                ratioPercentage: heightRatio,
                score: heightScore,
                maxScore: weights.heightWeight,
                status: determineStatus(heightRatio),
                delta: deltaHeight,
            },
            weight: {
                actual: actualWeight,
                expected: expected.weight,
                ratioPercentage: weightRatio,
                score: weightScore,
                maxScore: weights.weightWeight,
                status: determineStatus(weightRatio),
                delta: deltaWeight,
            },
            head: {
                actual: actualHead,
                expected: expected.headCircumference,
                ratioPercentage: headRatio,
                score: headScore,
                maxScore: weights.headWeight,
                status: determineStatus(headRatio),
                delta: deltaHead,
            },
            chest: {
                actual: actualChest,
                expected: expected.chestCircumference,
                ratioPercentage: chestRatio,
                score: chestScore,
                maxScore: weights.chestWeight,
                status: determineStatus(chestRatio),
                delta: deltaChest,
            },
            muac: {
                actual: actualMuac,
                expected: muacCutoffs.healthyAbove,
                ratioPercentage: muacRatio,
                score: muacScore,
                maxScore: weights.muacWeight,
                status: actualMuac >= muacCutoffs.healthyAbove ? "Optimal" : actualMuac >= muacCutoffs.samBelow ? "Borderline" : "Deficit",
                delta: deltaMuac,
            },
        },
        breakdown: {
            muacScore: Math.round(muacScore),
            weightScore: Math.round(weightScore),
            heightScore: Math.round(heightScore),
            headScore: Math.round(headScore),
            chestScore: Math.round(chestScore),
        },
    };
}

/**
 * Derives and formats the Report Month (e.g. "February 2026")
 * using explicit reportMonth or by extracting month/year from dateOfEntry.
 */
export function formatReportMonth(dateOfEntry?: string, explicitMonth?: string): string {
    if (explicitMonth && explicitMonth.trim()) return explicitMonth.trim();
    if (!dateOfEntry) return "Current Month";

    const parts = dateOfEntry.split(/[\/\-]/);
    if (parts.length === 3) {
        let monthNum = 0;
        let yearNum = 0;
        if (parts[0].length === 4) {
            yearNum = parseInt(parts[0], 10);
            monthNum = parseInt(parts[1], 10);
        } else {
            monthNum = parseInt(parts[0], 10);
            yearNum = parseInt(parts[2], 10);
        }
        if (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12 && !isNaN(yearNum)) {
            const date = new Date(yearNum, monthNum - 1, 1);
            return date.toLocaleString("en-US", { month: "long", year: "numeric" });
        }
    }
    return dateOfEntry;
}

/**
 * Calculates the next chronological month name
 * e.g. "November 2026" -> "December 2026", "December 2026" -> "January 2027"
 */
export function getNextMonthName(currentMonthStr?: string): string {
    if (!currentMonthStr) {
        const next = new Date();
        next.setMonth(next.getMonth() + 1);
        return next.toLocaleString("en-US", { month: "long", year: "numeric" });
    }
    const parts = currentMonthStr.trim().split(/\s+/);
    if (parts.length === 2) {
        const monthName = parts[0];
        const yearNum = parseInt(parts[1], 10);
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const idx = months.findIndex(m => m.toLowerCase().startsWith(monthName.toLowerCase().slice(0, 3)));
        if (idx !== -1 && !isNaN(yearNum)) {
            const nextIdx = (idx + 1) % 12;
            const nextYear = idx === 11 ? yearNum + 1 : yearNum;
            return `${months[nextIdx]} ${nextYear}`;
        }
    }
    const next = new Date();
    next.setMonth(next.getMonth() + 1);
    return next.toLocaleString("en-US", { month: "long", year: "numeric" });
}
