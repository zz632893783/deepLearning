import { createRouter, createWebHistory } from 'vue-router'

export const routes = [
    {
        path: '',
        redirect: '/mnist'
    },
    {
        path: '/mnist',
        cName: 'a',
        component: () => import('../views/testPage.vue'),
    },
    {
        path: '/cifar10',
        cName: 'b',
        component: () => import('../views/testPage.vue'),
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})
