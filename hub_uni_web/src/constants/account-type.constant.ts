export const accountTypes = {
    Admin: "Admin",
    Manager: "Manager",
    Collaborator: "Collaborator",
    Student: "Student",
    Guest: "Guest",
} as const;

export type AccountTypeKey = keyof typeof accountTypes;