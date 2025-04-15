import { createApp } from 'vue';
import App from './App.vue'; // 创建一个新的根组件
import router from './router/index.js';

createApp(App).use(router).mount('#app');