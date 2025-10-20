# 🚀 QWEN EXECUTOR - Oto-YT Autonomous Script (Auto Edit Mode, One-Direction)

> Mode: Auto Edit
> Tujuan: Jalankan semua langkah hingga workflow aktif, situs live sempurna, dan sistem AI Shorts Automation berjalan otomatis di Railway.

---

╭──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│  STEP 1 — PREPARATION                                                                                                        │
│  ○ Pastikan Qwen berada di direktori: `C:\Users\ASUS\Downloads\john\Oto-YT`                                                 │
│  ○ Pastikan repository sudah terhubung ke: `https://github.com/Johncvieri/Oto-YT`                                           │
│  ○ Pastikan Railway project aktif di: `oto-yt-production.up.railway.app`                                                    │
│  ○ Pastikan Railway API token dan Project ID valid dan tersimpan:                                                           │
│       - Project ID: `15b9723a-aa56-4e25-92fb-c435fac78885`                                                                  │
│       - Token: `622fffa8-75d3-4330-b405-792d7b674afb`                                                                       │
│  ○ Jalankan tanpa terminal install manual, semua proses akan berjalan via Railway CI/CD                                     │
│  ○ Jangan jalankan lokal — semua testing live di Railway                                                                    │
╰──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

╭──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│  STEP 2 — SYSTEM CLEANUP                                                                                                    │
│  ○ Pelajari isi project secara menyeluruh dan baca semua catatan di `PROJECT_ANALYSIS.md`                                   │
│  ○ Hapus file berikut bila ada: Dockerfile, docker-compose.yml, dan semua script build Docker                               │
│  ○ Bersihkan file tidak diperlukan: cache, node_modules, log, folder dist/build lama, dan file conflict                     │
│  ○ Hapus script lokal testing (jangan ada start-dev lokal)                                                                  │
│  ○ Pastikan semua package.json, workflow, dan env tidak mengandung perintah docker                                          │
│  ○ Jika terjadi error sistem atau freeze, hapus cache build Railway dan ulangi langkah ini                                  │
╰──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

╭──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│  STEP 3 — COMPATIBILITY & MODERNIZATION                                                                                     │
│  ○ Update semua dependency ke versi terbaru dan kompatibel Railway:                                                         │
│       - n8n (latest stable, Railway-compatible)                                                                            │
│       - Supabase client terbaru                                                                                            │
│       - Gemini API SDK terbaru                                                                                             │
│       - YouTube Data API v3 terbaru                                                                                        │
│       - Telegram Bot API terbaru                                                                                           │
│  ○ Pastikan semua dependensi berjalan tanpa Docker, gunakan node-based config                                              │
│  ○ Gunakan teknik “light install” untuk laptop low spec (optimalkan build & RAM usage)                                      │
│  ○ Pastikan instalasi tidak melebihi 30 menit — jika lebih, pastikan tidak crash                                            │
╰──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

╭──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│  STEP 4 — CONFIGURATION & ENVIRONMENT                                                                                       │
│  ○ Pastikan file `.env` berisi lengkap:                                                                                     │
│       - YOUTUBE_API_KEY_1, YOUTUBE_API_KEY_2, YOUTUBE_API_KEY_3                                                             │
│       - SUPABASE_URL, SUPABASE_KEY                                                                                          │
│       - GEMINI_API_KEY                                                                                                      │
│       - TELEGRAM_API, TELEGRAM_CHAT_ID                                                                                      │
│       - N8N_BASIC_AUTH_USER, N8N_BASIC_AUTH_PASSWORD                                                                        │
│       - RAILWAY_STATIC_URL sesuai domain aktif                                                                              │
│  ○ Validasi `.env` menggunakan script internal Qwen, catat hasil ke `PROJECT_ANALYSIS.md`                                   │
╰──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

