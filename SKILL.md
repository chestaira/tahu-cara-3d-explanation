---
name: explanation-3d
description: Membuat video explainer dan bedah mekanisme 3D Indonesia vertikal 9:16 dengan visual Semi-Realistic Cinematic Product, workflow audio eksternal atau TTS lokal, word-level captions, dynamic camera, spring UI, dan preview sebelum render penuh. Gunakan saat user memanggil /explanation-3d atau meminta workflow explainer ini.
---

**AUTO-TRIGGER WAJIB:** Setiap pemanggilan `/explanation-3d [topik]`, otomatis baca `assets/core/README.md`, kelima komponen `assets/core/`, `assets/reference/README.md`, dan kode blueprint yang dirujuknya TERLEBIH DAHULU; lalu jalankan `scripts/provision.ps1` untuk menyalin core dan seluruh Golden Reference Blueprint ke proyek sebelum menulis scene. Tidak perlu pengingat manual. Gunakan core terbaru dan adaptasikan blueprint sesuai topik; jangan mulai dari primitive/template kosong. Proyek existing: verifikasi aset yang sudah ada, pertahankan perubahan pengguna, dan integrasikan dengan sadar tanpa overwrite buta.

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
    ├── reference/              # Golden Reference Blueprint v4 + README + dependencies
    └── core/
        ├── CoreEnvironment.tsx
        ├── KaraokeSubtitle.tsx
        ├── CalloutPointer.tsx
        ├── BrandOutro.tsx
        └── TopDataCard.tsx
```

Setiap membuat subfolder video baru di Default Project, WAJIB menjalankan `scripts/provision.ps1 -ProjectPath "<absolute-project-path>"` melalui PowerShell. Script menyalin logo ke `public/logo.png`, empat audio ke `public/sfx/` (bukan root public), lima komponen ke `src/components/core/`, dan seluruh `assets/reference/` ke `reference/explanation-3d/`. Jangan hanya menjelaskan provisioning: jalankan dan periksa hasil. Script idempotent untuk file identik dan menolak overwrite perubahan proyek. Baca lalu adaptasikan modul blueprint dari folder reference ke source aktif; snapshot core di blueprint tidak menggantikan core terbaru. Pertahankan YAML frontmatter di awal file agar discovery skill tetap valid; aturan auto-trigger adalah baris instruksi pertama setelah metadata.

Dependensi template: React, Remotion, Three, @remotion/three, @react-three/fiber, @react-three/drei, @react-three/postprocessing, postprocessing; pin versi kompatibel. Load font Plus Jakarta Sans/JetBrains Mono sebelum capture. CoreEnvironment dipakai dalam ThreeCanvas/Suspense; komponen UI dan AutoAudioLayer di luar canvas. HDR preset dapat dicache ke public dan diberikan melalui prop hdrFile, sesuai konteks studio indoor atau sunset outdoor.

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

## B. Sebelas hukum arsitektur visual & teknis

### 1. Brand watermark logo — top-right

- Pasang `staticFile('logo.png')` persisten pada `top: 5%`, `right: 6%`, `width: 72px`, `height: 72px`, `borderRadius: 14px`, `opacity: 0.5`. Sejajarkan dengan Header Tag kiri; pertahankan aspect ratio via objectFit contain.
- Gunakan BrandWatermark dari CoreEnvironment di root termasuk outro. Jika root sudah memasang watermark, berikan `showWatermark={false}` ke BrandOutro agar tidak ganda.

### 2. Lookdev — Semi-Realistic Cinematic Material

- Dilarang outline kartun hitam, Inverted Hull, Edges/EdgesGeometry, dan toon material. Siluet terbentuk dari cahaya, refleksi, dan bayangan. Garis dashed callout 2D diperbolehkan.
- HDR environment wajib mengikuti preset lokasi pada Hukum 3: indoor `studio` intensity `0.6`, outdoor `sunset` intensity `0.75`; boleh dicache lokal untuk render deterministik. Tunggu asset siap sebelum capture.
- Plastik bening/kaca: `<meshPhysicalMaterial transmission={0.85} ior={1.49} thickness={0.4} roughness={0.12} clearcoat={0.8} />`; jangan ganti refraction dengan opacity biasa.
- Logam/mesin: `metalness={0.88}`, `roughness={0.25}`; kuningan `#D4AF37`, baja `#CBD5E1`, tembaga `#B87333`.
- Matte kayu/dinding/kain/kulit: procedural noise `CanvasTexture` deterministik sebagai `bumpMap`, `bumpScale={0.012}`, dan `roughnessMap`. Scalar maps memakai NoColorSpace, base-color map memakai SRGBColorSpace.

