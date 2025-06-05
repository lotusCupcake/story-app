const BASE_URL = "https://story-api.dicoding.dev/v1";

const getToken = () => localStorage.getItem("token");

const VAPID_PUBLIC_KEY =
  "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";

const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

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

  async subscribePushNotification() {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
      const token = getToken();

      const body = JSON.stringify({
        endpoint: subscription.endpoint,
        keys: subscription.toJSON().keys,
      });

      const res = await fetch(`${BASE_URL}/notifications/subscribe`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body,
      });
      if (!res.ok) throw new Error("Gagal subscribe notifikasi");
      return res.json();
    } else {
      throw new Error("Browser tidak mendukung Push API");
    }
  },

  async unsubscribePushNotification() {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      const token = getToken();
      await fetch(`${BASE_URL}/notifications/subscribe`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });
      await subscription.unsubscribe();
    }
  },
};
