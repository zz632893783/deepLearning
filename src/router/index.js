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
        component: () => import('../views/mnist/index.vue')
    },
    {
        path: '/cifar10',
        // name: 'templateSyntax',
        cName: '图像10分类',
        component: () => import('../views/cifar10/index.vue')
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})
