export type AccountLabel = {
    text: string;
}

export type AccountRecord = {
    id: string;
    labels: AccountLabel[];
    recordType: "LDAP" | "Локальная";
    login: string;
    password: string | null;
}

export type AccountFormData = {
    labels: string;
    recordType: "LDAP" | "Локальная";
    login: string;
    password: string;
}

export type ValidationErrors = {
    login?: string;
    password?: string;
}

export type UpdateAccountResult = 
    | { success: true }
    | { success: false; errors: Record<string, string> }
    | false;
