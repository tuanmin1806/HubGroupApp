import { ApiPaginationResponse } from "../models/api.model";
import { CreateCustomerRequest, CustomerFilterParams, CustomerResponse } from "../models/customer.model";
import baseApi from "./base.api";

const buildQueryString = (params?: CustomerFilterParams): string => {
    if (!params) return "";
    return new URLSearchParams(
        Object.entries(params)
            .filter(
                ([_, value]) => value !== undefined && value !== null && value !== ""
            )
            .map(([key, value]) => [key, String(value)])
    ).toString();
};

const customerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getCustomerByOrganizationWithPage: builder.query<ApiPaginationResponse<CustomerResponse[]>, CustomerFilterParams>({
            query: (params) => {
                const queryString = buildQueryString(params);
                return {
                    url: `customer/getbyorganization?${queryString}`,
                    method: "GET",
                };
            },
            transformResponse: (responseData: {
                Items: CustomerResponse[];
                Total: number;
            }): ApiPaginationResponse<CustomerResponse[]> => ({
                Items: responseData.Items,
                Total: responseData.Total,
            }),
        }),

        createCollabAccount: builder.mutation<void, CreateCustomerRequest>({
            query: (body) => ({
                url: "customer/addcollab",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const {
    useGetCustomerByOrganizationWithPageQuery,
} = customerApi;