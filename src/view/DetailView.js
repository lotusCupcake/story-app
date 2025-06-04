import { StoryModel } from "../model/StoryModel.js";
import StoryPresenter from "../presenter/StoryPresenter.js";
import MapComponent from "./components/MapComponent.js";

export class DetailView {
  render() {
    document.getElementById("main-content").innerHTML = `
      <button class="back-btn" id="back-detail">
        <svg height="20" width="20" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
        Kembali
      </button>
      <h1>Detail Cerita</h1>
      <div id="notif"></div>
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

  renderStoryDetail(story) {
    document.getElementById("detail").innerHTML = `
      <article class="card">
        <img src="${story.photoUrl}" alt="Foto cerita oleh ${story.name}" />
        <div class="card-content">
          <h2>${story.name}</h2>
          <p><b>Waktu:</b> ${new Date(story.createdAt).toLocaleString("id")}</p>
          <p>${story.description}</p>
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
