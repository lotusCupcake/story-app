import api from "../api/storyApi.js";

export class StoryModel {
  async getStories({ page, size }) {
    return await api.getStories({ page, size });
  }
  async getStory(id) {
    return await api.getStoryDetail(id);
  }
  async addNewStory(data, isGuest = false) {
    return await api.addStory(data, isGuest);
  }
}
