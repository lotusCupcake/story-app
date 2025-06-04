import { StoryModel } from "../model/StoryModel.js";
import StoryPresenter from "../presenter/StoryPresenter.js";
import StoryCard from "./components/StoryCard.js";
import MapComponent from "./components/MapComponent.js";

export class ListView {
  render() {
    if (!localStorage.getItem("token")) {
      window.location.hash = "#/login";
      return;
    }
    document.getElementById("main-content").innerHTML = `
      <h1 style="margin-bottom:1.8rem">Daftar Cerita</h1>
      <div id="map" style="margin-bottom:1.1rem"></div>
      <div id="notif"></div>
      <section id="story-list" aria-live="polite"></section>
      <div class="pagination"></div>
    `;
  }

  async afterRender() {
    this.page = 1;
    this.size = 8;
    this.model = new StoryModel();
    this.presenter = new StoryPresenter(this.model, this);
    await this.presenter.getStories({ page: this.page, size: this.size });

    document.querySelector(".pagination").onclick = (e) => {
      if (e.target.dataset.page) {
        this.page = parseInt(e.target.dataset.page, 10);
        this.presenter.getStories({ page: this.page, size: this.size });
      }
    };
  }

  renderStories(stories, page, size, totalPages) {
    MapComponent.render("map", stories);
    const list = document.getElementById("story-list");
    list.innerHTML = "";
    stories.forEach((story) => {
      list.appendChild(StoryCard.render(story));
    });

    // Pagination
    let pagHtml = "";
    for (let i = 1; i <= totalPages; i++) {
      pagHtml += `<button data-page="${i}" class="${
        i === page ? "active" : ""
      }">${i}</button>`;
    }
    document.querySelector(".pagination").innerHTML = pagHtml;
  }

  showLoading() {
    document.getElementById(
      "story-list"
    ).innerHTML = `<div class="loading-spinner"></div>`;
    document.querySelector(".pagination").innerHTML = "";
  }

  renderFailedMessage() {
    const container = document.getElementById("story-list");
    container.innerHTML =
      '<div class="notification error">Gagal mendapatkan data cerita</div>';
    document.querySelector(".pagination").innerHTML = "";
  }

  showNotification(msg, type = "info") {
    showGlobalNotification(msg, type);
  }
}
export default new ListView();

// Utility for global notification
window.showGlobalNotification = function (msg, type = "info") {
  let notif = document.getElementById("global-notification");
  if (!notif) {
    notif = document.createElement("div");
    notif.id = "global-notification";
    document.body.appendChild(notif);
  }
  notif.className = `notification ${type}`;
  notif.innerText = msg;
  notif.style.display = "block";
  setTimeout(() => {
    notif.style.display = "none";
  }, 2200);
};
