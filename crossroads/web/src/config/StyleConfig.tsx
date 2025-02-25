import { BusinessStatusType } from "../types/business-types"

export const BUSINESS_STATUS_COLOR_MAPPING: Record<BusinessStatusType | "UNKNOWN", string> = {
    PENDING_REVIEW: "bg-orange-100 text-orange-800 border border-orange-100 dark:bg-gray-700 dark:border-orange-300 dark:text-orange-300",
    FLAGGED: "bg-red-100 text-red-800 border border-red-100 dark:border-red-400 dark:bg-gray-700 dark:text-red-400",
    VERIFIED: "bg-green-100 text-green-800 dark:bg-gray-700 dark:text-green-400 border border-green-100 dark:border-green-500",
    UNKNOWN : "bg-orange-100 text-orange-800 border border-orange-100 dark:bg-gray-700 dark:border-orange-300 dark:text-orange-300"
};

