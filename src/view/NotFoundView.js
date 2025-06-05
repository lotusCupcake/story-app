export class NotFoundView {
  render() {
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.innerHTML = `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 50%; padding: 40px;">
            <h1>404 - Halaman Tidak Ditemukan</h1>
            <p>Maaf, halaman yang Anda cari tidak ada.</p>
            <a href="#/" class="back-btn" style="text-decoration: none; margin-top: 20px;">Kembali ke Beranda</a>
          </div>
        `;
    }
  }

  afterRender() {}
}

export default new NotFoundView();
