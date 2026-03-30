import { useSelector } from "react-redux";
import { RootState } from "../app/store";

const ROUTE_PREFIX: Record<string, string> = {
    Manager: "/admin",
    Collaborator: "/staff",
    Student: "/",
};

export function useRoutePrefix(): string {
    const accountType = useSelector((state: RootState) => state.auth.user?.AccountType);
    return ROUTE_PREFIX[accountType as string] ?? "/";
}