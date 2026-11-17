import React, {useMemo} from 'react';
import {CanvasTexture, NoColorSpace, SRGBColorSpace} from 'three';

function seededNoise(seed: number, color: boolean) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas 2D context unavailable for procedural materials.');
  let state = seed >>> 0;
  const random = () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
  context.fillStyle = color ? '#d9d5ca' : '#858585';
  context.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 3400; i++) {
    const value = Math.floor(90 + random() * 100);
    context.fillStyle = color
      ? `rgba(${value}, ${Math.max(0, value - 7)}, ${Math.max(0, value - 18)}, .13)`
      : `rgba(${value}, ${value}, ${value}, .24)`;
    const size = 1 + random() * 2.6;
    context.fillRect(random() * 128, random() * 128, size, size * (.5 + random()));
  }
  const texture = new CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = 1000;
  texture.repeat.set(4, 4);
  texture.colorSpace = color ? SRGBColorSpace : NoColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export function StoneMaterial({color = '#aaa392', opacity = 1}: {color?: string; opacity?: number}) {
  const [map, scalar] = useMemo(() => [seededNoise(31, true), seededNoise(67, false)], []);
  return <meshStandardMaterial color={color} map={map} bumpMap={scalar} bumpScale={0.012} roughnessMap={scalar} roughness={0.82} metalness={0.02} transparent={opacity < 1} opacity={opacity} depthWrite={opacity >= 1} />;
}

export function GrassMaterial() {
  const scalar = useMemo(() => seededNoise(97, false), []);
  return <meshStandardMaterial color="#354d25" bumpMap={scalar} bumpScale={0.012} roughness={0.96} />;
}

export const steel = {color: '#CBD5E1', metalness: 0.88, roughness: 0.25} as const;
export const brass = {color: '#D4AF37', metalness: 0.88, roughness: 0.25} as const;
