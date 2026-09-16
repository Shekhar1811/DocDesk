class TokenService {
  getLocalRefreshToken() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.refreshToken;
  }

  getLocalAccessToken() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.token;
  }

  getUserName() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.username;
  }

  getName() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.name;
  }

  getPersonGuid() {
    const user = JSON.parse(localStorage.getItem("personInfo"));
    return user?.PersonsGuid;
  }

  updateLocalAccessToken(token) {
    let user = JSON.parse(localStorage.getItem("user"));
    user.token = token;
    localStorage.setItem("user", JSON.stringify(user));
  }

  getUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  setUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  removeUser() {
    localStorage.removeItem("user");
  }

  getUserRowGuid() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.row_guid;
  }

  getExpTime() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.idTokenClaims?.exp;
  }
  getExpiryTimeForToken() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.idTokenClaims;
  }
}

export default new TokenService();
