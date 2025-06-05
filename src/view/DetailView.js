import { StoryModel } from "../model/StoryModel.js";
import StoryPresenter from "../presenter/StoryPresenter.js";
import MapComponent from "./components/MapComponent.js";
import {
  addBookmark,
  deleteBookmark,
  isBookmarked,
} from "../utils/indexedDbHelper.js";

export class DetailView {
  constructor() {
    this.currentStory = null;
    this.isCurrentlyBookmarked = false;
  }
  render() {
    document.getElementById("main-content").innerHTML = `
      <button class="back-btn" id="back-detail">
        <svg height="20" width="20" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
        Kembali
      </button>
      <h1>Detail Cerita</h1>
      <div id="notif-detail"></div>
      <section id="detail"></section>
    `;
  }

  async afterRender() {
    document.getElementById("back-detail").onclick = () =>
      window.history.back();
    const id = window.location.hash.split("/")[2];
    this.model = new StoryModel();
    this.presenter = new StoryPresenter(this.model, this);
    await this.presenter.getStoryDetail(id);
  }

  async renderStoryDetail(story) {
    this.currentStory = story;
    this.isCurrentlyBookmarked = await isBookmarked(story.id);

    document.getElementById("detail").innerHTML = `
      <article class="card">
        <img src="${story.photoUrl}" alt="Foto cerita oleh ${
      story.name
    }" loading="lazy" />
        <div class="card-content">
          <h2>${story.name}</h2>
          <p><b>Waktu:</b> ${new Date(story.createdAt).toLocaleString("id")}</p>
          <p>${story.description}</p>
          <button id="detail-bookmark-btn" class="bookmark-btn" style="margin-top:1rem; margin-bottom:1rem;">
            ${this.isCurrentlyBookmarked ? "❤️" : "🤍"}
          </button>
          <div id="detail-map"></div>
        </div>
      </article>
    `;
    if (story.lat && story.lon) {
      MapComponent.singleMarker("detail-map", {
        lat: story.lat,
        lon: story.lon,
        name: story.name,
        desc: story.description,
      });
    }

    document.getElementById("detail-bookmark-btn").onclick = () =>
      this.toggleDetailBookmark();
  }

  async toggleDetailBookmark() {
    if (!this.currentStory) return;
    const notifElement = document.getElementById("notif-detail");
    try {
      if (this.isCurrentlyBookmarked) {
        await deleteBookmark(this.currentStory.id);
        notifElement.innerHTML = `<div class="notification success">Bookmark dihapus.</div>`;
        this.isCurrentlyBookmarked = false;
      } else {
        await addBookmark(this.currentStory);
        notifElement.innerHTML = `<div class="notification success">Bookmark ditambahkan.</div>`;
        this.isCurrentlyBookmarked = true;
      }

      const btn = document.getElementById("detail-bookmark-btn");
      if (btn) {
        btn.innerHTML = this.isCurrentlyBookmarked ? "❤️" : "🤍";
      }
    } catch (error) {
      notifElement.innerHTML = `<div class="notification error">Gagal mengubah status bookmark.</div>`;
      console.error("Error toggling bookmark in DetailView:", error);
    }
    setTimeout(() => {
      notifElement.innerHTML = "";
    }, 2200);
  }

  showLoading() {
    document.getElementById(
      "detail"
    ).innerHTML = `<div class="loading-spinner"></div>`;
  }

  renderFailedMessage() {
    document.getElementById("detail").innerHTML =
      '<div class="notification error">Gagal mendapatkan detail cerita</div>';
  }

  showNotification(msg, type = "info") {
    showGlobalNotification(msg, type);
  }
}
export default new DetailView();