### 3. Adaptive Contextual Lighting & post-processing

- Pilih lighting menurut konteks scene; desk lamp bukan preset universal. Indoor/meja kerja/elektronik: `SpotLight` atau `DirectionalLight` tungsten `#FFD28E`, intensitas `2.6–2.8`, dari samping-atas; `AmbientLight` `0.3`; `<Environment preset="studio" environmentIntensity={0.6} background={false} />`.
- Outdoor/alam/jalan/taman: wajib Golden Hour Late Afternoon Sunlight, bukan desk lamp atau studio key. `DirectionalLight` matahari sore emas `#FFB76B`, intensitas `3.2`, sudut rendah menyamping sebagai 3/4 backlight/sidelight; `HemisphereLight` sky `#93C5FD`, ground `#365314`, intensitas `0.65`; `<Environment preset="sunset" environmentIntensity={0.75} background={false} />`. Bentuk bayangan panjang dramatis dan kilau emas pada percikan air; bayangan tetap kaya warna, tidak hitam mati.
- Wajib `castShadow`, `shadow-mapSize={[2048,2048]}`, `shadow-bias={-0.0005}`; atur frustum dan soft shadow menyamping sesuai renderer.
- `<ContactShadows opacity={0.45} scale={10} blur={2} far={4} />` pada permukaan kontak sesuai lokasi; jangan cache bayangan statis untuk benda bergerak.
- Kaca layar smartphone/monitor: `envMapIntensity={0.3}`. Tinjau close-up; kurangi specular/clearcoat bila silau putih memudarkan konten layar.
- Default indoor: meja walnut medium `#9C7A54` dengan serat halus, dinding krem hangat `#E8DFD1`, lis kayu serta properti meja masuk akal. Pertahankan tata ruang yang sudah disetujui.
- Wajib `<EffectComposer>` dengan `<N8AO aoRadius={0.5} intensity={1.2} />` dan `<Bloom mipmapBlur luminanceThreshold={1.1} intensity={0.35} />`. Pin versi kompatibel, verifikasi render headless; jangan diam-diam menghilangkan efek karena error.

### 4. Compound microshapes & real-world scale

- **Larangan Mobil Balok & Pohon Bola:** AI dilarang keras merepresentasikan kendaraan sebagai kotak bertumpuk atau pohon sebagai bola/kerucut polos. Kendaraan wajib memakai profil `ExtrudeGeometry` dengan `bevelEnabled: true`, kaca reflektif, lampu, spion, dan velg roda. Pohon wajib memakai cabang `TubeGeometry` dengan gugusan daun `InstancedMesh` multi-warna. Verifikasi siluet dan detail melalui still lingkungan, bukan hanya close-up objek utama.

- **Larangan Primitive Polos:** Setiap komponen mekanis dilarang dirender sebagai `BoxGeometry` atau `CylinderGeometry` polos tanpa modifikasi. Wajib kombinasikan `ExtrudeGeometry` dengan `bevelEnabled: true`, `LatheGeometry` untuk komponen silindris bertingkat/ulir/katup, dan `TubeGeometry` untuk kabel/pipa. Detail mikro wajib berupa kepala baut/sekrup, poros logam, rusuk penguat (ribs), dan lubang ventilasi, sesuai fungsi rakitan. Bevel saja tidak menggantikan detail mekanis nyata.
- **Syarat Lulus Pre-Delivery QA:** Saat mengecek hasil `npx remotion still`, jika objek utama masih terlihat seperti balok/silinder dasar tanpa bevel, sambungan baut, atau kabel penghubung, wajib di-refactor ulang sebelum dilaporkan selesai. Periksa close-up aktual; keberadaan nama geometri dalam kode saja bukan bukti kelulusan.

