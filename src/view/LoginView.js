import { UserModel } from "../model/UserModel.js";
import UserPresenter from "../presenter/UserPresenter.js";

export class LoginView {
  render() {
    document.getElementById("main-content").innerHTML = `
      <h1 style="text-align:center">Masuk</h1>
      <div id="notif"></div>
      <form id="login-form" autocomplete="on">
        <label for="email">Email</label>
        <input id="email" type="email" placeholder="you@mail.com" required aria-required="true"/>
        <label for="password">Password</label>
        <input id="password" type="password" placeholder="******" required aria-required="true"/>
        <button type="submit">Login</button>
        <p style="text-align:center;color:var(--text-light);margin-top:1rem">Belum punya akun? <a href="#/register" style="color:var(--primary)">Registrasi</a></p>
      </form>
    `;
  }
  async afterRender() {
    this.model = new UserModel();
    this.presenter = new UserPresenter(this.model, this);
    document.getElementById("login-form").onsubmit = async (ev) => {
      ev.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      await this.presenter.login(email, password);
    };
  }
  onLoginSuccess() {
    window.location.hash = "#/";
  }
  showLoading() {
    document.getElementById(
      "notif"
    ).innerHTML = `<div class="loading-spinner"></div>`;
  }
  showNotification(msg, type = "info") {
    const notif = document.getElementById("notif");
    notif.innerHTML = `<div class="notification ${type}">${msg}</div>`;
    setTimeout(() => {
      notif.innerHTML = "";
    }, 1800);
  }
  renderFailedMessage() {
    this.showNotification("Gagal login", "error");
  }
}
export default new LoginView();
