// Dipakai di semua halaman setelah login (dashboard, flashcard, quiz).

function pastikanLogin() {
  const sudahLogin = localStorage.getItem('sudahLogin') === 'ya';
  if (!sudahLogin) {
    window.location.href = 'index.html';
    return null;
  }
  const namaEl = document.getElementById('namaPengguna');
  if (namaEl) namaEl.textContent = localStorage.getItem('namaPengguna') || 'Pengguna';
  return { nama: localStorage.getItem('namaPengguna') };
}

function pasangTombolLogout() {
  const btn = document.getElementById('logoutBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    localStorage.removeItem('sudahLogin');
    localStorage.removeItem('namaPengguna');
    window.location.href = 'index.html';
  });
}

// Ucapkan kata bahasa Inggris memakai Web Speech API (tanpa perlu file audio).
//
// Catatan teknis: di banyak browser (terutama Chrome), daftar suara (voices)
// tidak langsung siap saat halaman dibuka — butuh sepersekian detik untuk
// dimuat oleh browser. Kalau kita baru mencari suara SAAT tombol diklik,
// klik pertama akan terasa "telat" atau bahkan tidak bersuara sama sekali.
// Solusinya: muat & simpan (cache) suara Inggris SEJAK AWAL halaman dibuka,
// jadi saat kartu/tombol diklik, suara sudah siap dan langsung terdengar.
let suaraInggrisTerpilih = null;

function muatCacheSuaraInggris() {
  if (!('speechSynthesis' in window)) return;
  const daftarSuara = window.speechSynthesis.getVoices();
  if (!daftarSuara.length) return;

  suaraInggrisTerpilih =
    daftarSuara.find(v => v.lang === 'en-US' && /female/i.test(v.name)) ||
    daftarSuara.find(v => v.lang === 'en-US') ||
    daftarSuara.find(v => v.lang && v.lang.toLowerCase().startsWith('en')) ||
    daftarSuara[0];
}

if ('speechSynthesis' in window) {
  muatCacheSuaraInggris();
  window.speechSynthesis.onvoiceschanged = muatCacheSuaraInggris;
}

function ucapkanKata(teks) {
  if (!('speechSynthesis' in window)) return;
  const synth = window.speechSynthesis;

  // Hanya batalkan ucapan sebelumnya kalau memang masih ada yang berjalan.
  // Memanggil cancel() setiap saat (walau tidak sedang bicara) justru bisa
  // membuat browser lambat merespons klik berikutnya.
  if (synth.speaking || synth.pending) synth.cancel();
  if (synth.paused) synth.resume();

  const utter = new SpeechSynthesisUtterance(teks);
  utter.lang = 'en-US';
  utter.rate = 0.85;
  utter.pitch = 1.1;
  if (suaraInggrisTerpilih) utter.voice = suaraInggrisTerpilih;

  synth.speak(utter);
}

function ambilParam(nama) {
  return new URLSearchParams(window.location.search).get(nama);
}

// Muat daftar kategori aktif dari manifest.json, lalu ambil detail tiap file kategori.
async function muatDaftarKategori() {
  const resManifest = await fetch('data/manifest.json');
  if (!resManifest.ok) throw new Error('Gagal memuat manifest.json');
  const manifest = await resManifest.json();
  const daftarId = manifest.aktif || [];

  const semuaKategori = await Promise.all(
    daftarId.map(async (id) => {
      try {
        const res = await fetch(`data/categories/${id}.json`);
        if (!res.ok) return null;
        const data = await res.json();
        return {
          id: data.id || id,
          nama: data.nama || id,
          iconEmoji: data.iconEmoji || '📚',
          warnaTema: data.warnaTema || '#2EC4B6',
          urutan: typeof data.urutan === 'number' ? data.urutan : 999,
          jumlahKata: Array.isArray(data.kata) ? data.kata.length : 0
        };
      } catch (err) {
        console.error(`Gagal memuat kategori "${id}":`, err);
        return null;
      }
    })
  );

  return semuaKategori
    .filter(Boolean)
    .sort((a, b) => a.urutan - b.urutan || a.nama.localeCompare(b.nama));
}

// Muat detail lengkap satu kategori (termasuk daftar katanya).
async function muatDetailKategori(id) {
  const res = await fetch(`data/categories/${id}.json`);
  if (!res.ok) throw new Error('Kategori tidak ditemukan');
  return res.json();
}

document.addEventListener('DOMContentLoaded', pasangTombolLogout);