- Objek utama tidak boleh hanya 1–2 kotak/silinder polos. Rakit 8–20 submesh bermakna, dengan lapisan kedalaman dan detail fungsi.
- Gunakan LatheGeometry untuk katup/ulir/kapasitor atau profil putar; ExtrudeGeometry untuk bentuk kompleks; TubeGeometry untuk kabel melengkung. Pilih geometri sesuai bentuk, termasuk gigi roda yang benar.
- Skala antarbenda masuk akal: contoh smartphone ~1.8× panjang kepala charger, buku ~1.2× panjang/lebar smartphone, tabung pulpen ~1.8× tinggi kepala charger dengan pulpen menjulang. Ini contoh staging charger, bukan rasio paksa untuk semua topik.
- Hitung boundingBox setelah transformasi/animasi; `minY >= floorY` untuk benda yang harus menapak. Meja/lantai memenuhi 100% bagian bawah frame, tanpa ruang kosong di luar set.
- Properti boleh terpotong natural di tepi bila disengaja; komponen utama yang dijelaskan harus terlihat, tidak tertutup UI atau objek foreground.

### 5. Layered environment & contextual staging

- **Anti-Floating Platform Law — wajib lintas topik:** dilarang memperlihatkan tepi/ujung `PlaneGeometry` atau lantai yang terputus di latar. Tutup cakrawala dengan horizon blocker kontekstual (tembok/pagar, semak/pohon rapat, siluet gedung, atau dinding ruangan), dipadukan fog dan kubah langit/latar serasi. Outdoor memakai ground minimal 60×60 dan kontur rolling hills di kejauhan. Periksa seluruh lintasan kamera, termasuk dolly-out; ukuran ground saja bukan bukti tepi tersembunyi.
- **Anti-Clone & Living Micro-Motion Law — wajib lintas topik:** dilarang hanya 1–2 properti identik hasil copy-paste. Vegetasi/properti latar harus bervariasi skala, rotasi, warna, penempatan asimetris, dan kepadatan. Ambient micro-motion harus terbaca sejak tiga detik pertama: angin tanaman, debu cahaya, dan riak permukaan sesuai konteks; benda kaku tetap diam secara fisik. Animasi deterministik dari frame, misalnya `Math.sin(frame * 0.05 + offset)` dengan amplitudo halus.
- **Preset taman hidup:** 7–9 pohon asimetris berskala 0.7–1.4, cabang bervariasi, palet daun `#65A30D`, `#365314`, `#D97706`; ratusan helai rumput instanced, bunga kuning/putih/merah muda, pakis berlapis, batu berlumut, jalur setapak sampai pagar belakang dan hedgerow rapat. Lampu taman memakai point light hangat plus glow; 30–40 golden dust motes melayang dan expanding water ripples. Langit gradasi `#FDBA74` ke `#38BDF8` ke `#1E293B`; fog linear Three/R3F `<fog attach="fog" args={['#FDE68A', 12, 38]} />`. Jika memakai `fogExp2`, gunakan density yang ditinjau visual, bukan near/far yang tidak didukung fogExp2.

