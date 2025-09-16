import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { AccountRecord, AccountFormData, AccountLabel, UpdateAccountResult } from "@/types/account";

export const useAccountStore = defineStore("account", () => {
    const accounts = ref<AccountRecord[]>([]);
    const accountsCount = computed(() => accounts.value.length);

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
        getFormData,
        addAccount
    };
});
