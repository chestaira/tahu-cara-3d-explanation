---
name: explanation-3d
description: Membuat video explainer dan bedah mekanisme 3D Indonesia vertikal 9:16 dengan visual Semi-Realistic Cinematic Product, workflow audio eksternal atau TTS lokal, word-level captions, dynamic camera, spring UI, dan preview sebelum render penuh. Gunakan saat user memanggil /explanation-3d atau meminta workflow explainer ini.
---

# /explanation-3d — 3D Explainer & Mechanism Breakdown Generator

Standar permanen kanal **Tahu Cara**: kualitas Semi-Realistic Cinematic Product (referensi kualitas kanal "kita bedah") dengan disiplin HUD edukasi vertikal 9:16. Gunakan logo dan audio asli user yang tersimpan bersama skill.

Default: bahasa Indonesia, 1080×1920 (9:16), 30 fps, 60–75 detik termasuk outro. Instruksi eksplisit user mengungguli default. Skill ini menjadi sumber aturan untuk workflow explanation-3d; aturan lama cartoon-3d-short tidak boleh mengganti angka atau ketentuan terbaru di sini.

## Struktur mandiri & auto-provisioning — wajib sebelum produksi

Direktori skill global ini menyimpan sumber aset mandiri:

```text
explanation-3d/
├── SKILL.md
├── scripts/provision.ps1
└── assets/
    ├── logo.png
    ├── sfx/
    │   ├── whoosh.mp3
    │   ├── ui popup.mp3
    │   ├── click.mp3
    │   └── bgm.mp3
    └── core/
        ├── CoreEnvironment.tsx
        ├── KaraokeSubtitle.tsx
        ├── CalloutPointer.tsx
        └── BrandOutro.tsx
```

Setiap membuat subfolder video baru di Default Project, WAJIB menjalankan `scripts/provision.ps1 -ProjectPath "<absolute-project-path>"` melalui PowerShell. Script menyalin logo ke `public/logo.png`, empat audio ke `public/sfx/` (bukan root public), dan empat komponen ke `src/components/core/`. Jangan hanya menjelaskan provisioning: jalankan dan periksa hasil. Script idempotent untuk file identik dan menolak overwrite perubahan proyek.

Dependensi template: React, Remotion, Three, @remotion/three, @react-three/fiber, @react-three/drei, @react-three/postprocessing, postprocessing; pin versi kompatibel. Load font Plus Jakarta Sans/JetBrains Mono sebelum capture. CoreEnvironment dipakai dalam ThreeCanvas/Suspense; komponen UI dan AutoAudioLayer di luar canvas. HDR preset dapat dicache ke public dan diberikan melalui prop hdrFile, tanpa menghilangkan studio environment.

## A. Interactive workflow & audio pipeline — wajib di awal

### 1. Periksa input

- Jika file MP3 **narasi** tersedia, langsung ekstraksi timestamp dan produksi tanpa mengulang pertanyaan audio. Logo default sudah tersedia di skill.
- MP3 SFX/BGM bukan narasi. Jika MP3 narasi belum tersedia, tawarkan singkat dua pilihan:
  - **A — Audio Eksternal / ElevenLabs (Direkomendasikan):** tulis naskah lengkap terlebih dahulu; user membuat suara di ElevenLabs dan mengirim MP3. Tunggu audio untuk tahap sinkronisasi.
  - **B — Auto-Generate Audio:** buat naskah, generate TTS lokal, ekstraksi timestamp, lalu produksi preview dan render sesuai persetujuan.
- Logo saja bukan audio: pasang logo, tetap tawarkan A/B bila belum ada MP3. Jika user sudah memilih jalur audio, jangan tanyakan lagi. Jika TTS lokal tidak tersedia, jelaskan kendala sebenarnya; jangan mengaku telah menghasilkan audio.

### 2. Standar naskah

- Padat, lugas, kasual-edukatif Indonesia; target 60–75 detik, sekitar 140–170 kata. Sesuaikan dengan durasi audio nyata, jangan memaksa hitungan kata merusak tempo.
- Hook 0–8 detik wajib berupa situasi sehari-hari yang relatable atau anomali mengejutkan, dengan mini-storytelling. Dilarang membuka dengan definisi membosankan seperti "Charger adalah...".
- Tutup hook dengan jembatan, misalnya "Kita bedah bagian dalamnya".
- Alur: Hook Situasional → Bedah Mekanisme/Komponen (Makro ke Mikro) → Bukti/Simulasi Fisika → Kesimpulan Praktis + Pertanyaan CTA.
- Periksa fakta dan simpan sumber; bedakan simulasi ilustratif dari hasil uji nyata. Hindari klaim harga saja menentukan keamanan atau ilustrasi sebagai bukti eksperimen.

