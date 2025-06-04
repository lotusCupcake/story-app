import api from "../api/storyApi.js";

export class UserModel {
  async login(email, password) {
    return await api.login(email, password);
  }
  async register(name, email, password) {
    return await api.register(name, email, password);
  }
}
