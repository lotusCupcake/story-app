self.addEventListener("push", function (event) {
  let data = {};
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    data = {};
  }
  const title = data.title || "Notifikasi";
  const options = data.options || { body: "Anda mendapatkan notifikasi baru." };
  event.waitUntil(self.registration.showNotification(title, options));
});
