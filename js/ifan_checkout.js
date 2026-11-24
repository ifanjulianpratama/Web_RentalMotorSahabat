function ifanTogglePengambilan() {
  const el = document.getElementById("ifan_cara_ambil");
  if (!el) return;
  const cara = el.value;
  const infoTokoBox = document.getElementById("ifan_info_toko_box");
  const lokasiBox = document.getElementById("ifan_lokasi_antar_box");
  const lokasiInput = document.getElementById("ifan_lokasi_antar_input");
  if (!infoTokoBox || !lokasiBox || !lokasiInput) return;

  if (cara === "Diambil ke Tempat") {
    infoTokoBox.style.display = "block";
    lokasiBox.style.display = "none";
    lokasiInput.required = false;
    lokasiInput.value = "";
  } else if (cara === "Diantarkan ke Tempat Penyewa") {
    infoTokoBox.style.display = "none";
    lokasiBox.style.display = "block";
    lokasiInput.required = true;
  } else {
    infoTokoBox.style.display = "none";
    lokasiBox.style.display = "none";
    lokasiInput.required = false;
    lokasiInput.value = "";
  }
}

function ifanToggleBankSelect() {
  const el = document.getElementById("ifan_metode_bayar");
  if (!el) return;
  const metode = el.value;
  const bankGroup = document.getElementById("ifan_bank_group");
  const bankSelect = document.getElementById("ifan_bank_input");
  if (!bankGroup || !bankSelect) return;

  if (metode === "Transfer Bank") {
    bankGroup.style.display = "block";
    bankSelect.required = true;
  } else {
    bankGroup.style.display = "none";
    bankSelect.required = false;
    bankSelect.value = "";
  }
}

function ifanKirimCheckout(event) {
  event.preventDefault();
  const nama = document.getElementById("ifan_nama_input").value.trim();
  const wa = document.getElementById("ifan_wa_input").value.trim();
  const tglMulai = document.getElementById("ifan_tgl_mulai").value;
  const caraAmbil = document.getElementById("ifan_cara_ambil").value;
  const lokasiAntar = document.getElementById("ifan_lokasi_antar_input").value.trim();
  const metodeBayar = document.getElementById("ifan_metode_bayar").value;
  const bank = document.getElementById("ifan_bank_input").value;

  if (!nama || !wa || !tglMulai || !caraAmbil || !metodeBayar) {
    alert("Mohon lengkapi nama, nomor WhatsApp, tanggal mulai sewa, cara pengambilan, dan metode pembayaran.");
    return;
  }

  if (caraAmbil === "Diantarkan ke Tempat Penyewa" && !lokasiAntar) {
    alert("Mohon isi lokasi pengantaran motor di tempat penyewa.");
    return;
  }

  if (metodeBayar === "Transfer Bank" && !bank) {
    alert("Silakan pilih bank tujuan untuk Transfer Bank.");
    return;
  }

  const keranjang = ifanAmbilKeranjang();
  const total = keranjang.reduce((sum, item) => sum + item.subtotal, 0);
  const ringkasanUnit = keranjang.map((i) => `${i.nama} (${i.paket} x${i.durasi}, ${i.qty} unit)`).join(", ");
  const labelPembayaran = metodeBayar === "Transfer Bank" ? `Transfer Bank (${bank})` : metodeBayar;

  const daftarRiwayat = JSON.parse(localStorage.getItem(ifanStorageMsg) || "[]");
  daftarRiwayat.unshift({
    id: "ord_" + Date.now(),
    waktu: new Date().toLocaleString("id-ID"),
    nama,
    wa,
    pembayaran: labelPembayaran,
    unit: ringkasanUnit || "Belum memilih unit di keranjang",
    total
  });

  localStorage.setItem(ifanStorageMsg, JSON.stringify(daftarRiwayat));
  ifanSimpanKeranjang([]);

  event.target.reset();
  ifanTogglePengambilan();
  ifanToggleBankSelect();
  ifanRenderRiwayatPesan();
  alert(`Checkout atas nama ${nama} (${labelPembayaran}) berhasil disimpan & keranjang sudah dikosongkan!`);
}

function ifanHapusRiwayatItem(id) {
  const data = JSON.parse(localStorage.getItem(ifanStorageMsg) || "[]").filter((r) => r.id !== id);
  localStorage.setItem(ifanStorageMsg, JSON.stringify(data));
  ifanRenderRiwayatPesan();
}

function ifanHapusSemuaRiwayat() {
  if (!confirm("Yakin ingin menghapus seluruh riwayat pemesanan di browser ini?")) return;
  localStorage.removeItem(ifanStorageMsg);
  ifanRenderRiwayatPesan();
}

function ifanRenderRiwayatPesan() {
  const box = document.getElementById("ifan_riwayat_pesan");
  if (!box) return;
  const data = JSON.parse(localStorage.getItem(ifanStorageMsg) || "[]");
  if (data.length === 0) {
    box.innerHTML = `<p class="ifan_muted_note">Belum ada riwayat pemesanan tersimpan di browser ini.</p>`;
    return;
  }
  box.innerHTML = data
    .map(
      (r) => `
      <div class="ifan_history_item">
        <div>
          <strong>${r.nama}</strong> (${r.wa})
          <span class="ifan_pay_badge">${r.pembayaran || "Cash"}</span>
          • <small class="ifan_admin_note">${r.waktu}</small>
          <div class="ifan_history_unit">${r.unit || "-"}</div>
          <small class="ifan_history_total">Total Checkout: ${ifanFormatRupiah(r.total)}</small>
        </div>
        <button type="button" class="ifan_btn_danger_sm" onclick="ifanHapusRiwayatItem('${r.id}')">Hapus</button>
      </div>
    `
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  ifanTogglePengambilan();
  ifanToggleBankSelect();
  ifanRenderRiwayatPesan();
});