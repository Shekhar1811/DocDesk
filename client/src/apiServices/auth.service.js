import axios from "axios";

import api from "./api";
import { API_URL } from "../constants";

class AuthService {
  login(email, password) {
    return api
      .post("api/login", {
        email,
        password,
      })
      .then((response) => {
        if (response.status === 200 && !response.data.error) {
          if (response.data.success) {
            localStorage.setItem("user", JSON.stringify(response.data.data));
            return true;
          }
          return false;
        } else {
          return false;
        }
      }) /* .catch((error) => {
        console.log(error);
        reject(error);
      }) */;
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username, email, password) {
    return axios.post(API_URL + "signup", {
      username,
      email,
      password,
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  isLoggedIn = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return !!(user && (user.token || user.access_token));
    } catch (e) {
      return false;
    }
  };

  isAdminUser = () => {
    const userInfo = this.getCurrentUser();
    if (userInfo.is_admin == "1") {
      return true;
    }
    return false;
  };

  isSuperAdminUser = () => {
    const userInfo = this.getCurrentUser();
    if (userInfo.email == "saurabhw@ecsion.com") {
      return true;
    }
    return false;
  };
}

export default new AuthService();
