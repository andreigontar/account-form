import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { AccountRecord, AccountFormData, AccountLabel, UpdateAccountResult } from "@/types/account";

export const useAccountStore = defineStore("account", () => {

    const accounts = ref<Map<string, AccountRecord>>(new Map());
    const parseLabelsCache = new Map<string, AccountLabel[]>();
    
    // Helper методы для работы с Map
    const getAccount = (id: string): AccountRecord | undefined => {
        return accounts.value.get(id);
    };
    
    const getAllAccounts = (): AccountRecord[] => {
        return Array.from(accounts.value.values());
    };
    
    const getAccountsCount = (): number => {
        return accounts.value.size;
    };
    
    const hasAccount = (id: string): boolean => {
        return accounts.value.has(id);
    };

    // Загрузка данных из localStorage при инициализации
    const loadAccounts = (): void => {
        const saved = localStorage.getItem("accounts");
        if (saved) {
            try {
                const accountsArray = JSON.parse(saved);
                accounts.value = new Map(accountsArray.map((account: AccountRecord) => [account.id, account]));
            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
                accounts.value = new Map();
            }
        }
    };

    // Сохранение данных в localStorage
    const saveAccounts = (): void => {
        localStorage.setItem("accounts", JSON.stringify(getAllAccounts()));
    };

    // Преобразование строки меток в массив объектов
    const parseLabels = (labelsString: string): AccountLabel[] => {
        if (!labelsString) return [];
        
        if (parseLabelsCache.has(labelsString)) {
            return parseLabelsCache.get(labelsString)!;
        }

        const result: AccountLabel[] = [];
        const parts = labelsString.split(";");
        
        for (let i = 0; i < parts.length; i++) {
            const trimmed = parts[i].trim();
            if (trimmed.length > 0) {
                result.push({ text: trimmed });
            }
        }
        
        parseLabelsCache.set(labelsString, result);
        return result;
    };

    // Валидация формы
    const validateAccount = (data: AccountFormData): Record<string, string> => {
        const errors: Record<string, string> = {};

        if (!data.login.trim()) {
            errors.login = "Логин обязателен для заполнения";
        } else if (data.login.length > 100) {
            errors.login = "Логин не должен превышать 100 символов";
        }

        if (data.recordType === "Локальная") {
            if (!data.password.trim()) {
                errors.password = "Пароль обязателен для заполнения";
            } else if (data.password.length > 100) {
                errors.password = "Пароль не должен превышать 100 символов";
            }
        }

        return errors;
    };

    // Добавление новой учетной записи
    const addAccount = (): AccountRecord => {
        const newAccount: AccountRecord = {
            id: Date.now().toString(),
            labels: [],
            recordType: "Локальная",
            login: "",
            password: "",
        };
        accounts.value.set(newAccount.id, newAccount);
        saveAccounts();
        return newAccount;
    };

    // Обновление учетной записи
    const updateAccount = (id: string, data: AccountFormData): UpdateAccountResult => {
        const existingAccount = getAccount(id);
        if (!existingAccount) return false;

        const errors = validateAccount(data);
        if (Object.keys(errors).length > 0) {
            return { success: false, errors };
        }

        const labels = parseLabels(data.labels);
        const password = data.recordType === "LDAP" ? null : data.password;

        accounts.value.set(id, {
            ...existingAccount,
            labels,
            recordType: data.recordType,
            login: data.login,
            password,
        });

        saveAccounts();
        return { success: true };
    };

    // Удаление учетной записи
    const removeAccount = (id: string): void => {
        if (hasAccount(id)) {
            accounts.value.delete(id);
            saveAccounts();
        }
    };

    // Получение данных формы для редактирования
    const getFormData = (id: string): AccountFormData | null => {
        const account = getAccount(id);
        if (!account) return null;

        let labelsString = "";
        const labels = account.labels;
        const labelsLength = labels.length;
        
        if (labelsLength > 0) {
            labelsString = labels[0].text;
            for (let i = 1; i < labelsLength; i++) {
                labelsString += "; " + labels[i].text;
            }
        }

        return {
            labels: labelsString,
            recordType: account.recordType,
            login: account.login,
            password: account.password ?? "",
        };
    };

    return {
        // Основные данные
        accounts,
        
        // Helper методы для работы с Map
        getAccount,
        getAllAccounts,
        getAccountsCount,
        hasAccount,
        
        // CRUD операции
        loadAccounts,
        saveAccounts,
        addAccount,
        updateAccount,
        removeAccount,
        getFormData,
        validateAccount,
    };
});