- Setiap scene wajib memiliki foreground, midground, dan background; dilarang menaruh objek utama di atas satu bidang datar satu warna polos.
- Permukaan wajib bertekstur dan bersegmen: pakai procedural `bumpMap` serta detail sesuai lokasi, seperti paving/batu berlumut, marka dan curb jalan, kayu berserat dengan desk mat, atau kerikil/koral via `InstancedMesh`.
- Scene dengan vegetasi wajib memakai batang/cabang melengkung `TubeGeometry`, daun berlapis `InstancedMesh` multi-warna hijau alami, dan helai rumput pendek. Jangan gunakan bola hijau polos untuk pohon/semak.
- Tambahkan contextual props berskala nyata di midground/background, misalnya bangku taman, lampu jalan, pagar, buku catatan, kabel atau alat pendukung. Props membangun depth tanpa menutup fokus.
- **Pemandangan taman/air mancur outdoor:** wajib batu setapak di foreground menuju kolam dan pagar belakang, hamparan koral/kerikil bertekstur di sekeliling bibir bak, dan rumput taman bertekstur dengan helai rumput `InstancedMesh` di tepi. Background memiliki 7–9 pohon asimetris berbatang/cabang `TubeGeometry` dan gugusan daun `InstancedMesh` berlapis yang membingkai atas layar. Midground/pinggir kolam memuat pakis berfrond, semak berdaun lebar, rumput liar, dan batu kali berlumut. Tambahkan bangku taman kayu-besi serta lampu taman klasik sebagai contextual props yang terbaca kamera. Variasikan ukuran, rotasi, warna alami, dan kepadatan; hindari bola hijau seragam atau ruang taman kosong.

### 6. Closed-to-cutaway reveal & dynamic camera choreography

- Objek utuh, tertutup solid selama 3–4 detik pertama hook. Setelah masuk mekanisme, wajib smooth dolly-in bersama x-ray transparency (`opacity: 0.15`, `depthWrite: false`) atau exploded lift; dilarang hard-cut ke jeroan.
- Zero Static Frames pada adegan 3D: selalu continuous subtle drift / slow push-in. Setiap narasi berpindah objek/komponen/skala, kamera wajib bergerak memakai smooth dolly-in, pan, tilt, atau orbital shift dengan `interpolate` halus.
- Susun shot dari fokus narasi: hook push-in, detail objek A/B, mikrokomponen, tracking kabel/aliran, akibat fisik, dolly-out kesimpulan. Jangan memakai dua posisi statis sepanjang video.
- Pertahankan instance kamera stabil; update position/target/matrix per frame. Project anchor setelah kamera diupdate. Gunakan Remotion frame, bukan waktu wall-clock.
- Periksa framing dan occlusion sepanjang transisi, bukan hanya keyframe. Outro grafis tersendiri tidak wajib memakai kamera 3D.
- Impact micro-jolt pada benturan, korsleting, atau insiden kritis: gunakan `getImpactShake(frame, impactFrame, intensity = 0.08)` dari CoreEnvironment. Fungsi memakai `t=(frame-impactFrame)/fps`, `Math.sin(t * 45) * Math.exp(-t * 8)`, aktif hanya 8 frame; tambahkan offset ke pose kamera dasar, jangan akumulasikan antar-frame. Jangan referensikan impact.mp3.

### 7. Visualisasi energi & fisika dinamis

- Aliran air/udara/panas/listrik/tekanan/gelombang wajib menunjukkan asal, arah, tujuan, dan akibat. Dilarang aliran berupa manik-manik bola kaku: gunakan lapisan fluida transparan `TubeGeometry` dengan tekstur mengalir teranimasi, dipadu partikel/percikan dinamis via `InstancedMesh`.
- Listrik/panas/dingin/tekanan/gelombang wajib memakai partikel bergerak (`instanced particles`) dan perubahan warna material dinamis (`color.lerp()`), bukan satu panah statis.
- Asal, arah, tujuan, serta akibat harus terbaca. Animasi deterministik berbasis frame.
- Bila menjelaskan deformasi, tampilkan perubahan geometri 3D nyata, misalnya bulging layar/bodi baterai, glow panas merah-oranye, dan ikon peringatan; jangan mengganti deformasi dengan lingkaran datar.
- Tandai simulasi/kegagalan ilustratif secara tepat; disclaimer bawah bila diperlukan memakai `#F1F5F9`, opacity 0.8, kontras terbaca.

### 8. Snappy spring UI — no hard cuts

- Semua Kartu Data, Callout Labels, Pill Harga, dan Kotak Subtitle wajib memakai helper Remotion:
  `spring({ frame, fps, config: { damping: 15, stiffness: 190, mass: 0.7 } })`.
