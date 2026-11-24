function ifanKirimPesanKontak(event) {
  event.preventDefault();
  const nama = document.getElementById("ifan_kontak_nama").value.trim();
  const kontak = document.getElementById("ifan_kontak_email").value.trim();
  const pesan = document.getElementById("ifan_kontak_pesan").value.trim();

  if (!nama || !kontak || !pesan) {
    alert("Mohon lengkapi nama, email/no. WhatsApp, dan isi pesan.");
    return;
  }

  const daftarPesan = JSON.parse(localStorage.getItem(ifanStorageKontak) || "[]");
  daftarPesan.unshift({
    id: "msg_" + Date.now(),
    waktu: new Date().toLocaleString("id-ID"),
    nama,
    kontak,
    pesan
  });

  localStorage.setItem(ifanStorageKontak, JSON.stringify(daftarPesan));
  event.target.reset();
  ifanRenderPesanKontak();
  alert(`Terima kasih ${nama}, pesan Anda sudah terkirim ke pemilik Rental Motor Sahabat.`);
}

function ifanRenderPesanKontak() {
  const box = document.getElementById("ifan_daftar_pesan_kontak");
  if (!box) return;
  const daftarPesan = JSON.parse(localStorage.getItem(ifanStorageKontak) || "[]");
  if (daftarPesan.length === 0) {
    box.innerHTML = "";
    return;
  }

  box.innerHTML = daftarPesan
    .slice(0, 3)
    .map(
      (p) => `
      <div class="ifan_pesan_card">
        <strong>${p.nama}</strong> (${p.kontak}) • <small class="ifan_admin_note">${p.waktu}</small>
        <div class="ifan_history_unit">${p.pesan}</div>
      </div>
    `
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  ifanRenderPesanKontak();
});