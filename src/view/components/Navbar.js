const Navbar = (isAuthPage = false) => {
  const isLoggedIn = !!localStorage.getItem("token");

  return `
    <nav class="${isAuthPage ? "navbar-auth" : ""}">
      <div class="nav-content">
        <div class="nav-l">
          <a href="#/" class="logo" style="text-decoration: none; color: var(--text);">STORY APP</a>
        </div>
        <div class="nav-r">
        <a href="#/add">Tambah Cerita</a>
        ${
          isLoggedIn
            ? `
          <a href="#/bookmarks">Bookmark</a>
          <button id="push-subscribe-btn" class="navbar-btn" aria-label="Aktifkan/Nonaktifkan Notifikasi" title="Notifikasi">
            <span id="push-subscribe-icon">🔔</span>
          </button>
          <a href="#" id="logout-link">Logout</a>
        `
            : `
          ${isAuthPage ? "" : '<a href="#/login">Login</a>'}
        `
        }
        </div>
      </div>
    </nav>
  `;
};

export default Navbar;
