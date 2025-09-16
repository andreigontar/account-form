<template>
    <v-container class="pa-6">
        <!-- Заголовок и кнопка добавления -->
        <div class="d-flex align-center mb-6">
            <h1 class="text-h4 font-weight-bold">Учетные записи</h1>
            <v-btn
                color="primary"
                size="large"
                icon="mdi-plus"
                class="ml-4"
                @click="addNewAccount"
            />
        </div>

        <!-- Подсказка -->
        <v-alert type="info" variant="tonal" class="mb-6" density="compact">
            <template #prepend>
                <v-icon>mdi-help-circle</v-icon>
            </template>
            Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;
        </v-alert>

        <!-- Список учетных записей -->
        <div class="table-wrapper">
            <table class="account-table">
                <v-card v-if="accounts.length > 0" class="mb-4">
                    <v-card-title class="pa-0">
                        <v-list>
                            <v-list-item class="px-4 py-2">
                                <v-list-item-title class="text-subtitle-1 font-weight-medium">
                                    <v-row no-gutters>
                                        <v-col cols="3">Метки</v-col>
                                        <v-col cols="2">Тип записи</v-col>
                                        <v-col cols="3">Логин</v-col>
                                        <v-col cols="3">Пароль</v-col>
                                        <v-col cols="1"></v-col>
                                    </v-row>
                                </v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-card-title>

                    <v-divider />

                    <v-list>
                        <v-list-item 
                                v-for="account in accounts"
                                :key="account.id"
                                class="px-4 py-2"
                            >
                            <v-row no-gutters align="center">
                                <!-- Метки -->
                                <v-col cols="3" class="pr-2">
                                    <v-text-field
                                        v-model="formData[account.id].labels"
                                        variant="outlined"
                                        density="compact"
                                        hide-details
                                        placeholder="Введите метки"
                                        :maxlength="50"
                                        @blur="validateAndSave(account.id)"
                                    />
                                </v-col>

                                <!-- Тип записи -->
                                <v-col cols="2" class="pr-2">
                                    <v-select
                                        v-model="formData[account.id].recordType"
                                        :items="recordTypes"
                                        variant="outlined"
                                        density="compact"
                                        hide-details
                                        @update:model-value="validateAndSave(account.id)"
                                    />
                                </v-col>

                                <!-- Логин -->
                                <v-col cols="3" class="pr-2">
                                    <v-text-field
                                        v-model="formData[account.id].login"
                                        variant="outlined"
                                        density="compact"
                                        hide-details
                                        placeholder="Введите логин"
                                        :maxlength="100"
                                        :error="!!validationErrors[account.id]?.login"
                                        :error-messages="validationErrors[account.id]?.login"
                                        @blur="validateAndSave(account.id)"
                                    />
                                </v-col>

                                <!-- Пароль -->
                                <v-col cols="3" class="pr-2">
                                    <v-text-field
                                        v-if="formData[account.id].recordType === 'Локальная'"
                                        v-model="formData[account.id].password"
                                        :type="passwordVisible[account.id] ? 'text' : 'password'"
                                        variant="outlined"
                                        density="compact"
                                        hide-details
                                        placeholder="Введите пароль"
                                        :maxlength="100"
                                        :error="!!validationErrors[account.id]?.password"
                                        :error-messages="validationErrors[account.id]?.password"
                                        @blur="validateAndSave(account.id)"
                                    >
                                        <template #append-inner>
                                            <v-icon
                                                @click="togglePasswordVisibility(account.id)"
                                                :icon="
                                                    passwordVisible[account.id]
                                                        ? 'mdi-eye'
                                                        : 'mdi-eye-off'
                                                "
                                            />
                                        </template>
                                    </v-text-field>
                                </v-col>

                                <!-- Кнопка удаления -->
                                <v-col cols="1">
                                    <v-btn
                                        icon="mdi-delete"
                                        variant="text"
                                        color="error"
                                        size="small"
                                        @click="removeAccount(account.id)"
                                    />
                                </v-col>
                            </v-row>
                        </v-list-item>
                    </v-list>
                </v-card>

                <!-- Пустое состояние -->
                <v-card v-else class="text-center pa-8">
                    <v-card-text>
                        <v-icon size="64" color="grey-lighten-1" class="mb-4"
                            >mdi-account-multiple</v-icon
                        >
                        <h3 class="text-h6 mb-2">Нет учетных записей</h3>
                        <p class="text-body-2 text-grey">
                            Нажмите кнопку "+" для добавления первой учетной записи
                        </p>
                    </v-card-text>
                </v-card>
            </table>
        </div>
    </v-container>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, watch } from "vue";
import { useAccountStore } from "@/stores/accountStore";
import type { AccountFormData, ValidationErrors } from "@/types/account";

const accountStore = useAccountStore();

// Данные формы для каждой учетной записи
const formData = reactive<Record<string, AccountFormData>>({});
const validationErrors = reactive<Record<string, ValidationErrors>>({});
const passwordVisible = reactive<Record<string, boolean>>({});

// Опции для типа записи
const recordTypes = [
    { title: "Локальная", value: "Локальная" },
    { title: "LDAP", value: "LDAP" },
];

// Получение списка учетных записей
const accounts = computed(() => accountStore.accounts);

// Инициализация данных формы
const initializeFormData = () => {
    accountStore.accounts.forEach((account) => {
        const data = accountStore.getFormData(account.id);
        if (data) {
            formData[account.id] = { ...data };
        }
    });
};

// Добавление новой учетной записи
const addNewAccount = () => {
    const newAccount = accountStore.addAccount();
    formData[newAccount.id] = {
        labels: "",
        recordType: "Локальная",
        login: "",
        password: "",
    };
    validationErrors[newAccount.id] = {};
    passwordVisible[newAccount.id] = false;
};

// Удаление учетной записи
const removeAccount = (id: string) => {
    accountStore.removeAccount(id);
    delete formData[id];
    delete validationErrors[id];
    delete passwordVisible[id];
};

// Валидация и сохранение
const validateAndSave = (id: string) => {
    const data = formData[id];
    if (!data) return;

    const errors = accountStore.validateAccount(data);
    validationErrors[id] = errors;

    if (Object.keys(errors).length === 0) {
        accountStore.updateAccount(id, data);
    }
};

// Переключение видимости пароля
const togglePasswordVisibility = (id: string) => {
    passwordVisible[id] = !passwordVisible[id];
};

// Отслеживание изменений типа записи
watch(
    formData,
    (newFormData) => {
        Object.keys(newFormData).forEach((id) => {
            const data = newFormData[id];
            if (data && data.recordType === "LDAP") {
                data.password = "";
                passwordVisible[id] = false;
            }
        });
    },
    { deep: true },
);

// Инициализация при монтировании
onMounted(() => {
    accountStore.loadAccounts();
    initializeFormData();
});
</script>

<style scoped>
.table-wrapper {
    width: 100%;
    overflow-x: auto;
}

.account-table {
    min-width: 960px;
    width: 100%;
}
</style>
