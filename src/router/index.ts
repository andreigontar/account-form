import { createRouter, createWebHistory } from "vue-router";
import AccountForm from "@/components/AccountForm.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: AccountForm,
        },
    ],
});

export default router;