╭──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│  STEP 5 — FILE AUDIT & OPTIMIZATION                                                                                         │
│  ○ Pelajari fungsi semua file dan pastikan sesuai kebutuhan AI YouTube Shorts Automation                                    │
│  ○ Hapus file yang tidak digunakan                                                                                          │
│  ○ Perbaiki dan sesuaikan workflow:                                                                                         │
│       1. Trend Discovery (YouTube/Twitter/TikTok, viral_score > 85)                                                         │
│       2. Template Execution (gunakan top 3 premium templates, overlays, text effects, durasi 60–70s)                        │
│       3. AI Enhancement (Gemini: viral titles, hooks, CTA, emotional triggers)                                              │
│       4. Multi-Account Upload (3 akun, topik berbeda, jam upload 12:00 WIB)                                                 │
│       5. Performance Tracking (monitor tiap jam selama 6 jam pertama)                                                       │
│       6. Community Engagement (share ke grup aktif tanpa bot)                                                               │
│  ○ Simpan hasil audit dan koreksi ke `PROJECT_ANALYSIS.md`                                                                  │
╰──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

╭──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│  STEP 6 — DEPLOYMENT                                                                                                        │
│  ○ Jalankan commit dan push ke branch utama repo `https://github.com/Johncvieri/Oto-YT`                                    │
│  ○ Railway CI/CD otomatis mem-build project                                                                                 │
│  ○ Tunggu hingga deploy sukses dan domain aktif                                                                             │
│  ○ Jangan ubah branch atau trigger manual build                                                                             │
╰──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

╭──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│  STEP 7 — VALIDATION & MONITORING                                                                                           │
│  ○ Kunjungi live site: `https://oto-yt-production.up.railway.app/`                                                          │
│  ○ Pastikan halaman setup tidak muncul — langsung ke halaman login/auth                                                     │
│  ○ Login dengan credential dari `.env`                                                                                      │
│  ○ Pastikan dashboard menampilkan workflow n8n aktif                                                                        │
│  ○ Jalankan workflow utama AI YouTube Shorts Automation                                                                     │
│  ○ Pastikan workflow berjalan tanpa error dan memunculkan log aktivitas                                                     │
│  ○ Monitor hasil di dashboard selama 6 jam pertama                                                                          │
╰──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

╭──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│  STEP 8 — LOGGING & ANALYSIS                                                                                                │
│  ○ Catat setiap langkah dan hasil di `PROJECT_ANALYSIS.md`                                                                  │
│  ○ Jika error muncul, tulis: deskripsi error, analisa, solusi, dan hasil retry                                              │
│  ○ Pastikan file `PROJECT_ANALYSIS.md` berisi semua progres dari awal hingga akhir                                          │
╰──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

╭──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│  STEP 9 — RECOVERY & RETRY LOOP                                                                                            │
│  ○ Jika salah satu kondisi di bawah ini muncul, Qwen wajib ulang dari STEP 2:                                               │
│       - Workflow tidak muncul                                                                                                │
│       - Halaman setup n8n masih tampil                                                                                       │
│       - Login gagal / error auth                                                                                            │
│       - Tidak ada monitoring aktif                                                                                           │
│       - Workflow tidak berjalan                                                                                              │
│       - API error (Gemini, Supabase, Telegram, YouTube)                                                                     │
│  ○ Jalankan ulang proses dari STEP 2 otomatis hingga semua masalah terselesaikan                                            │
╰──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

╭──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│  STEP 10 — FINAL CONFIRMATION & PERFORMANCE CHECK                                                                          │
│  ○ Pastikan checklist berikut semua ✅:                                                                                     │
│       - Halaman login aktif, bukan setup                                                                                    │
│       - Workflow n8n muncul dan berjalan                                                                                    │
│       - Monitoring aktif                                                                                                   │
│       - Semua API berfungsi (Gemini, Supabase, Telegram, YouTube)                                                           │
│       - Workflow AI YouTube Shorts otomatis upload 3 video harian                                                          │
│       - Total minimal 30K views & 3K likes / 24 jam                                                                        │
│       - Tidak ada error di Railway logs 24 jam terakhir                                                                    │
│  ○ Setelah semua ✅, catat ringkasan keberhasilan di `PROJECT_ANALYSIS.md`                                                  │
│  ○ Konfirmasi hasil akhir ke email owner: `johnchristianvieri@gmail.com`                                                   │
╰──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

---

🟢 **JALANKAN DI QWEN DENGAN PERINTAH:**

```
jalankan QWEN_EXECUTOR.md dengan mode auto edit
```

💡 Qwen akan mengeksekusi seluruh langkah dari STEP 1 sampai STEP 10 tanpa intervensi manual,
dengan auto retry, logging, dan perbaikan otomatis hingga hasil akhir tercapai sempurna.