- Reset frame lokal pada setiap kemunculan/pergantian konten. Kartu/pill: opacity 0→1, translateY 20→0 px, scale .94→1; clamp opacity dan fade-out halus sebelum keluar.
- Kartu data atas wajib compact memeluk teks, background alpha `0.95` sesuai styling berikut, tanpa ruang kosong besar di bawah konten. Saat tidak aktif opacity tepat `0`; container dan isinya masuk/keluar serentak dalam 3–4 frame tanpa ghosting.
- Kartu atas memakai `height: 'auto'`, tanpa height/minHeight statis, `padding: '12px 22px'`, `display: 'inline-flex'`, `alignItems: 'center'`, `backgroundColor: 'rgba(240, 253, 244, 0.95)'`. Lebar mengikuti teks dengan maxWidth safe zone; endpoint callout dihitung dari dimensi kartu aktual setelah font siap, termasuk wrapping dan transform spring.
- Callout wajib menghubungkan titik jangkar pada komponen, garis/leader, dan kotak label secara presisi. Dilarang menampilkan titik kuning/hijau tanpa garis dan label.
- Label callout mengikuti animasi kartu; tidak boleh terlepas atau berada di luar safe frame.
- Garis dashed tumbuh dari titik komponen menuju label selama 8–10 frame memakai strokeDashoffset. Gunakan mask reveal bila perlu agar pola putus-putus tetap terlihat.
- Project titik komponen 3D aktual setiap frame, hitung ujung pada kartu yang sedang bergerak/scale; jangan menggunakan koordinat lama.
- Subtitle entrance micro-scale .96→1; kata aktif micro-pop sampai 1.05, tanpa mengubah timing token.

### 9. Colorful semantic HUD & anti-overlap state machine

- Load dan tunggu font Plus Jakarta Sans 700/800 (judul/UI/subtitle) serta JetBrains Mono 700 (angka metrik/tag teknis). Cache lokal bila perlu.
- Header `top: 5%`, `left: 6%`, pill Neon Lime `#D9F938`, teks tebal `#0F172A`.
- Risiko/bahaya/panas: `#EF4444`; aman/solusi: `#22C55E` / `#D9F938`.
- Maksimal SATU Data Widget Card aktif per frame, termasuk entering/exiting; zona top 14–26%. State machine eksplisit idle/entering/active/exiting; exit selesai sebelum entry kartu berikutnya.
- Callout dapat menggunakan kartu data yang sama, bukan menambah kartu kedua. Header, subtitle, dan pill identitas terpisah dari data widget.
- Pill objek wajib mengikuti proyeksi koordinat 3D objeknya; otomatis fade-out ke opacity 0 saat objek keluar frame karena close-up sisi lain. Saat fokus eksklusif kiri, sembunyikan pill kanan; berlaku simetris.
- Periksa batas layar, depth/occlusion, tabrakan pill/subtitle/kartu, dan ruang label sepanjang gerakan kamera. Posisi layar tetap dengan fade saja tidak memenuhi aturan world-synced terbaru.

### 10. Presisi karaoke subtitle & safe zone

- Posisi `bottom: 24%–27%`, default 25%. Maksimal dua baris seimbang, 4–8 kata per kotak, `text-wrap: balance`.
- Segmentasi di titik/koma; hindari satu kata sendirian. Untuk fragmen pendek seperti "filter," atau "Yang penting,", gabungkan dengan kelanjutan semantis bila perlu, mempertahankan tanda baca dan seluruh timing kata; jangan melintasi batas kalimat berbeda tanpa alasan.
- Teks default `#FFFFFF`, kotak `#0F172A` opacity .94.
- Kata aktif standar `#D9F938`, micro-pop scale 1.05; bahaya/kerusakan/panas/negatif `#FF4D4D`. Gunakan lexicon semantik sesuai topik.
- `KaraokeSubtitle.tsx` wajib mempertahankan spasi antar-token saat kata aktif di-highlight/scale `1.05`; gunakan layout yang menjaga whitespace, bukan margin yang berubah oleh transform. Subtitle dan isi keluar/masuk serentak dalam 3–4 frame, dengan `opacity: 0` penuh saat tidak aktif.
- Timing wajib berasal dari ekstraksi audio di Bagian A. Verifikasi urutan, coverage, tanda baca, panjang baris, dan highlight terhadap suara. Jangan mengaku sinkron hanya karena caption bertahan lama.

