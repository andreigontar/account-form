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
                <v-card class="mb-4">
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
                        <v-list-item class="px-4 py-2">
                            <v-row no-gutters align="center">
                                <!-- Метки -->
                                <v-col cols="3" class="pr-2">
                                    <v-text-field
                                        variant="outlined"
                                        density="compact"
                                        hide-details
                                        placeholder="Введите метки"
                                        :maxlength="50"
                                    />
                                </v-col>

                                <!-- Тип записи -->
                                <v-col cols="2" class="pr-2">
                                    <v-select
                                        variant="outlined"
                                        density="compact"
                                        hide-details
                                        :items="recordTypes"
                                    />
                                </v-col>

                                <!-- Логин -->
                                <v-col cols="3" class="pr-2">
                                    <v-text-field
                                        variant="outlined"
                                        density="compact"
                                        hide-details
                                        placeholder="Введите логин"
                                        :maxlength="100"
                                    />
                                </v-col>

                                <!-- Пароль -->
                                <v-col cols="3" class="pr-2">
                                    <v-text-field
                                        type="password"
                                        variant="outlined"
                                        density="compact"
                                        hide-details
                                        placeholder="Введите пароль"
                                        :maxlength="100"
                                    >
                                        <template #append-inner>
                                            <v-icon icon="mdi-eye-off" />
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
                                    />
                                </v-col>
                            </v-row>
                        </v-list-item>
                    </v-list>
                </v-card>
            </table>
        </div>
    </v-container>
</template>

<script setup lang="ts">
// Опции для типа записи
const recordTypes = [
    { title: "Локальная", value: "Локальная" },
    { title: "LDAP", value: "LDAP" },
];
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
