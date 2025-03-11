
import { AdminRoutes, CustomerRoutes, BusinessOwnerRoutes } from "src/types/route-types"

export type AppRoutesType = {
    ADMIN: AdminRoutes
    CUSTOMER: CustomerRoutes
    BUSINESS_OWNER: BusinessOwnerRoutes
}

export const APP_ROUTES: AppRoutesType = {
    ADMIN: {
        BASE: '/admin',
        USERS: '/admin/users',
        BUSINESSES: '/admin/businesses',
        LOGS: '/admin/logs',
        REVIEWS: '/admin/reviews',
        CROSSROADS_SETTINGS: '/admin/crossroads-settings',
    },
    CUSTOMER: {
        EXPLORE: '/customer/explore',
        MY_REVIEWS: '/customer/my-reviews',
        SUBSCRIPTIONS: '/customer/subscriptions',
    },
    BUSINESS_OWNER: {
        BASE: '/business-owner/dashboard',
        MY_BUSINESS: '/business-owner/my-business',
    }
} as const;
