import { StoryModel } from "../model/StoryModel.js";
import StoryPresenter from "../presenter/StoryPresenter.js";
import MapComponent from "./components/MapComponent.js";

export class AddStoryView {
  render() {
    document.getElementById("main-content").innerHTML = `
      <button class="back-btn" id="back-add">
        <svg height="20" width="20" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
        Kembali
      </button>
      <h1>Tambah Cerita Baru</h1>
      <div id="notif"></div>
      <form id="add-story-form" autocomplete="off">
        <label for="description">Deskripsi</label>
        <textarea id="description" required aria-required="true"></textarea>

        <label>Ambil Foto Cerita</label>
        <div id="camera-container">
          <video id="video" autoplay playsinline width="320" height="240"></video>
          <canvas id="canvas" width="320" height="240"></canvas>
          </div>
          <button type="button" id="capture-btn">Ambil Gambar</button>
        <input type="hidden" id="lat" />
        <input type="hidden" id="lon" />

        <label>Lokasi Cerita (klik pada peta)</label>
        <div id="map-add"></div>

        <button type="submit">Tambah Cerita</button>
      </form>
    `;
  }

  async afterRender() {
    document.getElementById("back-add").onclick = () => window.history.back();

    let currentLatLon = {};
    MapComponent.pickLocation("map-add", (lat, lon) => {
      currentLatLon = { lat, lon };
      document.getElementById("lat").value = lat;
      document.getElementById("lon").value = lon;
    });

    let stream;
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const captureBtn = document.getElementById("capture-btn");
    let capturedBlob = null;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        video.srcObject = stream;
      } catch (e) {
        alert("Tidak bisa mengakses kamera!");
      }
    }
    startCamera();

    captureBtn.onclick = function () {
      canvas
        .getContext("2d")
        .drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          capturedBlob = blob;
        },
        "image/jpeg",
        0.95
      );
    };

    window.addEventListener("hashchange", () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    });

    document.getElementById("add-story-form").onsubmit = async (ev) => {
      ev.preventDefault();
      const description = document.getElementById("description").value;
      const photo = capturedBlob;
      const lat = document.getElementById("lat").value;
      const lon = document.getElementById("lon").value;
      const isGuest = !localStorage.getItem("token");

      if (!photo) {
        this.showNotification("Silakan ambil gambar dulu", "error");
        return;
      }
      this.model = new StoryModel();
      this.presenter = new StoryPresenter(this.model, this);
      await this.presenter.addStory({ description, photo, lat, lon }, isGuest);
    };
  }

  showLoading() {
    showGlobalNotification("Mengirim cerita...", "info");
  }
  showNotification(msg, type = "info") {
    showGlobalNotification(msg, type);
  }
  renderFailedMessage() {
    this.showNotification("Gagal menambah cerita", "error");
  }
}
export default new AddStoryView();
