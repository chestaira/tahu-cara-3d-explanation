import React, {useLayoutEffect, useMemo, useRef} from 'react';
import {CatmullRomCurve3, Color, DodecahedronGeometry, ExtrudeGeometry, Group, InstancedMesh, Mesh, Object3D, Shape, TubeGeometry, Vector2, Vector3} from 'three';
import {InstancedTrees} from './GardenTrees';
import {GrassMaterial, StoneMaterial} from '../materials';
import {useCurrentFrame} from 'remotion';
import {RollingGround,GardenBoundary,GoldenMotes,FlowerBeds,RearPath} from './LivingGarden';

function InstancedGrass({center,radius,count=170,seed=0}:{center:[number,number,number];radius:number;count?:number;seed?:number}) {
  const ref=useRef<InstancedMesh>(null);
  const frame=useCurrentFrame();
  const blade=new Shape();blade.moveTo(0,0);blade.quadraticCurveTo(.015,.13,.055,.22);blade.quadraticCurveTo(.025,.12,.018,0);blade.closePath();
  const geometry=useMemo(()=>new ExtrudeGeometry(blade,{depth:.008,bevelEnabled:false,steps:1}),[]);
  useLayoutEffect(()=>{if(!ref.current)return;const object=new Object3D();let state=(seed+7)*2654435761>>>0;const rand=()=>{state=(1664525*state+1013904223)>>>0;return state/4294967296;};
    for(let i=0;i<count;i++){const a=rand()*Math.PI*2,r=Math.sqrt(rand())*radius;object.position.set(center[0]+Math.cos(a)*r,center[1],center[2]+Math.sin(a)*r);object.rotation.set(0,rand()*Math.PI,0);object.scale.set(1.05+rand()*.9,1.05+rand()*.9,1.05+rand()*.8);object.updateMatrix();ref.current.setMatrixAt(i,object.matrix);ref.current.setColorAt(i,new Color(['#536e38','#71864a','#839254','#435d35'][i%4]));}
    ref.current.instanceMatrix.needsUpdate=true;if(ref.current.instanceColor)ref.current.instanceColor.needsUpdate=true;
  },[center[0],center[1],center[2],count,radius,seed]);
  return <group position={center} rotation={[.012*Math.sin(frame*.05+seed),0,.018*Math.sin(frame*.05+seed*2)]}><group position={[-center[0],-center[1],-center[2]]}><instancedMesh ref={ref} args={[geometry,undefined,count]} castShadow><meshStandardMaterial side={2} roughness={.92}/></instancedMesh></group></group>;
}

function PebbleBed(){
  const ref=useRef<InstancedMesh>(null);
  const geometry=useMemo(()=>{const g=new DodecahedronGeometry(1,0);g.scale(1,.42,.72);return g;},[]);
  useLayoutEffect(()=>{if(!ref.current)return;const o=new Object3D();let state=198311>>>0;const rand=()=>{state=(1664525*state+1013904223)>>>0;return state/4294967296;};
    for(let i=0;i<420;i++){const a=rand()*Math.PI*2,r=3.35+rand()*.65;o.position.set(Math.cos(a)*r,.025+rand()*.035,Math.sin(a)*r);o.rotation.set(rand()*.3,rand()*Math.PI,rand()*.35);o.scale.set(.08+rand()*.14,.07+rand()*.09,.08+rand()*.16);o.updateMatrix();ref.current.setMatrixAt(i,o.matrix);ref.current.setColorAt(i,new Color(['#817f70','#aaa18d','#6f7767','#c2b8a2','#8d927f'][i%5]));}
    ref.current.instanceMatrix.needsUpdate=true;if(ref.current.instanceColor)ref.current.instanceColor.needsUpdate=true;
  },[]);
  return <instancedMesh ref={ref} args={[geometry,undefined,420]} receiveShadow><meshStandardMaterial roughness={.94}/></instancedMesh>;
}

function GardenPath(){
  const stones=useMemo(()=>Array.from({length:10},(_,i)=>({x:(i%2?-.32:.32)+Math.sin(i*2.1)*.12,z:3.2+i*.64,rotation:Math.sin(i*1.7)*.13,scale:.8+(i%3)*.12})),[]);
  return <group>{stones.map((s,i)=><mesh key={i} position={[s.x,.045,s.z]} rotation={[-Math.PI/2,0,s.rotation]} scale={[s.scale,1,1]} receiveShadow castShadow><circleGeometry args={[.43,7]}/><StoneMaterial color={i%2?'#aaa492':'#c0b9a7'}/></mesh>)}</group>;
}

function BranchPlant({position,scale=1}:{position:[number,number,number];scale?:number}){
  const stems=useMemo(()=>Array.from({length:7},(_,i)=>{const a=i*2.399,reach=.28+(i%3)*.1;return new TubeGeometry(new CatmullRomCurve3([new Vector3(0,.03,0),new Vector3(Math.cos(a)*.12,.24,Math.sin(a)*.12),new Vector3(Math.cos(a)*reach,.54+(i%3)*.12,Math.sin(a)*reach)]),12,.018,6,false);}),[]);
  return <group position={position} scale={scale}>{stems.map((g,i)=><mesh key={i} geometry={g} castShadow><meshStandardMaterial color="#527044" roughness={.88}/></mesh>)}{stems.map((_,i)=>{const a=i*2.399;return <mesh key={`leaf-${i}`} position={[Math.cos(a)*(.28+(i%3)*.1),.51+(i%3)*.12,Math.sin(a)*(.28+(i%3)*.1)]} rotation={[0,-a,.4]} scale={[.12,.24,.04]} castShadow><dodecahedronGeometry args={[.18,1]}/><meshStandardMaterial color={['#527044','#69834e','#788d55'][i%3]} roughness={.9}/></mesh>;})}</group>;
}

