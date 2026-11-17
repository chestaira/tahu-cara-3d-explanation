import React, {useMemo} from 'react';
import {LatheGeometry, Vector2} from 'three';
import {StoneMaterial} from '../materials';

function Stone({profile,opacity=1,color='#c8c3b6'}:{profile:[number,number][];opacity?:number;color?:string}) {
  const geometry=useMemo(()=>new LatheGeometry(profile.map(p=>new Vector2(...p)),96),[profile]);
  return <mesh geometry={geometry} castShadow={opacity>.9} receiveShadow><StoneMaterial color={color} opacity={opacity}/></mesh>;
}

export function Fountain({xray=0}:{xray?:number}) {
  const solid=1-.96*xray;
  return <group name="FountainStonework">
    <Stone opacity={solid} profile={[[0,.02],[3.28,.02],[3.36,.08],[3.38,.16],[3.29,.22],[3.19,.31],[3.11,.58],[3.12,.67],[3.22,.72],[3.24,.79],[3.15,.86],[3.01,.87],[2.92,.83],[2.91,.74],[2.98,.67],[2.98,.28],[0,.28]]}/>
    <Stone opacity={solid} color="#e0dace" profile={[[3.12,.65],[3.22,.66],[3.28,.72],[3.25,.81],[3.17,.88],[3.02,.88],[2.95,.83],[2.95,.76],[3.01,.71],[3.12,.65]]}/>
    <Stone opacity={solid} color="#aaa596" profile={[[0,.28],[.66,.28],[.72,.37],[.67,.45],[.55,.48],[.53,.66],[.43,.72],[.38,.9],[.3,1.15],[.25,1.4],[.31,1.61],[.42,1.7],[.41,1.8],[.29,1.9],[.23,2.08],[.27,2.29],[.44,2.4],[.48,2.55],[0,2.58]]}/>
    <Stone opacity={solid} color="#d0c9b8" profile={[[0,2.5],[.36,2.5],[.61,2.55],[.95,2.65],[1.35,2.76],[1.57,2.86],[1.67,2.94],[1.68,3.03],[1.62,3.09],[1.5,3.09],[1.48,3.02],[1.29,2.94],[.94,2.85],[.52,2.76],[0,2.76]]}/>
    <Stone opacity={solid} color="#a8a393" profile={[[0,2.76],[.23,2.76],[.31,2.81],[.29,2.9],[.19,2.97],[.17,3.09],[.26,3.14],[.27,3.2],[.2,3.26],[.24,3.35],[.23,3.51],[.17,3.67],[.09,3.8],[.045,3.89],[0,3.92]]}/>
    {Array.from({length:38},(_,i)=>{const a=i*Math.PI*2/38;return <mesh key={i} position={[Math.cos(a)*1.54,2.89,Math.sin(a)*1.54]} scale={[.055,.083,.03]} rotation={[0,-a,0]}><sphereGeometry args={[1,10,8]}/><StoneMaterial opacity={solid} color="#b1aa98"/></mesh>;})}
    {Array.from({length:28},(_,i)=>{const row=Math.floor(i/7),a=i*Math.PI*2/7+row*.32,r=.2-row*.027;return <mesh key={i} position={[Math.cos(a)*r,3.28+row*.12,Math.sin(a)*r]} scale={[.058,.07,.035]} rotation={[0,-a,0]}><sphereGeometry args={[1,8,7]}/><StoneMaterial opacity={solid} color="#d8d0be"/></mesh>;})}
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,.755,0]}><circleGeometry args={[2.98,96]}/><meshPhysicalMaterial color="#477d83" transmission={.85} ior={1.33} thickness={.18} roughness={.12} clearcoat={.8} transparent opacity={1-xray*.96} depthWrite={xray<.1}/></mesh>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,3.035,0]}><circleGeometry args={[1.48,80]}/><meshPhysicalMaterial color="#73bcc4" transmission={.85} ior={1.33} thickness={.1} roughness={.12} clearcoat={.8} transparent opacity={.85*(1-xray*.96)} depthWrite={xray<.1}/></mesh>
  </group>;
}
