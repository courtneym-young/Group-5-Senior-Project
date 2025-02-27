export type AppRouteType = 'USERS' | 'BUSINESSES' | 'LOGS' | "REVIEWS" | "CROSSROADS_SETTINGS";

export const APP_ROUTES: Record<AppRouteType, string> = {
    USERS: "/users",
    BUSINESSES: "/businesses",
    LOGS: "/logs",
    REVIEWS: "/reviews",
    CROSSROADS_SETTINGS : '/crossroads-settings'
};