function Bench(){return <group position={[-5.05,.04,-1.8]} rotation={[0,.13,0]}>
  {[0,1,2].map(i=><mesh key={i} position={[0,.63+i*.13,0]} castShadow receiveShadow><boxGeometry args={[1.8,.11,.18]}/><meshStandardMaterial color={i===1?'#815b3e':'#9b7049'} roughness={.72}/></mesh>)}
  {[-.68,.68].map(x=><group key={x} position={[x,0,0]}><mesh position={[0,.34,0]} castShadow><boxGeometry args={[.09,.68,.48]}/><meshStandardMaterial color="#303b3a" metalness={.72} roughness={.32}/></mesh><mesh position={[0,.77,-.12]} rotation={[-.14,0,0]} castShadow><boxGeometry args={[.09,.68,.09]}/><meshStandardMaterial color="#303b3a" metalness={.72} roughness={.32}/></mesh></group>)}
</group>;}

function GardenLamp({position}:{position:[number,number,number]}){return <group position={position}>
  <mesh position={[0,.75,0]} castShadow><cylinderGeometry args={[.055,.075,1.5,12]}/><meshStandardMaterial color="#303b35" metalness={.76} roughness={.28}/></mesh>
  <mesh position={[0,1.53,0]} castShadow><latheGeometry args={[[[.07,0],[.13,.08],[.12,.18],[.06,.24],[.08,.31],[.15,.34]].map(p=>new Vector2(...p)),16]}/><meshStandardMaterial color="#303b35" metalness={.7} roughness={.32}/></mesh>
  <mesh position={[0,1.69,0]}><sphereGeometry args={[.1,12,8]}/><meshStandardMaterial color="#f7d68e" emissive="#ffc76b" emissiveIntensity={1.3}/></mesh>
  <pointLight position={[0,1.69,0]} color="#FFD28E" intensity={3} distance={4} decay={2}/>
</group>;}

function FernCluster({position}:{position:[number,number,number]}){const leaf=useMemo(()=>{const s=new Shape();s.moveTo(0,0);s.quadraticCurveTo(.12,.17,.035,.4);s.quadraticCurveTo(-.025,.23,0,0);return new ExtrudeGeometry(s,{depth:.018,bevelEnabled:true,bevelSize:.008,bevelThickness:.006,steps:1});},[]);return <group position={position}>{Array.from({length:11},(_,i)=>{const a=i*Math.PI*2/11;return <mesh key={i} geometry={leaf} position={[Math.cos(a)*.12,.04,Math.sin(a)*.12]} rotation={[Math.cos(a)*-.42,-a,.05]} scale={[.85+(i%4)*.12,.85+(i%3)*.18,1]} castShadow><meshStandardMaterial color={['#41663c','#547746','#69834b'][i%3]} roughness={.92} side={2}/></mesh>;})}<mesh position={[0,.14,0]}><cylinderGeometry args={[.025,.045,.28,7]}/><meshStandardMaterial color="#526a3d"/></mesh></group>;}

export function Garden({detail=0}:{detail?:number}){
  const frame=useCurrentFrame();
  const plants=useRef<Group>(null);
  useLayoutEffect(()=>{plants.current?.traverse(object=>{if(!(object instanceof Mesh||object instanceof InstancedMesh))return;for(const material of Array.isArray(object.material)?object.material:[object.material]){material.transparent=detail>0;material.opacity=1-.97*detail;material.depthWrite=detail<.1;}object.castShadow=detail<.1;});},[detail]);
  return <group>
    <RollingGround/><GardenBoundary/><GoldenMotes/><FlowerBeds/><RearPath/>
    <PebbleBed/><GardenPath/>
    {[-1,1].map(side=><group key={side}><InstancedGrass center={[side*4.08,.045,0]} radius={1.15} count={240} seed={side+2}/><InstancedGrass center={[side*5.6,.045,-1.1]} radius={1.1} count={200} seed={side+7}/>
      {Array.from({length:10},(_,i)=>{const a=i*Math.PI/5, x=side*(3.15+Math.cos(a)*.47),z=Math.sin(a)*3.15;return <group key={i}><mesh position={[x,.2,z]} rotation={[0,a,0]} scale={[.48,.2,.3]} castShadow><dodecahedronGeometry args={[1,1]}/><StoneMaterial color={['#686e55','#77765d','#596850'][i%3]}/></mesh><group position={[side*(3.7+(i%3)*.18),.03,z+.28]} rotation={[.024*Math.sin(frame*.05+i),0,.035*Math.sin(frame*.05+i+side)]}><FernCluster position={[0,0,0]}/></group></group>;})}
    </group>)}
    <group ref={plants}><InstancedTrees/></group>
    <group position={[1.6,0,-3]}><Bench/></group><GardenLamp position={[4.95,.03,-3.7]}/><GardenLamp position={[-4.4,.03,-2.8]}/>
  </group>;
}
