import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/quiz',
        name: 'Quiz',
        component: () => import('@/Quiz.vue'), // 假设这是问题页
    },
    {
        path: '/',
        name: 'Start',
        component: () => import('@/Start.vue'), // 当前存档页
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;