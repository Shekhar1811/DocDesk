import axios from "axios";
import { API_URL } from "../constants";
import TokenService from "./token.service";
import authService from "./auth.service";

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const assetInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
    "Accept": "application/json",
  },
});

const setAuthHeaders = (config) => {
  const username = TokenService.getUserName();
  const token = TokenService.getLocalAccessToken();

  if (token && config.url && !config.url.endsWith("/sign-in") && !config.url.endsWith("/print-invoice")) {
    config.headers["Authorization"] = "Bearer " + token;
  }

  if (username) {
    config.headers["userEmail"] = username;
  }

  return config;
};

// Apply the request interceptor to both instances
instance.interceptors.request.use(setAuthHeaders, (error) => {
  return Promise.reject(error);
});

assetInstance.interceptors.request.use(setAuthHeaders, (error) => {
  return Promise.reject(error);
});

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    if (originalConfig) {
      if (originalConfig.url.split("/").pop() !== "login" && err.response) {
        // Access Token was expired
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;
          authService.logout();
          window.location.replace("/sign-in");
        }
      }
    }
    return Promise.reject(err);
  }
);

export default instance;
