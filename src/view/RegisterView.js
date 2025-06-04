import { UserModel } from "../model/UserModel.js";
import UserPresenter from "../presenter/UserPresenter.js";

export class RegisterView {
  render() {
    document.getElementById("main-content").innerHTML = `
      <h1 style="text-align:center">Registrasi</h1>
      <div id="notif"></div>
      <form id="register-form" autocomplete="on">
        <label for="name">Nama</label>
        <input id="name" type="text" required aria-required="true"/>
        <label for="email">Email</label>
        <input id="email" type="email" required aria-required="true"/>
        <label for="password">Password</label>
        <input id="password" type="password" required aria-required="true"/>
        <button type="submit">Registrasi</button>
        <p style="text-align:center;color:var(--text-light);margin-top:1rem">Sudah punya akun? <a href="#/login" style="color:var(--primary)">Login</a></p>
      </form>
    `;
  }
  async afterRender() {
    this.model = new UserModel();
    this.presenter = new UserPresenter(this.model, this);
    document.getElementById("register-form").onsubmit = async (ev) => {
      ev.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      await this.presenter.register(name, email, password);
    };
  }
  onRegisterSuccess() {
    window.location.hash = "#/login";
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
    this.showNotification("Gagal registrasi", "error");
  }
}
export default new RegisterView();
