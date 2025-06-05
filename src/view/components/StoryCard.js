const getSafe = (fn, defaultValue = "") => {
  try {
    return fn();
  } catch (e) {
    return defaultValue;
  }
};

const StoryCard = {
  render(
    story,
    isInitiallyBookmarked = false,
    onToggleBookmarkCallback = async () => {}
  ) {
    const card = document.createElement("article");
    card.className = "card";
    card.tabIndex = 0;
    card.dataset.storyId = story.id;
    card.style.marginBottom = "1.5rem";

    const storyName = getSafe(() => story.name, "Nama tidak tersedia");
    const storyDescription = getSafe(
      () => story.description,
      "Deskripsi tidak tersedia"
    );
    const storyPhotoUrl = getSafe(
      () => story.photoUrl,
      "/path/to/default-image.png"
    );
    const storyCreatedAt = getSafe(
      () => new Date(story.createdAt).toLocaleString("id"),
      "Tanggal tidak tersedia"
    );

    card.innerHTML = `
        <img src="${storyPhotoUrl}" alt="Foto cerita oleh ${storyName}" loading="lazy" />
        <div class="card-content">
          <h2>${storyName}</h2>
          <p>${storyDescription.substring(0, 120)}...</p>
          <p><b>Dibuat:</b> ${storyCreatedAt}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem;">
            <button class="bookmark-btn" aria-label="${
              isInitiallyBookmarked ? "Hapus Bookmark" : "Tambah Bookmark"
            }">
              ${isInitiallyBookmarked ? "❤️" : "🤍"}
            </button>
            <button class="detail-btn" aria-label="Lihat detail cerita ${storyName}">Detail</button>
          </div>
        </div>
      `;

    card.querySelector(".detail-btn").onclick = () => {
      window.location.hash = `#/story/${story.id}`;
    };

    const bookmarkBtn = card.querySelector(".bookmark-btn");

    bookmarkBtn.onclick = async () => {
      await onToggleBookmarkCallback(story);
    };

    return card;
  },
};
export default StoryCard;
