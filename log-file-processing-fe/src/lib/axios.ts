import { config } from "@/utils/config";
import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
    baseURL: `${config.apiBaseUrl}/api`,
    withCredentials: true,
});

api.interceptors.request.use(config => {
    const token = Cookies.get("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 403) {
            window.location.href = "/auth"; // Redirect to login page
        }
        return Promise.reject(error);
    }
);

export default api;