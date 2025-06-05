import { StoryModel } from "../model/StoryModel.js";
import StoryPresenter from "../presenter/StoryPresenter.js";
import StoryCard from "./components/StoryCard.js";
import MapComponent from "./components/MapComponent.js";
import {
  addBookmark,
  deleteBookmark,
  isBookmarked,
  getAllBookmarks,
} from "../utils/indexedDbHelper.js";

export class ListView {
  constructor() {
    this.bookmarkedStoryIds = new Set();
  }

  render() {
    if (!localStorage.getItem("token")) {
      window.location.hash = "#/login";
      return;
    }
    document.getElementById("main-content").innerHTML = `
      <h1 style="margin-bottom:1.8rem">Daftar Cerita</h1>
      <div id="map" style="margin-bottom:1.1rem"></div>
      <div id="notif-list"></div>
      <section id="story-list" aria-live="polite"></section>
      <div class="pagination"></div>
    `;
  }

  async afterRender() {
    this.page = 1;
    this.size = 8;
    this.model = new StoryModel();
    this.presenter = new StoryPresenter(this.model, this);
    await this.fetchBookmarkedStoryIds();
    await this.presenter.getStories({ page: this.page, size: this.size });

    document.querySelector(".pagination").onclick = async (e) => {
      if (e.target.dataset.page) {
        this.page = parseInt(e.target.dataset.page, 10);

        await this.fetchBookmarkedStoryIds();
        await this.presenter.getStories({ page: this.page, size: this.size });
      }
    };
  }

  async fetchBookmarkedStoryIds() {
    try {
      const bookmarks = await getAllBookmarks();
      this.bookmarkedStoryIds = new Set(bookmarks.map((story) => story.id));
    } catch (error) {
      console.error("Error fetching bookmarked story IDs:", error);
      this.bookmarkedStoryIds = new Set();
    }
  }

  async toggleStoryBookmark(story) {
    const notifElement = document.getElementById("notif-list");
    try {
      if (this.bookmarkedStoryIds.has(story.id)) {
        await deleteBookmark(story.id);
        this.bookmarkedStoryIds.delete(story.id);
        showGlobalNotification(
          `"${story.name}" dihapus dari bookmark.`,
          "success"
        );
      } else {
        await addBookmark(story);
        this.bookmarkedStoryIds.add(story.id);
        showGlobalNotification(
          `"${story.name}" ditambahkan ke bookmark.`,
          "success"
        );
      }

      const cardElement = document.querySelector(
        `.card[data-story-id="${story.id}"]`
      );
      if (cardElement) {
        const bookmarkBtn = cardElement.querySelector(".bookmark-btn");
        if (this.bookmarkedStoryIds.has(story.id)) {
          bookmarkBtn.innerHTML = "❤️";
          bookmarkBtn.setAttribute("aria-label", "Hapus Bookmark");
        } else {
          bookmarkBtn.innerHTML = "🤍";
          bookmarkBtn.setAttribute("aria-label", "Tambah Bookmark");
        }
      }
    } catch (error) {
      showGlobalNotification("Gagal mengubah status bookmark.", "error");
      console.error("Error toggling bookmark in ListView:", error);
    }
  }

  async renderStories(stories, page, size, totalPages) {
    MapComponent.render("map", stories);
    const list = document.getElementById("story-list");
    list.innerHTML = "";

    await this.fetchBookmarkedStoryIds();

    stories.forEach((story) => {
      const isStoryBookmarked = this.bookmarkedStoryIds.has(story.id);
      const cardElement = StoryCard.render(story, isStoryBookmarked, (s) =>
        this.toggleStoryBookmark(s)
      );
      list.appendChild(cardElement);
    });

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

if (!window.showGlobalNotification) {
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
      if (notif) notif.style.display = "none";
    }, 2200);
  };
}
