import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

export const routes = [
    {
        path: '',
        redirect: '/cifar10'
    },
    {
        path: '/cifar10',
        cName: '图像10分类',
        component: () => import('../views/cifar10/index.vue')
    },
    {
        path: '/mnist',
        cName: '手写数字识别',
        component: () => import('../views/mnist/index.vue')
    },
    {
        path: '/mobileNet',
        cName: '迁移学习',
        component: () => import('../views/mobileNet/index.vue')
    }
]

export const router = createRouter({
    // history: createWebHistory(),
    history: createWebHashHistory(),
    routes
})
