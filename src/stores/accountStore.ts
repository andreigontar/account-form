import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { AccountRecord, AccountFormData, AccountLabel, UpdateAccountResult } from "@/types/account";

export const useAccountStore = defineStore("account", () => {
    const accounts = ref<AccountRecord[]>([]);
    const accountsCount = computed(() => accounts.value.length);

    // Загрузка данных из localStorage при инициализации
    const loadAccounts = (): void => {
        const saved = localStorage.getItem("accounts");
        if (saved) {
            try {
                accounts.value = JSON.parse(saved);
            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
                accounts.value = [];
            }
        }
    };

    // Сохранение данных в localStorage
    const saveAccounts = (): void => {
        localStorage.setItem("accounts", JSON.stringify(accounts.value));
    };

    // Преобразование строки меток в массив объектов
    const parseLabels = (labelsString: string): AccountLabel[] => {
        if (!labelsString.trim()) return [];

        return labelsString
            .split(";")
            .map((label) => label.trim())
            .filter((label) => label.length > 0)
            .map((label) => ({ text: label }));
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
        accounts.value.push(newAccount);
        return newAccount;
    };

    // Обновление учетной записи
    const updateAccount = (id: string, data: AccountFormData): UpdateAccountResult => {
        const accountIndex = accounts.value.findIndex((acc) => acc.id === id);
        if (accountIndex === -1) return false;

        const labels = parseLabels(data.labels);
        const password = data.recordType === "LDAP" ? null : data.password;

        accounts.value[accountIndex] = {
            ...accounts.value[accountIndex],
            labels,
            recordType: data.recordType,
            login: data.login,
            password,
        };

        saveAccounts();
        return { success: true };
    };

    // Получение данных формы для редактирования
    const getFormData = (id: string): AccountFormData | null => {
        const account = accounts.value.find((acc) => acc.id === id);
        if (!account) return null;

        return {
            labels: account.labels.map((label) => label.text).join("; "),
            recordType: account.recordType,
            login: account.login,
            password: account.password || "",
        };
    };

    return {
        accounts,
        accountsCount,
        loadAccounts,
        saveAccounts,
        addAccount,
        updateAccount,
        getFormData,
    };
});
