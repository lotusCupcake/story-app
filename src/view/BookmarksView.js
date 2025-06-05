import {
  getAllBookmarks,
  deleteBookmark,
  isBookmarked,
} from "../utils/indexedDbHelper.js";
import StoryCard from "./components/StoryCard.js";

export class BookmarksView {
  constructor() {
    this.stories = [];
  }

  render() {
    document.getElementById("main-content").innerHTML = `
      <button class="back-btn" id="back-bookmarks" style="margin-bottom: 1rem;">
        <svg height="20" width="20" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
        Kembali
      </button>
      <h1>Cerita Tersimpan (Offline)</h1>
      <div id="notif-bookmarks"></div>
      <section id="bookmarked-story-list" aria-live="polite"></section>
    `;
  }

  async afterRender() {
    document.getElementById("back-bookmarks").onclick = () =>
      window.history.back();
    await this.loadBookmarkedStories();
  }

  async loadBookmarkedStories() {
    const listElement = document.getElementById("bookmarked-story-list");
    listElement.innerHTML = '<div class="loading-spinner"></div>';

    try {
      this.stories = await getAllBookmarks();
      if (this.stories.length === 0) {
        listElement.innerHTML = "<p>Belum ada cerita yang Anda simpan.</p>";
        return;
      }

      listElement.innerHTML = "";
      this.stories.forEach((story) => {
        const cardElement = StoryCard.render(story, true, async () => {
          await this.toggleBookmark(story);
        });
        listElement.appendChild(cardElement);
      });
    } catch (error) {
      console.error("Failed to load bookmarked stories:", error);
      listElement.innerHTML =
        '<p class="notification error">Gagal memuat cerita tersimpan.</p>';
    }
  }

  async toggleBookmark(story) {
    const currentlyBookmarked = await isBookmarked(story.id);
    const notifElement = document.getElementById("notif-bookmarks");
    try {
      if (currentlyBookmarked) {
        await deleteBookmark(story.id);
        notifElement.innerHTML = `<div class="notification success">Bookmark dihapus: ${story.name}</div>`;
      } else {
        console.warn(
          "Attempted to add bookmark from bookmarks page for story not bookmarked. This is unusual."
        );
      }

      await this.loadBookmarkedStories();
    } catch (error) {
      notifElement.innerHTML = `<div class="notification error">Gagal mengubah status bookmark.</div>`;
      console.error("Error toggling bookmark:", error);
    }
    setTimeout(() => {
      notifElement.innerHTML = "";
    }, 2200);
  }
}

export default new BookmarksView();
