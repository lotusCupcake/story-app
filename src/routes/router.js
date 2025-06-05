import Navbar from "../view/components/Navbar.js";
import LoginView from "../view/LoginView.js";
import RegisterView from "../view/RegisterView.js";
import ListView from "../view/ListView.js";
import AddStoryView from "../view/AddStoryView.js";
import DetailView from "../view/DetailView.js";
import BookmarksView from "../view/BookmarksView.js";
import NotFoundView from "../view/NotFoundView.js";
import { setupPushSubscriptionBtn } from "../main.js";

function isAuthPage() {
  const hash = window.location.hash;
  return hash === "#/login" || hash === "#/register";
}

export function router() {
  if (!window.location.hash || window.location.hash === "#") {
    window.location.hash = "#/";
    return;
  }

  const rootHeader = document.querySelector("header");
  rootHeader.innerHTML = Navbar(isAuthPage());

  setTimeout(setupPushSubscriptionBtn, 0);

  const main = document.getElementById("main-content");
  main.className = isAuthPage() ? "main-auth" : "";

  const hash = window.location.hash || "#/";
  let page;
  const routes = {
    "#/login": LoginView,
    "#/register": RegisterView,
    "#/add": AddStoryView,
    "#/bookmarks": BookmarksView,
  };

  if (routes[hash]) {
    page = routes[hash];
  } else if (hash.startsWith("#/story/")) {
    page = DetailView;
  } else if (hash === "#/" || hash === "") {
    page = ListView;
  } else {
    page = NotFoundView;
  }

  if (document.startViewTransition) {
    document.startViewTransition(() => {
      page.render();
      if (page.afterRender) page.afterRender();
    });
  } else {
    page.render();
    if (page.afterRender) page.afterRender();
  }

  setTimeout(() => {
    const logoutLink = document.getElementById("logout-link");
    if (logoutLink) {
      logoutLink.onclick = (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        window.location.hash = "#/login";
        router();
      };
    }
  }, 0);
}