### 11. Dedicated brand outro — 3–4 detik terakhir

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
- CoreEnvironment.tsx: adaptive indoor/outdoor lighting, environment studio .6 atau sunset .75 sesuai scene, ContactShadows, N8AO/Bloom; juga helper BrandWatermark, getImpactShake, dan AutoAudioLayer.
- KaraokeSubtitle.tsx: otomatis fetch public/transcript.json, validasi word timestamps, grouping semantik, highlight dengan whitespace terjaga, spring, safe zone bottom 25%, keluar bersih tanpa ghosting, berhenti pada outroFrame. Prop groups boleh untuk segmentasi hasil review tanpa mengubah timestamp.
- CalloutPointer.tsx: project world-to-screen setelah update kamera, mask strokeDashoffset 9 frame, safe bounds dan prop occluded; titik, leader, dan label wajib terhubung presisi. Label opsional dihitung sebagai satu kartu aktif. WorldSyncedPill mengikuti koordinat dunia. Caller wajib memasok hasil raycast/focus untuk occlusion.
- BrandOutro.tsx: grid putih, logo asli, watermark .5, headline stabilo lime, ringkasan, CTA. Tempatkan dalam Sequence outro supaya frame spring lokal mulai 0.

### Automated visual self-check — wajib sebelum delivery video

- Tentukan dan catat frame_hook, frame_cutaway, frame_detail, frame_outro dari timeline proyek.
- Jalankan empat `npx remotion still <entry> <composition> <output.png> --frame <keyframe> --scale 0.5 --gl angle` secara berurutan, lalu buka dan inspeksi keempat gambar secara visual.
- Periksa: teks/callout/pill tidak terpotong atau mengambang; titik-leader-label terhubung; spasi karaoke utuh; kartu compact tanpa ghosting; skala realistis dan minY >= floorY (sertakan pengukuran bounds); lighting sesuai konteks, tekstur dan kedalaman tiga lapis terbaca.
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
9. Setelah render final selesai, WAJIB setorkan paket copywriting siap salin untuk YouTube Shorts dan Instagram Reels sesuai Modul D. Sertakan paket dalam respons delivery tanpa menunggu permintaan tambahan.
10. Integrasikan cover pada frame 0 komposisi video utama sesuai Modul E sejak penyusunan hook. Periksa crop dan transisi cover dalam QA/preview sebelum render final; frame 0 video menjadi sampul yang dapat dipilih dari timeline publikasi.

## Checklist penerimaan

- [ ] Input audio/logo ditangani; jalur A/B tidak ditanyakan ulang.
- [ ] Hook situasional dan alur makro-ke-mikro; fakta/simulasi dibedakan.
- [ ] Word-level JSON dari audio; coverage dan alignment diperiksa.
- [ ] Seluruh 11 hukum di atas diterapkan dan bukti QA dicatat.
- [ ] Preview perubahan dikirim; persetujuan versi terbaru tersedia sebelum full render.
- [ ] Final hanya diklaim setelah file dan pemeriksaan tersedia.
- [ ] Paket copywriting Shorts & Reels disetorkan: tiga judul maksimal 50 karakter, caption lengkap, CTA komentar, dan 5–8 hashtag termasuk #TahuCara.
- [ ] Frame 0 menjadi integrated cover; judul bold Plus Jakarta Sans 800, 3–5 kata utuh dalam zona top 32%–42%, aksen #D9F938, crop tengah 1:1/4:5; tampil 0–1.4 detik lalu fade sebelum kartu dan diperiksa tanpa tabrakan UI.

## D. MODUL AUTO-COPYWRITING REELS & SHORTS

### Aturan output judul & deskripsi — wajib setelah render selesai