### 3. Ekstraksi word-level timestamps

- Begitu audio tersedia, wajib transkripsi tingkat kata memakai Whisper / faster-whisper dengan `word_timestamps=True`, atau API transkripsi setara.
- Simpan `public/transcript.json` terstruktur `[{ "word": "...", "start": 0.123, "end": 0.456 }]`, waktu dalam detik berpresisi milidetik. Presisi angka bukan jaminan akurasi; periksa sinkronisasi terhadap audio.
- Dilarang memperkirakan timing subtitle dari jumlah kata atau durasi rata-rata. Selaraskan transkrip dengan naskah, pertahankan tanda baca dan timestamp tiap kata; catat token hilang/tidak cocok.
- Simpan audio sumber, naskah, transkrip, timestamp, dan segmentasi caption. Musik orisinal dan SFX subtle mendukung narasi; duck musik/SFX, ukur loudness serta true peak hasil mix. Jangan mengklaim pemeriksaan audio tanpa pengukuran.

## B. Sepuluh hukum arsitektur visual & teknis

### 1. Brand watermark logo — top-right

- Pasang `staticFile('logo.png')` persisten pada `top: 5%`, `right: 6%`, `width: 72px`, `height: 72px`, `borderRadius: 14px`, `opacity: 0.5`. Sejajarkan dengan Header Tag kiri; pertahankan aspect ratio via objectFit contain.
- Gunakan BrandWatermark dari CoreEnvironment di root termasuk outro. Jika root sudah memasang watermark, berikan `showWatermark={false}` ke BrandOutro agar tidak ganda.

### 2. Lookdev — Semi-Realistic Cinematic Material

- Dilarang outline kartun hitam, Inverted Hull, Edges/EdgesGeometry, dan toon material. Siluet terbentuk dari cahaya, refleksi, dan bayangan. Garis dashed callout 2D diperbolehkan.
- HDRI wajib: `<Environment preset="studio" environmentIntensity={0.6} background={false} />`. HDR studio boleh dicache lokal untuk render deterministik, dengan intensitas tetap 0.6; tunggu asset siap sebelum capture.
- Plastik bening/kaca: `<meshPhysicalMaterial transmission={0.85} ior={1.49} thickness={0.4} roughness={0.12} clearcoat={0.8} />`; jangan ganti refraction dengan opacity biasa.
- Logam/mesin: `metalness={0.88}`, `roughness={0.25}`; kuningan `#D4AF37`, baja `#CBD5E1`, tembaga `#B87333`.
- Matte kayu/dinding/kain/kulit: procedural noise `CanvasTexture` deterministik sebagai `bumpMap`, `bumpScale={0.012}`, dan `roughnessMap`. Scalar maps memakai NoColorSpace, base-color map memakai SRGBColorSpace.

### 3. Realistic Warm Desk Lamp & post-processing

- AmbientLight/HemisphereLight `0.3`; sudut ruangan lebih redup dan berdimensi.
- SpotLight atau DirectionalLight tungsten `#FFD28E`, intensitas 2.6–2.8, dari samping-atas menuju objek utama. Default kanan-atas `[4,7,3]`, sesuaikan target dengan meja.
- Wajib `castShadow`, `shadow-mapSize={[2048,2048]}`, `shadow-bias={-0.0005}`; atur frustum dan soft shadow menyamping sesuai renderer.
- `<ContactShadows opacity={0.45} scale={10} blur={2} far={4} />` tepat di permukaan meja; jangan cache bayangan statis untuk benda bergerak.
- Kaca layar smartphone/monitor: `envMapIntensity={0.3}`. Tinjau close-up; kurangi specular/clearcoat bila silau putih memudarkan konten layar.
- Default ruangan: meja walnut medium `#9C7A54` dengan serat halus, dinding krem hangat `#E8DFD1`, lis kayu serta properti meja masuk akal. Pertahankan tata ruang yang sudah disetujui.
- Wajib `<EffectComposer>` dengan `<N8AO aoRadius={0.5} intensity={1.2} />` dan `<Bloom mipmapBlur luminanceThreshold={1.1} intensity={0.35} />`. Pin versi kompatibel, verifikasi render headless; jangan diam-diam menghilangkan efek karena error.

