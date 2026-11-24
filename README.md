# E-Voting Pemilihan Kepala Desa Ciater

Aplikasi web **simulasi** pemungutan suara dengan 4 kandidat. Dibuat menggunakan HTML, CSS, dan JavaScript murni sehingga dapat dijalankan langsung di browser dan dipublikasikan melalui GitHub Pages.

## Fitur

- Tampilan responsif untuk HP, tablet, dan komputer.
- Empat kartu kandidat dengan nomor urut, nama, dan visi/deskripsi.
- Alur pilih kandidat → konfirmasi → tanda terima simulasi.
- Satu suara per browser sampai admin melakukan reset.
- Panel admin dengan PIN demo.
- Ringkasan total suara, persentase, dan grafik batang.
- Edit nama serta visi/deskripsi kandidat.
- Unduh rekapitulasi dalam format CSV.
- Reset data suara simulasi.

## Menjalankan di komputer

1. Ekstrak folder `e-voting-ciater`.
2. Buka file `index.html` menggunakan Chrome, Edge, Firefox, atau browser lain.
3. Klik **Panel Admin** untuk membuka dashboard.
4. PIN demo awal: `123456`.

Tidak diperlukan instalasi, server, database, atau build tools.

## Mengganti data kandidat

1. Buka `script.js` menggunakan editor teks (misalnya Visual Studio Code).
2. Temukan bagian `DEFAULT_CANDIDATES`.
3. Ganti `name` dan `vision` dengan data kandidat sebenarnya untuk kebutuhan simulasi.
4. Simpan file, lalu muat ulang halaman.

Contoh:
```js
{
  id: 1,
  number: "01",
  name: "Nama Kandidat",
  vision: "Visi dan misi singkat kandidat.",
  initials: "NK"
}
```

Anda juga dapat mengubah nama dan deskripsi melalui menu **Panel Admin → Data kandidat**. Perubahan dari panel admin disimpan di browser yang sedang digunakan. Untuk mengubah data awal bagi semua pengunjung, edit `DEFAULT_CANDIDATES` pada `script.js` lalu unggah ulang.

## Mengganti foto kandidat

Versi awal menggunakan placeholder inisial agar dapat langsung berjalan tanpa file foto. Untuk menambahkan foto:
1. Buat folder `assets`.
2. Letakkan foto, misalnya `calon-1.jpg` sampai `calon-4.jpg`.
3. Tambahkan properti `photo: "assets/calon-1.jpg"` pada setiap objek kandidat di `DEFAULT_CANDIDATES`.
4. Pada fungsi `renderCandidates()` di `script.js`, ubah elemen `.candidate-placeholder` menjadi elemen gambar bila `c.photo` tersedia. Contoh markup:
```js
${c.photo
  ? `<img class="candidate-image" src="${escapeHTML(c.photo)}" alt="Foto ${escapeHTML(c.name)}">`
  : `<div class="candidate-placeholder">${escapeHTML(initials(c.name))}</div>`}
```
5. Tambahkan CSS:
```css
.candidate-image {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 25%;
}
```

## Mengubah PIN demo

Buka `script.js`, ubah baris:
```js
const ADMIN_PIN = "123456";
```
PIN ini hanya pengunci tampilan di browser, bukan keamanan server. Jangan gunakan sebagai pengamanan pemilihan sungguhan.

## Publikasi gratis dengan GitHub Pages

1. Buat akun atau masuk ke [GitHub](https://github.com/).
2. Klik **New repository**.
3. Isi nama repository, misalnya `e-voting-ciater`.
4. Pilih **Public**, lalu klik **Create repository**.
5. Klik **Add file → Upload files**.
6. Unggah `index.html`, `style.css`, `script.js`, `README.md`, dan folder `assets` jika digunakan. Pastikan `index.html` berada di root repository, bukan di dalam folder tambahan.
7. Klik **Commit changes**.
8. Buka **Settings → Pages**.
9. Pada **Build and deployment**, pilih **Deploy from a branch**.
10. Pilih branch `main` dan folder `/ (root)`, lalu klik **Save**.
11. Tunggu proses publikasi selesai. Alamat situs biasanya:
   `https://USERNAME.github.io/e-voting-ciater/`

Jika halaman belum muncul, tunggu beberapa menit, lalu muat ulang. Pastikan nama file tepat `index.html` dan file CSS/JS berada satu folder dengannya.

## Batasan penting — hanya simulasi

Aplikasi ini adalah demonstrasi front-end, bukan sistem pemilihan resmi:
- Data suara disimpan di `localStorage` browser masing-masing. Suara dari perangkat berbeda **tidak digabungkan**.
- Pengguna dapat menghapus data browser atau memanipulasi penyimpanan.
- PIN admin berada di kode JavaScript yang dapat dilihat pengunjung.
- Tidak ada verifikasi identitas pemilih, server, database terpusat, enkripsi suara, audit independen, atau pencegahan suara ganda lintas perangkat.
- Angka partisipasi hanya mencerminkan browser lokal yang sedang dibuka, bukan jumlah pemilih desa.

Untuk pemilihan resmi, diperlukan backend dan database terpusat, autentikasi pemilih yang layak, pemisahan identitas dari pilihan, pengamanan dan audit, pencadangan, pengujian keamanan, serta persetujuan dan tata kelola sesuai ketentuan yang berlaku. Jangan gunakan versi ini untuk menentukan hasil pemilihan kepala desa yang sebenarnya.
