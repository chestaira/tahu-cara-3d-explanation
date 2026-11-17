import React, {useMemo} from 'react';
import {CatmullRomCurve3, ExtrudeGeometry, LatheGeometry, Shape, TubeGeometry, Vector2, Vector3} from 'three';
import {steel} from '../materials';

export const PUMP_POSITION: [number, number, number] = [-.96, .519, .64];

function RoundedPlate({position, width, height, depth, color, opacity = 1}: {position: [number,number,number]; width: number; height: number; depth: number; color: string; opacity?: number}) {
  const geometry = useMemo(() => {
    const s = new Shape(), w = width/2, h = height/2, r = .045;
    s.moveTo(-w+r,-h);s.lineTo(w-r,-h);s.quadraticCurveTo(w,-h,w,-h+r);s.lineTo(w,h-r);s.quadraticCurveTo(w,h,w-r,h);s.lineTo(-w+r,h);s.quadraticCurveTo(-w,h,-w,h-r);s.lineTo(-w,-h+r);s.quadraticCurveTo(-w,-h,-w+r,-h);
    return new ExtrudeGeometry(s,{depth,bevelEnabled:true,bevelSize:.012,bevelThickness:.012,bevelSegments:3,steps:1});
  },[width,height,depth]);
  return <mesh position={position} geometry={geometry} castShadow={opacity>.9} receiveShadow>
    <meshStandardMaterial color={color} metalness={.32} roughness={.34} transparent={opacity<1} opacity={opacity} depthWrite={opacity>.8}/>
  </mesh>;
}

export function Wire({points, radius=.012, color='#17232a', opacity=1}: {points: [number,number,number][];radius?:number;color?:string;opacity?:number}) {
  const geometry=useMemo(()=>new TubeGeometry(new CatmullRomCurve3(points.map(p=>new Vector3(...p))),32,radius,8,false),[points,radius]);
  return <mesh geometry={geometry} castShadow={opacity>.9}><meshStandardMaterial color={color} metalness={.1} roughness={.45} transparent={opacity<1} opacity={opacity} depthWrite={opacity>.8}/></mesh>;
}

function Turned({profile,position=[0,0,0],color='#CBD5E1',opacity=1}: {profile:[number,number][];position?:[number,number,number];color?:string;opacity?:number}) {
  const geometry=useMemo(()=>new LatheGeometry(profile.map(p=>new Vector2(...p)),48),[profile]);
  return <mesh geometry={geometry} position={position} rotation={[Math.PI/2,0,0]} castShadow={opacity>.9}><meshStandardMaterial color={color} metalness={.88} roughness={.25} transparent={opacity<1} opacity={opacity} depthWrite={opacity>.8}/></mesh>;
}

function Screw({position}:{position:[number,number,number]}) {
  return <group position={position}>
    <Turned profile={[[0,0],[.021,0],[.025,.007],[.024,.019],[.016,.023],[0,.023]]}/>
    <mesh position={[0,0,.005]}><boxGeometry args={[.028,.005,.003]}/><meshStandardMaterial color="#17232a" roughness={.4}/></mesh>
  </group>;
}