### 4. Compound microshapes & real-world scale

- Objek utama tidak boleh hanya 1–2 kotak/silinder polos. Rakit 8–20 submesh bermakna, dengan lapisan kedalaman dan detail fungsi.
- Gunakan LatheGeometry untuk katup/ulir/kapasitor atau profil putar; ExtrudeGeometry untuk bentuk kompleks; TubeGeometry untuk kabel melengkung. Pilih geometri sesuai bentuk, termasuk gigi roda yang benar.
- Skala antarbenda masuk akal: contoh smartphone ~1.8× panjang kepala charger, buku ~1.2× panjang/lebar smartphone, tabung pulpen ~1.8× tinggi kepala charger dengan pulpen menjulang. Ini contoh staging charger, bukan rasio paksa untuk semua topik.
- Hitung boundingBox setelah transformasi/animasi; `minY >= floorY` untuk benda yang harus menapak. Meja/lantai memenuhi 100% bagian bawah frame, tanpa ruang kosong di luar set.
- Properti boleh terpotong natural di tepi bila disengaja; komponen utama yang dijelaskan harus terlihat, tidak tertutup UI atau objek foreground.

### 5. Closed-to-cutaway reveal & dynamic camera choreography

- Objek utuh, tertutup solid selama 3–4 detik pertama hook. Setelah masuk mekanisme, animasikan exploded lift cangkang atau perubahan menjadi kaca fisik transparan.
- Zero Static Frames pada adegan 3D: selalu continuous subtle drift / slow push-in. Setiap narasi berpindah objek/komponen/skala, kamera wajib bergerak memakai smooth dolly-in, pan, tilt, atau orbital shift dengan `interpolate` halus.
- Susun shot dari fokus narasi: hook push-in, detail objek A/B, mikrokomponen, tracking kabel/aliran, akibat fisik, dolly-out kesimpulan. Jangan memakai dua posisi statis sepanjang video.
- Pertahankan instance kamera stabil; update position/target/matrix per frame. Project anchor setelah kamera diupdate. Gunakan Remotion frame, bukan waktu wall-clock.
- Periksa framing dan occlusion sepanjang transisi, bukan hanya keyframe. Outro grafis tersendiri tidak wajib memakai kamera 3D.
- Impact micro-jolt pada benturan, korsleting, atau insiden kritis: gunakan `getImpactShake(frame, impactFrame, intensity = 0.08)` dari CoreEnvironment. Fungsi memakai `t=(frame-impactFrame)/fps`, `Math.sin(t * 45) * Math.exp(-t * 8)`, aktif hanya 8 frame; tambahkan offset ke pose kamera dasar, jangan akumulasikan antar-frame. Jangan referensikan impact.mp3.

### 6. Visualisasi energi & fisika dinamis

- Listrik/panas/dingin/tekanan/gelombang wajib memakai partikel bergerak (`instanced particles`) dan perubahan warna material dinamis (`color.lerp()`), bukan satu panah statis.
- Asal, arah, tujuan, serta akibat harus terbaca. Animasi deterministik berbasis frame.
- Bila menjelaskan deformasi, tampilkan perubahan geometri 3D nyata, misalnya bulging layar/bodi baterai, glow panas merah-oranye, dan ikon peringatan; jangan mengganti deformasi dengan lingkaran datar.
- Tandai simulasi/kegagalan ilustratif secara tepat; disclaimer bawah bila diperlukan memakai `#F1F5F9`, opacity 0.8, kontras terbaca.

### 7. Snappy spring UI — no hard cuts

- Semua Kartu Data, Callout Labels, Pill Harga, dan Kotak Subtitle wajib memakai helper Remotion:
  `spring({ frame, fps, config: { damping: 15, stiffness: 190, mass: 0.7 } })`.
- Reset frame lokal pada setiap kemunculan/pergantian konten. Kartu/pill: opacity 0→1, translateY 20→0 px, scale .94→1; clamp opacity dan fade-out halus sebelum keluar.
- Label callout mengikuti animasi kartu; tidak boleh terlepas atau berada di luar safe frame.
- Garis dashed tumbuh dari titik komponen menuju label selama 8–10 frame memakai strokeDashoffset. Gunakan mask reveal bila perlu agar pola putus-putus tetap terlihat.
- Project titik komponen 3D aktual setiap frame, hitung ujung pada kartu yang sedang bergerak/scale; jangan menggunakan koordinat lama.
- Subtitle entrance micro-scale .96→1; kata aktif micro-pop sampai 1.05, tanpa mengubah timing token.

