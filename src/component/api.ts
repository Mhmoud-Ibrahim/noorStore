import axios from 'axios';

const api = axios.create({
    baseURL:"https://noor-server-ts.vercel.app",
    withCredentials: true 
});

export default api;
