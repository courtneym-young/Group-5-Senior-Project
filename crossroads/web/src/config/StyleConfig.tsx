import { BusinessStatusType } from "../types/business-types"

export const BUSINESS_STATUS_COLOR_MAPPING: Record<BusinessStatusType | "UNKNOWN", string> = {
    PENDING_REVIEW: "bg-orange-100 text-orange-800 border border-orange-100 dark:bg-gray-700 dark:border-orange-300 dark:text-orange-300",
    FLAGGED: "bg-red-100 text-red-800 border border-red-100 dark:border-red-400 dark:bg-gray-700 dark:text-red-400",
    VERIFIED: "bg-green-100 text-green-800 dark:bg-gray-700 dark:text-green-400 border border-green-100 dark:border-green-500",
    UNKNOWN : "bg-orange-100 text-orange-800 border border-orange-100 dark:bg-gray-700 dark:border-orange-300 dark:text-orange-300"
};

export const businessCategoriesToColor = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 60%, 60%)`;
};


export const getBusinessCategoryColor = (category: string): string => {
    return businessCategoriesToColor(category);
};

export const getTextColor = (bgColor: string): string => {
    // Convert Hex to RGB
    const hex = bgColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
  
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
    return luminance > 0.5 ? "#000000" : "#FFFFFF"; // Use black for light backgrounds, white for dark
  };