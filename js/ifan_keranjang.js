function ifanUbahQtyItem(key, delta) {
  const keranjang = ifanAmbilKeranjang();
  const idx = keranjang.findIndex((item) => item.key === key);
  if (idx < 0) return;

  keranjang[idx].qty += delta;
  if (keranjang[idx].qty <= 0) {
    keranjang.splice(idx, 1);
  } else {
    keranjang[idx].subtotal = keranjang[idx].qty * keranjang[idx].tarifSatuan * keranjang[idx].durasi;
  }
  ifanSimpanKeranjang(keranjang);
}

function ifanHapusItem(key) {
  const keranjang = ifanAmbilKeranjang().filter((item) => item.key !== key);
  ifanSimpanKeranjang(keranjang);
}

function ifanRenderKeranjang() {
  const listEl = document.getElementById("ifan_cart_items");
  const totalEl = document.getElementById("ifan_cart_total");
  if (!listEl || !totalEl) return;

  const keranjang = ifanAmbilKeranjang();
  if (keranjang.length === 0) {
    listEl.innerHTML = `<p class="ifan_muted_note">Keranjang sewa kosong. Buka menu Armada atau Promo untuk memilih unit.</p>`;
    totalEl.textContent = ifanFormatRupiah(0);
    return;
  }

  listEl.innerHTML = keranjang
    .map((item) => {
      const satuanLabel = item.paket === "harian" ? "hari" : item.paket === "mingguan" ? "minggu" : "bulan";
      return `
        <div class="ifan_cart_item">
          <div>
            <strong>${item.nama}</strong>
            <span class="ifan_trans_badge ${item.transmisi === "MATIC" ? "ifan_trans_matic" : "ifan_trans_manual"}">${item.transmisi}</span>
            <div class="ifan_cart_meta">
              Paket ${item.paket.toUpperCase()} (${item.durasi} ${satuanLabel}) • ${ifanFormatRupiah(item.tarifSatuan * item.durasi)} / unit
            </div>
          </div>
          <div class="ifan_cart_right">
            <div class="ifan_qty_ctrl">
              <button type="button" class="ifan_qty_btn" onclick="ifanUbahQtyItem('${item.key}', -1)">-</button>
              <strong>${item.qty}</strong>
              <button type="button" class="ifan_qty_btn" onclick="ifanUbahQtyItem('${item.key}', 1)">+</button>
            </div>
            <strong class="ifan_cart_sub">${ifanFormatRupiah(item.subtotal)}</strong>
            <button type="button" class="ifan_qty_btn" onclick="ifanHapusItem('${item.key}')" title="Hapus">✕</button>
          </div>
        </div>
      `;
    })
    .join("");

  const grandTotal = keranjang.reduce((sum, item) => sum + item.subtotal, 0);
  totalEl.textContent = ifanFormatRupiah(grandTotal);
}

document.addEventListener("DOMContentLoaded", () => {
  ifanRenderKeranjang();
});