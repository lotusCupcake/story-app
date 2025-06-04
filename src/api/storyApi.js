const BASE_URL = "https://story-api.dicoding.dev/v1";

const getToken = () => localStorage.getItem("token");

export default {
  async login(email, password) {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Login gagal");
    return res.json();
  },
  async register(name, email, password) {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) throw new Error("Registrasi gagal");
    return res.json();
  },
  async getStories() {
    const res = await fetch(`${BASE_URL}/stories`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error("Gagal mengambil data");
    return res.json();
  },
  async getStoryDetail(id) {
    const res = await fetch(`${BASE_URL}/stories/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error("Gagal mengambil detail");
    return res.json();
  },
  async addStory({ description, photo, lat, lon }, isGuest = false) {
    const formData = new FormData();
    formData.append("description", description);
    formData.append("photo", photo);
    if (lat) formData.append("lat", lat);
    if (lon) formData.append("lon", lon);

    const url = isGuest ? `${BASE_URL}/stories/guest` : `${BASE_URL}/stories`;
    const headers = isGuest ? {} : { Authorization: `Bearer ${getToken()}` };

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    });
    if (!res.ok) throw new Error("Gagal menambah cerita");
    return res.json();
  },
};
