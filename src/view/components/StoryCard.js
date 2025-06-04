const StoryCard = {
  render(story) {
    const card = document.createElement("article");
    card.className = "card";
    card.tabIndex = 0;
    card.innerHTML = `
        <img src="${story.photoUrl}" alt="Foto cerita oleh ${story.name}" />
        <div class="card-content">
          <h2>${story.name}</h2>
          <p>${story.description.substring(0, 120)}...</p>
          <p><b>Dibuat:</b> ${new Date(story.createdAt).toLocaleString(
            "id"
          )}</p>
          <button onclick="window.location.hash='#/story/${
            story.id
          }'" aria-label="Lihat detail cerita">Detail</button>
        </div>
      `;
    return card;
  },
};
export default StoryCard;
