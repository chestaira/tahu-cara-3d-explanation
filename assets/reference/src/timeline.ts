import {Easing, interpolate} from 'remotion';
import {PerspectiveCamera, Vector3} from 'three';
import durations from './sfx-durations.json';
import type {SoundEvent} from './components/core/CoreEnvironment';

export const FPS = 30;
export const NARRATION_OFFSET = 1.5;
export const OUTRO = Math.round((70.266042 + NARRATION_OFFSET) * FPS);
export const DURATION = OUTRO + 105;
export const COVER_END = 45;
export const ease = (value: number, start: number, end: number) =>
  interpolate(value, [start, end], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic),
  });

export type Shot = {at: number; p: [number, number, number]; look: [number, number, number]; label: string; anchor: [number, number, number]; pill: string};
export const shots: Shot[] = [
  {at: 0, p: [7.6, 6.7, 18.3], look: [0, 1.7, 0], label: 'AIR NAIK, JATUH, NAIK LAGI', anchor: [0, 3.45, 0], pill: 'AIR MANCUR BATU'},
  {at: 9.2, p: [6.2, 4.9, 8.8], look: [0, 1.45, 0], label: 'POMPA TERENDAM DI BAK', anchor: [-0.65, 0.36, 0.16], pill: 'BAK PENAMPUNG'},
  {at: 12.36, p: [.8, 1.7, 3.5], look: [-.92, .53, .7], label: 'KISI MENYARING AIR', anchor: [-.96, .5, .91], pill: 'KISI INTAKE'},
  {at: 16.42, p: [-.23, 1.03, 2.45], look: [-.93, .51, .66], label: 'IMPELLER ADA DI RUMAH POMPA', anchor: [-.96, .5, .74], pill: 'IMPELLER'},
  {at: 20.22, p: [.08, .94, 1.72], look: [-.96, .5, .57], label: 'MOTOR MEMUTAR ROTOR', anchor: [-.96, .5, .55], pill: 'ROTOR + POROS'},
  {at: 26.68, p: [-1.72, .98, 1.48], look: [-.96, .5, .55], label: 'KUMPARAN DI BALIK DINDING KEDAP', anchor: [-1.06, .57, .54], pill: 'STATOR KERING'},
  {at: 30.72, p: [-.65, .83, 1.77], look: [-.96, .51, .75], label: 'AIR MASUK KE PUSAT IMPELLER', anchor: [-.96, .5, .78], pill: 'ALIRAN MASUK'},
  {at: 34.62, p: [-.47, .92, 1.7], look: [-.91, .53, .75], label: 'SUDU MENDORONG AIR KE TEPI', anchor: [-.82, .62, .74], pill: 'ALIRAN MENYEBAR'},
  {at: 38.54, p: [-.17, 1.16, 2.0], look: [-.72, .67, .71], label: 'AIR DIARAHKAN KE SALURAN KELUAR', anchor: [-.67, .8, .71], pill: 'SALURAN KELUAR'},
  {at: 43.16, p: [3.0, 4.0, 5.5], look: [0, 2.6, 0], label: 'PIPA MEMBAWA AIR KE NOSEL', anchor: [0.0, 3.15, 0.19], pill: 'PIPA NAIK'},
  {at: 48.42, p: [4.3, 3.9, 5.2], look: [0, 2.0, 0], label: 'GRAVITASI MENGEMBALIKAN AIR', anchor: [1.27, 2.25, 0.18], pill: 'AIR TURUN KE BAK'},
  {at: 53.92, p: [-.4, .99, 2.15], look: [-.96, .5, .75], label: 'SARINGAN TERSUMBAT, ALIRAN MELEMAH', anchor: [-.96, .5, .91], pill: 'RAWAT SARINGAN'},
  {at: 58.68, p: [2.8, 3.7, 5.0], look: [0, 2.55, 0], label: 'HEAD LEBIH TINGGI, DEBIT TURUN', anchor: [0.04, 2.95, 0.18], pill: 'TINGGI PIPA BERPENGARUH'},
  {at: 62.72, p: [7.3, 6.7, 17.8], look: [0, 1.7, 0], label: 'AIR BERSIRKULASI, MOTOR MEMAKAI LISTRIK', anchor: [0, 2.7, 0], pill: 'SIKLUS BERULANG'},
];
for (const shot of shots) shot.at += NARRATION_OFFSET;

const shotIndex = (time: number) => Math.max(0, shots.findLastIndex((shot) => shot.at <= time));
export function shotState(frame: number) {
  const i = shotIndex(frame / FPS), shot = shots[i];
  return {i, shot, start: Math.round(shot.at * FPS) + 8, end: i + 1 < shots.length ? Math.round(shots[i + 1].at * FPS) - 8 : OUTRO - 12};
}

export function cameraAt(frame: number, width = 1080, height = 1920) {
  const t = frame / FPS, i = shotIndex(t), current = shots[i], previous = shots[Math.max(0, i - 1)];
  const transition = i === shots.length - 1 ? 2.8 : i === 9 || i === 12 ? 1.8 : 1.2;
  const blend = i === 0 ? 1 : ease(t, current.at, current.at + transition);
  const position = new Vector3(...previous.p).lerp(new Vector3(...current.p), blend);
  const target = new Vector3(...previous.look).lerp(new Vector3(...current.look), blend);
  position.x += Math.sin(t * 0.23) * 0.035;
  position.y += Math.sin(t * 0.17) * 0.025;
  position.z -= Math.sin(t * 0.31) * 0.035;
  const distance=position.distanceTo(target),wide=ease(distance,6,16),lensScale=1-.38*wide;
  position.sub(target).multiplyScalar(lensScale).add(target);
  const fov=2*Math.atan(Math.tan(34*Math.PI/360)/lensScale)*180/Math.PI;
  const camera = new PerspectiveCamera(fov, width / height, 0.04, 130);
  camera.position.copy(position);
  camera.lookAt(target);
  camera.updateMatrixWorld();
  return {position, target, camera};
}

const frames = (seconds: number) => Math.round(seconds * FPS);
export const events: SoundEvent[] = shots.flatMap((shot, i) => {
  const f = frames(shot.at);
  return [
    {frame: f + 8, type: 'popup' as const, durationInFrames: Math.ceil(durations['ui popup'] * FPS)},
    ...(i === 4 ? [
      {frame: f, type: 'whoosh' as const, durationInFrames: Math.ceil(durations.whoosh * FPS)},
    ] : i === 0 ? [] : [{frame: f, type: 'whoosh' as const, durationInFrames: Math.ceil(durations.whoosh * FPS)}]),
  ];
});
