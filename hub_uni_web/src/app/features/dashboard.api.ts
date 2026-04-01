import { DashboardModel } from "../models/dashboard.model";
import baseApi from "./base.api";
import { TAG_TYPES } from "./tags";

const dashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDashboard: builder.query<DashboardModel, string>({
            query: (orgId: string) => `dashboard/getdashboard/${orgId}`,
            providesTags: [TAG_TYPES.DASHBOARD],
        }),
    }),
});

export const { useGetDashboardQuery } = dashboardApi;