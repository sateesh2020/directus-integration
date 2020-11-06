import axios from "axios";

import LocalStorageService from "./localStorage";
import { DIRECT_US_HOST } from "./constants";
// LocalstorageService
const localStorageService = LocalStorageService.getService();
// Create Instance
const axiosInstance = axios.create();

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorageService.getAccessToken();
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    // config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

//Add a response interceptor

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      //const refreshToken = localStorageService.getRefreshToken();
      return axios
        .post(`${DIRECT_US_HOST}/:project/auth/authenticate`, {
          email: "email@example.com",
          password: "d1r3ctu5",
        })
        .then((res) => {
          if (res.status === 201) {
            localStorageService.setToken(res.data.token);
            axios.defaults.headers.common["Authorization"] =
              "Bearer " + localStorageService.getAccessToken();
            return axios(originalRequest);
          }
        });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
