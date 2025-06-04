import L from "leaflet";

const MapComponent = {
  render(mapId, stories) {
    const mapDiv = document.getElementById(mapId);
    mapDiv.innerHTML = "";
    mapDiv.style.height = "350px";
    const map = L.map(mapId).setView([-2.5489, 118.0149], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(map);
        marker.bindPopup(
          `<b>${story.name}</b><br>${story.description.substring(0, 80)}`
        );
      }
    });
  },
  singleMarker(mapId, { lat, lon, name, desc }) {
    const mapDiv = document.getElementById(mapId);
    mapDiv.innerHTML = "";
    mapDiv.style.height = "300px";
    const map = L.map(mapId).setView([lat, lon], 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const marker = L.marker([lat, lon]).addTo(map);
    marker.bindPopup(`<b>${name}</b><br>${desc}`).openPopup();
  },
  pickLocation(mapId, cb) {
    const mapDiv = document.getElementById(mapId);
    mapDiv.innerHTML = "";
    mapDiv.style.height = "300px";
    const map = L.map(mapId).setView([-2.5, 118.0], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    let marker;
    map.on("click", function (e) {
      const { lat, lng } = e.latlng;
      if (marker) map.removeLayer(marker);
      marker = L.marker([lat, lng]).addTo(map);
      cb(lat, lng);
    });
  },
};

export default MapComponent;
