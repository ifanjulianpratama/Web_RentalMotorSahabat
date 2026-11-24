const ifanImgPrefix = window.location.pathname.includes("/html/") ? "../ifan_gambar/" : "ifan_gambar/";

const ifanDataMotor = [
  { id: "beat", nama: "Honda BeAT", cc: "110 CC", transmisi: "MATIC", img: ifanImgPrefix + "beat_110cc.jpg", harian: 80000, mingguan: 450000, bulanan: 1600000 },
  { id: "genio", nama: "Honda Genio", cc: "110 CC", transmisi: "MATIC", img: ifanImgPrefix + "genio_125cc.jpg", harian: 75000, mingguan: 400000, bulanan: 1400000 },
  { id: "scopy", nama: "Honda Scoopy", cc: "110 CC", transmisi: "MATIC", img: ifanImgPrefix + "scopy_110cc.jpg", harian: 80000, mingguan: 450000, bulanan: 1600000 },
  { id: "vario125", nama: "Honda Vario 125", cc: "125 CC", transmisi: "MATIC", img: ifanImgPrefix + "vario_125cc.jpg", harian: 90000, mingguan: 500000, bulanan: 1800000 },
  { id: "vario160", nama: "Honda Vario 160", cc: "160 CC", transmisi: "MATIC", img: ifanImgPrefix + "vario_160cc.jpg", harian: 110000, mingguan: 600000, bulanan: 2200000 },
  { id: "pcx160", nama: "Honda PCX 160", cc: "160 CC", transmisi: "MATIC", img: ifanImgPrefix + "pcx_160cc.jpg", harian: 140000, mingguan: 800000, bulanan: 2800000 },
  { id: "nmax155", nama: "Yamaha NMAX 155", cc: "155 CC", transmisi: "MATIC", img: ifanImgPrefix + "nmax_155cc.jpg", harian: 130000, mingguan: 750000, bulanan: 2700000 },
  { id: "aerox155", nama: "Yamaha Aerox 155", cc: "155 CC", transmisi: "MATIC", img: ifanImgPrefix + "aerox_155cc.jpg", harian: 140000, mingguan: 800000, bulanan: 2900000 },
  { id: "lexi125", nama: "Yamaha Lexi 125", cc: "125 CC", transmisi: "MATIC", img: ifanImgPrefix + "lexy_155cc.jpg", harian: 90000, mingguan: 500000, bulanan: 1800000 },
  { id: "flano125", nama: "Yamaha Grand Filano", cc: "125 CC", transmisi: "MATIC", img: ifanImgPrefix + "flano_125cc.jpg", harian: 90000, mingguan: 500000, bulanan: 1900000 },
  { id: "suprax125", nama: "Honda Supra X 125", cc: "125 CC", transmisi: "MANUAL", img: ifanImgPrefix + "suprax_125cc.jpg", harian: 70000, mingguan: 400000, bulanan: 1400000 },
  { id: "fufi150", nama: "Suzuki Satria FU 150", cc: "150 CC", transmisi: "MANUAL", img: ifanImgPrefix + "fufi_150cc.jpg", harian: 80000, mingguan: 450000, bulanan: 1700000 },
  { id: "sonic150", nama: "Honda Sonic 150R", cc: "150 CC", transmisi: "MANUAL", img: ifanImgPrefix + "sonic_150cc.jpg", harian: 80000, mingguan: 450000, bulanan: 1700000 },
  { id: "revo110", nama: "Honda Revo Fit", cc: "110 CC", transmisi: "MANUAL", img: ifanImgPrefix + "revo_110cc.jpg", harian: 60000, mingguan: 350000, bulanan: 1200000 },
  { id: "blade125", nama: "Honda Blade", cc: "110 CC", transmisi: "MANUAL", img: ifanImgPrefix + "blade_125cc.jpg", harian: 60000, mingguan: 350000, bulanan: 1200000 },
  { id: "klx150", nama: "Kawasaki KLX 150", cc: "150 CC", transmisi: "MANUAL", img: ifanImgPrefix + "klx_150cc.jpg", harian: 150000, mingguan: 850000, bulanan: 3000000 },
  { id: "r15v3", nama: "Yamaha R15 V3", cc: "155 CC", transmisi: "MANUAL", img: ifanImgPrefix + "r15_150cc.jpg", harian: 200000, mingguan: 1200000, bulanan: 4000000 }
];

const ifanStorageCart = "ifan_sahabat_cart_v1";
const ifanStorageMsg = "ifan_sahabat_messages_v1";
const ifanStorageKontak = "ifan_sahabat_kontak_msg_v1";

function ifanFormatRupiah(angka) {
  return "Rp " + Number(angka).toLocaleString("id-ID");
}

function ifanAmbilKeranjang() {
  try {
    return JSON.parse(localStorage.getItem(ifanStorageCart)) || [];
  } catch (e) {
    return [];
  }
}

function ifanSimpanKeranjang(data) {
  localStorage.setItem(ifanStorageCart, JSON.stringify(data));
  ifanUpdateBadgeKeranjang();
  if (typeof ifanRenderKeranjang === "function") {
    ifanRenderKeranjang();
  }
}

function ifanUpdateBadgeKeranjang() {
  const keranjang = ifanAmbilKeranjang();
  const totalUnit = keranjang.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll(".ifan_cart_count").forEach((el) => {
    el.textContent = totalUnit;
  });
}

function ifanToggleMenu() {
  const menu = document.getElementById("ifan_nav_menu");
  if (menu) menu.classList.toggle("ifan_show");
}

document.addEventListener("DOMContentLoaded", () => {
  ifanUpdateBadgeKeranjang();
});