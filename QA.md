# Pemeriksaan library Tahu Cara

- Lima file asli dipindahkan dari Downloads ke assets; SHA-256 sebelum/sesudah cocok. Manifest: assets/manifest.json.
- Keempat MP3 didecode penuh menggunakan FFmpeg tanpa error. Durasi: BGM 134.4 s, whoosh .574688 s, popup 1.358344 s, click 1.056 s.
- Provisioning dijalankan dua kali ke fixture baru; keduanya berhasil. Lima aset dan empat TSX tersedia pada struktur tujuan yang benar.
- Empat TSX lolos TypeScript dengan dependency baseline di assets/core/README.md.
- Empat Remotion still 540×960 dirender berurutan dan dibuka: hook frame 30, cutaway 135, detail 615, outro 2145.
- Bukti lokal: C:/Users/CHESTAIRA/OneDrive/Documents/Default Project/charger-kenapa/qa/core-library-check/{hook,cutaway,detail,outro}.png.
- Hasil visual: watermark di kanan atas, subtitle dalam safe zone, kata aktif lime/merah, garis komponen menuju kartu dalam frame, logo dan CTA outro terbaca. Fixture menggunakan geometri charger lama sebagai scene integrasi, bukan produksi video baru.
- Transcript fixture adalah data sintetis untuk tes komponen UI, bukan transkripsi narasi dan bukan bukti sinkronisasi audio. Proyek produksi tetap wajib ekstraksi word timestamps asli.
- Still tidak menguji kelancaran motion atau mixing akhir. Pengukuran bounds, occlusion seluruh timeline, audio mix, dan review motion tetap wajib per proyek.
- Revisi 18 November 2026: aturan paritas preview/final ditambahkan ke SKILL.md. Wrapper Preview di blueprint dihapus. Preview persetujuan harus memakai komposisi dan render settings final; source chunks disimpan dan dipakai kembali, dengan mapping frame serta decoded framemd5. Ini perubahan workflow; bukan klaim seluruh blueprint sudah dirender ulang.
