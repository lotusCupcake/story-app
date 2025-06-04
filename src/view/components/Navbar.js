const Navbar = (isAuthPage = false) => {
  return `
      <nav class="${isAuthPage ? "navbar-auth" : ""}">
        <div class="nav-content">
          <div class="nav-l">
            <span class="logo">STORY APP</span>
          </div>
          <div class="nav-r">
          <a href="#/add">Tambah Cerita</a>
            ${
              !isAuthPage
                ? `
              ${
                localStorage.getItem("token")
                  ? `<a href="#" id="logout-link">Logout</a>`
                  : `<a href="#/login">Login</a>`
              }
                `
                : ""
            }
          </div>
        </div>
      </nav>
    `;
};

export default Navbar;
