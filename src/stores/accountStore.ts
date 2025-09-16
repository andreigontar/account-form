import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { AccountRecord, AccountFormData, AccountLabel, UpdateAccountResult } from "@/types/account";

export const useAccountStore = defineStore("account", () => {
    const accounts = ref<AccountRecord[]>([]);
    const accountsCount = computed(() => accounts.value.length);



    return {
        accounts,
        accountsCount,
    };
});
