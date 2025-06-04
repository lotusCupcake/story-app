export default class StoryPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  async getStories({ page, size }) {
    try {
      this.view.showLoading();
      const data = await this.model.getStories({ page, size });
      this.view.renderStories(
        data.listStory,
        data.page,
        data.size,
        data.totalPages
      );
    } catch {
      this.view.renderFailedMessage();
    }
  }

  async getStoryDetail(id) {
    try {
      this.view.showLoading();
      const data = await this.model.getStory(id);
      this.view.renderStoryDetail(data.story);
    } catch {
      this.view.renderFailedMessage();
    }
  }

  async addStory(formData, isGuest = false) {
    try {
      this.view.showLoading();
      await this.model.addNewStory(formData, isGuest);
      this.view.showNotification("Berhasil menambah cerita!", "success");
      setTimeout(() => {
        window.location.hash = "#/";
      }, 1200);
    } catch (e) {
      this.view.showNotification(e.message, "error");
    }
  }
}