export function Pump({time,xray=0,motorReveal=0}:{time:number;xray?:number;motorReveal?:number}) {
  const bladeGeometry=useMemo(()=>{
    const s=new Shape();s.moveTo(.065,-.016);s.bezierCurveTo(.12,-.05,.19,-.065,.245,-.02);s.lineTo(.23,.008);s.bezierCurveTo(.18,-.028,.12,-.014,.075,.018);s.closePath();
    return new ExtrudeGeometry(s,{depth:.048,bevelEnabled:true,bevelSize:.008,bevelThickness:.006,bevelSegments:2,steps:1});
  },[]);
  const casingOpacity=1-xray*.94, motorOpacity=1-motorReveal*.96;
  return <group name="PumpAssembly" position={PUMP_POSITION} scale={.7}>
    {[-.24,.24].map(x=><RoundedPlate key={x} position={[x,-.255,-.32]} width={.17} height={.055} depth={.65} color="#273943"/>)}
    {[-.24,.24].flatMap(x=>[-.29,.23].map(z=><mesh key={`${x}-${z}`} position={[x,-.283,z]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.052,.012,8,20]}/><meshStandardMaterial color="#101e24" roughness={.75}/></mesh>))}
    <Turned position={[0,0,-.13]} profile={[[0,-.2],[.18,-.2],[.235,-.17],[.255,-.12],[.255,.17],[.235,.21],[.12,.23],[0,.23]]} color="#253942" opacity={motorOpacity}/>
    {Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return <RoundedPlate key={i} position={[Math.cos(a)*.243,Math.sin(a)*.243,-.34]} width={.028} height={.038} depth={.32} color="#536775" opacity={motorOpacity}/>;})}
    <Turned position={[0,0,-.105]} profile={[[.125,-.22],[.183,-.22],[.2,-.2],[.2,.13],[.183,.15],[.125,.15],[.125,-.22]]} color="#9eaab2" opacity={1-motorReveal*.91}/>
    {Array.from({length:6},(_,i)=>{const a=i*Math.PI/3;return <group key={i} position={[Math.cos(a)*.157,Math.sin(a)*.157,-.2]} rotation={[0,0,a]}>
      {Array.from({length:7},(_,j)=><mesh key={j} position={[0,0,(j-3)*.022]} rotation={[0,Math.PI/2,0]}><torusGeometry args={[.054,.008,7,20]}/><meshStandardMaterial color="#B87333" metalness={.88} roughness={.25}/></mesh>)}
    </group>;})}
    <Turned position={[0,0,-.12]} profile={[[.083,-.2],[.104,-.2],[.108,-.17],[.108,.12],[.1,.15],[.083,.15],[.083,-.2]]} color="#f2ece0" opacity={1-motorReveal*.65}/>
    <group rotation={[0,0,-time*5.4]}>
      <Turned position={[0,0,-.13]} profile={[[0,-.17],[.062,-.17],[.075,-.14],[.075,.12],[.058,.15],[0,.15]]} color="#64748b"/>
      <Turned position={[0,0,.04]} profile={[[0,-.37],[.015,-.37],[.018,-.33],[.015,.18],[.026,.19],[.025,.21],[0,.21]]}/>
      <Turned position={[0,0,.13]} profile={[[0,-.022],[.24,-.022],[.25,-.01],[.25,.006],[.22,.012],[.06,.012],[.04,.058],[0,.058]]} color="#b6c5c8" opacity={1-motorReveal*.94}/>
      {Array.from({length:7},(_,i)=><mesh key={i} geometry={bladeGeometry} position={[0,0,.115]} rotation={[0,0,i*Math.PI*2/7]} castShadow={motorReveal<.1}><meshStandardMaterial color="#D4AF37" metalness={.88} roughness={.25} transparent={motorReveal>0} opacity={1-motorReveal*.83} depthWrite={motorReveal<.1}/></mesh>)}
      <Turned position={[0,0,.15]} profile={[[0,-.02],[.055,-.02],[.065,0],[.06,.025],[.03,.05],[0,.05]]} color="#CBD5E1"/>
    </group>
    <Turned position={[0,0,-.33]} profile={[[0,-.03],[.023,-.03],[.046,-.018],[.047,.018],[.03,.025],[0,.025]]} color="#D4AF37"/>
    <Turned position={[0,0,.065]} profile={[[.27,-.09],[.29,-.09],[.325,-.065],[.337,0],[.333,.115],[.31,.15],[.27,.15],[.27,-.09]]} color="#386174" opacity={Math.max(.2,1-xray*.74)}/>
    <Wire points={[[.16,.245,.14],[.27,.265,.14],[.36,.29,.13],[.4,.35,.12],[.42,.43,.1]]} radius={.075} color="#365367" opacity={Math.max(.18,1-xray*.77)}/>
    <Turned position={[0,0,.295]} profile={[[.07,-.035],[.18,-.035],[.22,-.02],[.235,.004],[.23,.026],[.2,.044],[.1,.049],[.075,.025],[.07,-.035]]} color="#223a46" opacity={casingOpacity}/>
    <RoundedPlate position={[0,0,.34]} width={.57} height={.56} depth={.03} color="#1d303b" opacity={casingOpacity}/>
    {Array.from({length:9},(_,i)=><RoundedPlate key={i} position={[-.22+i*.055,0,.38]} width={.018} height={.42-Math.abs(4-i)*.026} depth={.014} color="#536b78" opacity={casingOpacity}/>)}
    {[-.23,.23].flatMap(x=>[-.22,.22].map(y=><Screw key={`${x}-${y}`} position={[x,y,.39]}/>))}
    <Turned position={[.42,.42,.1]} profile={[[0,-.07],[.052,-.07],[.069,-.05],[.069,.05],[.056,.07],[.05,.1],[0,.1]]} color="#a5adb0"/>
    <Wire points={[[.0,.18,-.34],[.13,.27,-.4],[.34,.3,-.38],[.6,.26,-.5],[1.3,.25,-.9],[2.0,.3,-1.15]]} radius={.024} color="#16252a"/>
    <Wire points={[[.12,.13,-.16],[.17,.23,-.18],[.07,.28,-.2],[-.04,.23,-.19]]} radius={.009} color="#c94e35"/>
    <Wire points={[[-.12,.12,-.15],[-.18,.2,-.17],[-.09,.28,-.2],[.05,.24,-.2]]} radius={.009} color="#243a44"/>
    <RoundedPlate position={[0,-.19,-.38]} width={.27} height={.09} depth={.04} color="#43525a"/>
  </group>;
}
