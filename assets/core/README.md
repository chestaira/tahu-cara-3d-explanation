# Tahu Cara core components

Run `scripts/provision.ps1 -ProjectPath <new-project>` from the skill directory. Four TSX files plus logo and four MP3 files are copied. Project-specific narration, transcript.json, geometry, fonts, and shot timeline must be supplied by production.

Validated dependency baseline: React 19.1.0, Remotion/@remotion/three 4.0.484, Three 0.180.0, @react-three/fiber 9.3.0, @react-three/drei 10.7.6, @react-three/postprocessing 3.0.4, postprocessing 6.38.3, TypeScript 5.9.3.

Usage:

```tsx
// Inside ThreeCanvas/Suspense, using stable frame-updated camera:
<CoreEnvironment />
// Optional cached studio HDR: <CoreEnvironment hdrFile="studio.hdr" />

// DOM layers outside ThreeCanvas:
<BrandWatermark />
<KaraokeSubtitle outroFrame={outroFrame} />
<CalloutPointer point={componentWorldPosition} camera={camera}
  startFrame={startFrame} endFrame={endFrame} label="KOMPONEN" />
<AutoAudioLayer outroFrame={outroFrame} narration="narration.mp3" events={events} />
<Sequence from={outroFrame}>
  <BrandOutro showWatermark={false} summary="Ringkasan mekanisme." />
</Sequence>
```

`CalloutPointer` with label IS the active data card. Do not also render another card. For external cards, omit label and pass matching card bounds/animation. Update camera matrices before DOM projection. World coordinates must include parent transforms; caller supplies occluded state from raycast/focus. WorldSyncedPill fades near safe edges and follows projected point.

`KaraokeSubtitle` reads `public/transcript.json`. `groups` overrides automatic grouping when visual review needs balanced wording; timestamps must remain source-derived. Check actual line wrapping: long words can exceed two lines and require regrouping/font adjustment. The template does not fabricate audio timing.

Audio source durations (ffprobe): whoosh .574688 s, popup 1.358344 s, click 1.056 s, BGM 134.4 s. At 30 fps use event durationInFrames 18, 41, and 32 respectively. AutoAudioLayer deduplicates same-kind same-frame events. Build events from cutaway/fast camera moves, card/label/checklist entries, and mechanical interactions. Do not trigger SFX on every drift frame. BGM loop volume .07, outro .03; whoosh .35, popup .25, click .3.

Use `getImpactShake(frame, impactFrame, .08, fps)` as a non-accumulating camera offset for 8 frames. Default fps 30.

Render four production keyframes and inspect them. This component library supplies mechanisms, not a replacement for project-specific geometry/bounds/occlusion and audio QA.
