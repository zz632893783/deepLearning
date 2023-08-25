import { createRouter, createWebHistory } from 'vue-router'

export const routes = [
    {
        path: '',
        redirect: '/mnist'
    },
    {
        path: '/mnist',
        // name: 'templateSyntax',
        cName: '手写数字识别',
        component: () => import('../views/testPage.vue'),
    },
    {
        path: '/cifar10',
        cName: '图像10分类',
        component: () => import('@/views/testPage.vue'),
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})
