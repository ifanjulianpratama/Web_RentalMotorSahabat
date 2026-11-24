let ifanMotorAktif = null;
let ifanPaketAktif = "harian";

function ifanRenderKatalog(filter = "SEMUA", targetId = "ifan_katalog_grid") {
  const container = document.getElementById(targetId);
  if (!container) return;

  const list = ifanDataMotor.filter((m) => {
    if (filter === "SEMUA") return true;
    return m.transmisi === filter;
  });

  container.innerHTML = list
    .map((m) => {
      const badgeClass = m.transmisi === "MATIC" ? "ifan_trans_matic" : "ifan_trans_manual";
      return `
        <article class="ifan_card" onclick="ifanBukaModal('${m.id}')">
          <div class="ifan_img_box">
            <img src="${m.img}" alt="${m.nama} ${m.cc}" onerror="this.style.opacity='0.35'">
          </div>
          <div class="ifan_card_body">
            <span class="ifan_trans_badge ${badgeClass}">${m.transmisi}</span>
            <h3 class="ifan_motor_name">${m.nama}</h3>
            <p class="ifan_cc_text">${m.cc} • Transmisi ${m.transmisi}</p>
            <div class="ifan_price_daily">${ifanFormatRupiah(m.harian)} <span class="ifan_price_unit">/ hari</span></div>
            <p class="ifan_price_sub">Mingguan: ${ifanFormatRupiah(m.mingguan)} • Bulanan: ${ifanFormatRupiah(m.bulanan)}</p>
          </div>
        </article>
      `;
    })
    .join("");
}

function ifanFilterMotor(jenis, tombol) {
  document.querySelectorAll(".ifan_filter_btn").forEach((btn) => btn.classList.remove("ifan_active"));
  if (tombol) tombol.classList.add("ifan_active");
  ifanRenderKatalog(jenis);
}

function ifanBukaModal(motorId) {
  const motor = ifanDataMotor.find((m) => m.id === motorId);
  const overlay = document.getElementById("ifan_modal_overlay");
  if (!motor || !overlay) return;

  ifanMotorAktif = motor;
  ifanPaketAktif = "harian";

  document.getElementById("ifan_modal_img").src = motor.img;
  document.getElementById("ifan_modal_img").alt = motor.nama;
  document.getElementById("ifan_modal_nama").textContent = motor.nama;
  document.getElementById("ifan_modal_spec").textContent = `${motor.cc} • Kategori ${motor.transmisi}`;

  const transEl = document.getElementById("ifan_modal_trans");
  transEl.textContent = motor.transmisi;
  transEl.className = "ifan_trans_badge " + (motor.transmisi === "MATIC" ? "ifan_trans_matic" : "ifan_trans_manual");

  document.getElementById("ifan_harga_harian").textContent = ifanFormatRupiah(motor.harian);
  document.getElementById("ifan_harga_mingguan").textContent = ifanFormatRupiah(motor.mingguan);
  document.getElementById("ifan_harga_bulanan").textContent = ifanFormatRupiah(motor.bulanan);
  document.getElementById("ifan_durasi_input").value = 1;

  ifanPilihPaket("harian");
  overlay.classList.add("ifan_open");
}

function ifanTutupModal() {
  const overlay = document.getElementById("ifan_modal_overlay");
  if (overlay) overlay.classList.remove("ifan_open");
}

function ifanPilihPaket(paket) {
  ifanPaketAktif = paket;
  document.querySelectorAll(".ifan_paket_opt").forEach((opt) => {
    opt.classList.toggle("ifan_selected", opt.dataset.paket === paket);
  });
  const labelSatuan = document.getElementById("ifan_satuan_label");
  if (labelSatuan) {
    labelSatuan.textContent = paket === "harian" ? "Hari" : paket === "mingguan" ? "Minggu" : "Bulan";
  }
  ifanHitungSubtotalModal();
}

function ifanHitungSubtotalModal() {
  if (!ifanMotorAktif) return;
  const durasi = Math.max(1, parseInt(document.getElementById("ifan_durasi_input").value || "1", 10));
  const tarifSatuan = ifanMotorAktif[ifanPaketAktif];
  const subtotal = tarifSatuan * durasi;
  document.getElementById("ifan_modal_subtotal").textContent = ifanFormatRupiah(subtotal);
}

function ifanTambahKeKeranjang() {
  if (!ifanMotorAktif) return;
  const durasi = Math.max(1, parseInt(document.getElementById("ifan_durasi_input").value || "1", 10));
  const tarifSatuan = ifanMotorAktif[ifanPaketAktif];
  const keranjang = ifanAmbilKeranjang();

  const key = `${ifanMotorAktif.id}_${ifanPaketAktif}_${durasi}`;
  const idx = keranjang.findIndex((item) => item.key === key);

  if (idx >= 0) {
    keranjang[idx].qty += 1;
    keranjang[idx].subtotal = keranjang[idx].qty * keranjang[idx].tarifSatuan * keranjang[idx].durasi;
  } else {
    keranjang.push({
      key,
      id: ifanMotorAktif.id,
      nama: ifanMotorAktif.nama,
      cc: ifanMotorAktif.cc,
      transmisi: ifanMotorAktif.transmisi,
      img: ifanMotorAktif.img,
      paket: ifanPaketAktif,
      durasi,
      tarifSatuan,
      qty: 1,
      subtotal: tarifSatuan * durasi
    });
  }

  ifanSimpanKeranjang(keranjang);
  ifanTutupModal();
  alert(`${ifanMotorAktif.nama} (${ifanPaketAktif.toUpperCase()} x ${durasi}) masuk ke keranjang.`);
}

function ifanCheckoutPromo(namaPromo, paket, durasi, tarifSatuan) {
  const keranjang = ifanAmbilKeranjang();
  const key = `promo_${paket}_${durasi}_${tarifSatuan}`;
  const idx = keranjang.findIndex((item) => item.key === key);

  if (idx >= 0) {
    keranjang[idx].qty += 1;
    keranjang[idx].subtotal = keranjang[idx].qty * keranjang[idx].tarifSatuan * keranjang[idx].durasi;
  } else {
    keranjang.push({
      key,
      id: key,
      nama: `Promo ${namaPromo}`,
      cc: "Unit Pilihan",
      transmisi: "MATIC",
      img: ifanImgPrefix + "beat_110cc.jpg",
      paket,
      durasi,
      tarifSatuan,
      qty: 1,
      subtotal: tarifSatuan * durasi
    });
  }

  ifanSimpanKeranjang(keranjang);
  window.location.href = window.location.pathname.includes("/html/") ? "ifan_checkout.html" : "html/ifan_checkout.html";
}

document.addEventListener("DOMContentLoaded", () => {
  ifanRenderKatalog("SEMUA");
});