Setiap kali video selesai diproduksi, AI WAJIB memberikan paket copywriting siap salin untuk publikasi **YouTube Shorts** dan **Instagram Reels**. Ini tahap akhir workflow, bukan tawaran opsional. Gunakan bahasa Indonesia kasual-edukatif khas kanal **Tahu Cara** dan sesuaikan dengan narasi serta mekanisme yang benar-benar dibahas dalam video.

1. **3 Opsi Judul / Hook Cover (kurang dari 50 karakter per opsi):** Singkat, memicu rasa penasaran tinggi (curiosity gap), tanpa clickbait murahan. Cocok untuk judul YouTube Shorts sekaligus teks sampul Reels. Hitung karakter termasuk spasi dan tanda baca; nomor daftar bukan bagian judul. Hindari janji atau klaim yang tidak didukung isi video.
2. **Caption / Deskripsi Utama (IG Reels & YT Shorts):** Berikan satu blok teks siap salin dengan urutan berikut:
   - **Baris 1 — Hook Pembuka:** Kalimat pancingan kuat yang melengkapi tiga detik pertama video.
   - **Isi Singkat — 2–3 kalimat:** Ringkasan inti mekanisme yang dibedah dengan bahasa kasual-edukatif khas Tahu Cara. Pertahankan batasan faktual; jangan menyamaratakan konfigurasi yang bisa berbeda.
   - **CTA Komentar:** Pertanyaan ringan di akhir isi untuk memancing diskusi atau pengalaman penonton.
   - **Hashtags:** 5–8 hashtag relevan dan tertarget, gabungan topik spesifik, edukasi/mekanisme, dan **#TahuCara**. Letakkan setelah CTA.

Pisahkan tiga opsi judul dari blok caption. Jangan masukkan label struktur seperti “Hook Pembuka” atau “CTA Komentar” ke dalam teks siap salin. Periksa jumlah opsi, batas karakter, jumlah kalimat isi, CTA, relevansi dan jumlah hashtag sebelum delivery.

## E. FIRST-FRAME INTEGRATED COVER — FRAME 0 SEBAGAI THUMBNAIL

Aturan ini menggantikan modul thumbnail terpisah. Tidak perlu membuat komposisi `Thumbnail`, mengekspor `thumbnail.png`, atau memakai angle sampul terpisah. Cover merupakan bagian langsung dari komposisi video utama.

1. **Satu kesatuan dengan frame pertama:** Frame 0 (`00:00`) wajib sudah tertata sebagai sampul, siap dipilih dari timeline IG Reels/YouTube Shorts tanpa upload terpisah. Gunakan scene dan kamera pembuka yang sama, objek utama jelas dan utuh/tertutup sesuai Hukum 6. Muat font/aset sebelum capture; judul terlihat penuh sejak frame 0.
2. **Judul sampul di Center Safe Zone:** Tampilkan judul **3–5 kata**, bold **Plus Jakarta Sans 800**, aksen stabilo **#D9F938** dengan kontras cukup. Letakkan blok judul pada **top 32%–42%**, aman untuk crop tengah **1:1 dan 4:5**. Judul tampil dari 0.0 hingga 1.4 detik.
3. **Transisi menyatu dengan hook:** Pada 30 fps, judul tampil frame 0–35; fade-out halus frame 36–41, hilang penuh sebelum 1.4 detik/frame 42. Hitung sesuai fps aktual. Selaraskan dengan gerak kamera dan UI berikutnya; tahan kartu edukasi serta subtitle sampai cover keluar tanpa menggeser timestamp narasi. Kamera boleh drift halus sejak frame 0.
4. **QA terintegrasi:** Periksa frame 0 dari komposisi video utama, termasuk crop tengah 1:1 dan 4:5, serta preview gerak 0–2 detik untuk memastikan judul terbaca, keluar halus, dan tidak menumpuk dengan UI berikutnya. Still untuk bukti QA boleh disimpan di folder QA; bukan deliverable thumbnail terpisah. Sertakan pemeriksaan ini dalam preview sebelum persetujuan render penuh. Paket copywriting Modul D tetap wajib setelah render selesai.