### 8. Colorful semantic HUD & anti-overlap state machine

- Load dan tunggu font Plus Jakarta Sans 700/800 (judul/UI/subtitle) serta JetBrains Mono 700 (angka metrik/tag teknis). Cache lokal bila perlu.
- Header `top: 5%`, `left: 6%`, pill Neon Lime `#D9F938`, teks tebal `#0F172A`.
- Risiko/bahaya/panas: `#EF4444`; aman/solusi: `#22C55E` / `#D9F938`.
- Maksimal SATU Data Widget Card aktif per frame, termasuk entering/exiting; zona top 14–26%. State machine eksplisit idle/entering/active/exiting; exit selesai sebelum entry kartu berikutnya.
- Callout dapat menggunakan kartu data yang sama, bukan menambah kartu kedua. Header, subtitle, dan pill identitas terpisah dari data widget.
- Pill objek wajib mengikuti proyeksi koordinat 3D objeknya; otomatis fade-out ke opacity 0 saat objek keluar frame karena close-up sisi lain. Saat fokus eksklusif kiri, sembunyikan pill kanan; berlaku simetris.
- Periksa batas layar, depth/occlusion, tabrakan pill/subtitle/kartu, dan ruang label sepanjang gerakan kamera. Posisi layar tetap dengan fade saja tidak memenuhi aturan world-synced terbaru.

### 9. Presisi karaoke subtitle & safe zone

- Posisi `bottom: 24%–27%`, default 25%. Maksimal dua baris seimbang, 4–8 kata per kotak, `text-wrap: balance`.
- Segmentasi di titik/koma; hindari satu kata sendirian. Untuk fragmen pendek seperti "filter," atau "Yang penting,", gabungkan dengan kelanjutan semantis bila perlu, mempertahankan tanda baca dan seluruh timing kata; jangan melintasi batas kalimat berbeda tanpa alasan.
- Teks default `#FFFFFF`, kotak `#0F172A` opacity .94.
- Kata aktif standar `#D9F938`, micro-pop scale 1.05; bahaya/kerusakan/panas/negatif `#FF4D4D`. Gunakan lexicon semantik sesuai topik.
- Timing wajib berasal dari ekstraksi audio di Bagian A. Verifikasi urutan, coverage, tanda baca, panjang baris, dan highlight terhadap suara. Jangan mengaku sinkron hanya karena caption bertahan lama.

### 10. Dedicated brand outro — 3–4 detik terakhir

- Sediakan 3–4 detik khusus, hentikan subtitle narasi saat outro. Selesaikan narasi sebelumnya atau sesuaikan durasi; jangan menyembunyikan narasi yang masih berbunyi.
- Background `#F8FAFC`, pola grid tipis `#E2E8F0`, komposisi terpusat.
- Isi: (1) ikon vektor/logo aksen `#D9F938`, (2) headline tebal dengan stabilo `#D9F938` pada kata kunci, (3) kotak ringkasan/pesan utama, (4) tombol pill CTA hitam-limau di bawah. CTA berupa pertanyaan relevan dengan topik.
- Logo watermark yang diberikan tetap persisten sesuai Hukum 1.

## C. Produksi, preview, dan penyimpanan

### Auto-SFX & library core

- Bangun event audio dari timeline semantik yang sama dengan kamera/UI. Mount AutoAudioLayer sekali; isi SoundEvent dengan frame kejadian dan durationInFrames dari durasi file hasil ffprobe.
- Whoosh `sfx/whoosh.mp3`, volume .35: setiap cangkang membuka/cutaway dan dolly-in/pan cepat, bukan setiap frame slow drift.
- Popup `sfx/ui popup.mp3`, volume .25: setiap kartu data, label callout, atau checklist masuk dengan spring. Jika label dan kartu adalah elemen yang sama, gunakan satu event agar tidak dobel.
- Click `sfx/click.mp3`, volume .3: tombol ditekan, sakelar aktif, mekanisme terkunci.
- BGM `sfx/bgm.mp3`, loop, volume .07 sepanjang video; turun ke .03 pada outro.
- Syntax Remotion yang benar: `<Sequence from={eventFrame} durationInFrames={soundFrames}><Audio src={staticFile('sfx/whoosh.mp3')} volume={0.35}/></Sequence>`. `staticFile` bukan prop Audio. Jangan memakai file impact.mp3 atau audio placeholder.
- CoreEnvironment.tsx: warm lighting, HDR studio .6, ContactShadows, N8AO/Bloom; juga helper BrandWatermark, getImpactShake, dan AutoAudioLayer.
- KaraokeSubtitle.tsx: otomatis fetch public/transcript.json, validasi word timestamps, grouping semantik, highlight, spring, safe zone bottom 25%, berhenti pada outroFrame. Prop groups boleh untuk segmentasi hasil review tanpa mengubah timestamp.
- CalloutPointer.tsx: project world-to-screen setelah update kamera, mask strokeDashoffset 9 frame, safe bounds dan prop occluded; label opsional dihitung sebagai satu kartu aktif. WorldSyncedPill mengikuti koordinat dunia. Caller wajib memasok hasil raycast/focus untuk occlusion.
- BrandOutro.tsx: grid putih, logo asli, watermark .5, headline stabilo lime, ringkasan, CTA. Tempatkan dalam Sequence outro supaya frame spring lokal mulai 0.

