import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

// Dentro de axiosConfig.js
let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

// Agrega token automáticamente a cada request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        const refresh = localStorage.getItem("refresh");

        try {
          const res = await axios.post("http://localhost:8000/api/accounts/refresh/", {
            refresh,
          });

          const newAccess = res.data.access;
          localStorage.setItem("token", newAccess);
          instance.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`;
          onRefreshed(newAccess);
          isRefreshing = false;

          return instance(originalRequest);
        } catch (err) {
          isRefreshing = false;
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(err);
        }
      }

      return new Promise((resolve) => {
        subscribeTokenRefresh((token) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          resolve(instance(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);


export default instance;

