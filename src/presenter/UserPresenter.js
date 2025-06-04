export default class UserPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  async login(email, password) {
    try {
      this.view.showLoading();
      const res = await this.model.login(email, password);
      localStorage.setItem("token", res.loginResult.token);
      this.view.onLoginSuccess();
    } catch (e) {
      this.view.showNotification(e.message, "error");
    }
  }

  async register(name, email, password) {
    try {
      this.view.showLoading();
      await this.model.register(name, email, password);
      this.view.onRegisterSuccess();
    } catch (e) {
      this.view.showNotification(e.message, "error");
    }
  }
}
