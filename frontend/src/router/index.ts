import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'root',
        redirect: '/admin/categories'
    },
    {
        path: '/admin',
        name: 'admin-layout',
        component: () => import('@/layouts/AdminLayout.vue'),
        children: [
            {
                path: 'categories',
                name: 'admin-categories',
                component: () => import('@/views/admin/CategoryManageView.vue')
            }
        ]
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;