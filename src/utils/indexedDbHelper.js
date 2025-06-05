const DB_NAME = "storyAppDB";
const DB_VERSION = 1;
const OBJECT_STORE_NAME = "bookmarkedStories";

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
        const store = db.createObjectStore(OBJECT_STORE_NAME, {
          keyPath: "id",
        });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      console.error("IndexedDB error:", event.target.error);
      reject(event.target.error);
    };
  });
}

export async function addBookmark(story) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(OBJECT_STORE_NAME, "readwrite");
    const store = transaction.objectStore(OBJECT_STORE_NAME);
    const request = store.put(story);

    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => {
      console.error("Error adding bookmark:", event.target.error);
      reject(event.target.error);
    };
  });
}

export async function getAllBookmarks() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(OBJECT_STORE_NAME, "readonly");
    const store = transaction.objectStore(OBJECT_STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => {
      console.error("Error getting all bookmarks:", event.target.error);
      reject(event.target.error);
    };
  });
}

export async function getBookmarkById(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(OBJECT_STORE_NAME, "readonly");
    const store = transaction.objectStore(OBJECT_STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => {
      console.error(
        `Error getting bookmark with id ${id}:`,
        event.target.error
      );
      reject(event.target.error);
    };
  });
}

export async function deleteBookmark(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(OBJECT_STORE_NAME, "readwrite");
    const store = transaction.objectStore(OBJECT_STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => {
      console.error("Error deleting bookmark:", event.target.error);
      reject(event.target.error);
    };
  });
}

export async function isBookmarked(id) {
  const bookmark = await getBookmarkById(id);
  return !!bookmark;
}
