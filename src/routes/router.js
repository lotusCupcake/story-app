import Navbar from "../view/components/Navbar.js";
import LoginView from "../view/LoginView.js";
import RegisterView from "../view/RegisterView.js";
import ListView from "../view/ListView.js";
import AddStoryView from "../view/AddStoryView.js";
import DetailView from "../view/DetailView.js";

function isAuthPage() {
  const hash = window.location.hash;
  return hash === "#/login" || hash === "#/register";
}

export function router() {
  const rootHeader = document.querySelector("header");

  rootHeader.innerHTML = Navbar(isAuthPage());

  const main = document.getElementById("main-content");

  main.className = isAuthPage() ? "main-auth" : "";

  const hash = window.location.hash || "#/";
  let page;
  if (hash === "#/login") page = LoginView;
  else if (hash === "#/register") page = RegisterView;
  else if (hash === "#/add") page = AddStoryView;
  else if (hash.startsWith("#/story/")) page = DetailView;
  else page = ListView;

  if (document.startViewTransition) {
    document.startViewTransition(() => {
      page.render();
      page.afterRender && page.afterRender();
    });
  } else {
    page.render();
    page.afterRender && page.afterRender();
  }

  setTimeout(() => {
    const logout = document.getElementById("logout-link");
    if (logout) {
      logout.onclick = (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        window.location.hash = "#/login";
      };
    }
  }, 0);
}
