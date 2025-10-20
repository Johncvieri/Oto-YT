# 🚀 QWEN EXECUTOR - Oto-YT Full Autonomous Instruction

## 🧠 BACKGROUND

Kamu adalah **Qwen**, AI developer utama dari project **Oto-YT**.
Tugasmu adalah menjalankan seluruh langkah di bawah ini **dari awal sampai akhir tanpa henti** sampai sistem bekerja sempurna, dan hasil akhir tercapai.
Jika error terjadi, kamu **harus mengulang dari awal** hingga error terselesaikan otomatis.
Tujuan akhirnya: sistem AI YouTube Shorts Automation **berjalan 100% stabil di Railway live site**.

---

## 🎯 MAIN OBJECTIVE

Hasil akhir yang harus dicapai:

1. Situs live Railway: [https://oto-yt-production.up.railway.app/](https://oto-yt-production.up.railway.app/)

   * Menampilkan halaman **auth**, bukan halaman setup.
   * Workflow n8n dapat dimonitor dan berjalan dengan baik.
2. Semua API (`Gemini`, `Supabase`, `YouTube (3 akun)`, `Telegram`) aktif.
3. Workflow menghasilkan video otomatis dengan target:

   * ≥10.000 views dan ≥1.000 likes / akun / 24 jam.
   * 3 akun aktif total 30K+ views & 3K+ likes per hari.
4. Semua error tercatat otomatis dalam file `PROJECT_ANALYSIS.md`.

---

## ⚙️ HOW TO EXECUTE

Ikuti langkah-langkah ini satu arah (tidak boleh melompat):

### STEP 1 — Preparation

* Pastikan direktori aktif:
  `C:\Users\ASUS\Downloads\john\Oto-YT`
* Pastikan project sudah terhubung ke repo GitHub:
  `https://github.com/Johncvieri/Oto-YT`

### STEP 2 — System Cleanup

* Hapus semua file & konfigurasi Docker.
* Hapus script setup manual atau lokal.
* Bersihkan cache, log, dan folder `node_modules` jika ada sisa build lama.
* Jangan install apapun lewat terminal — deployment akan dilakukan otomatis oleh Railway.

### STEP 3 — Compatibility & Modernization

* Gunakan versi terbaru dari:

  * `n8n` (latest stable, Railway-compatible)
  * `Supabase client`
  * `Gemini API SDK`
  * `YouTube Data API v3`
  * `Telegram Bot API`
* Sesuaikan semua dependensi agar berjalan tanpa Docker.

### STEP 4 — Configuration & Environment

* Pastikan `.env` berisi:

  * YouTube API keys (3 akun)
  * Supabase URL & Key
  * Gemini API Key
  * Telegram API & Chat ID
  * `N8N_BASIC_AUTH_USER` dan `N8N_BASIC_AUTH_PASSWORD` untuk halaman auth
* Validasi env menggunakan script internal.
* Pastikan `RAILWAY_STATIC_URL` sesuai domain Railway aktif.

### STEP 5 — File Audit & Optimization

* Pelajari semua file project dan pahami fungsinya.
* Hapus yang tidak diperlukan.
* Perbaiki dan sesuaikan script sesuai workflow AI Shorts:

  1. Trend discovery (YouTube/Twitter/TikTok)
  2. Template video execution
  3. AI content enhancement (Gemini)
  4. Multi-account upload
  5. Performance tracking
  6. Community engagement

### STEP 6 — Deployment

* Commit & push seluruh perubahan ke branch utama:

  ```
  git add .
  git commit -m "update: Oto-YT optimized for Railway deployment"
  git push
  ```
* Railway akan auto-deploy project.
* Tunggu hingga build selesai dan situs aktif.

### STEP 7 — Validation & Monitoring

* Akses: [https://oto-yt-production.up.railway.app/](https://oto-yt-production.up.railway.app/)

  * Pastikan tidak menampilkan halaman setup.
  * Pastikan login berhasil dengan env `auth` credentials.
  * Pastikan workflow muncul di dashboard.
* Jalankan workflow AI YouTube Shorts Automation.
* Monitor performa dan error lewat dashboard.

### STEP 8 — Logging & Analysis

* Setiap langkah, error, perbaikan, dan progres dicatat otomatis ke:
  `PROJECT_ANALYSIS.md`
* Format log harus sesuai template:

  * SYSTEM STATUS
  * CURRENT TASK
  * ERROR LOG & FIX HISTORY
  * DEPLOYMENT LOG
  * PERFORMANCE TRACKING
  * FINAL GOAL CHECKLIST

### STEP 9 — Recovery & Retry Mechanism

Jika ditemukan error (misal: workflow tidak muncul, halaman setup muncul, API gagal, dsb):

1. Catat error di `PROJECT_ANALYSIS.md`.
2. Jalankan ulang seluruh langkah dari **STEP 2 sampai STEP 7**.
3. Ulangi terus sampai checklist final di `PROJECT_ANALYSIS.md` seluruhnya ✅.

### STEP 10 — Final Confirmation

Hasil akhir dianggap selesai jika:

* Workflow berjalan otomatis di n8n Railway tanpa error.
* Monitoring aktif dan real-time.
* Video YouTube Shorts terunggah otomatis.
* Semua indikator performance target tercapai.
* Tidak ada error baru selama 24 jam.

---

## 🔄 LOOP RULE

* Qwen wajib **mengulangi langkah dari STEP 2** jika ada error apapun di sistem.
* Tidak boleh berhenti hingga seluruh checklist final ✅.
* Semua aktivitas harus tercatat di `PROJECT_ANALYSIS.md`.

---

## 🔐 Railway & Access

* Railway Project ID: `15b9723a-aa56-4e25-92fb-c435fac78885`
* Railway Token: `622fffa8-75d3-4330-b405-792d7b674afb`
* GitHub Repository: `https://github.com/Johncvieri/Oto-YT`
* Deployment Link: `https://oto-yt-production.up.railway.app/`
* Email pemilik: `johnchristianvieri@gmail.com`

---

## 📌 NOTE

* Jangan test secara lokal.
* Semua test dilakukan lewat Railway deployment.
* Gunakan strategi aman untuk laptop low-spec: tidak compile berat, tidak build manual.
* Pastikan update maksimal dalam 30 menit per siklus.
* Seluruh perubahan dicatat otomatis ke file `PROJECT_ANALYSIS.md`.

---

> Jalankan seluruh instruksi ini berulang sampai sistem 100% stabil dan semua tujuan tercapai.
> Jika sistem crash, stuck, atau error, restart dari STEP 2.
> Jangan melompat ke langkah lain tanpa menyelesaikan langkah sebelumnya.
