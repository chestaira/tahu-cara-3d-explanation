# Golden Reference Blueprint — Tahu Cara

Baseline visual: pompa-air-mancur preview v4, disetujui pengguna 18 November 2026. Versi dependensi pada `package.json`. Workflow preview diperbarui 18 November 2026: wrapper komposisi Preview dihapus agar frame selalu berasal dari komposisi utama. Ini referensi visual yang disetujui, bukan jaminan semua topik bebas bug.

## Wajib dibaca sebelum produksi

1. Baca `../core/README.md` dan seluruh komponen core. Jalankan provisioning untuk menyalin core serta blueprint.
2. Baca `src/assemblies/LivingGarden.tsx`, `GardenTrees.tsx`, `Garden.tsx`, `Pump.tsx`, `Fountain.tsx`, `materials.tsx`, `Scene.tsx`, dan `timeline.ts` sebelum menyusun scene.
3. Adaptasikan bentuk objek, prop kontekstual, timeline, narasi, timestamp, caption, dan label ke topik baru. Terapkan standar horizon, variasi, gerak, material, kamera, dan HUD. Referensi taman bukan set wajib untuk indoor/otomotif/elektronik.
4. Gunakan core dari `assets/core/` sebagai sumber operasional terbaru. `src/components/core/` di blueprint adalah snapshot v4 asli; jangan menimpanya ke atas core terbaru.

## Peta kode

| Standar | Sumber |
|---|---|
| Ground berkontur, horizon blocker, sky dome, fog | `src/assemblies/LivingGarden.tsx`: RollingGround, GardenBoundary, Atmosphere |
| Pohon asimetris, palet daun, wind sway | `src/assemblies/GardenTrees.tsx`: Tree, LeafCloud |
| Rumput, pakis, koral, bangku, lampu point light | `src/assemblies/Garden.tsx` |
| Golden motes, bunga, path | `src/assemblies/LivingGarden.tsx` |
| Riak air dan aliran ilustratif | `src/phenomena.tsx` |
| Compound mechanical geometry, rotor, kumparan, ribs, baut | `src/assemblies/Pump.tsx` |
| Profil putar LatheGeometry | `src/assemblies/Fountain.tsx` |
| Bump/roughness procedural | `src/materials.tsx` |
| Kamera dan x-ray deterministik | `src/timeline.ts`, `src/Scene.tsx` |

## Integrasi

- Provisioning menyalin blueprint ke `reference/explanation-3d/`; ini sumber referensi, bukan entry komposisi aktif. Salin/adaptasi modul yang dibutuhkan ke `src/` proyek dengan import relatif yang valid.
- `src/video.tsx`, caption groups, SFX durations, dan timeline adalah contoh pompa; wajib ganti untuk topik baru. Audio, logo, font, HDR, transcript public tidak dibundel ulang di blueprint.
- Format baseline 1080×1920, 30 fps; wind/flow/audio tertentu memakai 30 fps. Bila fps berubah, konversi timing ke fps proyek.
- Gunakan environment indoor/studio atau outdoor/sunset sesuai lokasi. Baseline outdoor exposure .78; review actual still saat mengganti kamera/material.
- Uji TypeScript, provisioning, still dan preview motion tiap proyek. Periksa semantik aliran, occlusion, bounds, spasi caption, endpoint callout dan horizon pada semua shot.
- Preview terakhir dan final wajib memakai komposisi utama, frame absolut, bundle, aset, renderer dan setting identik. Render cuplikan 1080×1920 dengan `--frames=start-end`, cache potongan dan pakai ulang dalam final; simpan mapping dan uji decoded `framemd5`. Jangan menyalin wrapper Preview dari snapshot proyek lama. Aturan lengkap: `../../SKILL.md`, bagian paritas preview/final.
