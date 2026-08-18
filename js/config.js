// ============================================================
// PENGATURAN LOGIN
// Ganti username / password di bawah ini sesuai keinginan.
// Ini cukup untuk menahan pengunjung biasa agar tidak asal masuk,
// TAPI karena aplikasi ini murni berjalan di browser (tanpa server),
// siapapun yang membuka file ini secara teknis bisa melihat nilainya.
// Cocok untuk model "bagikan 1 akun ke pembeli", bukan untuk data rahasia.
// ============================================================

const AKUN_VALID = {
  username: "belajar",
  password: "belajar123"
};

// ============================================================
// DEVICE LOCK (soft-lock, pakai npoint.io sebagai penyimpanan gratis)
// ============================================================
// 1. Buka https://npoint.io, klik "Create a bin".
// 2. Isi kontennya dengan: {"deviceId": null}
// 3. Simpan, lalu salin URL bin-nya (bentuknya https://api.npoint.io/xxxxxxxxxxxxxxxx)
// 4. Tempel URL itu di bawah ini, ganti nilai placeholder.
//
// CATATAN JUJUR: ini bukan proteksi kuat. URL bin ini bisa dilihat
// siapapun yang buka DevTools, dan siapapun yang tahu URL-nya bisa
// PATCH manual buat reset deviceId. Ini hanya menahan pemakaian
// akun bersama secara kasual, bukan mencegah orang yang niat.
//
// Kalau npoint.io sedang down/tidak terjangkau, sistem akan
// FAIL-OPEN (login tetap diizinkan tanpa cek device) supaya
// pembeli sah tidak ikut terkunci gara-gara masalah pihak ketiga.
const DEVICE_LOCK = {
  npointUrl: "https://api.npoint.io/4006c7c62ae528034dab"
};
