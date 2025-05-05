// api.js
import axios from 'axios';

// 创建一个 axios 实例
const apiClient = axios.create({
    // baseURL: "http://127.0.0.1:4523/m1/6211700-5905121-default/api/v1",
    // baseURL: "http://localhost:8080/api/v1",
    // baseURL: "http://192.168.137.1:8080/api/v1",
    // baseURL: "http://192.168.1.3:8080/api/v1",
    baseURL: "https://103.8.71.176:18080/api/v1",
    timeout: 10000000,
    headers: {'Content-Type': 'application/json'}
});

export default apiClient;