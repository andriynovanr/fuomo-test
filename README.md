# Automation Test - Registrasi Akun fuomo.id

Automation test menggunakan **Playwright** untuk menguji fitur registrasi akun baru pada website [fuomo.id](https://fuomo.id).

## Prasyarat

- [Node.js](https://nodejs.org/) versi 18 atau lebih baru
- Koneksi internet (test berjalan langsung terhadap website fuomo.id)

## Cara Install

```bash
# 1. Install dependencies
npm install

# 2. Install browser Chromium untuk Playwright
npx playwright install chromium
```

## Cara Menjalankan Test

```bash
# Jalankan semua test
npx playwright test

# Jalankan dengan output di terminal
npx playwright test --reporter=line

# Jalankan test tertentu saja (contoh: hanya positive test)
npx playwright test --grep "Berhasil"

# Buka HTML report di browser setelah test selesai di jalankan
npx playwright show-report
```

## Struktur Project

```
fuomo-test/
├── playwright.config.js              # Konfigurasi Playwright (baseURL, browser, dll.)
├── package.json
├── tests/
│   ├── pages/
│   │   └── registration.page.js      # Page Object Model - selector & aksi form registrasi
│   └── registration.spec.js          # Test cases (5 negatif + 1 positif)
└── README.md
```

## Pendekatan

### Page Object Model (POM)

Selector dan aksi yang berhubungan dengan halaman registrasi dipisahkan ke dalam file `registration.page.js`. Ini membuat test file lebih bersih dan kalau ada perubahan UI, cukup update di satu tempat saja.

### Test Cases

| #   | Skenario                         | Tipe       | Yang Diverifikasi                                                     |
| --- | -------------------------------- | ---------- | --------------------------------------------------------------------- |
| 1   | Semua field kosong               | ❌ Negatif | Error muncul untuk setiap field wajib (nama, email, gender, password) |
| 2   | Format email tidak valid         | ❌ Negatif | Pesan error validasi email                                            |
| 3   | Konfirmasi password tidak cocok  | ❌ Negatif | Pesan error password mismatch                                         |
| 4   | Password tidak memenuhi kriteria | ❌ Negatif | Indikator warna (merah/hijau) untuk panjang, huruf besar, huruf kecil |
| 5   | Email sudah terdaftar            | ❌ Negatif | Pesan error duplikat email                                            |
| 6   | Registrasi dengan data valid     | ✅ Positif | Modal pilih role muncul → redirect ke dashboard                       |
