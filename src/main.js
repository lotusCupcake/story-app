import { router } from "./routes/router.js";
import "./assets/style.css";
import storyApi from "./api/storyApi.js";

const VAPID_PUBLIC_KEY =
  "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function subscribePushNotification() {
  if (
    !("Notification" in window) ||
    !("serviceWorker" in navigator) ||
    !("PushManager" in window)
  ) {
    window.showGlobalNotification?.("Push messaging is not supported", "error");
    return;
  }

  if (Notification.permission === "denied") {
    window.showGlobalNotification?.(
      "Akses notifikasi sudah ditolak permanen. Silakan izinkan notifikasi di pengaturan browser.",
      "error"
    );
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    window.showGlobalNotification?.("Akses notifikasi ditolak.", "info");
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    try {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
      await storyApi.subscribePushNotification(subscription);
      window.showGlobalNotification?.("Notifikasi diaktifkan.", "success");
    } catch (err) {
      window.showGlobalNotification?.("Gagal subscribe notifikasi.", "error");
      console.error("Failed to subscribe to push notifications: ", err);
    }
  } else {
    window.showGlobalNotification?.("Notifikasi sudah aktif.", "info");
  }
}

async function unsubscribePushNotification() {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (subscription) {
    await storyApi.unsubscribePushNotification(subscription);
    await subscription.unsubscribe();
    window.showGlobalNotification?.("Notifikasi dinonaktifkan.", "info");
  }
}

export function setupPushSubscriptionBtn() {
  const btn = document.getElementById("push-subscribe-btn");
  const icon = document.getElementById("push-subscribe-icon");
  if (!btn || !icon) return;

  btn.disabled = true;
  navigator.serviceWorker.ready.then(async (registration) => {
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      icon.textContent = "🔕";
      btn.title = "Nonaktifkan Notifikasi";
    } else {
      icon.textContent = "🔔";
      btn.title = "Aktifkan Notifikasi";
    }
    btn.disabled = false;
  });

  btn.onclick = async () => {
    btn.disabled = true;
    navigator.serviceWorker.ready.then(async (registration) => {
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await unsubscribePushNotification();
        icon.textContent = "🔔";
        btn.title = "Aktifkan Notifikasi";
      } else {
        await subscribePushNotification();
        icon.textContent = "🔕";
        btn.title = "Nonaktifkan Notifikasi";
      }
      btn.disabled = false;
    });
  };
}

function initializeApp() {
  router();

  window.addEventListener("hashchange", router);

  window.addEventListener("DOMContentLoaded", () => {
    router();

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  });
}

initializeApp();

export { subscribePushNotification, unsubscribePushNotification };