### Automated visual self-check — wajib sebelum delivery video

- Tentukan dan catat frame_hook, frame_cutaway, frame_detail, frame_outro dari timeline proyek.
- Jalankan empat `npx remotion still <entry> <composition> <output.png> --frame <keyframe> --scale 0.5 --gl angle` secara berurutan, lalu buka dan inspeksi keempat gambar secara visual.
- Periksa: teks/callout/pill tidak terpotong atau mengambang; skala realistis dan minY >= floorY (sertakan pengukuran bounds, bukan hanya pengamatan gambar); warm contrast jelas tanpa silau berlebihan.
- Jika gagal, perbaiki dan ulang frame terdampak sebelum melaporkan selesai. Simpan gambar serta laporan QA. Empat still melengkapi preview motion, bukan menggantikan preview video.

### Urutan produksi

1. Simpan naskah/sumber, audio, timestamp, caption groups, dan rencana shot. Implementasikan modul terpisah untuk timeline, assemblies, materials, lighting/post, camera, phenomena, callouts, HUD state, subtitle, dan outro.
2. Selesaikan produksi sesuai jalur audio yang dipilih tanpa pertanyaan ulang yang tidak perlu. Pertahankan aset dan keputusan user yang telah disetujui.
3. Setiap proyek baru DAN setiap revisi wajib menghasilkan, memeriksa, dan MENGIRIM preview nyata sebelum render penuh. Default preview 540×960, 30 fps, 5–8 detik; perubahan motion/kamera/UI harus berupa video, bukan hanya still. Montase boleh bila perlu mencakup beberapa interval; beri durasi dan jelaskan bagian timeline yang dicakup.
4. Render preview dengan concurrency 1, GPU job berurutan, terutama bila laptop pernah lag. Jangan polling background job; lanjut pekerjaan independen dan gunakan notifikasi selesai.
5. Tinjau hasil render: material, layar gelap, bayangan, geometri, grounding, framing, leader endpoints, world-synced pills, single-card maximum, subtitle boundary, dan outro. Simpan QA dengan bukti aktual; still tidak membuktikan kelancaran gerak.
6. Kirim tautan preview dan tunggu persetujuan versi tersebut sebelum full render. Persetujuan versi lama tidak berlaku untuk revisi baru. Instruksi eksplisit user dapat mengganti gate preview ini.
7. Render final 1080×1920, 30 fps setelah diizinkan. Gunakan satu worker bila beban perangkat tinggi; hindari GPU job paralel. Verifikasi decode, ukuran, frame rate, durasi, audio presence/loudness/true peak, serta frame representatif sebelum delivery.
8. Simpan laporan QA, batas pemeriksaan, dan hasil akhir. Jangan mengklaim MP4 selesai, audio tersinkron, atau seluruh QA lolos jika baru kode/still yang tersedia.

## Checklist penerimaan

- [ ] Input audio/logo ditangani; jalur A/B tidak ditanyakan ulang.
- [ ] Hook situasional dan alur makro-ke-mikro; fakta/simulasi dibedakan.
- [ ] Word-level JSON dari audio; coverage dan alignment diperiksa.
- [ ] Seluruh 10 hukum di atas diterapkan dan bukti QA dicatat.
- [ ] Preview perubahan dikirim; persetujuan versi terbaru tersedia sebelum full render.
- [ ] Final hanya diklaim setelah file dan pemeriksaan tersedia.
